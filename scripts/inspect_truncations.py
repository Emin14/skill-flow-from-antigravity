# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

art_map = {}
for a in muller_articles:
    hw = a.get('headword', '').split()[0].lower().rstrip(',;.')
    if hw not in art_map:
        art_map[hw] = []
    art_map[hw].append(a)

problem_words = ['carry', 'draw', 'look', 'rope', 'chunk', 'sheep', 'staff', 'film', 'cheer', 'write', 'strike', 'get', 'dig', 'hang', 'file', 'bank2', 'bear2', 'fly1', 'fly2', 'row1', 'tear1', 'well1']

for w in problem_words:
    base = re.sub(r'\d+$', '', w)
    print(f"\n{'='*30} {w} (base: {base}) {'='*30}")
    for entry in oxford:
        if entry.get('word') == w:
            for m in entry.get('meanings', []):
                tr = m.get('translation', '')
                if len(tr) <= 4 or not any('\u0400' <= c <= '\u04FF' for c in tr) or tr.endswith((';', ',', ':', '-')):
                    print(f"  [OXFORD ID {m.get('id')}] tr: {repr(tr)}, exs: {m.get('examples')}")
            break
    if base in art_map:
        for a in art_map[base][:2]:
            print(f"  [MULLER] {a.get('headword')}: {a.get('body')[:250]}...")
