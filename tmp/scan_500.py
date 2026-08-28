import io, json, re

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
pdf_text = io.open('tmp/muller_full_text.txt', 'r', encoding='utf-8').read()

entries_500 = data[:500]

def get_article_text(word):
    base = re.sub(r'\d+$', '', word)
    # Search for word header
    pats = [
        rf'(?:^|\n){re.escape(base)}(?:\s+[IVX]+)?\s*\[',
        rf'(?:^|\n){re.escape(base)}(?:\s+[IVX]+)?\s*1\.',
        rf'(?:^|\n){re.escape(base)}\b',
    ]
    for p in pats:
        m = re.search(p, pdf_text, re.IGNORECASE)
        if m:
            start = m.start()
            # find next entry
            next_m = re.search(r'\n[a-z][a-z\'\-]{2,}(?:\s+[IVX]+)?\s*(\[|1\.)', pdf_text[start+len(base)+3:], re.IGNORECASE)
            if next_m:
                end = start + len(base) + 3 + next_m.start()
            else:
                end = min(start + 4000, len(pdf_text))
            return pdf_text[start:end]
    return ""

out = io.open('tmp/audit_500_detailed_scan.txt', 'w', encoding='utf-8')

# OCR patterns that are 100% indicative of an error
SUSPICIOUS_PATTERNS = [
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
    (r'(?<!\b[A-Z])\s+[A-Za-z]\s*$', 'trailing letter artifact'),
    (r'^refl\.?\s', 'refl in translation'),
    (r';\s*(?:самозабвенно|неудержимо|безоглядно)\b', 'stuck adverb in translation'),
    (r'\b\w+\s+(?:\[.*?\]|[A-Z][a-z]+\])\s*[nva]\s*$', 'trailing entry header in text'),
]

anomalies = []

for idx, entry in enumerate(entries_500):
    word = entry['word']
    art = get_article_text(word)
    art_clean = re.sub(r'[\x00-\x1f]', ' ', art)
    
    word_anomalies = []
    
    # Check meanings
    for m in entry.get('meanings', []):
        mid = m['id']
        trans = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        
        # Check suspicious patterns in translation
        for p, desc in SUSPICIOUS_PATTERNS:
            if re.search(p, trans):
                word_anomalies.append({
                    'word': word, 'mid': mid, 'field': 'translation',
                    'val': trans, 'desc': desc, 'pattern': p
                })
        
        # Check examples
        for eidx, ex in enumerate(m.get('examples', [])):
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            for p, desc in SUSPICIOUS_PATTERNS:
                if p == r'(?<!\b[A-Z])\s+[A-Za-z]\s*$' and en and re.search(r'\b[A-Z]\.\s*$', en):
                    continue
                if p == r'(?<!\b[A-Z])\s+[A-Za-z]\s*$' and en.endswith(' A') and word == 'a':
                    pass
                if re.search(p, ru):
                    word_anomalies.append({
                        'word': word, 'mid': mid, 'field': f'example[{eidx}].ru',
                        'val': ru, 'desc': desc, 'pattern': p
                    })
    
    if word_anomalies:
        out.write(f"[{idx+1}/500] WORD: {word}\n")
        out.write(f"PDF Snippet: {art_clean[:300]}\n")
        for an in word_anomalies:
            out.write(f"  MID {an['mid']} | {an['field']}: {an['desc']}\n")
            out.write(f"    VALUE: {an['val']}\n")
        out.write("\n" + "-"*60 + "\n\n")
        anomalies.extend(word_anomalies)

out.close()
print(f"Total anomaly detections in first 500 words: {len(anomalies)}")
