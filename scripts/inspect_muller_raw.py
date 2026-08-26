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
        print(f"Headword: {art.get('headword')}")
        print(f"Raw text:\n{art.get('raw_text')[:600]}...\n")
        print(f"Meanings in Muller parsed index ({len(art.get('meanings', []))}):")
        for m in art.get('meanings', [])[:8]:
            print(f"  - [{m.get('partOfSpeech')}] {m.get('translation')}")
            if m.get('examples'):
                for ex in m.get('examples')[:3]:
                    print(f"      ex: en={repr(ex.get('en'))}, ru={repr(ex.get('ru'))}")
    else:
        print("NOT FOUND IN MULLER MAP")
