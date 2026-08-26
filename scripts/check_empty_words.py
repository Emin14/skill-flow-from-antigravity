# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

empty_words = [item['word'] for item in data if not item.get('meanings')]
print("Empty words in oxford_5000_updated.json:", empty_words)
