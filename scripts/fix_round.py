# -*- coding: utf-8 -*-
"""
Fix round in oxford dataset.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'round':
        clean_m = [m for m in item['meanings'] if m['translation'].strip()]
        for idx, m in enumerate(clean_m, 1):
            m['id'] = idx
        item['meanings'] = clean_m

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed round successfully!")
