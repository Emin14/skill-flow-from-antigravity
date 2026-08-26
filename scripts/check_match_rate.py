# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_data = json.load(f)

muller_dict = {}
for art in muller_data:
    hw = art['headword']
    base = re.sub(r'\s+[I|V|X]+$', '', hw).strip().lower()
    if base not in muller_dict:
        muller_dict[base] = []
    muller_dict[base].append(art)

matched = 0
missing = []
for entry in oxford_data:
    w = entry['word'].lower()
    # Check exact, or without trailing numbers (e.g. well2 -> well)
    base_w = re.sub(r'[0-9]+$', '', w).strip()
    if base_w in muller_dict:
        matched += 1
    else:
        missing.append(w)

print(f"Matched: {matched} / {len(oxford_data)} words ({matched/len(oxford_data)*100:.2f}%)")
print(f"Missing count: {len(missing)}")
if missing:
    print(f"Sample missing: {missing[:20]}")
