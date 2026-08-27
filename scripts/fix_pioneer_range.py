# -*- coding: utf-8 -*-
"""
Fix pioneer and range attr meanings.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'pioneer':
        for m in item['meanings']:
            if m['id'] == 5:
                m['translation'] = 'в роли определения: новаторский, первый'
                m['examples'] = [
                    { "en": "pioneer work", "ru": "новаторская работа, почин" }
                ]
            elif m['id'] == 7:
                m['translation'] = 'в роли определения: разведочный'
                m['examples'] = [
                    { "en": "pioneer well", "ru": "разведочная скважина" }
                ]
    elif item['word'] == 'range':
        for m in item['meanings']:
            if m['id'] == 11:
                m['translation'] = 'в роли определения: дальномерный, прицельный'
                m['examples'] = [
                    { "en": "range table", "ru": "таблица дальностей и прицелов" },
                    { "en": "range elevation", "ru": "установка прицела" }
                ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed pioneer and range successfully!")
