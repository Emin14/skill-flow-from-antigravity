import json, io

data = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
out = io.open('tmp/structure_analysis.txt', 'w', encoding='utf-8')

out.write('=== STRUCTURE ANALYSIS - FIRST 50 ENTRIES ===\n\n')
for entry in data[:50]:
    word = entry['word']
    cefr = entry['cefr']
    out.write(f'WORD: {word} (CEFR: {cefr})\n')
    for m in entry.get('meanings', []):
        mid = m['id']
        pos = m['partOfSpeech']
        trans = m['translation'][:100]
        out.write(f'  [{mid}] {pos}: {trans}\n')
        for ex in m.get('examples', [])[:2]:
            en = ex.get('en', '')[:70]
            ru = ex.get('ru', '')[:70]
            out.write(f'    EN: {en}\n')
            out.write(f'    RU: {ru}\n')
    phrases = entry.get('phrases', [])
    if phrases:
        out.write(f'  PHRASES: {len(phrases)}\n')
    out.write('\n')

out.close()
print('done - wrote structure_analysis.txt')
