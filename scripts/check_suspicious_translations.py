# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Checking short or suspicious translations:")
for entry in data:
    w = entry['word']
    for m in entry.get('meanings', []):
        tr = m.get('translation', '').strip()
        if len(tr) <= 3 or tr.endswith((';', ',', ':', '-', '—')) or not any('\u0400' <= c <= '\u04FF' for c in tr):
            print(f"Word: {w:15} (id={m.get('id')}): {repr(tr)}")
