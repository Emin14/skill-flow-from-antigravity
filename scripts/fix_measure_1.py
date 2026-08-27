# -*- coding: utf-8 -*-
"""
Clean measure meaning 1 examples.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'measure':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'мера; единица измерения'
                m['examples'] = [
                    { "en": "dry (linear, liquid, square, etc.) measures", "ru": "меры сыпучих тел (длины, жидкостей, площади и т. п.)" },
                    { "en": "full (short) measure", "ru": "полная (неполная) мера" },
                    { "en": "to give good measure", "ru": "1) дать полную меру; 2) воздать полной мерой, заплатить с лихвой" }
                ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed measure meaning 1 successfully!")
