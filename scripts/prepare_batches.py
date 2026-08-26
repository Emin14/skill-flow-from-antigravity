# -*- coding: utf-8 -*-
"""
Prepare batches of 25 words with matching Muller 2021 source articles.
"""

import json
import os
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
OXFORD_PATH = ROOT / "oxford_5000.json"
MULLER_ARTICLES_PATH = ROOT / "tmp" / "muller_rebuild" / "articles.json"
BATCHES_DIR = ROOT / "tmp" / "batches"

BATCHES_DIR.mkdir(parents=True, exist_ok=True)

print("1. Loading datasets...")
with open(OXFORD_PATH, 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open(MULLER_ARTICLES_PATH, 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

# Index Muller articles by headword base
muller_index = {}
for a in muller_articles:
    hw_raw = a.get('headword', '').strip()
    hw_base = hw_raw.split()[0].lower().rstrip(',;.')
    if hw_base not in muller_index:
        muller_index[hw_base] = []
    muller_index[hw_base].append(a)

BATCH_SIZE = 25
total_words = len(oxford)
num_batches = (total_words + BATCH_SIZE - 1) // BATCH_SIZE

print(f"Total words: {total_words}, Batch size: {BATCH_SIZE}, Total batches: {num_batches}")

for b_idx in range(num_batches):
    start = b_idx * BATCH_SIZE
    end = min(start + BATCH_SIZE, total_words)
    batch_words = oxford[start:end]
    
    batch_data = {
        'batch_id': b_idx + 1,
        'start_index': start,
        'end_index': end,
        'total_in_batch': len(batch_words),
        'items': []
    }
    
    for entry in batch_words:
        w = entry.get('word', '').strip()
        base = re.sub(r'\d+$', '', w).lower()
        
        # Get matching Muller articles
        matching_articles = muller_index.get(base, [])
        sources = []
        for art in matching_articles:
            sources.append({
                'headword': art.get('headword', ''),
                'page': art.get('page', 0),
                'column': art.get('column', 0),
                'body': art.get('body', '')
            })
            
        batch_data['items'].append({
            'oxford_entry': entry,
            'muller_sources': sources
        })
        
    batch_file = BATCHES_DIR / f"batch_{b_idx + 1:03d}_input.json"
    with open(batch_file, 'w', encoding='utf-8') as f:
        json.dump(batch_data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {num_batches} batch input files in {BATCHES_DIR}.")
