"""
Унифицированный аудитор для любого диапазона статей.
Использование: python audit_batch.py <start> <end>
"""
import io, json, re, sys, time
from collections import defaultdict

JSON_PATH  = "oxford_5000_2026-08-27.json"
PDF_TEXT   = "tmp/muller_full_text.txt"

# Все известные OCR-паттерны (только надёжные, без ложных срабатываний)
OCR_PATTERNS = [
    # Потеря "сл" ("сло", "слу", "сле")
    (r'\bучайно\b',   r'случайно'),
    (r'\bучайн',      r'случайн'),
    (r'\bишком\b',    r'слишком'),
    (r'\bепой\b',     r'слепой'),
    (r'\bушайт',      r'слушайт'),
    (r'\bедить\b',    r'следить'),
    (r'\bожить\b',    r'сложить'),
    # Потеря "стр"
    (r'\bахование\b', r'страхование'),
    (r'\bаховани',    r'страховани'),
    (r'\bелковое\b',  r'стрелковое'),
    # Потеря "ком"/"бухг"/"минист"
    (r'\bпетенци',    r'компетенци'),
    (r'\bалтер\b',    r'бухгалтер'),
    (r'\bерство\b(?!\s+дел|\s+слов)',  r'Министерство'),
    # OCR-слипание слов
    (r'\bруказакона\b', r'рука закона'),
    # Артефакт "картин форм."
    (r'картин\s+форм\.', r'информ.'),
    # Trailing next-article header (частые паттерны)
    # Определяем по: русский текст + пробел + латинские буквы + [... ]
    (r'\s+\w+(?:[\'\-]\w+)*\s+[A-Z][a-z]\w*\s*(?:\[.*?\]\s*)?[nva]\s*$', r'TRAILING_HEADER'),
]

# Trailing одиночная буква (не в конце аббревиатуры)
TRAILING_SINGLE_LETTER = re.compile(r'(?<!\b[A-Z])\s+([A-Za-z])\s*$')

def find_ocr_errors(text):
    results = []
    for pat, fix in OCR_PATTERNS:
        m = re.search(pat, text)
        if m:
            if fix == 'TRAILING_HEADER':
                results.append({'pat': pat, 'match': m.group(0), 'fix': '(remove trailing)', 'is_header': True})
            else:
                old_part = m.group(0)
                new_part = re.sub(pat, fix, old_part)
                results.append({'pat': pat, 'match': old_part, 'fix': new_part, 'is_header': False})
    return results

def check_trailing_letter(text):
    m = TRAILING_SINGLE_LETTER.search(text)
    if m:
        # Exclude: abbreviations like "A.", "V.", "Dr.", initials
        if re.search(r'\b[A-Z]\.\s*$', text):
            return None
        return m.group(1)
    return None

def check_refl_in_translation(trans):
    return bool(re.match(r'^refl\.?\s', trans))

def check_dup_example_eq_translation(meaning):
    trans = meaning.get('translation', '')
    issues = []
    for ex in meaning.get('examples', []):
        ru = ex.get('ru', '')
        if ru.strip() == trans.strip() and ru.strip():
            issues.append(ru)
    return issues

def extract_article(pdf_text, word):
    base = re.sub(r'\d+$', '', word)
    for pat in [
        rf'(?:^|\n){re.escape(base)}(?:\s+[IVX]+)?\s*[\[1]',
        rf'(?:^|\n){re.escape(base)}\b',
    ]:
        m = re.compile(pat, re.IGNORECASE).search(pdf_text)
        if m:
            start = m.start()
            nm = re.compile(r'\n[a-z][a-z\'\-]{2,}(?:\s+[IVX]+)?\s*[\[1nva ]', re.IGNORECASE).search(pdf_text, start + len(base) + 5)
            end = nm.start() if nm else min(start + 4000, len(pdf_text))
            return pdf_text[start:end]
    return ''

def audit_entry(entry, pdf_article):
    word = entry['word']
    issues = []
    for meaning in entry.get('meanings', []):
        mid = meaning['id']
        trans = meaning.get('translation', '')
        pos   = meaning.get('partOfSpeech', '')

        # OCR in translation
        for err in find_ocr_errors(trans):
            if not err['is_header']:
                issues.append({'type': 'ocr_error', 'word': word, 'mid': mid,
                               'field': 'translation', 'old': trans,
                               'fix_hint': re.sub(err['pat'], err['fix'], trans),
                               'detail': f"pattern '{err['pat']}' matched '{err['match']}'"})

        # trailing letter in translation
        trail = check_trailing_letter(trans)
        if trail:
            issues.append({'type': 'ocr_trailing', 'word': word, 'mid': mid,
                           'field': 'translation', 'old': trans,
                           'fix_hint': re.sub(r'\s+[A-Za-z]\s*$', '', trans).strip(),
                           'detail': f'trailing letter "{trail}"'})

        # refl. in translation
        if check_refl_in_translation(trans):
            issues.append({'type': 'refl_in_translation', 'word': word, 'mid': mid,
                           'field': 'translation', 'old': trans,
                           'fix_hint': re.sub(r'^refl\.?\s+', '', trans),
                           'detail': 'refl. should not be in translation'})

        # stuck adverb in noun translation
        if pos == 'noun' and re.search(r';\s*(самозабвенно|неудержимо|безоглядно)\b', trans):
            issues.append({'type': 'stuck_adverb', 'word': word, 'mid': mid,
                           'field': 'translation', 'old': trans,
                           'fix_hint': re.sub(r';\s*(самозабвенно|неудержимо|безоглядно)\b.*$', '', trans).strip(),
                           'detail': 'adverb stuck in noun translation'})

        # duplicate examples
        for ru in check_dup_example_eq_translation(meaning):
            issues.append({'type': 'dup_example', 'word': word, 'mid': mid,
                           'field': 'example.ru', 'old': ru,
                           'detail': f'example.ru == translation: "{ru[:60]}"'})

        # OCR in examples
        for ex in meaning.get('examples', []):
            for fld, txt in [('example.ru', ex.get('ru','')), ('example.en', ex.get('en',''))]:
                for err in find_ocr_errors(txt):
                    if not err['is_header']:
                        issues.append({'type': 'ocr_error', 'word': word, 'mid': mid,
                                       'field': fld, 'old': txt,
                                       'fix_hint': re.sub(err['pat'], err['fix'], txt),
                                       'detail': f"'{err['match']}' -> '{err['fix']}'"})
                trail = check_trailing_letter(txt)
                if trail and not re.search(r'\b[A-Z]\.$', txt):
                    issues.append({'type': 'ocr_trailing', 'word': word, 'mid': mid,
                                   'field': fld, 'old': txt,
                                   'fix_hint': re.sub(r'\s+[A-Za-z]\s*$', '', txt).strip(),
                                   'detail': f'trailing "{trail}"'})
    return issues


def main():
    start_idx = int(sys.argv[1]) if len(sys.argv) > 1 else 1000
    end_idx   = int(sys.argv[2]) if len(sys.argv) > 2 else 1500
    out_txt = f"tmp/audit_{start_idx}_{end_idx}.txt"
    out_json = f"tmp/audit_{start_idx}_{end_idx}.json"

    t0 = time.time()
    data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
    pdf_text = io.open(PDF_TEXT, 'r', encoding='utf-8').read()

    batch = data[start_idx:end_idx]
    N = len(batch)
    print(f"Auditing {N} entries ({start_idx+1}–{end_idx})...")

    all_issues = []
    pdf_found = 0
    out = io.open(out_txt, 'w', encoding='utf-8')
    out.write(f"AUDIT {start_idx+1}–{end_idx}\n{'='*60}\n\n")

    for i, entry in enumerate(batch):
        word = entry['word']
        article = extract_article(pdf_text, word)
        if article: pdf_found += 1

        issues = audit_entry(entry, article)
        if issues:
            out.write(f"\n{'─'*50}\nWORD: {word}\n")
            if article:
                clean = re.sub(r'[\x00-\x1f]', ' ', article[:300])
                out.write(f"PDF: {clean}\n")
            for iss in issues:
                out.write(f"  [{iss['mid']}] {iss['type']} | {iss['field']}\n")
                out.write(f"    OLD: {iss['old'][:100]}\n")
                if 'fix_hint' in iss:
                    out.write(f"    FIX: {iss['fix_hint'][:100]}\n")
                out.write(f"    NOTE: {iss['detail']}\n")
        all_issues.extend(issues)
        if (i+1) % 200 == 0:
            print(f"  {start_idx+i+1}/{end_idx}... issues={len(all_issues)}, pdf_found={pdf_found}")

    by_type = defaultdict(int)
    for iss in all_issues: by_type[iss['type']] += 1

    out.write(f"\n\n{'='*60}\nSUMMARY: {N} entries, PDF found {pdf_found}, issues {len(all_issues)}\n")
    for t, c in sorted(by_type.items(), key=lambda x: -x[1]):
        out.write(f"  {t}: {c}\n")
    out.close()

    json.dump(all_issues, io.open(out_json, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    elapsed = time.time()-t0
    print(f"\nDone in {elapsed:.1f}s | Issues: {len(all_issues)} | PDF found: {pdf_found}/{N}")
    for t, c in sorted(by_type.items(), key=lambda x: -x[1]):
        print(f"  {t}: {c}")
    print(f"Report: {out_txt}")

if __name__ == "__main__":
    main()
