# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

from scan_stemmed_words import stem_matches

print(f"Total stemmed words to fix: {len(stem_matches)}")
for w, s in stem_matches:
    item = next(it for it in data if it['word'] == w)
    cefr = item.get('cefr')
    rank = item.get('frequency_rank')
    print(f"Word: '{w}' (stem: '{s}', cefr: {cefr}, rank: {rank})")
