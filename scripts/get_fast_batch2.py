# -*- coding: utf-8 -*-
"""
Get raw text from parsed_index.json for batch 2:
act, air, arm, back, bear, beat, box, care, case, cast
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

target_words = ['act', 'air', 'arm', 'back', 'bear', 'beat', 'box', 'care', 'case', 'cast']
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

for target in target_words:
    print(f"\n======================================== {target} ========================================")
    entries = parsed_index.get(target, [])
    if not entries:
        # Check homonyms like 'act i'
        for k in sorted(parsed_index.keys()):
            if k.startswith(target + ' ') or k.startswith(target + '1') or k == target:
                entries.extend(parsed_index[k])
    for e in entries:
        print(f"HEADER: {e.get('headword', '')}")
        print(e.get('text', ''))
        print("-" * 40)
