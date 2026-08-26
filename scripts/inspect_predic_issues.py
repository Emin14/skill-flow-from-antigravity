# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. FIND 'солдатоднополчанин' OR 'однополчанин' ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'однополчан' in t:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if 'однополчан' in ru:
                print(f"ex in {it['word']}: {ex}")

print("\n=== 2. FIND ALL '(в роли сказуемого)' AND '(в роли определения)' IN TRANSLATIONS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'в роли сказуемого' in t or 'в роли определения' in t:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")

print("\n=== 3. CHECK 'certain' AND 'clever' ===")
for target in ['certain', 'clever']:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n--- Word: {target} ---")
        print(json.dumps(it, ensure_ascii=False, indent=2))
