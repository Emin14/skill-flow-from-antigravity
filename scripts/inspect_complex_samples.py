# -*- coding: utf-8 -*-
"""
Inspect sample raw texts for complex words from parsed_index.json:
go, get, pass, work, break
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sample_words = ['go', 'get', 'pass', 'work', 'break']
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

for w in sample_words:
    print(f"\n======================================== {w} ========================================")
    entries = parsed_index.get(w, [])
    if not entries:
        for k in sorted(parsed_index.keys()):
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                entries.extend(parsed_index[k])
    for e in entries:
        print(f"HEADWORD: {e.get('headword', '')}")
        print(e.get('text', '')[:1000])
        print("...")
