# -*- coding: utf-8 -*-
"""
Deep inspection script for Round 3:
1. Scan for all OCR broken hyphens across entire dataset.
2. Inspect the 6 words with translation == ":" (behalf, camp, live, random, sake, take).
3. Inspect plural notation artifacts in examples (genius, money, mouse, penny, photo, referendum, staff, etc.).
4. Inspect fade, cabin, couple, get, set, abstract, come.
5. Scan for Cyrillic homoglyphs in English examples/phrases.
"""
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECK WORDS WITH ':' AS TRANSLATION ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '').strip()
        if t in [':', ':', '= :', '1:', '2:', '3:'] or t.startswith(':'):
            print(f"Word: {it['word']} | meaning id {m['id']} | trans: {repr(t)} | examples: {m.get('examples')}")

print("\n=== 2. CHECK PLURAL ARTIFACTS IN EXAMPLES ===")
for it in data:
    for m in it.get('meanings', []):
        for ex in m.get('examples', []):
            en = ex.get('en', '')
            if any(k in en for k in ['pl', '-es', '-os', '-da', 'genii', 'monies', 'pennies', 'staves', ')', '(']):
                print(f"Word: {it['word']} | ex.en: {repr(en)} | ex.ru: {repr(ex.get('ru'))}")

print("\n=== 3. CHECK CYRILLIC IN ENGLISH EXAMPLES / PHRASES ===")
cyrillic_in_en = []
for it in data:
    for m in it.get('meanings', []):
        for ex_idx, ex in enumerate(m.get('examples', [])):
            en = ex.get('en', '')
            cyr_chars = re.findall(r'[а-яёА-ЯЁ]', en)
            if cyr_chars:
                cyrillic_in_en.append((it['word'], f"meanings[{m['id']}].examples[{ex_idx}]", en, set(cyr_chars)))
    for p_idx, p in enumerate(it.get('phrases', [])):
        en = p.get('en', '')
        cyr_chars = re.findall(r'[а-яёА-ЯЁ]', en)
        if cyr_chars:
            cyrillic_in_en.append((it['word'], f"phrases[{p_idx}]", en, set(cyr_chars)))

print(f"Found {len(cyrillic_in_en)} English strings with Cyrillic characters:")
for item in cyrillic_in_en:
    print(f"  Word: {item[0]:15} | Path: {item[1]} | Text: {repr(item[2])} | Chars: {item[3]}")

print("\n=== 4. CHECK FADE, CABIN, COUPLE, GET, SET, ABSTRACT ===")
for target in ['fade', 'cabin', 'couple', 'get', 'set', 'abstract', 'come']:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n--- Word: {target} ---")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] POS: {m['partOfSpeech']} | Trans: {m['translation']}")
            for ex in m.get('examples', []):
                print(f"       ex: {ex['en']} -> {ex['ru']}")
