# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    up = json.load(f)

up_map = {x['word']: x for x in up}

for w in ['back', 'give', 'afternoon', 'dispose', 'behalf', 'deliver', 'small', 'add', 'article']:
    print(f"\n{'='*35} {w} in oxford_5000_updated.json {'='*35}")
    if w in up_map:
        for m in up_map[w].get('meanings', []):
            print(f"  ID: {m.get('id')}, POS: {m.get('partOfSpeech')}, tr: {repr(m.get('translation'))}")
            if m.get('examples'):
                print(f"       exs: {m.get('examples')}")
