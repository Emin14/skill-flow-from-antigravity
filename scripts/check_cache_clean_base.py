# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_list = json.load(f)

with open('tmp/dict_doc2_cache.json', 'r', encoding='utf-8') as f:
    dict_entries = json.load(f)

def clean_base(hw):
    s = hw.strip()
    # Strip Roman numerals like " I", " II", " III", " IV", " V", " VI", " VII", " VIII", " IX", " X"
    s = re.sub(r'\s+(?:IX|VIII|VII|VI|IV|V|III|II|I)\b', '', s, flags=re.IGNORECASE).strip()
    # Strip trailing digits like "lead1" -> "lead", "bank2" -> "bank"
    s = re.sub(r'\d+$', '', s).strip()
    s = re.sub(r'[\,\.\/].*$', '', s).strip()
    return s.lower()

dict_by_clean = {}
for e in dict_entries:
    cb = clean_base(e['raw_hw'])
    if cb not in dict_by_clean:
        dict_by_clean[cb] = []
    dict_by_clean[cb].append(e)

print(f"Total dictionary entries: {len(dict_entries)}")
print(f"Total clean base headwords: {len(dict_by_clean)}")

matched_count = 0
unmatched_words = []

for item in oxford_list:
    w = item['word'].strip().lower()
    w_clean = re.sub(r'\d+$', '', w)
    
    candidates = [
        w,
        w_clean,
        w.replace('_', ' '),
        w_clean.replace('_', ' '),
        w.replace('-', ' '),
        w.replace(' ', '-'),
        w.replace("'", "’"),
        w.replace("’", "'")
    ]
    
    found = False
    for c in candidates:
        if c in dict_by_clean:
            matched_count += 1
            found = True
            break
    if not found:
        unmatched_words.append(item['word'])

print(f"Matched Oxford words: {matched_count} / {len(oxford_list)} ({matched_count/len(oxford_list)*100:.2f}%)")
print(f"Unmatched words count: {len(unmatched_words)}")
print(f"Unmatched list: {unmatched_words}")
