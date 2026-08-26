# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data_map = {x['word']: x for x in data}

reported_words = [
    'lady', 'latter', 'lend', 'lie', 'long', 'joke', 'push', 'reckon',
    'good', 'ground', 'induce', 'high', 'shape', 'key', 'air', 'ball'
]

print("=== CHECKING ALL USER REPORTED WORDS IN REBUILT DATASET ===")

for w in reported_words:
    print(f"\n{'='*30} WORD: {w} {'='*30}")
    if w not in data_map:
        print("MISSING IN DATASET!")
        continue
    entry = data_map[w]
    print(f"CEFR: {entry.get('cefr')}, Rank: {entry.get('frequency_rank')}, Meanings count: {len(entry.get('meanings', []))}")
    for m in entry['meanings']:
        reg = f" | reg: {m.get('register')}" if m.get('register') else ""
        print(f"  [{m['id']}] ({m['partOfSpeech']}): {repr(m['translation'])}{reg}")
        if m.get('examples'):
            for ex in m['examples']:
                print(f"       ex: en={repr(ex['en'])}, ru={repr(ex['ru'])}")
