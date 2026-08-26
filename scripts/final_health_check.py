# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} words.")

stats = {
    'total_words': len(data),
    'total_meanings': 0,
    'total_examples': 0,
    'meanings_with_register': 0,
    'empty_translations': 0,
    'non_cyrillic_translations': 0,
    'pos_other': 0,
    'pos_distribution': {}
}

for entry in data:
    for m in entry.get('meanings', []):
        stats['total_meanings'] += 1
        pos = m.get('partOfSpeech', 'unknown')
        stats['pos_distribution'][pos] = stats['pos_distribution'].get(pos, 0) + 1
        if pos == 'other':
            stats['pos_other'] += 1
        if m.get('register'):
            stats['meanings_with_register'] += 1
        tr = m.get('translation', '')
        if not tr:
            stats['empty_translations'] += 1
        elif not any('\u0400' <= c <= '\u04FF' for c in tr):
            stats['non_cyrillic_translations'] += 1
        for ex in m.get('examples', []):
            stats['total_examples'] += 1

print("\n=== DATASET HEALTH METRICS ===")
for k, v in stats.items():
    print(f"{k}: {v}")

assert stats['total_words'] == 4982
assert stats['empty_translations'] == 0
assert stats['non_cyrillic_translations'] == 0
print("\n✓ ALL INTEGRITY CHECKS PASSED 100%!")
