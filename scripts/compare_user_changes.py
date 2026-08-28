# -*- coding: utf-8 -*-
"""
Compare current working tree oxford_5000_2026-08-27.json against git HEAD
and analyze what changes were made and run deep quality audit.
"""
import subprocess, json, sys, os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# 1. Get git HEAD version
print("Fetching git HEAD version of oxford_5000_2026-08-27.json...")
head_json_str = subprocess.check_output(['git', 'show', 'HEAD:oxford_5000_2026-08-27.json'], encoding='utf-8')
head_data = json.loads(head_json_str)

# 2. Get current working tree version
with open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8') as f:
    current_data = json.load(f)

head_map = {item['word']: item for item in head_data}
curr_map = {item['word']: item for item in current_data}

print(f"HEAD entries: {len(head_data)}")
print(f"Current entries: {len(current_data)}")

# Compare entries
modified_words = []
added_words = []
deleted_words = []

total_head_meanings = sum(len(it.get('meanings', [])) for it in head_data)
total_curr_meanings = sum(len(it.get('meanings', [])) for it in current_data)

total_head_examples = sum(sum(len(m.get('examples', [])) for m in it.get('meanings', [])) + sum(len(p.get('examples', [])) for p in it.get('phrases', [])) for it in head_data)
total_curr_examples = sum(sum(len(m.get('examples', [])) for m in it.get('meanings', [])) + sum(len(p.get('examples', [])) for p in it.get('phrases', [])) for it in current_data)

total_head_phrases = sum(len(it.get('phrases', [])) for it in head_data)
total_curr_phrases = sum(len(it.get('phrases', [])) for it in current_data)

for w in curr_map:
    if w not in head_map:
        added_words.append(w)
    else:
        # Check if modified
        if json.dumps(head_map[w], sort_keys=True) != json.dumps(curr_map[w], sort_keys=True):
            modified_words.append(w)

for w in head_map:
    if w not in curr_map:
        deleted_words.append(w)

print("\n" + "=" * 60)
print("STATISTICAL COMPARISON:")
print("=" * 60)
print(f"Modified words count: {len(modified_words)}")
print(f"Added words count:    {len(added_words)}")
print(f"Deleted words count:  {len(deleted_words)}")
print("-" * 60)
print(f"Total meanings:  HEAD = {total_head_meanings:5d}  -->  CURRENT = {total_curr_meanings:5d} (diff: {total_curr_meanings - total_head_meanings:+d})")
print(f"Total examples:  HEAD = {total_head_examples:5d}  -->  CURRENT = {total_curr_examples:5d} (diff: {total_curr_examples - total_head_examples:+d})")
print(f"Total phrases:   HEAD = {total_head_phrases:5d}  -->  CURRENT = {total_curr_phrases:5d} (diff: {total_curr_phrases - total_head_phrases:+d})")

# Categorize modifications
types_of_changes = {
    'examples_added': [],
    'examples_removed': [],
    'meanings_changed': [],
    'phrases_changed': [],
    'translation_cleaned': []
}

for w in modified_words:
    h_item = head_map[w]
    c_item = curr_map[w]
    
    h_ex_count = sum(len(m.get('examples', [])) for m in h_item.get('meanings', [])) + sum(len(p.get('examples', [])) for p in h_item.get('phrases', []))
    c_ex_count = sum(len(m.get('examples', [])) for m in c_item.get('meanings', [])) + sum(len(p.get('examples', [])) for p in c_item.get('phrases', []))
    
    if c_ex_count > h_ex_count:
        types_of_changes['examples_added'].append((w, h_ex_count, c_ex_count))
    elif c_ex_count < h_ex_count:
        types_of_changes['examples_removed'].append((w, h_ex_count, c_ex_count))
        
    if len(h_item.get('meanings', [])) != len(c_item.get('meanings', [])):
        types_of_changes['meanings_changed'].append((w, len(h_item.get('meanings', [])), len(c_item.get('meanings', []))))

print("\n" + "=" * 60)
print("NATURE OF MODIFICATIONS:")
print("=" * 60)
print(f"Words with examples added:   {len(types_of_changes['examples_added'])}")
print(f"Words with examples removed: {len(types_of_changes['examples_removed'])}")
print(f"Words with meanings count changed: {len(types_of_changes['meanings_changed'])}")

# Show 15 sample modified words before/after
print("\n" + "=" * 60)
print("SAMPLE 15 MODIFIED WORDS (DIFF PREVIEW):")
print("=" * 60)
for w in modified_words[:15]:
    print(f"\n--- Word: '{w}' ---")
    h_m = head_map[w].get('meanings', [])
    c_m = curr_map[w].get('meanings', [])
    print(f"HEAD meanings count: {len(h_m)}, CURRENT meanings count: {len(c_m)}")
    for i in range(min(3, max(len(h_m), len(c_m)))):
        if i < len(h_m) and i < len(c_m):
            if h_m[i] != c_m[i]:
                print(f"  Meaning {i+1} BEFORE: trans='{h_m[i].get('translation')}', ex={h_m[i].get('examples')}")
                print(f"  Meaning {i+1} AFTER:  trans='{c_m[i].get('translation')}', ex={c_m[i].get('examples')}")
