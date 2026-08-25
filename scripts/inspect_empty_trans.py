# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    for m in item['meanings']:
        if not m.get('translation'):
            print(f"Word: {w}, Meaning ID: {m['id']}, POS: {m['partOfSpeech']}, Examples: {m.get('examples')}, Register: {m.get('register')}")
