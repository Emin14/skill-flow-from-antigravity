# -*- coding: utf-8 -*-
import sys
import json
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

word_counts = Counter(item['word'] for item in oxford_data)
duplicates = {w: c for w, c in word_counts.items() if c > 1}

print(f"Total entries in oxford_5000_updated.json: {len(oxford_data)}")
print(f"Unique words count: {len(word_counts)}")
print(f"Duplicate words in JSON ({len(duplicates)}): {duplicates}")

for w in duplicates:
    print(f"\nOccurrences of {w}:")
    for i, item in enumerate(oxford_data):
        if item['word'] == w:
            print(f"  Index {i}: CEFR={item.get('cefr')}, phon_br={item.get('phon_br')}, rank={item.get('frequency_rank')}, meanings_count={len(item.get('meanings', []))}")
