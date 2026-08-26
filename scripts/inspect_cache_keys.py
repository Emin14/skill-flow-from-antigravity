# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/dict_doc2_cache.json', 'r', encoding='utf-8') as f:
    dict_cache = json.load(f)

print("Keys in dict_cache[0]:", dict_cache[0].keys())
cross_entries = [e for e in dict_cache if e.get('raw_hw', '').startswith('cross ')]
print(f"Found {len(cross_entries)} cross entries:")
for e in cross_entries:
    print(e.get('raw_hw'), '| pos:', e.get('pos'))
