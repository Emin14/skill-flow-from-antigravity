# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. FIND 'плетью' OR 'девятихвосткой' ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'девятихвост' in t or 'плеть' in t:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if 'девятихвост' in ru or 'плеть' in ru:
                print(f"ex in {it['word']}: {ex}")

print("\n=== 2. CHECK NOR MEANINGS IN DETAIL ===")
it_nor = next((x for x in data if x['word'] == 'nor'), None)
if it_nor:
    for m in it_nor.get('meanings', []):
        print(f"[{m['id']}] {repr(m['translation'])}")
