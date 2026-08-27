# -*- coding: utf-8 -*-
"""
Scan for any other words where raw text has attr. without standalone translation.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

by_word = {x['word']: x for x in oxford_data}

# Check words like acceptance, account, action, admission, advance, anchor
check_words = ['acceptance', 'accident', 'account', 'action', 'admission', 'advance', 'anchor']
for w in check_words:
    item = by_word.get(w)
    if not item: continue
    print(f"=== {w} ===")
    for m in item['meanings']:
        if 'определени' in m['translation'] or 'attr' in m['translation']:
            print(f"  [{m['id']}] {m['translation']} | exs: {[ex['en'] for ex in m.get('examples', [])]}")
