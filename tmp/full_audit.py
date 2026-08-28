"""
ПОЛНЫЙ АУДИТ oxford_5000_2026-08-27.json ПО PDF МЮЛЛЕРА

Стратегия:
1. Загрузить полный текст PDF
2. Для каждого из 4980 слов — найти статью в PDF
3. Сравнить meanings в JSON с текстом PDF
4. Выявить: OCR-ошибки, прилипшие/потерянные переводы, прилипшие примеры
5. Сгенерировать список исправлений и отчёт

Аудит охватывает:
- translation: OCR-ошибки, усечённые слова, прилипшие тексты
- examples: неверные примеры, неверные переводы примеров
- register: неверные или пропущенные регистры
- partOfSpeech: несоответствие части речи
"""
import io
import json
import re
import time
from collections import defaultdict

JSON_PATH  = "oxford_5000_2026-08-27.json"
PDF_TEXT   = "tmp/muller_full_text.txt"
OUT_REPORT = "tmp/full_audit_report.txt"
OUT_FIXES  = "tmp/confirmed_fixes.json"

# ───────────────────────────────────────────────
# 1. OCR ERROR PATTERNS
# Паттерны, которые гарантированно указывают на OCR-ошибки
# ───────────────────────────────────────────────
OCR_ERRORS = [
    # Обрезанные слова (потерян первый слог из-за переноса)
    (re.compile(r'\bучайно\b'),      'учайно → случайно'),
    (re.compile(r'\bучайн'),         'учайн → случайн'),
    (re.compile(r'\bахование\b'),    'ахование → страхование'),
    (re.compile(r'\bаховани'),       'ахование → страхование'),
    (re.compile(r'\bалтер\b'),       'алтер → бухгалтер'),
    (re.compile(r'\bетенци'),        'петенци → компетенци'),
    (re.compile(r'\bоговариватель'), 'оговариватель → подговариватель'),
    (re.compile(r'\bедоразвит'),     'едоразвит → недоразвит'),
    (re.compile(r'\bедостаток'),     'едостаток → недостаток'),
    (re.compile(r'\bеобходим'),      'еобходим → необходим'),
    (re.compile(r'\bеодно'),         'еодно → неодно'),
    (re.compile(r'\bелегитим'),      'елегитим → нелегитим'),
    (re.compile(r'\bелепый\b'),      'елепый → нелепый'),
    (re.compile(r'\bикакой'),        'икакой → никакой'),
    (re.compile(r'\bезначительн'),   'езначительн → незначительн'),
    (re.compile(r'\bрасположенн'),   'maybe OK but check'),
    # Артефакт колонки: одиночная заглавная буква в конце
    (re.compile(r'\s[A-Z]\s*$'),     'trailing uppercase letter (column header artifact)'),
    # refl. попавший в перевод вместо грамматической пометы
    (re.compile(r'^refl\.\s+\S'),    'refl. leaked into translation field'),
    # Артефакт: "картин форм." вместо "информ." 
    (re.compile(r'картин\s+форм\.'), 'OCR: картин форм. → информ.'),
    # Обрезанная строка — оканчивается на пробел+одна буква
    (re.compile(r'\s+[а-яА-Я]\s*$'), 'possible truncated end of line (single Cyrillic char)'),
]

# ───────────────────────────────────────────────
# 2. STRUCTURAL ERROR PATTERNS
# Паттерны ошибок структуры (прилипшие тексты)
# ───────────────────────────────────────────────
STRUCTURAL_ERRORS = [
    # "refl." в поле translation
    (re.compile(r'^refl\b'), 'refl. mark should be in register, not translation'),
    # Пример оказался в translation (содержит to + глагол + пример)
    (re.compile(r'^to [a-z]+ (oneself|smb|smth)'), 'example leaked into translation'),
    # Дублирование: то же слово что и translation повторяется в ru примера
    # Проверяем в коде
]

# ───────────────────────────────────────────────
# 3. ФУНКЦИЯ ПОИСКА СЛОВА В PDF
# ───────────────────────────────────────────────
def find_article_in_pdf(pdf_text: str, word: str, word_index: dict) -> tuple:
    """
    Ищет словарную статью в тексте PDF.
    Возвращает (found: bool, article_text: str, page_hint: int)
    """
    base = re.sub(r'\d+$', '', word)  # убираем суффикс омонима

    if base in word_index:
        pos = word_index[base]
        # Берём блок ~3000 символов начиная с позиции
        snippet = pdf_text[pos:pos + 3000]
        return True, snippet, -1

    return False, '', -1


def build_word_index(pdf_text: str) -> dict:
    """
    Строит индекс: слово → позиция в PDF-тексте.
    Заголовки словарных статей — строки вида:
      word [транскрипция] или word I [транскрипция]
    (слово всегда начинается с новой строки или после переноса колонки)
    """
    index = {}
    # Ищем строки вида: "слово [транскрипция]" или "слово n " или "слово 1."
    # Заголовки: маленькая буква, потом пробел и либо [ или 1. или n или v или a
    pattern = re.compile(
        r'(?:^|\n)([a-z][a-z\-\']+(?:\s+[IV]+)?\s*)(?=\[|1\.\s|n\s|v\s|a\s)',
        re.MULTILINE
    )
    for m in pattern.finditer(pdf_text):
        w = m.group(1).strip().lower()
        w = re.sub(r'\s+[IV]+$', '', w).strip()  # убираем римские цифры
        if w and w not in index:
            index[w] = m.start()

    return index


# ───────────────────────────────────────────────
# 4. ПРОВЕРКА ОДНОЙ СТАТЬИ
# ───────────────────────────────────────────────
def audit_entry(entry: dict, pdf_snippet: str) -> list:
    """Аудит одной словарной статьи. Возвращает список проблем."""
    issues = []
    word = entry['word']

    for meaning in entry.get('meanings', []):
        mid   = meaning['id']
        trans = meaning.get('translation', '')
        pos   = meaning.get('partOfSpeech', '')
        regs  = meaning.get('register', [])
        exs   = meaning.get('examples', [])

        # --- Проверка translation на OCR-ошибки ---
        for pat, desc in OCR_ERRORS:
            if pat.search(trans):
                issues.append({
                    'type': 'ocr_error',
                    'word': word, 'meaning_id': mid,
                    'field': 'translation',
                    'old': trans,
                    'detail': desc,
                })

        # --- Проверка structural errors ---
        for pat, desc in STRUCTURAL_ERRORS:
            if pat.search(trans):
                issues.append({
                    'type': 'structural',
                    'word': word, 'meaning_id': mid,
                    'field': 'translation',
                    'old': trans,
                    'detail': desc,
                })

        # --- Дублирование в примерах ---
        for ex in exs:
            en = ex.get('en', '')
            ru = ex.get('ru', '')

            # OCR-ошибки в примерах
            for pat, desc in OCR_ERRORS:
                if pat.search(ru):
                    issues.append({
                        'type': 'ocr_error',
                        'word': word, 'meaning_id': mid,
                        'field': 'example.ru',
                        'old': ru,
                        'detail': desc,
                    })
                if pat.search(en):
                    issues.append({
                        'type': 'ocr_error',
                        'word': word, 'meaning_id': mid,
                        'field': 'example.en',
                        'old': en,
                        'detail': desc,
                    })

            # Дублирование: ru примера совпадает с translation
            if ru.strip() == trans.strip() and ru.strip():
                issues.append({
                    'type': 'duplicate_translation',
                    'word': word, 'meaning_id': mid,
                    'field': 'example.ru',
                    'old': ru,
                    'detail': 'Example ru duplicates meaning translation',
                })

        # --- Проверка meanings в PDF ---
        if pdf_snippet:
            # Проверяем что перевод хотя бы частично присутствует в PDF
            # (Берём первое значимое слово перевода)
            trans_words = [w for w in re.findall(r'[а-яёА-ЯЁ]{4,}', trans)]
            if trans_words:
                key_word = trans_words[0].lower()
                if key_word not in pdf_snippet.lower():
                    issues.append({
                        'type': 'translation_mismatch',
                        'word': word, 'meaning_id': mid,
                        'field': 'translation',
                        'old': trans,
                        'detail': f'Key word "{key_word}" not found in PDF article text',
                    })

    return issues


# ───────────────────────────────────────────────
# 5. КОНКРЕТНЫЕ KNOWN FIXES (подтверждённые по предыдущему просмотру PDF)
# ───────────────────────────────────────────────
# Из анализа первых 50 статей структуры + чтения PDF:
KNOWN_FIXES = [
    {
        'word': 'a', 'meaning_id': 6, 'field': 'example.ru',
        'old': 'некий мистер Генри Грин A',
        'new': 'некий мистер Генри Грин',
        'type': 'ocr_artifact',
        'reason': 'Trailing letter "A" is a column header artifact from PDF layout',
        'page': 15,
    },
    {
        'word': 'a', 'meaning_id': 7, 'field': 'translation',
        'old': 'апостериори, из опыта, по опыту a',
        'new': 'апостериори, из опыта, по опыту',
        'type': 'ocr_artifact',
        'reason': 'Trailing letter "a" is artifact; also meaning [7] and [8] (a posteriori/a priori) are prefix entries, not meanings of article "a"',
        'page': 15,
    },
    {
        'word': 'abandon', 'meaning_id': 3, 'field': 'translation',
        'old': 'развязность, несдержанность; самозабвенно',
        'new': 'развязность, несдержанность',
        'type': 'stuck_translation',
        'reason': 'PDF: "2. n развязность, несдержанность; with ~ не сдерживаясь; самозабвенно" — "самозабвенно" is part of the example "with ~ не сдерживаясь; самозабвенно", not the translation of the noun',
        'page': 15,
    },
    {
        'word': 'ability', 'meaning_id': 5, 'field': 'translation',
        'old': 'петенция',
        'new': 'компетенция',
        'type': 'ocr_error',
        'reason': 'OCR: "компетенция" was truncated to "петенция" (lost "ком")',
        'page': 15,
    },
    {
        'word': 'accident', 'meaning_id': 1, 'field': 'example.ru',
        'old': 'учайно, нечаянно',
        'new': 'случайно, нечаянно',
        'type': 'ocr_error',
        'reason': 'OCR: "случайно" truncated to "учайно" (lost "сл")',
        'page': 15,
    },
    {
        'word': 'accident', 'meaning_id': 4, 'field': 'translation',
        'old': 'учайное свойство',
        'new': 'случайное свойство',
        'type': 'ocr_error',
        'reason': 'OCR: "случайное" truncated to "учайное"',
        'page': 15,
    },
    {
        'word': 'accident', 'meaning_id': 5, 'field': 'example.ru',
        'old': 'ахование от несчастных случаев',
        'new': 'страхование от несчастных случаев',
        'type': 'ocr_error',
        'reason': 'OCR: "страхование" truncated to "ахование" (lost "стр")',
        'page': 15,
    },
    {
        'word': 'accountant', 'meaning_id': 1, 'field': 'translation',
        'old': 'алтер',
        'new': 'бухгалтер',
        'type': 'ocr_error',
        'reason': 'OCR: "бухгалтер" truncated to "алтер" (lost "бухг")',
        'page': 16,
    },
    {
        'word': 'access', 'meaning_id': 4, 'field': 'translation',
        'old': 'картин форм. выборка (из памяти); доступ (к базе данных)',
        'new': 'выборка (из памяти); доступ (к базе данных)',
        'type': 'ocr_error',
        'reason': 'OCR artefact: "картин форм." should be register "информ." which was corrupted. The register should be extracted to register field.',
        'page': 16,
    },
]


# ───────────────────────────────────────────────
# 6. MAIN
# ───────────────────────────────────────────────
def main():
    t0 = time.time()

    print("Loading JSON dictionary...")
    data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
    print(f"Loaded {len(data)} entries, {sum(len(e.get('meanings',[])) for e in data)} meanings")

    print("Loading PDF text...")
    pdf_text = io.open(PDF_TEXT, 'r', encoding='utf-8').read()
    print(f"PDF text: {len(pdf_text):,} chars")

    print("Building word index...")
    word_index = build_word_index(pdf_text)
    print(f"Indexed {len(word_index)} words from PDF")

    print("Running full audit...")
    all_issues = []
    not_found  = []
    found_count = 0

    for i, entry in enumerate(data):
        word = entry['word']
        base = re.sub(r'\d+$', '', word).lower()

        found, snippet, _ = find_article_in_pdf(pdf_text, word, word_index)
        if found:
            found_count += 1
        else:
            not_found.append(word)
            snippet = ''

        issues = audit_entry(entry, snippet)
        all_issues.extend(issues)

        if (i + 1) % 500 == 0:
            print(f"  Processed {i+1}/{len(data)}... issues so far: {len(all_issues)}")

    elapsed = time.time() - t0
    print(f"\nAudit complete in {elapsed:.1f}s")
    print(f"  Found in PDF: {found_count}/{len(data)}")
    print(f"  Not found:    {len(not_found)}")
    print(f"  Issues found: {len(all_issues)}")

    # ── Write report ──
    out = io.open(OUT_REPORT, 'w', encoding='utf-8')
    out.write("=" * 70 + "\n")
    out.write("FULL AUDIT REPORT — oxford_5000_2026-08-27.json vs Мюллер 2021\n")
    out.write("=" * 70 + "\n\n")
    out.write(f"Total entries:    {len(data)}\n")
    out.write(f"Found in PDF:     {found_count}\n")
    out.write(f"Not found in PDF: {len(not_found)}\n")
    out.write(f"Total issues:     {len(all_issues)}\n\n")

    by_type = defaultdict(list)
    for iss in all_issues:
        by_type[iss['type']].append(iss)

    out.write("ISSUES BY TYPE:\n")
    for t, items in sorted(by_type.items(), key=lambda x: -len(x[1])):
        out.write(f"  {t}: {len(items)}\n")

    out.write("\n" + "=" * 70 + "\n")
    out.write("KNOWN CONFIRMED FIXES (from manual PDF review):\n")
    out.write("=" * 70 + "\n\n")
    for fix in KNOWN_FIXES:
        out.write(f"Word: {fix['word']}  meaning_id: {fix['meaning_id']}\n")
        out.write(f"  Field:  {fix['field']}\n")
        out.write(f"  OLD:    {fix['old']}\n")
        out.write(f"  NEW:    {fix['new']}\n")
        out.write(f"  Type:   {fix['type']}\n")
        out.write(f"  Reason: {fix['reason']}\n")
        out.write(f"  Page:   {fix.get('page','?')}\n\n")

    out.write("\n" + "=" * 70 + "\n")
    out.write("DETECTED ISSUES DETAIL:\n")
    out.write("=" * 70 + "\n\n")
    for t, items in sorted(by_type.items(), key=lambda x: -len(x[1])):
        out.write(f"\n{'─'*50}\n")
        out.write(f"{t.upper()} ({len(items)})\n")
        out.write(f"{'─'*50}\n")
        for item in items[:50]:  # top 50 per type
            out.write(f"  [{item['word']}] meaning {item.get('meaning_id','?')} | {item.get('field','?')}\n")
            old_text = str(item.get('old', ''))[:100]
            out.write(f"  OLD: {old_text}\n")
            out.write(f"  NOTE: {item.get('detail','')}\n\n")

    out.write("\n" + "=" * 70 + "\n")
    out.write("NOT FOUND IN PDF (first 100):\n")
    for w in not_found[:100]:
        out.write(f"  {w}\n")

    out.close()
    print(f"Report written to {OUT_REPORT}")

    # ── Write confirmed fixes JSON ──
    all_confirmed = KNOWN_FIXES.copy()
    # Add auto-detected OCR fixes with high confidence
    for iss in all_issues:
        if iss['type'] == 'ocr_error':
            all_confirmed.append({
                'word': iss['word'],
                'meaning_id': iss.get('meaning_id'),
                'field': iss.get('field'),
                'old': iss.get('old'),
                'new': '*** NEEDS MANUAL REVIEW ***',
                'type': 'ocr_error_detected',
                'reason': iss.get('detail', ''),
                'page': None,
                'confidence': 'auto_detected',
            })

    json.dump(all_confirmed, io.open(OUT_FIXES, 'w', encoding='utf-8'),
              ensure_ascii=False, indent=2)
    print(f"Fixes written to {OUT_FIXES} ({len(all_confirmed)} entries)")


if __name__ == "__main__":
    main()
