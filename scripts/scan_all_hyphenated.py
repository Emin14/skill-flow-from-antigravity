# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

all_hyphenated = set()
for it in data:
    txt = json.dumps(it, ensure_ascii=False)
    matches = re.findall(r'\b[а-яёА-ЯЁ]{2,}-[а-яёА-ЯЁ]{2,}\b', txt)
    for m in matches:
        all_hyphenated.add((m.lower(), it['word']))

print(f"Total unique hyphenated Russian forms found: {len(all_hyphenated)}")
for h, w in sorted(all_hyphenated):
    print(f"  {h:25} (in '{w}')")
