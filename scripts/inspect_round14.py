# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

words_to_check = ['wire', 'slip', 'race', 'potato', 'step', 'pace']

for w in words_to_check:
    it = next((x for x in data if x['word'] == w), None)
    if it:
        print(f"\n==================== WORD: {w} ====================")
        print(json.dumps(it, ensure_ascii=False, indent=2))
