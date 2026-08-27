# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))
for k, v in parsed_index.items():
    if k.lower().startswith('about'):
        print(f"Key: '{k}'")
        for it in v:
            print(it.get('text'))
