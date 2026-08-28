# -*- coding: utf-8 -*-
import json, os, sys

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

sym_issues = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for sym in ['~', '≅', '¬', '♦']:
            if sym in t:
                sym_issues.append((w, 'meaning', m['id'], t, sym))
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for sym in ['~', '≅', '¬', '♦']:
            if sym in t:
                sym_issues.append((w, 'phrase', p['id'], t, sym))

print(f"Found {len(sym_issues)} symbol issues:")
for s in sym_issues[:30]:
    print(f"  [{s[0]}] ({s[1]} {s[2]}): sym='{s[4]}' in '{s[3]}'")
