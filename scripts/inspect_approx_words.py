# -*- coding: utf-8 -*-
"""
Inspect all words where ≅ appears in raw parsed_index.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

found = []
for k, entries in parsed_index.items():
    for it in entries:
        txt = it.get('text', '')
        if '≅' in txt:
            found.append((k, txt))

print(f"Words containing ≅ in raw parsed index ({len(found)}):")
for f_k, f_txt in found:
    for line in f_txt.split('\n'):
        if '≅' in line:
            print(f"  Word '{f_k}': {line.strip()}")
