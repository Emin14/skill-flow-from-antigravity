# -*- coding: utf-8 -*-
"""
Scan for all raw pl markers across oxford_5000_2026-08-27.json.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

raw_pl_meanings = []
raw_pl_phrases = []

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if re.search(r'\bpl\b', tr) and not 'при англ. мн. ч.' in tr:
            raw_pl_meanings.append((w, m['id'], tr))
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if re.search(r'\bpl\b', tr) and not 'при англ. мн. ч.' in tr:
            raw_pl_phrases.append((w, p['id'], tr))

print(f"Total meanings with raw 'pl': {len(raw_pl_meanings)}")
for it in raw_pl_meanings[:25]:
    print(f"  Word '{it[0]}' [meaning {it[1]}]: '{it[2]}'")

print(f"\nTotal phrases with raw 'pl': {len(raw_pl_phrases)}")
for it in raw_pl_phrases[:10]:
    print(f"  Word '{it[0]}' [phrase {it[1]}]: '{it[2]}'")
