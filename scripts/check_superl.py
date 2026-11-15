# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('src/data/oxford_5000.json', encoding='utf-8'))

print("=== SEARCH FOR 'superl' / 'compar' / 'part' IN TRANSLATIONS ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\b(superl|compar|pres part|past part)\b', t, re.IGNORECASE):
            print(f"[{it['word']:12}] POS: {m['partOfSpeech']} | Trans: {repr(t)}")
