# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECK 'lady' ===")
it_lady = next((x for x in data if x['word'] == 'lady'), None)
print(json.dumps(it_lady, ensure_ascii=False, indent=2))

print("\n=== 2. CHECK 'lion' AND 'Leo' ===")
for w in ['lion', 'Leo', 'leo']:
    it = next((x for x in data if x['word'].lower() == w.lower()), None)
    if it:
        print(f"--- Word: {it['word']} ---")
        print(json.dumps(it, ensure_ascii=False, indent=2))

print("\n=== 3. CHECK 'let' ===")
it_let = next((x for x in data if x['word'] == 'let'), None)
if it_let:
    print(json.dumps(it_let, ensure_ascii=False, indent=2))

print("\n=== 4. CHECK 'nerve' ===")
it_nerve = next((x for x in data if x['word'] == 'nerve'), None)
if it_nerve:
    print(json.dumps(it_nerve, ensure_ascii=False, indent=2))

print("\n=== 5. FIND ALL OCCURRENCES OF 'pl' IN THE ENTIRE VERIFIED FILE ===")
pl_count = 0
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\bpl\b', t, re.IGNORECASE):
            pl_count += 1
            print(f"Meaning: [{it['word']:12}] ID: {m['id']} | Trans: {repr(t)}")
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if re.search(r'\bpl\b', ru, re.IGNORECASE):
                pl_count += 1
                print(f"Example: [{it['word']:12}] ru: {repr(ru)}")
    for p in it.get('phrases', []):
        ru = p.get('ru', '')
        if re.search(r'\bpl\b', ru, re.IGNORECASE):
            pl_count += 1
            print(f"Phrase:  [{it['word']:12}] ru: {repr(ru)}")

print(f"\nTotal remaining 'pl' occurrences: {pl_count}")

print("\n=== 6. FIND ALL UNRESOLVED REGISTER PREFIXES LIKE 'ист ' ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        m_reg = re.match(r'^([а-яёА-ЯЁ]{2,6})\s+([а-яёА-ЯЁ]+)', t)
        if m_reg:
            first_word = m_reg.group(1).lower()
            if first_word in ['ист', 'воен', 'мед', 'юр', 'мат', 'тех', 'мор', 'муз', 'разг', 'амер', 'уст', 'книжн', 'поэт', 'спорт', 'театр', 'биол', 'бот', 'зоол', 'геогр', 'геол', 'астр', 'хим', 'физ', 'филос', 'эл', 'ком', 'фин', 'полит', 'рел', 'жив', 'вчт', 'информ', 'кино', 'тлв', 'фото', 'иск', 'авиа']:
                print(f"Unextracted register: [{it['word']:12}] ID: {m['id']} | Trans: {repr(t)}")
