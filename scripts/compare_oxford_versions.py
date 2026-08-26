# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open('tmp/muller_rebuild/oxford_5000.rebuilt.json', 'r', encoding='utf-8') as f:
    rebuilt = json.load(f)

with open('tmp/muller_rebuild/oxford_5000.clean.json', 'r', encoding='utf-8') as f:
    clean = json.load(f)

ox_map = {x['word']: x for x in oxford}
reb_map = {x['word']: x for x in rebuilt}
cl_map = {x['word']: x for x in clean}

for w in ['give', 'afternoon', 'dispose', 'behalf', 'deliver', 'small']:
    print(f"\n{'='*30} WORD: {w} {'='*30}")
    print("--- CURRENT oxford_5000.json ---")
    if w in ox_map:
        for m in ox_map[w].get('meanings', [])[:6]:
            print(f"  [{m.get('id')}] POS: {m.get('partOfSpeech')}, tr: {repr(m.get('translation'))}, ex: {len(m.get('examples', []))}")
        print(f"  ... total meanings: {len(ox_map[w].get('meanings', []))}")
    
    print("--- REBUILT oxford_5000.rebuilt.json ---")
    if w in reb_map:
        for m in reb_map[w].get('meanings', [])[:6]:
            print(f"  [{m.get('id')}] POS: {m.get('partOfSpeech')}, tr: {repr(m.get('translation'))}, ex: {len(m.get('examples', []))}")
        print(f"  ... total meanings: {len(reb_map[w].get('meanings', []))}")

    print("--- CLEAN oxford_5000.clean.json ---")
    if w in cl_map:
        for m in cl_map[w].get('meanings', [])[:6]:
            print(f"  [{m.get('id')}] POS: {m.get('partOfSpeech')}, tr: {repr(m.get('translation'))}, ex: {len(m.get('examples', []))}")
        print(f"  ... total meanings: {len(cl_map[w].get('meanings', []))}")
