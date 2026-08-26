# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

from deep_lexical_refiner import process_single_entry

refined = [process_single_entry(e) for e in data]

print("=== INSPECTING NON-CYRILLIC MEANINGS ===")
for entry in refined:
    w = entry['word']
    for m in entry['meanings']:
        tr = m.get('translation', '')
        if tr and not any('\u0400' <= c <= '\u04FF' for c in tr):
            print(f"Word: {w}, id: {m['id']}, POS: {m['partOfSpeech']}, tr: {repr(tr)}, exs: {m.get('examples')}")
