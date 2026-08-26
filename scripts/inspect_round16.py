# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECK 'best' ===")
it_best = next((x for x in data if x['word'] == 'best'), None)
print(json.dumps(it_best, ensure_ascii=False, indent=2))

print("\n=== 2. CHECK 'there' ===")
it_there = next((x for x in data if x['word'] == 'there'), None)
print(json.dumps(it_there, ensure_ascii=False, indent=2))

print("\n=== 3. CHECK 'be' ===")
it_be = next((x for x in data if x['word'] == 'be'), None)
print(json.dumps(it_be, ensure_ascii=False, indent=2))

print("\n=== 4. SEARCH FOR 'superl' / 'compar' / 'part' IN TRANSLATIONS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\b(superl|compar|pres part|past part)\b', t, re.IGNORECASE):
            print(f"Meaning: [{it['word']:12}] ID: {m['id']} | Trans: {repr(t)}")

print("\n=== 5. SEARCH FOR 'и т д' / 'и т п' WITHOUT DOTS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\bи т [дп]\b', t, re.IGNORECASE):
            print(f"Meaning: [{it['word']:12}] ID: {m['id']} | Trans: {repr(t)}")
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if re.search(r'\bи т [дп]\b', ru, re.IGNORECASE):
                print(f"Example: [{it['word']:12}] | ru: {repr(ru)}")
    for p in it.get('phrases', []):
        ru = p.get('ru', '')
        if re.search(r'\bи т [дп]\b', ru, re.IGNORECASE):
            print(f"Phrase:  [{it['word']:12}] | ru: {repr(ru)}")
