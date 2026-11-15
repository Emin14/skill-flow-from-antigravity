# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

empty_words = [item['word'] for item in data if not item.get('meanings')]
print("Empty words in src/data/oxford_5000.json:", empty_words)
