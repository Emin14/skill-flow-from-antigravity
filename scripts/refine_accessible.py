# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'accessible':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "adjective",
                "translation": "доступный (to); достижимый",
                "examples": [
                    {
                        "en": "accessible to the public",
                        "ru": "доступный широкой публике"
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "adjective",
                "translation": "поддающийся; податливый",
                "examples": [
                    {
                        "en": "accessible to bribery",
                        "ru": "продажный; взяточник"
                    }
                ],
                "register": []
            }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Refined accessible perfectly!")
