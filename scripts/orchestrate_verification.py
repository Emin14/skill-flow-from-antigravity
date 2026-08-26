# -*- coding: utf-8 -*-
"""
Orchestrator for Deep Batch Verification of oxford_5000_updated.json
Splits into batches of 25 words, verifies each word against dictionaries:
- Deeply verifies and standardizes all register labels (биол., фин., мед., вчт., etc.)
- Separates Phrasal Verbs (◼) and Idioms (◊) into phrases
- Keeps only authentic headword senses in meanings with sequential IDs
- Cleans OCR codes, accents, soft hyphens, ligatures
- Preserves all Oxford metadata
- Progressively saves to oxford_5000_updated_verified.json and updates verification__updated_progress.json
"""

import sys
import json
import time
import os
import shutil

sys.stdout.reconfigure(encoding='utf-8')

from deep_batch_verifier import verify_batch_items

BATCH_SIZE = 25
INPUT_FILE = 'oxford_5000_updated.json'
OUTPUT_FILE = 'oxford_5000_updated_verified.json'
PROGRESS_FILE = 'verification__updated_progress.json'

print("=== Starting Deep Batch Verification Orchestration ===")

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    full_dataset = json.load(f)

total_words = len(full_dataset)
total_batches = (total_words + BATCH_SIZE - 1) // BATCH_SIZE

print(f"Total words: {total_words}")
print(f"Batch size: {BATCH_SIZE} words/batch (Total batches: {total_batches})")

verified_data = []
start_time = time.time()

for batch_idx in range(total_batches):
    start_idx = batch_idx * BATCH_SIZE
    end_idx = min(start_idx + BATCH_SIZE, total_words)
    batch_words = full_dataset[start_idx:end_idx]
    
    verified_batch = verify_batch_items(batch_words)
    
    assert len(verified_batch) == len(batch_words), f"Batch {batch_idx+1}: word count mismatch ({len(verified_batch)} vs {len(batch_words)})"
    
    for item in verified_batch:
        assert item.get('word'), f"Missing word in batch {batch_idx+1}"
        assert 'meanings' in item, f"Missing meanings in word {item['word']}"
        for idx, m in enumerate(item['meanings'], 1):
            assert m['id'] == idx, f"Non-sequential meaning ID in word {item['word']}"
            assert m['partOfSpeech'], f"Missing POS in word {item['word']}"
            assert m['translation'], f"Empty translation in word {item['word']}"
            
    verified_data.extend(verified_batch)
    
    # Save incremental progress every batch
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out_f:
        json.dump(verified_data, out_f, ensure_ascii=False, indent=2)
        
    progress_info = {
        'total_words': total_words,
        'total_batches': total_batches,
        'completed_batches': batch_idx + 1,
        'verified_words_count': len(verified_data),
        'last_processed_idx': end_idx,
        'percentage': round(((batch_idx + 1) / total_batches) * 100, 2),
        'last_batch_sample': [w['word'] for w in verified_batch[:3]],
        'updated_at': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as pf:
        json.dump(progress_info, pf, ensure_ascii=False, indent=2)
        
    if (batch_idx + 1) % 10 == 0 or (batch_idx + 1) == total_batches:
        elapsed = time.time() - start_time
        pct = (batch_idx + 1) / total_batches * 100
        print(f"[{pct:5.1f}%] Batch {batch_idx+1:3d}/{total_batches}: Verified words {start_idx+1:4d}..{end_idx:4d} (Total verified: {len(verified_data):4d}) - elapsed: {elapsed:.1f}s")

# Sync to primary updated files
shutil.copyfile(OUTPUT_FILE, INPUT_FILE)
if os.path.exists('src/data/oxford_5000.json'):
    shutil.copyfile(OUTPUT_FILE, 'src/data/oxford_5000.json')

print("\n=== Deep Batch Verification Completed Successfully ===")
print(f"Total Verified Words: {len(verified_data)} / {total_words}")
print(f"Updated File: {INPUT_FILE}")
print(f"Verified File: {OUTPUT_FILE}")
print(f"Progress File: {PROGRESS_FILE}")
