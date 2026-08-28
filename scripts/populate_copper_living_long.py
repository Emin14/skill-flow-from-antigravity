# -*- coding: utf-8 -*-
"""
Populate copper, living, and long with canonical Mueller 2021 articles.
"""
import json, os, sys

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    if w == 'copper':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "noun", "translation": "медь", "examples": [], "register": [] },
            { "id": 2, "partOfSpeech": "noun", "translation": "медная монета; медяки", "examples": [], "register": [] },
            { "id": 3, "partOfSpeech": "noun", "translation": "медный котёл", "examples": [], "register": [] },
            { "id": 4, "partOfSpeech": "noun", "translation": "полицейский, легавый", "examples": [], "register": ["разговорное", "жаргон"] },
            { "id": 5, "partOfSpeech": "adjective", "translation": "медный, медно-красный", "examples": [], "register": [] },
            { "id": 6, "partOfSpeech": "verb", "translation": "покрывать медью", "examples": [], "register": [] }
        ]
    elif w == 'living':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "adjective", "translation": "живой; ныне живущий", "examples": [], "register": [] },
            { "id": 2, "partOfSpeech": "adjective", "translation": "жизненный, действующий; современный", "examples": [], "register": [] },
            { "id": 3, "partOfSpeech": "adjective", "translation": "точный, верный (об изображении)", "examples": [], "register": [] },
            { "id": 4, "partOfSpeech": "noun", "translation": "жизнь, существование", "examples": [], "register": [] },
            { "id": 5, "partOfSpeech": "noun", "translation": "средства к существованию; заработок", "examples": [], "register": [] },
            { "id": 6, "partOfSpeech": "noun", "translation": "образ жизни", "examples": [], "register": [] }
        ]
    elif w == 'long':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "adjective", "translation": "длинный, долгий, продолжительный", "examples": [], "register": [] },
            { "id": 2, "partOfSpeech": "adjective", "translation": "протяжённый (в пространстве)", "examples": [], "register": [] },
            { "id": 3, "partOfSpeech": "adjective", "translation": "длительный, долговременный", "examples": [], "register": [] },
            { "id": 4, "partOfSpeech": "adverb", "translation": "долго, давно", "examples": [], "register": [] },
            { "id": 5, "partOfSpeech": "adverb", "translation": "на долгое время", "examples": [], "register": [] },
            { "id": 6, "partOfSpeech": "verb", "translation": "страстно желать, стремиться, тосковать (for, to — по кому-либо/чему-либо)", "examples": [], "register": [] }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully populated copper, living, and long!")
