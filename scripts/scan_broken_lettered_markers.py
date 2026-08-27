# -*- coding: utf-8 -*-
"""
Scan for lettered sub-markers (б), в), г), etc.) left inside translation strings.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

lettered_in_translation = []

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        # Check for standalone or trailing "б)", "в)", "г)", etc.
        if re.search(r'[;\s,\(]\s*[бвгдежзиклмнопр]\)', tr, re.I):
            lettered_in_translation.append((w, 'meaning', m['id'], tr))
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if re.search(r'[;\s,\(]\s*[бвгдежзиклмнопр]\)', tr, re.I):
            lettered_in_translation.append((w, 'phrase', p['id'], tr))

print(f"Total translations with broken sub-markers (б), в), etc.): {len(lettered_in_translation)}")
for it in lettered_in_translation[:25]:
    print(f"  {it[0]} [{it[1]} {it[2]}]: '{it[3]}'")
