import io, json, re

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
pdf_text = io.open('tmp/muller_full_text.txt', 'r', encoding='utf-8').read()

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
                end = min(start + 3000, len(pdf_text))
            return pdf_text[start:end]
    return ""

out = io.open('tmp/inspect_26_50.txt', 'w', encoding='utf-8')

for i in range(25, 50):
    entry = data[i]
    word = entry['word']
    art = get_article_text(word)
    art_clean = re.sub(r'[\x00-\x1f]', ' ', art)
    
    out.write(f"============================================================\n")
    out.write(f"[{i+1}] WORD: {word} (cefr={entry.get('cefr')}, rank={entry.get('frequency_rank')})\n")
    out.write(f"PDF:\n{art_clean[:600]}\n\n")
    out.write(f"JSON Meanings ({len(entry.get('meanings', []))}):\n")
    for m in entry.get('meanings', []):
        mid = m['id']
        pos = m.get('partOfSpeech')
        tr = m.get('translation')
        reg = m.get('register')
        out.write(f"  [{mid}] ({pos}) [reg={reg}] {tr}\n")
        for ex in m.get('examples', []):
            out.write(f"      EN: {ex.get('en')}\n")
            out.write(f"      RU: {ex.get('ru')}\n")
    if 'phrases' in entry:
        out.write(f"JSON Phrases ({len(entry['phrases'])}):\n")
        for phr in entry['phrases']:
            out.write(f"  - {phr.get('phrase')} ({phr.get('partOfSpeech')}): {phr.get('translation')}\n")
    out.write("\n")

out.close()
print("Saved to tmp/inspect_26_50.txt")
