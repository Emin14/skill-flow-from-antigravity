# -*- coding: utf-8 -*-
"""
Deep scan for:
1. Chopped 'уст-' words: 'ремлять' -> 'устремлять', 'ремиться' -> 'устремиться', 'ройство' -> 'устройство', etc.
2. Dangling dashes in parentheses: e.g. '(to, on —)', '(with —)', '(for —)'
3. Examples where definition dumps occurred (e.g. in fasten)
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

print("=" * 80)
print("1. INSPECTING 'fasten' ENTRY IN FULL")
print("=" * 80)

for item in data:
    if item['word'] == 'fasten':
        print(json.dumps(item, ensure_ascii=False, indent=2))

print("\n" + "=" * 80)
print("2. SCANNING CHOPPED 'уст-' / 'стр-' / 'при-' WORDS")
print("=" * 80)

CHOPPED_UST_ROOTS = [
    'ремлять', 'ремляет', 'ремляют', 'ремлял', 'ремляла', 'ремлять(ся)',
    'ремиться', 'ремится', 'ремятся', 'ремился', 'ремилась',
    'ройство', 'ройства', 'ройству', 'ройством', 'ройстве',
    'анавливать', 'анавливает', 'анавливают', 'анавливал',
    'ановка', 'ановки', 'ановку', 'ановке',
    'ав', 'ава', 'аву', 'авом', 'аве',
    'ойчивый', 'ойчивая', 'ойчивое', 'ойчивые',
    'алость', 'алости',
    'упать', 'упает', 'упают', 'упал'
]

chopped_ust_matches = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for wd in re.findall(r'[а-яёА-ЯЁ]+', t):
            if wd.lower() in CHOPPED_UST_ROOTS:
                chopped_ust_matches.append((w, 'meaning', m['id'], t, wd))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for wd in re.findall(r'[а-яёА-ЯЁ]+', ru):
                if wd.lower() in CHOPPED_UST_ROOTS:
                    chopped_ust_matches.append((w, 'meaning_ex', m['id'], ru, wd))
                    
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for wd in re.findall(r'[а-яёА-ЯЁ]+', t):
            if wd.lower() in CHOPPED_UST_ROOTS:
                chopped_ust_matches.append((w, 'phrase', p['id'], t, wd))
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            for wd in re.findall(r'[а-яёА-ЯЁ]+', ru):
                if wd.lower() in CHOPPED_UST_ROOTS:
                    chopped_ust_matches.append((w, 'phrase_ex', p['id'], ru, wd))

print(f"Found {len(chopped_ust_matches)} chopped 'уст-' matches:")
for c in chopped_ust_matches:
    print(f"  [{c[0]}] ({c[1]} id {c[2]}): word='{c[4]}' in '{c[3]}'")

print("\n" + "=" * 80)
print("3. SCANNING DANGLING DASHES IN PARENTHESES")
print("=" * 80)

dangling_dash_matches = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\([a-zA-Z\s,;/-]+[—\-]\s*\)', t):
            dangling_dash_matches.append((w, 'meaning', m['id'], t))
            
print(f"Found {len(dangling_dash_matches)} dangling dash matches:")
for d in dangling_dash_matches:
    print(f"  [{d[0]}] (id {d[2]}): '{d[3]}'")

print("\n" + "=" * 80)
print("4. SCANNING DEFINITION DUMPS INSIDE EXAMPLES")
print("=" * 80)

definition_dump_matches = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if re.search(r'\([a-zA-Z\s,;/-]+\);', ru) and ru.count(';') >= 2:
                definition_dump_matches.append((w, 'meaning_ex', m['id'], ex.get('en'), ru))
                
print(f"Found {len(definition_dump_matches)} definition dump matches in examples:")
for d in definition_dump_matches:
    print(f"  [{d[0]}] (id {d[2]}): en='{d[3]}' -> ru='{d[4]}'")
