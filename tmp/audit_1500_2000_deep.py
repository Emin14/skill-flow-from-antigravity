import io, json, re
from collections import Counter

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
pdf_text = io.open('tmp/muller_full_text.txt', 'r', encoding='utf-8').read()

entries_1500_2000 = data[1500:2000]

def get_article_text(word):
    base = re.sub(r'\d+$', '', word)
    pats = [
        rf'(?:^|\n){re.escape(base)}(?:\s+[IVX]+)?\s*\[',
        rf'(?:^|\n){re.escape(base)}(?:\s+[IVX]+)?\s*1\.',
        rf'(?:^|\n){re.escape(base)}\b',
    ]
    for p in pats:
        m = re.search(p, pdf_text, re.IGNORECASE)
        if m:
            start = m.start()
            next_m = re.search(r'\n[a-z][a-z\'\-]{2,}(?:\s+[IVX]+)?\s*(\[|1\.)', pdf_text[start+len(base)+3:], re.IGNORECASE)
            if next_m:
                end = start + len(base) + 3 + next_m.start()
            else:
                end = min(start + 4000, len(pdf_text))
            return pdf_text[start:end]
    return ""

report = []

ocr_checks = [
    (r'\bучайно\b', 'учайно -> случайно'),
    (r'\bучайн', 'учайн -> случайн'),
    (r'\bишком\b', 'ишком -> слишком'),
    (r'\bепой\b', 'епой -> слепой'),
    (r'\bушайт', 'ушайт -> слушайт'),
    (r'\bедить\b', 'едить -> следить'),
    (r'\bожить\b', 'ожить -> сложить'),
    (r'\bахование\b', 'ахование -> страхование'),
    (r'\bаховани', 'аховани -> страховани'),
    (r'\bелковое\b', 'елковое -> стрелковое'),
    (r'\bпетенци', 'петенци -> компетенци'),
    (r'^алтер$', 'алтер -> бухгалтер'),
    (r'^ерство\b', 'ерство -> Министерство'),
    (r'\bруказакона\b', 'руказакона -> рука закона'),
    (r'картин\s+форм\.', 'картин форм. -> информ.'),
    (r'^ическое равновесие', 'ическое равновесие -> политическое равновесие'),
]

for idx_rel, entry in enumerate(entries_1500_2000):
    idx_abs = 1500 + idx_rel
    word = entry['word']
    art = get_article_text(word)
    art_clean = re.sub(r'[\x00-\x1f]', ' ', art)
    
    issues = []
    
    for m in entry.get('meanings', []):
        mid = m['id']
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        
        # 1. Glued POS transition (e.g. "2. v")
        if re.search(r'\b\d+\.\s+[nvaj]\b', tr):
            issues.append({
                'type': 'glued_pos_header',
                'mid': mid, 'field': 'translation', 'val': tr,
                'detail': 'Contains glued part of speech transition (e.g. 2. v)'
            })
            
        # 2. Glued idiom mark '≅' or '♦'
        if '≅' in tr or '♦' in tr:
            issues.append({
                'type': 'glued_idiom',
                'mid': mid, 'field': 'translation', 'val': tr,
                'detail': 'Contains idiom symbol ≅ or ♦'
            })
            
        # 3. Trailing next-article header (e.g. latin text + [IPA] + pos)
        if re.search(r'\s+[A-Za-z][A-Za-z\'\-]+\s*(?:\[.*?\]|[A-Z][a-z]+\])\s*[nva]\s*$', tr):
            issues.append({
                'type': 'trailing_article_header',
                'mid': mid, 'field': 'translation', 'val': tr,
                'detail': 'Contains trailing next-article header'
            })
            
        # 4. POS is 'other'
        if pos == 'other':
            issues.append({
                'type': 'pos_other',
                'mid': mid, 'field': 'partOfSpeech', 'val': tr,
                'detail': f'partOfSpeech is "other"'
            })
            
        # 5. OCR errors in translation
        for pat, desc in ocr_checks:
            if re.search(pat, tr):
                issues.append({
                    'type': 'ocr_error',
                    'mid': mid, 'field': 'translation', 'val': tr,
                    'detail': desc
                })
                
        # 6. refl in translation
        if re.match(r'^refl\.?\s', tr):
            issues.append({
                'type': 'refl_in_translation',
                'mid': mid, 'field': 'translation', 'val': tr,
                'detail': 'refl. mark in translation'
            })
            
        # 7. stuck adverb
        if pos == 'noun' and re.search(r';\s*(самозабвенно|неудержимо|безоглядно)\b', tr):
            issues.append({
                'type': 'stuck_adverb',
                'mid': mid, 'field': 'translation', 'val': tr,
                'detail': 'adverb stuck in noun translation'
            })
            
        # 8. Check examples for OCR errors
        for eidx, ex in enumerate(m.get('examples', [])):
            ru = ex.get('ru', '')
            for pat, desc in ocr_checks:
                if re.search(pat, ru):
                    issues.append({
                        'type': 'ocr_error',
                        'mid': mid, 'field': f'example[{eidx}].ru', 'val': ru,
                        'detail': desc
                    })
    
    if issues:
        report.append({
            'index': idx_abs + 1,
            'word': word,
            'pdf': art_clean[:400],
            'issues': issues
        })

out_txt = io.open('tmp/audit_1500_2000_summary.txt', 'w', encoding='utf-8')
out_txt.write(f"FULL AUDIT SUMMARY FOR WORDS 1501-2000 (Found {len(report)} words with issues)\n")
out_txt.write("="*70 + "\n\n")

counts = Counter()
for r in report:
    out_txt.write(f"[{r['index']}] WORD: {r['word']} ({len(r['issues'])} issues)\n")
    out_txt.write(f"PDF Snippet: {r['pdf'][:300]}\n")
    for iss in r['issues']:
        counts[iss['type']] += 1
        out_txt.write(f"  - [{iss['mid']}] {iss['type']} | {iss['field']}: {iss['detail']}\n")
        out_txt.write(f"    VAL: {iss['val'][:80]}\n")
    out_txt.write("\n" + "-"*50 + "\n\n")

out_txt.write("\n" + "="*70 + "\n")
out_txt.write("COUNTS BY ISSUE TYPE:\n")
for t, cnt in counts.most_common():
    out_txt.write(f"  {t}: {cnt}\n")
out_txt.close()

out_json = io.open('tmp/audit_1500_2000_full_report.json', 'w', encoding='utf-8')
json.dump(report, out_json, ensure_ascii=False, indent=2)
out_json.close()

print(f"Audit 1500-2000 completed: {len(report)} words with issues.")
for t, cnt in counts.most_common():
    print(f"  {t}: {cnt}")
