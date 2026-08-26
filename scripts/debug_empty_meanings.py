# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for w in ['give', 'afternoon', 'dispose', 'small', 'deliver', 'charge', 'behalf']:
    for entry in data:
        if entry.get('word') == w:
            print(f"\n=== {w} ===")
            for m in entry.get('meanings', []):
                tr = m.get('translation', '')
                if not tr or len(tr.strip()) < 4 or not any('\u0400' <= c <= '\u04FF' for c in tr):
                    print(f"  ID: {m.get('id')}, POS: {m.get('partOfSpeech')}, tr: {repr(tr)}, ex: {m.get('examples')}")
