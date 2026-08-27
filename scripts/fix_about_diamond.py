# -*- coding: utf-8 -*-
"""
Perfect formatting for 'about' entry and deep audit of all middle-diamond phrases.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'about':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "adverb",
                "translation": "приблизительно, около, почти",
                "examples": [
                    {
                        "en": "you are about right",
                        "ru": "вы почти правы"
                    },
                    {
                        "en": "it is about two o'clock",
                        "ru": "сейчас около двух часов"
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "adverb",
                "translation": "неподалёку, недалеко",
                "examples": [
                    {
                        "en": "he is somewhere about",
                        "ru": "он где-то здесь"
                    }
                ],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "adverb",
                "translation": "кругом, вокруг; везде, повсюду",
                "examples": [
                    {
                        "en": "to look about",
                        "ru": "оглянуться вокруг"
                    },
                    {
                        "en": "don't leave the papers about",
                        "ru": "не разбрасывай бумаги!"
                    },
                    {
                        "en": "rumours are about",
                        "ru": "ходят слухи"
                    }
                ],
                "register": []
            },
            {
                "id": 4,
                "partOfSpeech": "adverb",
                "translation": "в обратном направлении",
                "examples": [
                    {
                        "en": "to face about",
                        "ru": "обернуться"
                    },
                    {
                        "en": "about face (or turn)!",
                        "ru": "кругом!",
                        "register": [
                            "военное"
                        ]
                    }
                ],
                "register": []
            },
            {
                "id": 5,
                "partOfSpeech": "preposition",
                "translation": "о, об; насчёт",
                "examples": [
                    {
                        "en": "I'll see about it",
                        "ru": "я позабочусь об этом"
                    },
                    {
                        "en": "he went about his business",
                        "ru": "он пошёл по своим делам"
                    }
                ],
                "register": []
            },
            {
                "id": 6,
                "partOfSpeech": "preposition",
                "translation": "во временном значении указывает на приблизительность: около",
                "examples": [
                    {
                        "en": "about nightfall",
                        "ru": "к вечеру"
                    }
                ],
                "register": []
            },
            {
                "id": 7,
                "partOfSpeech": "preposition",
                "translation": "в пространственном значении указывает на: а) движение вокруг; б) нахождение вблизи: около, близ, у; в) место совершения действия: по",
                "examples": [
                    {
                        "en": "the forests about Tomsk",
                        "ru": "леса под Томском"
                    },
                    {
                        "en": "to walk about the room",
                        "ru": "ходить по комнате"
                    }
                ],
                "register": []
            },
            {
                "id": 8,
                "partOfSpeech": "preposition",
                "translation": "иметь что-либо при себе, с собой",
                "examples": [
                    {
                        "en": "I had all the documents about me",
                        "ru": "все документы были у меня с собой (или при мне, под рукой)"
                    }
                ],
                "register": []
            }
        ]
        
        item['phrases'] = [
            {
                "id": 1,
                "phrase": "Mr. Jones is not about",
                "partOfSpeech": "noun",
                "translation": "господин Джоунз вышел",
                "examples": [],
                "register": []
            },
            {
                "id": 2,
                "phrase": "about right",
                "partOfSpeech": "adverb",
                "translation": "1) правильно; 2) здорово, основательно",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "phrase": "to be about to go (to speak, etc.)",
                "partOfSpeech": "verb",
                "translation": "собираться уходить (говорить и т. п.)",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "phrase": "what are you about?",
                "partOfSpeech": "verb",
                "translation": "1) что вам нужно?; 2) редк. что вы делаете?",
                "examples": [],
                "register": [
                    "редкое"
                ]
            }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed 'about' entry perfectly!")
