# -*- coding: utf-8 -*-
"""
Add rail example to meaning 4 of rail.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'rail':
        for m in item['meanings']:
            if m['id'] == 4:
                m['examples'] = [
                    { "en": "the train left (или jumped) the rails", "ru": "поезд сошёл с рельсов" }
                ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Added rail example successfully!")
