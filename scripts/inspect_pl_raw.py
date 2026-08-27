# -*- coding: utf-8 -*-
"""
Inspect raw text and check pl handling for all target homonyms.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

for k in ['may', 'may i', 'march', 'march i', 'march ii', 'house', 'minute i', 'minute ii', 'minute iii', 'use', 'wind i', 'wind ii', 'it']:
    print(f"============================== {k} ==============================")
    if k in parsed_index:
        for it in parsed_index[k]:
            print(it.get('text', ''))
