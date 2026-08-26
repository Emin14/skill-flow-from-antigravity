# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    orig = json.load(f)

for w in ['house', 'live', 'minute', 'use', 'wind1', 'wind2']:
    print(f"\n--- Original oxford_5000.json occurrences of {w} ---")
    for i, item in enumerate(orig):
        if item['word'] == w:
            print(f"Index {i}: word={item['word']}, CEFR={item.get('cefr')}, phon_br={item.get('phon_br')}, pos in meanings={[m.get('partOfSpeech') for m in item.get('meanings', [])]}")
