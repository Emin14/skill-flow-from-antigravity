# -*- coding: utf-8 -*-
"""
Apply standardized 'в роли определения к другому слову' for all attributive senses.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

count_updated = 0
for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if tr in ['в роли определения', 'в значении определения', 'в функции определения', 'в роли определения:', 'attr.', 'attr', 'attr.:']:
            m['translation'] = 'в роли определения к другому слову'
            count_updated += 1
        elif tr.startswith('в роли определения (') or tr.startswith('в значении определения ('):
            # Keep descriptor if present, e.g. "в роли определения к другому слову (аварийный)"
            inner = tr.split('(', 1)[1].rstrip(')')
            m['translation'] = f"в роли определения к другому слову ({inner})"
            count_updated += 1

print(f"Standardized {count_updated} attributive senses to 'в роли определения к другому слову'!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
