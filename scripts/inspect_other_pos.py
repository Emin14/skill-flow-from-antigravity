# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

other_entries = []
for it in data:
    w = it['word']
    for m in it.get('meanings', []):
        if m.get('partOfSpeech') == 'other':
            other_entries.append((w, m['id'], m.get('translation')))

print(f"Total meanings with POS 'other': {len(other_entries)}")
# Group by word
from collections import defaultdict
grouped = defaultdict(list)
for w, mid, t in other_entries:
    grouped[w].append((mid, t))

print(f"Total unique words with POS 'other': {len(grouped)}")
for w, ms in list(grouped.items())[:50]:
    print(f"Word '{w}' ({len(ms)} meanings):")
    for mid, t in ms[:3]:
        print(f"   [{mid}] {t}")
