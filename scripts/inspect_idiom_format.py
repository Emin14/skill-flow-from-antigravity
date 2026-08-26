# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Inspecting idioms/meanings in oxford_5000.json:")
count = 0
for entry in data:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        # Check meanings where translation is non-empty and contains dash or phrase
        if tr and ('—' in tr or '-' in tr or 'to ' in tr) and any('\u0400' <= c <= '\u04FF' for c in tr):
            print(f"Word: {entry.get('word')}, POS: {m.get('partOfSpeech')}, tr: {repr(tr)}")
            if exs:
                print(f"   exs: {exs[:2]}")
            count += 1
            if count >= 20:
                break
    if count >= 20:
        break
