# -*- coding: utf-8 -*-
"""
Audit duplicate words in oxford_5000_2026-08-27.json and compare with original oxford_5000.json.
"""
import json, sys
from collections import Counter
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# 1. Count occurrences of words in dataset
word_counts = Counter(item['word'] for item in oxford_data)
duplicates = {w: c for w, c in word_counts.items() if c > 1}

print(f"Total entries in dataset: {len(oxford_data)}")
print(f"Unique 'word' keys: {len(word_counts)}")
print(f"Total duplicate 'word' keys: {len(duplicates)}")
print("Duplicate keys and their counts:")
for w, c in sorted(duplicates.items(), key=lambda x: x[1], reverse=True):
    print(f"  '{w}': {c} times")

# 2. Inspect the exact duplicate objects
sample_check = ['house', 'it', 'live', 'march', 'may', 'minute', 'use', 'wind1', 'wind2']
print("\nDetailed inspection of reported words:")
for w in sample_check:
    items = [x for x in oxford_data if x['word'] == w]
    print(f"\n==================== WORD '{w}' ({len(items)} entries) ====================")
    for i, it in enumerate(items, 1):
        print(f"Entry #{i}:")
        print(f"  CEFR: {it.get('cefr')}, Rank: {it.get('frequency_rank')}")
        print(f"  Phon BR: {it.get('phon_br')}, Phon NAM: {it.get('phon_n_am')}")
        print(f"  Meanings ({len(it.get('meanings', []))}):")
        for m in it.get('meanings', [])[:3]:
            print(f"    [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")
        print(f"  Phrases ({len(it.get('phrases', []))}): {[p['phrase'] for p in it.get('phrases', [])]}")
