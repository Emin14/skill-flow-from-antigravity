# -*- coding: utf-8 -*-
"""
Inspect Muller entries for the target homonym words.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

target_keys = ['it', 'march', 'may', 'house', 'live', 'minute', 'use', 'wind']
for k in target_keys:
    print(f"==================== KEY: '{k}' ====================")
    for entry_k in [k, f"{k} i", f"{k} ii", f"{k} iii"]:
        if entry_k in parsed_index:
            for it in parsed_index[entry_k]:
                print(f"--- Subkey: '{entry_k}' (pos: {it.get('pos')}) ---")
                print(it.get('text', '')[:300] + "...")
