# -*- coding: utf-8 -*-
"""
Research script for Round 6 issues:
1. Find translations with embedded English sentences (e.g. 'he aimed a stone at me').
2. Find translations with trailing numbers/equals (e.g. '4 =', '= something').
3. Find translations with 'predic', 'attr', 'predicative', 'attributive'.
4. Find abbreviations like 'кого-л', 'что-л', 'каком-л' to expand to '-либо'.
5. Find words: AIDS, aim, resistance, series, late, leader.
"""
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. FIND EMBEDDED ENGLISH EXAMPLES INSIDE RUSSIAN TRANSLATION ===")
embedded_examples = []
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        # Check if there is an English phrase/sentence (3+ English words) inside Russian translation
        if re.search(r'[a-zA-Z]{2,}\s+[a-zA-Z]{2,}\s+[a-zA-Z]{2,}', t):
            embedded_examples.append((it['word'], m['id'], t))

print(f"Found {len(embedded_examples)} embedded English text in translations:")
for ee in embedded_examples[:25]:
    print(f"  Word: {ee[0]:15} | ID: {ee[1]:2} | Trans: {repr(ee[2])}")

print("\n=== 2. FIND TRAILING ARTIFACTS (e.g. '4 =', '= ...') ===")
trailing_artifacts = []
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'(?:\d+\s*=|=\s*$|=$)', t):
            trailing_artifacts.append((it['word'], m['id'], t))

print(f"Found {len(trailing_artifacts)} trailing '=' artifacts:")
for ta in trailing_artifacts[:25]:
    print(f"  Word: {ta[0]:15} | ID: {ta[1]:2} | Trans: {repr(ta[2])}")

print("\n=== 3. FIND PREDIC / ATTR LEFTOVERS ===")
predic_artifacts = []
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\b(?:predic|attr|predicative|attributive)\b', t, flags=re.IGNORECASE):
            predic_artifacts.append((it['word'], m['id'], t))

print(f"Found {len(predic_artifacts)} predic/attr artifacts:")
for pa in predic_artifacts[:25]:
    print(f"  Word: {pa[0]:15} | ID: {pa[1]:2} | Trans: {repr(pa[2])}")

print("\n=== 4. INSPECT SPECIFIC WORDS: AIDS, aim, resistance, series, late, leader ===")
for target in ['AIDS', 'aids', 'aim', 'resistance', 'series', 'late', 'leader', 'loss leader', 'loss-leader']:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n--- Word: {target} ---")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] POS: {m['partOfSpeech']} | Reg: {m.get('register')} | Trans: {m['translation']}")
            for ex in m.get('examples', []):
                print(f"       ex: {ex['en']} -> {ex['ru']}")
        for p in it.get('phrases', []):
            print(f"  ◊ {p['en']} -> {p['ru']}")
