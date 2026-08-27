# -*- coding: utf-8 -*-
"""
Perfect complete reconstruction of 'measure' directly from Muller's dictionary (Page 499).
Includes:
- All 11 noun senses (1. n 1..11)
- All 8 verb senses (2. v 1..8)
- All idioms from noun section (measure for measure, to get the measure of smb.)
- All phrasal verbs from verb section (measure off, measure out, measure up)
- All idioms from verb section (to measure one's length)
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

ENTRY_MEASURE_PERFECT = {
    "word": "measure",
    "frequency_rank": 1589,
    "cefr": "b1",
    "phon_br": "/ˈmeʒə(r)/",
    "phon_n_am": "/ˈmeʒər/",
    "lists": {
        "oxford3000": True,
        "oxford5000": True
    },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "мера; единица измерения",
            "examples": [
                {
                    "en": "dry (linear, liquid, square, etc.) measures",
                    "ru": "меры сыпучих тел (длины, жидкостей, площади и т. п.)"
                },
                {
                    "en": "full (short) measure",
                    "ru": "полная (неполная) мера"
                },
                {
                    "en": "to give good measure",
                    "ru": "1) дать полную меру; 2) воздать полной мерой, заплатить с лихвой"
                }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "мерка",
            "examples": [
                {
                    "en": "made to measure",
                    "ru": "1) сшитый по мерке; 2) сделанный на заказ"
                },
                {
                    "en": "to take smb.'s measure",
                    "ru": "1) снимать мерку с кого-либо; 2) присматриваться к кому-либо; определять чей-либо характер"
                }
            ],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "noun",
            "translation": "предел, степень",
            "examples": [
                {
                    "en": "to set measures to smth.",
                    "ru": "1) ограничивать что-либо; 2) ставить предел чему-либо"
                },
                {
                    "en": "beyond (или out of) measure",
                    "ru": "1) чрезмерно; 2) чрезвычайно"
                },
                {
                    "en": "in some (или in a) measure",
                    "ru": "до некоторой степени, отчасти"
                },
                {
                    "en": "to give a measure of hope",
                    "ru": "до некоторой степени обнадёжить, вселить какую-то надежду"
                },
                {
                    "en": "a limited measure of success",
                    "ru": "неполный, относительный успех"
                }
            ],
            "register": []
        },
        {
            "id": 4,
            "partOfSpeech": "noun",
            "translation": "масштаб, мерило, критерий",
            "examples": [
                {
                    "en": "measure of value",
                    "ru": "мерило стоимости"
                }
            ],
            "register": []
        },
        {
            "id": 5,
            "partOfSpeech": "noun",
            "translation": "мера, мероприятие",
            "examples": [
                {
                    "en": "to take (drastic) measures",
                    "ru": "принять (решительные, крутые) меры"
                }
            ],
            "register": []
        },
        {
            "id": 6,
            "partOfSpeech": "noun",
            "translation": "делитель",
            "examples": [
                {
                    "en": "greatest common measure",
                    "ru": "общий наибольший делитель",
                    "register": [
                        "математика"
                    ]
                }
            ],
            "register": []
        },
        {
            "id": 7,
            "partOfSpeech": "noun",
            "translation": "ширина столбца",
            "examples": [],
            "register": [
                "полиграфия"
            ]
        },
        {
            "id": 8,
            "partOfSpeech": "noun",
            "translation": "метр, размер",
            "examples": [],
            "register": [
                "просодия"
            ]
        },
        {
            "id": 9,
            "partOfSpeech": "noun",
            "translation": "такт",
            "examples": [],
            "register": [
                "музыка"
            ]
        },
        {
            "id": 10,
            "partOfSpeech": "noun",
            "translation": "танец",
            "examples": [],
            "register": [
                "устаревшее"
            ]
        },
        {
            "id": 11,
            "partOfSpeech": "noun",
            "translation": "при англ. мн. ч.: пласты определённой геологической формации; свита",
            "examples": [],
            "register": [
                "геология"
            ]
        },
        {
            "id": 12,
            "partOfSpeech": "verb",
            "translation": "измерять, мерить",
            "examples": [],
            "register": []
        },
        {
            "id": 13,
            "partOfSpeech": "verb",
            "translation": "иметь размеры",
            "examples": [
                {
                    "en": "the house measures 60 feet long",
                    "ru": "дом имеет 60 футов в длину"
                }
            ],
            "register": []
        },
        {
            "id": 14,
            "partOfSpeech": "verb",
            "translation": "снимать мерку",
            "examples": [
                {
                    "en": "to measure a person with one's eye",
                    "ru": "смерить кого-либо взглядом"
                }
            ],
            "register": []
        },
        {
            "id": 15,
            "partOfSpeech": "verb",
            "translation": "оценивать, определять (характер и т. п.)",
            "examples": [],
            "register": []
        },
        {
            "id": 16,
            "partOfSpeech": "verb",
            "translation": "отмерять, отсчитывать (также measure off)",
            "examples": [],
            "register": []
        },
        {
            "id": 17,
            "partOfSpeech": "verb",
            "translation": "соразмерять; регулировать",
            "examples": [
                {
                    "en": "to measure one's acts (by)",
                    "ru": "соразмерять свои поступки (с)"
                }
            ],
            "register": []
        },
        {
            "id": 18,
            "partOfSpeech": "verb",
            "translation": "помериться силами (with, against — с)",
            "examples": [],
            "register": []
        },
        {
            "id": 19,
            "partOfSpeech": "verb",
            "translation": "покрывать (расстояние)",
            "examples": [],
            "register": [
                "поэтическое"
            ]
        }
    ],
    "phrases": [
        {
            "id": 1,
            "phrase": "measure for measure",
            "partOfSpeech": "noun",
            "translation": "≈ мера за меру; око за око",
            "examples": [],
            "register": []
        },
        {
            "id": 2,
            "phrase": "to get the measure of smb.",
            "partOfSpeech": "verb",
            "translation": "раскусить кого-либо",
            "examples": [],
            "register": []
        },
        {
            "id": 3,
            "phrase": "measure off",
            "partOfSpeech": "verb",
            "translation": "отмерять",
            "examples": [],
            "register": []
        },
        {
            "id": 4,
            "phrase": "measure out",
            "partOfSpeech": "verb",
            "translation": "отмерять; выдавать по мерке; распределять",
            "examples": [],
            "register": []
        },
        {
            "id": 5,
            "phrase": "measure up",
            "partOfSpeech": "verb",
            "translation": "1) достигать (уровня: to, with); 2) соответствовать, отвечать (требованиям)",
            "examples": [],
            "register": []
        },
        {
            "id": 6,
            "phrase": "to measure one's length",
            "partOfSpeech": "verb",
            "translation": "растянуться во весь рост",
            "examples": [],
            "register": []
        }
    ]
}

# Update measure in oxford_data
for idx, it in enumerate(oxford_data):
    if it['word'] == 'measure':
        oxford_data[idx] = ENTRY_MEASURE_PERFECT
        break

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Perfected measure successfully with all 19 senses and 6 phrases!")
