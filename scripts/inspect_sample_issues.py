# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

art_map = {}
for a in articles:
    hw = a.get('headword', '').split()[0].lower()
    if hw not in art_map:
        art_map[hw] = []
    art_map[hw].append(a)

sample_words = ['add', 'aftermath', 'afternoon', 'agree', 'anchor', 'angle', 'article', 'back', 'behalf']

for w in sample_words:
    print(f"\n{'='*35} {w} {'='*35}")
    # In Oxford
    for entry in oxford:
        if entry.get('word') == w:
            print("--- OXFORD MEANINGS ---")
            for m in entry.get('meanings', []):
                print(f"  ID: {m.get('id')}, POS: {m.get('partOfSpeech')}, tr: {repr(m.get('translation'))}")
                if m.get('examples'):
                    print(f"       exs: {m.get('examples')}")
            break
    # In Muller
    if w in art_map:
        print("--- MULLER ARTICLES ---")
        for a in art_map[w]:
            print(f"  Headword: {a.get('headword')}, Page: {a.get('page')}")
            print(f"  Body: {a.get('body')[:300]}...")
