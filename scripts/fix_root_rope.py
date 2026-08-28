# -*- coding: utf-8 -*-
"""
Fix root and rope phrases.
"""
import json, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    if w == 'root':
        item['phrases'] = [
            { "id": 1, "phrase": "root out", "partOfSpeech": "verb", "translation": "вырывать с корнем, искоренять, уничтожать", "examples": [], "register": [] },
            { "id": 2, "phrase": "root up", "partOfSpeech": "verb", "translation": "вырывать с корнем; выискивать, искать; рыться", "examples": [], "register": [] }
        ]
    elif w == 'rope':
        item['phrases'] = [
            { "id": 1, "phrase": "rope in", "partOfSpeech": "verb", "translation": "1) окружать канатом; 2) заманивать, втягивать, вовлекать", "examples": [], "register": [] },
            { "id": 2, "phrase": "rope into", "partOfSpeech": "verb", "translation": "втягивать, вовлекать (во что-либо)", "examples": [], "register": [] },
            { "id": 3, "phrase": "rope off", "partOfSpeech": "verb", "translation": "отгораживать веревкой или канатом", "examples": [], "register": [] }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Fixed root and rope phrases successfully!")
