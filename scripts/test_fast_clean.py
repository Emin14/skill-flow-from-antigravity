# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract all 60,000 texts (meanings + examples)
all_texts = []
for entry in data:
    for m in entry.get('meanings', []):
        all_texts.append(m.get('translation', ''))
        for ex in m.get('examples', []):
            all_texts.append(ex.get('ru', ''))

print(f"Total texts to process: {len(all_texts)}")

t0 = time.time()
# Clean without catastrophic trailing regex
PAT_PUNCT = re.compile(r'[\;\,]\s+to\b.*$')
for t in all_texts:
    PAT_PUNCT.sub('', t)

print(f"Cleaned all {len(all_texts)} texts in {time.time() - t0:.3f}s!")
