# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_list = json.load(f)

with open('tmp/dict_doc2_cache.json', 'r', encoding='utf-8') as f:
    dict_entries = json.load(f)

dict_by_base = {}
for e in dict_entries:
    bhw = e['base_hw']
    if bhw not in dict_by_base:
        dict_by_base[bhw] = []
    dict_by_base[bhw].append(e)

print(f"Total Oxford words: {len(oxford_list)}")
print(f"Total Base Headwords in Dictionary: {len(dict_by_base)}")

# Let's check stem/compound matching for all words
stemmed_matches = {}
unmatched = []

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
        if c in dict_by_base:
            found = True
            break
    if found:
        continue
        
    # Check stemming candidates
    stem_candidates = []
    if w_clean.endswith('ly') and len(w_clean) > 4:
        stem_candidates.append(w_clean[:-2])
        if w_clean.endswith('ally'):
            stem_candidates.append(w_clean[:-4])
        if w_clean.endswith('ily'):
            stem_candidates.append(w_clean[:-3] + 'y')
    if w_clean.endswith('ed') and len(w_clean) > 4:
        stem_candidates.append(w_clean[:-2])
        stem_candidates.append(w_clean[:-1])
    if w_clean.endswith('ing') and len(w_clean) > 5:
        stem_candidates.append(w_clean[:-3])
        stem_candidates.append(w_clean[:-3] + 'e')
    if w_clean.endswith('s') and len(w_clean) > 3:
        stem_candidates.append(w_clean[:-1])
        if w_clean.endswith('es'):
            stem_candidates.append(w_clean[:-2])
    if w_clean.endswith('tion') and len(w_clean) > 6:
        stem_candidates.append(w_clean[:-4] + 'te')
        stem_candidates.append(w_clean[:-4] + 't')
        stem_candidates.append(w_clean[:-4])
    if w_clean.endswith('ment') and len(w_clean) > 6:
        stem_candidates.append(w_clean[:-4])
    if w_clean.endswith('ness') and len(w_clean) > 6:
        stem_candidates.append(w_clean[:-4])
        if w_clean.endswith('iness'):
            stem_candidates.append(w_clean[:-5] + 'y')
    if w_clean.endswith('able') and len(w_clean) > 6:
        stem_candidates.append(w_clean[:-4])
        stem_candidates.append(w_clean[:-4] + 'e')
    if w_clean.endswith('ability') and len(w_clean) > 8:
        stem_candidates.append(w_clean[:-7] + 'able')
        stem_candidates.append(w_clean[:-7])

    matched_stem = None
    for sc in stem_candidates:
        if sc in dict_by_base:
            matched_stem = sc
            break
            
    if matched_stem:
        stemmed_matches[w] = matched_stem
    else:
        unmatched.append(w)

print(f"Direct match: {len(oxford_list) - len(stemmed_matches) - len(unmatched)}")
print(f"Stemmed match: {len(stemmed_matches)}")
print(f"Unmatched: {len(unmatched)} -> {unmatched}")
