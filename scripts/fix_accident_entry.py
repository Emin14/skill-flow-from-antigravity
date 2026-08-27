# -*- coding: utf-8 -*-
"""
Perfect formatting for 'accident' with true attributive sense and diamond proverb.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'accident':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "случай; случайность",
                "examples": [
                    {
                        "en": "by accident",
                        "ru": "случайно, нечаянно"
                    },
                    {
                        "en": "by a lucky accident",
                        "ru": "по счастливой случайности"
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "несчастный случай; катастрофа; авария",
                "examples": [
                    {
                        "en": "to meet with an accident",
                        "ru": "потерпеть аварию, крушение"
                    },
                    {
                        "en": "fatal accident",
                        "ru": "несчастный случай со смертельным исходом"
                    },
                    {
                        "en": "industrial accident",
                        "ru": "несчастный случай на производстве"
                    }
                ],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "noun",
                "translation": "неровность поверхности, складка",
                "examples": [],
                "register": [
                    "астрономия",
                    "геология"
                ]
            },
            {
                "id": 4,
                "partOfSpeech": "noun",
                "translation": "случайное свойство",
                "examples": [],
                "register": [
                    "логика"
                ]
            },
            {
                "id": 5,
                "partOfSpeech": "noun",
                "translation": "в роли определения",
                "examples": [
                    {
                        "en": "accident insurance",
                        "ru": "страхование от несчастных случаев"
                    },
                    {
                        "en": "accident prevention",
                        "ru": "предупреждение несчастных случаев; техника безопасности"
                    },
                    {
                        "en": "accident rate",
                        "ru": "коэффициент промышленного травматизма",
                        "register": [
                            "американизм"
                        ]
                    }
                ],
                "register": []
            }
        ]
        item['phrases'] = [
            {
                "id": 1,
                "phrase": "accidents will happen (in the best regulated families)",
                "partOfSpeech": "noun",
                "translation": "посл. в семье не без урода; скандал в благородном семействе",
                "examples": [],
                "register": [
                    "пословица"
                ]
            }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated 'accident' perfectly!")
