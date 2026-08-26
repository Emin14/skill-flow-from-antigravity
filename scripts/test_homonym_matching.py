# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/dict_doc2_cache.json', 'r', encoding='utf-8') as f:
    dict_entries = json.load(f)

# Index dictionary by exact raw_hw cleaned (e.g. 'wind1', 'wind2', 'tear1', 'tear2')
dict_by_raw_clean = {}
for e in dict_entries:
    # remove Roman numerals from raw_hw: e.g. "wind1 I" -> "wind1", "wind2 I" -> "wind2"
    rhw = re.sub(r'\s+(?:IX|VIII|VII|VI|IV|V|III|II|I)\b', '', e['raw_hw'], flags=re.IGNORECASE).strip().lower()
    if rhw not in dict_by_raw_clean:
        dict_by_raw_clean[rhw] = []
    dict_by_raw_clean[rhw].append(e)

homonyms = [
    'bank1', 'bank2', 'bear1', 'bear2', 'can1', 'can2', 'fly1', 'fly2',
    'match1', 'match2', 'mean1', 'mean2', 'mean3', 'mine1', 'mine2',
    'row1', 'row2', 'row3', 'sound1', 'sound2', 'sound3', 'sound4',
    'tear1', 'tear2', 'well1', 'well2', 'wind1', 'wind2'
]

for h in homonyms:
    matches = dict_by_raw_clean.get(h, [])
    print(f"Homonym [{h}] -> {len(matches)} matched entries in dict:")
    for m in matches:
        first_line = m['article_text'].split('\n')[0]
        print(f"   POS: {m['pos']} | {repr(first_line[:70])}")
