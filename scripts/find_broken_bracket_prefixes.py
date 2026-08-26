# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. FIND '(при) годный' OR SIMILAR PREFIXES WITH SPACE ===")
pattern = re.compile(r'\(([а-яёА-ЯЁ]{1,5})\)\s+([а-яёА-ЯЁ]{3,})')

matches = []
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        found = pattern.findall(t)
        if found:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")
            matches.append((it['word'], m['id'], t))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            found_ex = pattern.findall(ru)
            if found_ex:
                print(f"  ex in {it['word']:15} | ru: {repr(ru)}")

print(f"\nTotal matches found: {len(matches)}")
