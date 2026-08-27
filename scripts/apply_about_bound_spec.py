# -*- coding: utf-8 -*-
"""
Apply bound collocation formatting for 'about' meaning 8 and validate.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'about':
        for m in item['meanings']:
            if m['id'] == 8 and m['partOfSpeech'] == 'preposition':
                m['translation'] = "при себе, с собой (в сочетании с have)"
                m['examples'] = [
                    {
                        "en": "to have smth. about one",
                        "ru": "иметь что-либо при себе, с собой"
                    },
                    {
                        "en": "I had all the documents about me",
                        "ru": "все документы были у меня с собой (или при мне, под рукой)"
                    }
                ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated about meaning 8 with contextual bound specification successfully!")
