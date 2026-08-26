# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECK 'hi' ===")
it_hi = next((x for x in data if x['word'] == 'hi'), None)
print(json.dumps(it_hi, ensure_ascii=False, indent=2))

print("\n=== 2. CHECK 'grace' ===")
it_grace = next((x for x in data if x['word'] == 'grace'), None)
print(json.dumps(it_grace, ensure_ascii=False, indent=2))

print("\n=== 3. CHECK 'hang' ===")
it_hang = next((x for x in data if x['word'] == 'hang'), None)
print(json.dumps(it_hang, ensure_ascii=False, indent=2))

print("\n=== 4. CHECK 'bear2' ===")
it_bear2 = next((x for x in data if x['word'] == 'bear2'), None)
print(json.dumps(it_bear2, ensure_ascii=False, indent=2))

print("\n=== 5. FIND OCCURRENCES OF 'pass' IN TRANSLATIONS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\bpass\b', t, re.IGNORECASE):
            print(f"Meaning: [{it['word']:12}] ID: {m['id']} | Trans: {repr(t)}")

print("\n=== 6. FIND REGISTER LABELS LEFTOVER IN EXAMPLES (ru) ===")
reg_in_ex_count = 0
for it in data:
    for m in it.get('meanings', []):
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if re.match(r'^(разг|библ|ист|воен|мед|юр|мат|тех|мор|муз|книжн|уст|поэт|шутл|ирон|жарг|сленг)\.?\s+', ru, re.IGNORECASE):
                reg_in_ex_count += 1
                print(f"Example [{it['word']:12}] ru: {repr(ru)}")
    for p in it.get('phrases', []):
        ru = p.get('ru', '')
        if re.match(r'^(разг|библ|ист|воен|мед|юр|мат|тех|мор|муз|книжн|уст|поэт|шутл|ирон|жарг|сленг)\.?\s+', ru, re.IGNORECASE):
            reg_in_ex_count += 1
            print(f"Phrase  [{it['word']:12}] ru: {repr(ru)}")

print(f"\nTotal registers in examples/phrases ru: {reg_in_ex_count}")
