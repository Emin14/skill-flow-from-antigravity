# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if len(t) <= 1:
            print(f"Word: {it['word']} | ID: {m['id']} | Trans: {repr(t)} | Reg: {m.get('register')}")
            for ex in m.get('examples', []):
                print(f"   ex: {ex}")
