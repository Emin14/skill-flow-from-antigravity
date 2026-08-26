# -*- coding: utf-8 -*-
"""
Verification and QA script for oxford_5000.json
"""

import json
import sys
import hashlib

sys.stdout.reconfigure(encoding='utf-8')

print("=== RUNNING FULL QA VERIFICATION ===")

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    root_data = json.load(f)

with open('src/data/oxford_5000.json', 'r', encoding='utf-8') as f:
    src_data = json.load(f)

# 1. Check file synchronization
with open('oxford_5000.json', 'rb') as f:
    root_md5 = hashlib.md5(f.read()).hexdigest()
with open('src/data/oxford_5000.json', 'rb') as f:
    src_md5 = hashlib.md5(f.read()).hexdigest()

print(f"Root MD5: {root_md5}")
print(f"Src  MD5: {src_md5}")
assert root_md5 == src_md5, "Files must be identical!"
print("✓ Root and src/data/oxford_5000.json are perfectly identical.")

# 2. Check counts
print(f"Total entries: {len(root_data)}")
assert len(root_data) == 4982, f"Expected 4982 entries, got {len(root_data)}"
print("✓ Exactly 4982 entries preserved.")

# 3. Check integrity of every entry and meaning
total_meanings = 0
empty_translations = 0
non_cyrillic_translations = []
invalid_ids = 0
missing_fields = 0

for entry in root_data:
    for field in ['word', 'cefr', 'meanings']:
        if field not in entry:
            missing_fields += 1
            
    meanings = entry.get('meanings', [])
    for expected_id, m in enumerate(meanings, start=1):
        total_meanings += 1
        if m.get('id') != expected_id:
            invalid_ids += 1
            
        tr = m.get('translation', '')
        if not tr or not tr.strip():
            empty_translations += 1
        elif not any('\u0400' <= c <= '\u04FF' for c in tr):
            non_cyrillic_translations.append((entry['word'], m['id'], tr))

print(f"Total meanings: {total_meanings}")
print(f"Empty translations: {empty_translations}")
print(f"Non-cyrillic translations: {len(non_cyrillic_translations)}")
print(f"Invalid sequential IDs: {invalid_ids}")
print(f"Missing required fields: {missing_fields}")

assert empty_translations == 0, f"Found {empty_translations} empty translations!"
assert len(non_cyrillic_translations) == 0, f"Found {len(non_cyrillic_translations)} non-cyrillic translations!"
assert invalid_ids == 0, f"Found {invalid_ids} invalid IDs!"
assert missing_fields == 0, f"Found {missing_fields} missing fields!"

# 4. Spot check key words
sample_words = ['a', 'abandon', 'ability', 'about', 'afternoon', 'anyway', 'back', 'bank2', 'bear2', 'behalf', 'deliver', 'disk', 'dispose', 'fly1', 'fly2', 'give', 'hello', 'row1', 'small', 'tear1', 'until', 'well1', 'write']

print("\n--- SPOT CHECK SAMPLES ---")
data_map = {x['word']: x for x in root_data}
for w in sample_words:
    entry = data_map.get(w)
    if entry:
        print(f"\nWord: {w} (CEFR: {entry.get('cefr')}, Meanings count: {len(entry.get('meanings', []))})")
        for m in entry.get('meanings', [])[:3]:
            print(f"  [{m.get('id')}] ({m.get('partOfSpeech')}): {m.get('translation')}")
            if m.get('examples'):
                print(f"       Example: {m.get('examples')[0]}")

print("\n✓ ALL QA CHECKS PASSED WITH ZERO ERRORS!")
