# -*- coding: utf-8 -*-
"""
Clean be meaning 7 and at meaning 3 with absolute path and safe writing.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'be':
        for m in item['meanings']:
            if m['id'] == 7:
                m['translation'] = 'как модальный глагол с последующим инфинитивом обозначает долженствование, возможность, намерение'
                m['examples'] = [
                    { "en": "I am to inform you", "ru": "я должен вас известить" },
                    { "en": "to be about to do smth.", "ru": "собираться сделать что-либо" }
                ]
    elif item['word'] == 'at':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'указывает на действие, занятие: за'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Cleaned be and at successfully!")
