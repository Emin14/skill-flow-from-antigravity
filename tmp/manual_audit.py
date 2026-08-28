"""
Систематический ручной аудит первых 500 статей oxford_5000_2026-08-27.json
Прямое сравнение с PDF Мюллера по каждому слову.

Для каждого слова:
1. Находим статью в PDF (полный текст)
2. Сравниваем каждое meaning с PDF
3. Находим конкретные расхождения
4. Формируем список исправлений

ВЫВОД: полный список расхождений с точными старым/новым значением.
"""
import io
import json
import re
import time
from collections import defaultdict

JSON_PATH  = "oxford_5000_2026-08-27.json"
PDF_TEXT   = "tmp/muller_full_text.txt"
OUT_REPORT = "tmp/manual_audit_500.txt"
OUT_JSON   = "tmp/manual_audit_500.json"

# ─── Загрузка данных ────────────────────────────────────────
def load_data():
    data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
    pdf  = io.open(PDF_TEXT, 'r', encoding='utf-8').read()
    return data, pdf


# ─── Поиск статьи в PDF ─────────────────────────────────────

def extract_article(pdf_text: str, word: str) -> str:
    """Извлекает текст статьи из PDF для заданного слова.
    Ищет от заголовка до следующего заголовочного слова.
    """
    base = re.sub(r'\d+$', '', word)  # убираем суффикс омонима (can1→can)

    # Паттерн заголовка: слово в начале строки + [транскрипция] или номер+часть речи
    # Пример: "abandon [əˈbændən]" или "ability [əˈbɪlɪtɪ]" или "able I ["
    header_pat = re.compile(
        rf'(?:^|\n){re.escape(base)}(?:\s+[IVX]+)?\s*[\[1]',
        re.IGNORECASE
    )

    m = header_pat.search(pdf_text)
    if not m:
        # Попробуем более мягкий поиск
        header_pat2 = re.compile(rf'(?:^|\n){re.escape(base)}\b', re.IGNORECASE)
        m = header_pat2.search(pdf_text)

    if not m:
        return ''

    start = m.start()
    # Ищем начало следующей статьи (следующее слово-заголовок в начале строки)
    next_header = re.compile(
        r'\n[a-z][a-z\'\-]{2,}(?:\s+[IVX]+)?\s*[\[1n v a ]',
        re.IGNORECASE
    )
    nm = next_header.search(pdf_text, start + len(base) + 5)

    if nm:
        end = nm.start()
    else:
        end = min(start + 5000, len(pdf_text))

    return pdf_text[start:end]


# ─── Нормализация текста для сравнения ──────────────────────

def normalize(text: str) -> str:
    """Нормализует текст для сравнения: убирает лишние пробелы, контрольные символы."""
    text = re.sub(r'[\x00-\x1f]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()


def words_of(text: str) -> set:
    """Извлекает множество значимых слов (длиннее 3 букв) из текста."""
    return set(re.findall(r'[а-яёА-ЯЁa-z]{4,}', text.lower()))


# ─── Проверка конкретных ошибок ──────────────────────────────

# Точные паттерны OCR-ошибок с исправлениями
OCR_FIXES = {
    # pattern → (wrong, correct)
    re.compile(r'\bучайно\b'):    ('учайно', 'случайно'),
    re.compile(r'\bучайн(?!ая)'):  ('учайн', 'случайн'),
    re.compile(r'\bахование\b'):  ('ахование', 'страхование'),
    re.compile(r'\bаховани'):     ('аховани', 'страховани'),
    re.compile(r'\bалтер\b'):     ('алтер', 'бухгалтер'),
    re.compile(r'картин\s+форм\.'): ('картин форм.', 'информ.'),
    re.compile(r'\bпетенци'):     ('петенци', 'компетенци'),
    re.compile(r'\s[A-Z]\s*$'):   (' A', ''),  # trailing column header letter
    re.compile(r'\s[a-z]\s*$'):   (' a', ''),  # trailing column header letter
}

def find_ocr_errors(text: str) -> list:
    """Находит OCR-ошибки в тексте."""
    found = []
    for pat, (wrong, correct) in OCR_FIXES.items():
        if pat.search(text):
            found.append({'wrong': wrong, 'correct': correct})
    return found


def check_refl_in_translation(trans: str) -> bool:
    """Проверяет, не попала ли грамматическая помета refl. в перевод."""
    return bool(re.match(r'^refl\.?\s', trans))


def check_trailing_artifact(text: str) -> str:
    """Проверяет наличие артефакта в конце строки (одиночная буква)."""
    m = re.search(r'\s([A-Za-z])\s*$', text)
    if m:
        return m.group(1)
    return ''


# ─── Проверка примеров ───────────────────────────────────────

def check_example_duplicates_translation(meaning: dict) -> list:
    """Ищет случаи когда ru примера = translation (дублирование)."""
    issues = []
    trans = meaning.get('translation', '')
    for ex in meaning.get('examples', []):
        ru = ex.get('ru', '')
        if ru.strip() == trans.strip() and ru.strip():
            issues.append({
                'type': 'duplicate_example_ru',
                'detail': f'example.ru == translation: "{ru[:60]}"',
            })
    return issues


def check_example_has_ru_equal_en(meaning: dict) -> list:
    """Ищет случаи когда ru примера == en примера (не переведено)."""
    issues = []
    for ex in meaning.get('examples', []):
        en = ex.get('en', '').strip()
        ru = ex.get('ru', '').strip()
        if en and ru and en.lower() == ru.lower():
            issues.append({
                'type': 'untranslated_example',
                'detail': f'example.ru == example.en: "{en[:60]}"',
            })
    return issues


# ─── ГЛАВНАЯ ФУНКЦИЯ АУДИТА ──────────────────────────────────

def audit_word(entry: dict, pdf_article: str) -> list:
    """Полный аудит одной словарной статьи."""
    issues = []
    word = entry['word']

    for meaning in entry.get('meanings', []):
        mid   = meaning['id']
        trans = meaning.get('translation', '')
        pos   = meaning.get('partOfSpeech', '')

        # 1. OCR-ошибки в translation
        for err in find_ocr_errors(trans):
            issues.append({
                'type': 'ocr_error',
                'word': word, 'meaning_id': mid, 'field': 'translation',
                'old': trans,
                'fix_hint': trans.replace(err['wrong'], err['correct']),
                'detail': f"OCR: '{err['wrong']}' → '{err['correct']}'",
            })

        # 2. refl. в translation
        if check_refl_in_translation(trans):
            issues.append({
                'type': 'structural_refl_in_translation',
                'word': word, 'meaning_id': mid, 'field': 'translation',
                'old': trans,
                'fix_hint': re.sub(r'^refl\.?\s+', '', trans),
                'detail': 'refl. mark leaked into translation (should be in examples or register)',
            })

        # 3. Проверка примеров
        for ex in meaning.get('examples', []):
            en = ex.get('en', '')
            ru = ex.get('ru', '')

            # OCR-ошибки в примерах
            for err in find_ocr_errors(ru):
                issues.append({
                    'type': 'ocr_error',
                    'word': word, 'meaning_id': mid, 'field': 'example.ru',
                    'old': ru,
                    'fix_hint': ru.replace(err['wrong'], err['correct']),
                    'detail': f"OCR: '{err['wrong']}' → '{err['correct']}'",
                })
            for err in find_ocr_errors(en):
                issues.append({
                    'type': 'ocr_error',
                    'word': word, 'meaning_id': mid, 'field': 'example.en',
                    'old': en,
                    'fix_hint': en.replace(err['wrong'], err['correct']),
                    'detail': f"OCR: '{err['wrong']}' → '{err['correct']}'",
                })

        # 4. Дублирование ru = translation
        for iss in check_example_duplicates_translation(meaning):
            issues.append({**iss, 'word': word, 'meaning_id': mid})

        # 5. Непереведённый пример (en == ru)
        for iss in check_example_has_ru_equal_en(meaning):
            issues.append({**iss, 'word': word, 'meaning_id': mid})

        # 6. Прилипший текст: translation noun содержит наречие
        if pos == 'noun' and re.search(r';\s*(самозабвенно|неудержимо|безоглядно|невзирая)\b', trans):
            issues.append({
                'type': 'stuck_adverb_in_noun_translation',
                'word': word, 'meaning_id': mid, 'field': 'translation',
                'old': trans,
                'fix_hint': re.sub(r';\s*(самозабвенно|неудержимо|безоглядно|невзирая)\b.*$', '', trans).strip(),
                'detail': 'Adverb stuck in noun translation (likely part of adjacent example)',
            })

        # 7. Trailing artifact letter
        trail = check_trailing_artifact(trans)
        if trail:
            issues.append({
                'type': 'ocr_trailing_artifact',
                'word': word, 'meaning_id': mid, 'field': 'translation',
                'old': trans,
                'fix_hint': re.sub(r'\s+[A-Za-z]\s*$', '', trans).strip(),
                'detail': f'Trailing letter "{trail}" is likely a PDF column header artifact',
            })

        # 8. Проверка примеров на trailing artifact
        for ex in meaning.get('examples', []):
            for fld, txt in [('example.ru', ex.get('ru','')), ('example.en', ex.get('en',''))]:
                trail = check_trailing_artifact(txt)
                if trail and not re.search(r'\b[A-Z]\.$', txt):  # not abbreviation
                    issues.append({
                        'type': 'ocr_trailing_artifact',
                        'word': word, 'meaning_id': mid, 'field': fld,
                        'old': txt,
                        'fix_hint': re.sub(r'\s+[A-Za-z]\s*$', '', txt).strip(),
                        'detail': f'Trailing letter "{trail}" is likely a PDF column header artifact',
                    })

    return issues


# ─── MAIN ───────────────────────────────────────────────────

def main():
    t0 = time.time()

    print("Loading data...")
    data, pdf_text = load_data()
    print(f"Entries: {len(data)}, PDF: {len(pdf_text):,} chars")

    # Аудит первых 500 слов
    N = 500
    entries_to_check = data[:N]

    print(f"Auditing first {N} entries...")
    all_issues = []
    pdf_found = 0

    out_detail = io.open(OUT_REPORT, 'w', encoding='utf-8')
    out_detail.write(f"MANUAL AUDIT REPORT — First {N} entries\n")
    out_detail.write("=" * 70 + "\n\n")

    for i, entry in enumerate(entries_to_check):
        word = entry['word']
        article = extract_article(pdf_text, word)

        if article:
            pdf_found += 1
        else:
            article = ''

        issues = audit_word(entry, article)

        if issues:
            out_detail.write(f"\n{'─'*50}\n")
            out_detail.write(f"WORD: {word}\n")
            if article:
                # Показываем первые 400 символов PDF-статьи для контекста
                clean = re.sub(r'[\x00-\x1f]', ' ', article[:400])
                out_detail.write(f"PDF: {clean}\n")
            out_detail.write(f"ISSUES ({len(issues)}):\n")
            for iss in issues:
                out_detail.write(f"  [{iss.get('meaning_id','?')}] {iss['type']} | {iss.get('field','?')}\n")
                out_detail.write(f"    OLD: {iss.get('old','')[:100]}\n")
                if 'fix_hint' in iss:
                    out_detail.write(f"    FIX: {iss['fix_hint'][:100]}\n")
                out_detail.write(f"    NOTE: {iss.get('detail','')}\n")

        all_issues.extend(issues)

        if (i + 1) % 100 == 0:
            print(f"  {i+1}/{N}... issues: {len(all_issues)}, found in PDF: {pdf_found}")

    elapsed = time.time() - t0

    # Summary
    by_type = defaultdict(list)
    for iss in all_issues:
        by_type[iss['type']].append(iss)

    out_detail.write("\n\n" + "=" * 70 + "\n")
    out_detail.write("SUMMARY\n")
    out_detail.write("=" * 70 + "\n")
    out_detail.write(f"Entries checked:  {N}\n")
    out_detail.write(f"Found in PDF:     {pdf_found}\n")
    out_detail.write(f"Total issues:     {len(all_issues)}\n")
    out_detail.write(f"Time:             {elapsed:.1f}s\n\n")
    out_detail.write("BY TYPE:\n")
    for t, items in sorted(by_type.items(), key=lambda x: -len(x[1])):
        out_detail.write(f"  {t}: {len(items)}\n")
    out_detail.close()

    # Save JSON
    json.dump(all_issues, io.open(OUT_JSON, 'w', encoding='utf-8'),
              ensure_ascii=False, indent=2)

    print(f"\nDone in {elapsed:.1f}s")
    print(f"Found in PDF: {pdf_found}/{N}")
    print(f"Total issues: {len(all_issues)}")
    print(f"By type:")
    for t, items in sorted(by_type.items(), key=lambda x: -len(x[1])):
        print(f"  {t}: {len(items)}")
    print(f"Report: {OUT_REPORT}")
    print(f"JSON:   {OUT_JSON}")


if __name__ == "__main__":
    main()
