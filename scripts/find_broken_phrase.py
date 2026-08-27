# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

for item in oxford:
    w = item['word']
    for m in item['meanings']:
        if 'передаваться из' in m.get('translation', ''):
            print(f"FOUND in meaning: word='{w}' id={m['id']}: '{m['translation']}'")
    for p in item.get('phrases', []):
        if 'передаваться из' in p.get('translation', ''):
            print(f"FOUND in phrase: word='{w}' phrase='{p['phrase']}': '{p['translation']}'")

# Also check raw article for that word
for k, v in parsed_index.items():
    if v and 'передаваться из' in v[0].get('text', ''):
        print(f"RAW ARTICLE for '{k}': {v[0].get('text')}")
