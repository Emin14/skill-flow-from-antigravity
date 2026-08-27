# -*- coding: utf-8 -*-
"""
Inspect raw input file to see where duplicates originated.
"""
import json, glob, sys
from collections import Counter
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

for fpath in glob.glob('*.json'):
    if fpath == 'oxford_5000_2026-08-27.json': continue
    try:
        data = json.load(open(fpath, 'r', encoding='utf-8'))
        if isinstance(data, list):
            words = [x.get('word') for x in data if isinstance(x, dict) and 'word' in x]
            counts = Counter(words)
            dupes = {k: v for k, v in counts.items() if v > 1}
            print(f"File '{fpath}': {len(data)} items, {len(words)} words, {len(dupes)} duplicate words:")
            for d_k, d_v in dupes.items():
                print(f"   '{d_k}': {d_v} times")
    except Exception as e:
        pass
