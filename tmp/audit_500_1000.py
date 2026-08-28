"""
Аудит слов 501-1000 (B-C раздел)
с расширенным набором OCR-паттернов на основе паттернов из первого прохода.
"""
import io
import json
import re
import time
from collections import defaultdict

JSON_PATH  = "oxford_5000_2026-08-27.json"
PDF_TEXT   = "tmp/muller_full_text.txt"
OUT_REPORT = "tmp/manual_audit_500_1000.txt"
OUT_JSON   = "tmp/manual_audit_500_1000.json"

# Расширенный список OCR-паттернов (из обоих проходов)
OCR_FIXES = {
    # Потеря "сл" в начале слова
    re.compile(r'\bучайно\b'):    ('учайно', 'случайно'),
    re.compile(r'\bучайн(?!ая)'): ('учайн', 'случайн'),
    re.compile(r'\bишком\b'):     ('ишком', 'слишком'),
    re.compile(r'\bепой\b'):      ('епой', 'слепой'),
    re.compile(r'\bушайт'):       ('ушайт', 'слушайт'),
    re.compile(r'\bедить\b'):     ('едить', 'следить'),
    re.compile(r'\bежу\b'):       ('ежу', 'слежу'),
    # Потеря "стр" в начале слова
    re.compile(r'\bахование\b'):  ('ахование', 'страхование'),
    re.compile(r'\bаховани'):     ('аховани', 'страховани'),
    re.compile(r'\bелковое\b'):   ('елковое', 'стрелковое'),
    re.compile(r'\bелок(?!а)'):   ('елок', 'стрелок'),
    # Потеря "ком" / "бухг" / "минист"
    re.compile(r'\bпетенци'):     ('петенци', 'компетенци'),
    re.compile(r'\bалтер\b'):     ('алтер', 'бухгалтер'),
    re.compile(r'\bерство\b'):    ('ерство', 'Министерство'),
    # Потеря "ожи" / "ложи"
    re.compile(r'\bожить\b'):     ('ожить', 'сложить'),
    # OCR-слипание слов
    re.compile(r'\bруказакона\b'): ('руказакона', 'рука закона'),
    re.compile(r'\bруказа\b'):    ('руказа', 'рука за'),
    # Артефакт "картин форм."
    re.compile(r'картин\s+форм\.'): ('картин форм.', 'информ.'),
    # Трейлинг одиночной заглавной буквы
    re.compile(r'\s[A-Z]\s*$'):   (' A', ''),
    re.compile(r'\s[a-z]\s*$'):   (' a', ''),
    # refl. в translation
    re.compile(r'^refl\.?\s+\S'): ('refl. leaked', 'remove refl.'),
    # номер страницы в конце примера
    re.compile(r'\s+\w+ \d{2,3}$'): ('trailing page', 'page number artifact'),
    # Потеря "не" в начале (менее уверенные паттерны)
    re.compile(r'\bдоразвит'):    ('едоразвит', 'недоразвит'),
    re.compile(r'\bдостаток\b'):  ('едостаток', 'недостаток'),
    re.compile(r'\bобходим'):     ('еобходим', 'необходим'),
    re.compile(r'\bлегитим'):     ('елегитим', 'нелегитим'),
    re.compile(r'\bлепый\b'):     ('елепый', 'нелепый'),
    re.compile(r'\bзначительн'):  ('езначительн', 'незначительн'),
    # Потеря части слова "пол-"
    re.compile(r'\bностью\b(?!ю)'):  ('ностью', 'полностью'),  # неуверенно — только в контексте
}

def find_ocr_errors(text: str) -> list:
    found = []
    for pat, (wrong, correct) in OCR_FIXES.items():
        if pat.search(text):
            found.append({'wrong': wrong, 'correct': correct, 'in': text})
    return found

def check_refl_in_translation(trans: str) -> bool:
    return bool(re.match(r'^refl\.?\s', trans))

def check_trailing_artifact(text: str) -> str:
    m = re.search(r'\s([A-Za-z])\s*$', text)
    if m:
        return m.group(1)
    return ''

def check_example_duplicates_translation(meaning: dict) -> list:
    issues = []
    trans = meaning.get('translation', '')
    for ex in meaning.get('examples', []):
        ru = ex.get('ru', '')
        if ru.strip() == trans.strip() and ru.strip():
            issues.append({'type': 'duplicate_example_ru', 'detail': f'example.ru == translation: "{ru[:60]}"'})
    return issues

def check_stuck_adverb_in_noun(meaning: dict) -> list:
    issues = []
    pos = meaning.get('partOfSpeech', '')
    trans = meaning.get('translation', '')
    if pos == 'noun' and re.search(r';\s*(самозабвенно|неудержимо|безоглядно|невзирая)\b', trans):
        issues.append({
            'type': 'stuck_adverb_in_noun_translation',
            'fix_hint': re.sub(r';\s*(самозабвенно|неудержимо|безоглядно|невзирая)\b.*$', '', trans).strip(),
        })
    return issues

def extract_article(pdf_text: str, word: str) -> str:
    base = re.sub(r'\d+$', '', word)
    header_pat = re.compile(rf'(?:^|\n){re.escape(base)}(?:\s+[IVX]+)?\s*[\[1]', re.IGNORECASE)
    m = header_pat.search(pdf_text)
    if not m:
        header_pat2 = re.compile(rf'(?:^|\n){re.escape(base)}\b', re.IGNORECASE)
        m = header_pat2.search(pdf_text)
    if not m:
        return ''
    start = m.start()
    next_header = re.compile(r'\n[a-z][a-z\'\-]{2,}(?:\s+[IVX]+)?\s*[\[1n v a ]', re.IGNORECASE)
    nm = next_header.search(pdf_text, start + len(base) + 5)
    end = nm.start() if nm else min(start + 5000, len(pdf_text))
    return pdf_text[start:end]

def audit_word(entry: dict, pdf_article: str) -> list:
    issues = []
    word = entry['word']
    for meaning in entry.get('meanings', []):
        mid   = meaning['id']
        trans = meaning.get('translation', '')
        pos   = meaning.get('partOfSpeech', '')

        # OCR in translation
        for err in find_ocr_errors(trans):
            if err['wrong'] in ('PAGE number artifact', 'refl. leaked', 'trailing page'):
                continue
            fix = trans.replace(err['wrong'], err['correct'])
            issues.append({'type': 'ocr_error', 'word': word, 'meaning_id': mid,
                           'field': 'translation', 'old': trans, 'fix_hint': fix,
                           'detail': f"OCR: '{err['wrong']}' → '{err['correct']}'"})

        # refl. in translation
        if check_refl_in_translation(trans):
            issues.append({'type': 'structural_refl_in_translation', 'word': word,
                           'meaning_id': mid, 'field': 'translation', 'old': trans,
                           'fix_hint': re.sub(r'^refl\.?\s+', '', trans),
                           'detail': 'refl. mark should not be in translation'})

        # trailing artifact in translation
        trail = check_trailing_artifact(trans)
        if trail and not re.search(r'\b[A-Z]\.$', trans):
            issues.append({'type': 'ocr_trailing_artifact', 'word': word, 'meaning_id': mid,
                           'field': 'translation', 'old': trans,
                           'fix_hint': re.sub(r'\s+[A-Za-z]\s*$', '', trans).strip(),
                           'detail': f'Trailing "{trail}" is PDF column header artifact'})

        # stuck adverb in noun
        for iss in check_stuck_adverb_in_noun(meaning):
            issues.append({**iss, 'word': word, 'meaning_id': mid, 'field': 'translation', 'old': trans})

        # examples
        for ex in meaning.get('examples', []):
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            for txt, fld in [(ru, 'example.ru'), (en, 'example.en')]:
                for err in find_ocr_errors(txt):
                    if err['wrong'] in ('PAGE number artifact', 'refl. leaked', 'trailing page'):
                        continue
                    fix = txt.replace(err['wrong'], err['correct'])
                    issues.append({'type': 'ocr_error', 'word': word, 'meaning_id': mid,
                                   'field': fld, 'old': txt, 'fix_hint': fix,
                                   'detail': f"OCR: '{err['wrong']}' → '{err['correct']}'"})
                # trailing in examples
                trail = check_trailing_artifact(txt)
                if trail and not re.search(r'\b[A-Z]\.$', txt):
                    issues.append({'type': 'ocr_trailing_artifact', 'word': word, 'meaning_id': mid,
                                   'field': fld, 'old': txt,
                                   'fix_hint': re.sub(r'\s+[A-Za-z]\s*$', '', txt).strip(),
                                   'detail': f'Trailing "{trail}" artifact'})

        # duplicate examples
        for iss in check_example_duplicates_translation(meaning):
            issues.append({**iss, 'word': word, 'meaning_id': mid})

    return issues

def main():
    t0 = time.time()
    print("Loading data...")
    data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
    pdf_text = io.open(PDF_TEXT, 'r', encoding='utf-8').read()
    print(f"Entries: {len(data)}")

    START, END = 500, 1000
    entries_to_check = data[START:END]
    N = len(entries_to_check)
    print(f"Auditing entries {START+1}–{START+N}...")

    all_issues = []
    pdf_found = 0
    out_detail = io.open(OUT_REPORT, 'w', encoding='utf-8')
    out_detail.write(f"AUDIT REPORT — Entries {START+1}–{START+N}\n{'='*70}\n\n")

    for i, entry in enumerate(entries_to_check):
        word = entry['word']
        article = extract_article(pdf_text, word)
        if article:
            pdf_found += 1
        issues = audit_word(entry, article)
        if issues:
            out_detail.write(f"\n{'─'*50}\nWORD: {word}\n")
            if article:
                clean = re.sub(r'[\x00-\x1f]', ' ', article[:350])
                out_detail.write(f"PDF: {clean}\n")
            out_detail.write(f"ISSUES ({len(issues)}):\n")
            for iss in issues:
                out_detail.write(f"  [{iss.get('meaning_id','?')}] {iss['type']} | {iss.get('field','?')}\n")
                out_detail.write(f"    OLD: {iss.get('old','')[:100]}\n")
                if 'fix_hint' in iss:
                    out_detail.write(f"    FIX: {iss['fix_hint'][:100]}\n")
                out_detail.write(f"    NOTE: {iss.get('detail','')}\n")
        all_issues.extend(issues)
        if (i+1) % 100 == 0:
            print(f"  {START+i+1}... issues: {len(all_issues)}, pdf_found: {pdf_found}")

    by_type = defaultdict(list)
    for iss in all_issues:
        by_type[iss['type']].append(iss)

    out_detail.write(f"\n\n{'='*70}\nSUMMARY\n{'='*70}\n")
    out_detail.write(f"Entries checked: {N}\nFound in PDF: {pdf_found}\nTotal issues: {len(all_issues)}\n\nBY TYPE:\n")
    for t, items in sorted(by_type.items(), key=lambda x: -len(x[1])):
        out_detail.write(f"  {t}: {len(items)}\n")
    out_detail.close()

    json.dump(all_issues, io.open(OUT_JSON, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    elapsed = time.time() - t0
    print(f"\nDone in {elapsed:.1f}s | Issues: {len(all_issues)} | PDF found: {pdf_found}/{N}")
    for t, items in sorted(by_type.items(), key=lambda x: -len(x[1])):
        print(f"  {t}: {len(items)}")

if __name__ == "__main__":
    main()
