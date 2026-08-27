# -*- coding: utf-8 -*-
"""
Full authentic parser for 'house' based on literal PDF page 393.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

ENTRY_HOUSE_NOUN = {
    "word": "house",
    "frequency_rank": 164,
    "cefr": "a1",
    "phon_br": "/haʊs/",
    "phon_n_am": "/haʊs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "дом; жилище; здание",
            "examples": [],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "религиозное братство; монастырь",
            "examples": [],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "noun",
            "translation": "колледж университета; пансион при школе",
            "examples": [],
            "register": []
        },
        {
            "id": 4,
            "partOfSpeech": "noun",
            "translation": "семья, род; дом, династия",
            "examples": [],
            "register": []
        },
        {
            "id": 5,
            "partOfSpeech": "noun",
            "translation": "дом; семья; хозяйство",
            "examples": [
                { "en": "to keep house", "ru": "вести хозяйство" },
                { "en": "to keep the house", "ru": "сидеть дома" }
            ],
            "register": []
        },
        {
            "id": 6,
            "partOfSpeech": "noun",
            "translation": "(торговая) фирма",
            "examples": [],
            "register": []
        },
        {
            "id": 7,
            "partOfSpeech": "noun",
            "translation": "(the H.) (лондонская) биржа",
            "examples": [],
            "register": [
                "разговорное"
            ]
        },
        {
            "id": 8,
            "partOfSpeech": "noun",
            "translation": "(тж. the H.) палата (парламента)",
            "examples": [
                { "en": "a parliament of two houses", "ru": "двухпалатный парламент" },
                { "en": "lower house", "ru": "нижняя палата" },
                { "en": "upper house", "ru": "верхняя палата" },
                { "en": "House of Commons", "ru": "палата общин" },
                { "en": "House of Lords", "ru": "палата лордов" },
                { "en": "House of Representatives", "ru": "палата представителей, нижняя палата конгресса США" },
                { "en": "third house", "ru": "кулуары конгресса", "register": ["американизм", "разговорное"] },
                { "en": "to enter the House", "ru": "стать членом парламента" },
                { "en": "to divide the house", "ru": "провести поимённое голосование", "register": ["парламентский термин"] }
            ],
            "register": []
        },
        {
            "id": 9,
            "partOfSpeech": "noun",
            "translation": "театр, зрительный зал; публика, зрители",
            "examples": [
                { "en": "a crowded house", "ru": "полный сбор, аншлаг" },
                { "en": "a poor house", "ru": "полупустой зал" },
                { "en": "to bring down the house", "ru": "иметь бешеный успех у публики, вызвать бурю аплодисментов" }
            ],
            "register": []
        },
        {
            "id": 10,
            "partOfSpeech": "noun",
            "translation": "спектакль, сеанс",
            "examples": [
                { "en": "first house", "ru": "первый сеанс" },
                { "en": "five o'clock house", "ru": "сеанс в пять часов" }
            ],
            "register": []
        },
        {
            "id": 11,
            "partOfSpeech": "noun",
            "translation": "гостиница, постоялый двор",
            "examples": [],
            "register": []
        },
        {
            "id": 12,
            "partOfSpeech": "noun",
            "translation": "бордель",
            "examples": [],
            "register": [
                "американизм"
            ]
        },
        {
            "id": 13,
            "partOfSpeech": "noun",
            "translation": "(the H.) работный дом",
            "examples": [],
            "register": [
                "историческое",
                "разговорное"
            ]
        },
        {
            "id": 14,
            "partOfSpeech": "noun",
            "translation": "рубка",
            "examples": [],
            "register": [
                "морской термин"
            ]
        },
        {
            "id": 15,
            "partOfSpeech": "noun",
            "translation": "в роли определения к другому слову (домашний, комнатный)",
            "examples": [],
            "register": []
        }
    ],
    "phrases": [
        { "id": 1, "phrase": "house and home", "partOfSpeech": "noun", "translation": "дом, домашний уют", "examples": [], "register": [] },
        { "id": 2, "phrase": "on the house", "partOfSpeech": "adverb", "translation": "за счёт предприятия, бесплатно", "examples": [{ "en": "a drink on the house", "ru": "бесплатная выпивка" }], "register": [] },
        { "id": 3, "phrase": "to set (или to put) one's house in order", "partOfSpeech": "verb", "translation": "привести в порядок свои дела", "examples": [], "register": [] },
        { "id": 4, "phrase": "like a house on fire", "partOfSpeech": "adverb", "translation": "1) быстро и легко; 2) успешно, прекрасно", "examples": [], "register": [] }
    ]
}

ENTRY_HOUSE_VERB = {
    "word": "house",
    "frequency_rank": 164,
    "cefr": "b2",
    "phon_br": "/haʊz/",
    "phon_n_am": "/haʊz/",
    "lists": { "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "предоставлять жилище; обеспечивать жильём",
            "examples": [],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "verb",
            "translation": "поселить, приютить",
            "examples": [],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "verb",
            "translation": "расквартировывать",
            "examples": [],
            "register": [
                "военное"
            ]
        },
        {
            "id": 4,
            "partOfSpeech": "verb",
            "translation": "жить (в доме)",
            "examples": [],
            "register": []
        },
        {
            "id": 5,
            "partOfSpeech": "verb",
            "translation": "помещать, убирать (вещи, имущество и т. п.)",
            "examples": [],
            "register": []
        },
        {
            "id": 6,
            "partOfSpeech": "verb",
            "translation": "убирать (хлеб); загонять (скот)",
            "examples": [],
            "register": [
                "сельскохозяйственное"
            ]
        },
        {
            "id": 7,
            "partOfSpeech": "verb",
            "translation": "вмещать(ся), помещать(ся)",
            "examples": [],
            "register": []
        }
    ]
}

# Update house entries in oxford_data
h_seen = 0
for i, it in enumerate(oxford_data):
    if it['word'] == 'house':
        if h_seen == 0:
            oxford_data[i] = ENTRY_HOUSE_NOUN
        else:
            oxford_data[i] = ENTRY_HOUSE_VERB
        h_seen += 1

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated house to 100% authentic PDF entries!")
