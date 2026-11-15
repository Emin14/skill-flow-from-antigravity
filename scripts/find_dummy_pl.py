# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('src/data/oxford_5000.json', encoding='utf-8'))

for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '').strip()
        if t in ['(pl)', 'pl', '(pl.)', '(употр. во мн.ч.)']:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")
