# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. FIND 'глаголсвязка' OR 'глагол-связка' ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'связка' in t or 'глагол' in t:
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")

print("\n=== 2. FIND ALL OCCURRENCES OF 'pl' OR 'pl.' IN TRANSLATIONS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\bpl\b', t, re.IGNORECASE):
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")

print("\n=== 3. FIND ALL OCCURRENCES OF 'sing' OR 'sing.' IN TRANSLATIONS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\bsing\b', t, re.IGNORECASE):
            print(f"Word: {it['word']:15} | ID: {m['id']} | Trans: {repr(t)}")
