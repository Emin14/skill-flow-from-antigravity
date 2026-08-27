# -*- coding: utf-8 -*-
"""
Inspect the complete raw text from Muller for all target homonyms.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

keys = ['house', 'live i', 'live ii', 'minute i', 'minute iii', 'use', 'march i', 'March', 'may i', 'May', 'wind i', 'wind ii', 'it']

for k in keys:
    print(f"============================== KEY: '{k}' ==============================")
    found = False
    for p_k, p_val in parsed_index.items():
        if p_k.lower() == k.lower():
            for item in p_val:
                print(item.get('text', ''))
                found = True
    if not found:
        print(f"NOT FOUND IN parsed_index: '{k}'")
