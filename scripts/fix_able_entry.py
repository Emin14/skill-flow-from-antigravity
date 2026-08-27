# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'able':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "adjective",
                "translation": "умелый, умеющий; знающий",
                "examples": [
                    {
                        "en": "to be able to do smth.",
                        "ru": "быть в состоянии сделать что-либо"
                    },
                    {
                        "en": "to be able to swim",
                        "ru": "уметь плавать"
                    },
                    {
                        "en": "able to pay",
                        "ru": "платёжеспособный"
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "adjective",
                "translation": "способный, талантливый",
                "examples": [
                    {
                        "en": "an able writer",
                        "ru": "талантливый писатель"
                    }
                ],
                "register": []
            }
        ]
        if 'phrases' in item:
            del item['phrases']

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Successfully cleaned 'able' entry!")
