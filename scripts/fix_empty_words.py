# -*- coding: utf-8 -*-
"""
Restore exact definitions for cinema, fellow, poet, text, theatre, young.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    w = item['word']
    if w == 'cinema':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "noun", "translation": "кинотеатр, кино", "examples": [
                { "en": "to go to the cinema", "ru": "ходить в кино" }
            ], "register": [] },
            { "id": 2, "partOfSpeech": "noun", "translation": "киноискусство, кинематография, кинопромышленность", "examples": [], "register": ["кинематография"] }
        ]
    elif w == 'fellow':
        for m in item['meanings']:
            if m['id'] == 2 and not m['translation']:
                m['translation'] = 'товарищ, коллега; собрат'
    elif w == 'poet':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "noun", "translation": "поэт, стихотворец", "examples": [], "register": ["литературоведение"] }
        ]
    elif w == 'text':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "noun", "translation": "текст, подлинный текст; тема, цитата", "examples": [
                { "en": "text message", "ru": "текстовое сообщение" }
            ], "register": [] },
            { "id": 2, "partOfSpeech": "noun", "translation": "учебник (также text book)", "examples": [], "register": [] },
            { "id": 3, "partOfSpeech": "verb", "translation": "отправлять текстовое сообщение, писать смс", "examples": [], "register": [] }
        ]
    elif w == 'theatre':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "noun", "translation": "театр, драматическое искусство", "examples": [
                { "en": "to go to the theatre", "ru": "идти в театр" }
            ], "register": ["театр"] },
            { "id": 2, "partOfSpeech": "noun", "translation": "театр военных действий; операционная (в больнице)", "examples": [
                { "en": "theatre of war", "ru": "театр военных действий", "register": ["военное"] },
                { "en": "operating theatre", "ru": "операционная", "register": ["медицинское"] }
            ], "register": [] }
        ]
    elif w == 'young':
        clean_m = [m for m in item['meanings'] if m['translation'].strip()]
        for idx, m in enumerate(clean_m, 1):
            m['id'] = idx
        item['meanings'] = clean_m

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed cinema, fellow, poet, text, theatre, young successfully!")
