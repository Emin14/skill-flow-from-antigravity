"""
Проверка конкретных случаев:
1. advocate - trailing A в example.en
2. attend - trailing X в example.en
3. agriculture - trailing A в example.en  
4. duplicate_example_ru - реальные дублирования
5. about meaning [8] - дублирование "иметь что-либо при себе"
"""
import io
import json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
pdf_text = io.open('tmp/muller_full_text.txt', 'r', encoding='utf-8').read()
out = io.open('tmp/specific_checks.txt', 'w', encoding='utf-8')

def get_entry(word):
    for e in data:
        if e['word'] == word:
            return e
    return None

def get_pdf_snippet(word, chars=600):
    import re
    base = re.sub(r'\d+$', '', word)
    pat = re.compile(rf'(?:^|\n){re.escape(base)}\b', re.IGNORECASE)
    m = pat.search(pdf_text)
    if m:
        return pdf_text[m.start():m.start()+chars]
    return 'NOT FOUND'

words_to_check = [
    'a', 'abandon', 'ability', 'about', 'above', 'access', 'accident',
    'accidentally', 'accountant', 'adapt', 'address', 'advocate',
    'agriculture', 'altogether', 'any', 'arm', 'assumption', 'assurance',
    'attend', 'balance', 'bend', 'beyond', 'bite', 'blanket', 'blind',
]

for word in words_to_check:
    entry = get_entry(word)
    if not entry:
        out.write(f"\n{'='*60}\nWORD: {word} -- NOT IN JSON\n")
        continue
    
    out.write(f"\n{'='*60}\n")
    out.write(f"WORD: {word}\n")
    out.write(f"\n--- JSON meanings ---\n")
    for m in entry.get('meanings', []):
        mid = m['id']
        trans = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        out.write(f"  [{mid}] {pos}: {trans[:100]}\n")
        for ex in m.get('examples', []):
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            if en or ru:
                out.write(f"    EN: {en[:80]}\n")
                out.write(f"    RU: {ru[:80]}\n")
    
    out.write(f"\n--- PDF snippet ---\n")
    snippet = get_pdf_snippet(word, 800)
    # Clean control chars
    import re
    snippet_clean = re.sub(r'[\x00-\x1f]', ' ', snippet)
    out.write(snippet_clean[:800])
    out.write("\n")

out.close()
print("done")
