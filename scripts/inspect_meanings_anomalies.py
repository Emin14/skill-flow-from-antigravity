# -*- coding: utf-8 -*-
"""
Inspect all 152 truncated endings, 21 broken roots, and 42 duplicates.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 80)
print("1. ALL 21 BROKEN ROOTS")
print("=" * 80)

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for wd in re.findall(r'[а-яёА-ЯЁ]+', t):
            wd_l = wd.lower()
            if wd_l in ['аболетучий', 'абый', 'абость', 'едующий', 'анавливать', 'ановка', 'ремлять', 'ремиться', 'ройство', 'упать', 'ойчивый', 'ное', 'ный', 'ная', 'ское', 'ский', 'ская']:
                print(f"[{w}] (id {m['id']}): word='{wd}' in '{t}'")

print("\n" + "=" * 80)
print("2. ALL 42 DUPLICATE MEANINGS")
print("=" * 80)

for item in data:
    w = item['word']
    seen = {}
    for m in item.get('meanings', []):
        pos = m.get('partOfSpeech', '')
        t = m.get('translation', '').strip().lower()
        if (pos, t) in seen:
            print(f"[{w}] duplicate: pos={pos}, id={m['id']} vs id={seen[(pos, t)]} -> '{m['translation']}'")
        else:
            seen[(pos, t)] = m['id']

print("\n" + "=" * 80)
print("3. SAMPLE TRUNCATED TRANSLATIONS (FIRST 40)")
print("=" * 80)

trunc_count = 0
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'[,;:\-—]\s*$', t) or re.search(r'\([^\)]*$', t) or re.search(r'\[[^\]]*$', t):
            trunc_count += 1
            if trunc_count <= 40:
                print(f"[{w}] (id {m['id']}): '{t}'")
print(f"Total truncated translations: {trunc_count}")
