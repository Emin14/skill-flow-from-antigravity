# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

words_to_inspect = ['good', 'ground', 'induce', 'high', 'shape', 'key']

for w in words_to_inspect:
    print(f"\n{'='*30} WORD: {w} {'='*30}")
    for entry in data:
        if entry['word'] == w:
            print(f"CEFR: {entry.get('cefr')}, Total meanings: {len(entry.get('meanings', []))}")
            for m in entry.get('meanings', []):
                print(f"  [{m.get('id')}] POS: {m.get('partOfSpeech')}, tr: {repr(m.get('translation'))}")
                if m.get('examples'):
                    print(f"       exs: {m.get('examples')}")
            break
