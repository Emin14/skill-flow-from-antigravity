# -*- coding: utf-8 -*-
"""
Inspection script for Round 7:
1. Check 'solicitor' (patent solicitor -> юрисконсульт-патентовед) and other merged compound nouns.
2. Check 'resistance' and all words containing '(тж ' or English words in translation.
3. Check words with 'в (составе, числе)' or similar.
4. Check 'nor', 'neither' and ellipsis/dots formatting.
"""
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECK SOLICITOR ===")
it = next((x for x in data if x['word'] == 'solicitor'), None)
if it:
    print(json.dumps(it, ensure_ascii=False, indent=2))

print("\n=== 2. FIND ALL OCCURRENCES OF 'тж' IN TRANSLATIONS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'тж' in t or 'т.ж.' in t:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")

print("\n=== 3. FIND 'в (составе, числе)' ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'составе' in t:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")

print("\n=== 4. CHECK 'nor' and 'neither' ===")
for target in ['nor', 'neither']:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n--- Word: {target} ---")
        print(json.dumps(it, ensure_ascii=False, indent=2))

print("\n=== 5. FIND MERGED RUSSIAN WORDS LIKE 'юрисконсультпатентовед' ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if 'юрисконсульт' in ru:
                print(f"ex in {it['word']}: {ex}")
