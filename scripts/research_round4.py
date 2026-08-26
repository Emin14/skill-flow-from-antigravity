# -*- coding: utf-8 -*-
"""
Research script for Round 4:
1. Scan for words with 'traffi c' or any split ligature (ffi, fl, fi, ffl).
2. Scan for trailing semicolons, commas, or double semicolons in translations.
3. Inspect abandon, abortion, access, about, attraction, able, flee, worse.
"""
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. SCAN FOR LIGATURE SPLITS IN EXAMPLES & TRANSLATIONS ===")
ligature_splits = []
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\b[a-zA-Z]+(?:ffi|ffl|fi|fl)\s+[a-zA-Z]+\b', t):
            ligature_splits.append((it['word'], 'translation', t))
        for ex in m.get('examples', []):
            en = ex.get('en', '')
            if re.search(r'\b[a-zA-Z]*(?:ffi|ffl|fi|fl)\s+[a-zA-Z]+\b', en) or 'traffi' in en or 'diffi' in en:
                ligature_splits.append((it['word'], 'example.en', en))

print(f"Found {len(ligature_splits)} ligature split occurrences:")
for ls in ligature_splits:
    print(f"  Word: {ls[0]:15} | Field: {ls[1]:12} | Text: {repr(ls[2])}")

print("\n=== 2. SCAN FOR PUNCTUATION ISSUES (;;, ,;, trailing ;, etc.) ===")
punct_issues = []
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if ';;' in t or ',;' in t or ';,' in t or re.search(r'[,;]\s*$', t):
            punct_issues.append((it['word'], m['id'], 'translation', t))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if ';;' in ru or ',;' in ru or ';,' in ru or re.search(r'[,;]\s*$', ru):
                punct_issues.append((it['word'], m['id'], 'example.ru', ru))

print(f"Found {len(punct_issues)} punctuation issues:")
for pi in punct_issues[:25]:
    print(f"  Word: {pi[0]:15} | Field: {pi[2]:12} | Text: {repr(pi[3])}")

print("\n=== 3. INSPECT CONTENT FOR ABANDON, ABORTION, ACCESS, ABOUT, ATTRACTION, ABLE ===")
for target in ['abandon', 'abortion', 'access', 'about', 'attraction', 'able', 'flee', 'worse']:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n--- Word: {target} ---")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] POS: {m['partOfSpeech']} | Trans: {m['translation']}")
            for ex in m.get('examples', []):
                print(f"       ex: {ex['en']} -> {ex['ru']}")
