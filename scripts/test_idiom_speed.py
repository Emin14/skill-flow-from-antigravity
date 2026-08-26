# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

IDIOM_PAIR_PATTERN = re.compile(r'^([a-zA-Z][a-zA-Z\s\(\)\'\’\/\-]*?)\s+([а-яА-ЯёЁ].*)$')

all_chunks = []
for entry in data:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for chunk in tr.split('; '):
            all_chunks.append(chunk)

print(f"Total chunks: {len(all_chunks)}")

t0 = time.time()
matches = 0
for chunk in all_chunks:
    if IDIOM_PAIR_PATTERN.match(chunk):
        matches += 1

print(f"Matched {matches} idioms in {time.time() - t0:.3f}s!")
