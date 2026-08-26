# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_data = json.load(f)

muller_map = {x['headword'].lower(): x for x in muller_data}

words = ['push', 'lady', 'reckon', 'long', 'lend', 'lie', 'joke', 'latter']

for w in words:
    print(f"\n{'='*30} MULLER ARTICLE FOR: {w} {'='*30}")
    if w in muller_map:
        art = muller_map[w]
        print(f"Headword: {art.get('headword')}, Page: {art.get('page')}")
        print(f"Body:\n{art.get('body')}\n")
    else:
        print("NOT FOUND IN MULLER MAP")
