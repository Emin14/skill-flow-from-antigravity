# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for entry in data:
    w = entry['word']
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        if not any('\u0400' <= c <= '\u04FF' for c in tr):
            print(f"Word: {w}, POS: {m.get('partOfSpeech')}, id: {m.get('id')}, tr: {repr(tr)}, exs: {m.get('examples')}")
