# -*- coding: utf-8 -*-
"""
Find all articles in oxford_5000_2026-08-27.json where part '2. v' or '2. n' or '2. a'
was cut off because of middle diamond (♦).
"""
import json, os, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

truncated_words = []

for item in oxford_data:
    w = item['word'].lower()
    raw_entries = parsed_index.get(w, [])
    if not raw_entries:
        # Try finding homonyms like 'word i'
        for k in parsed_index:
            if k.startswith(w + ' '):
                raw_entries.extend(parsed_index[k])
                
    full_raw_text = ' '.join(e.get('text', '') for e in raw_entries)
    
    # Check if raw text has '2. v' or '2. n' or '2. a' or '2. adv'
    has_pos2 = bool(re.search(r'\b2\.\s+[vna]\b', full_raw_text))
    
    if has_pos2:
        # Check current POS in meanings
        meanings = item.get('meanings', [])
        curr_poses = set(m.get('partOfSpeech') for m in meanings)
        
        # If raw text has '2. v' but current entry only has noun
        if re.search(r'\b2\.\s+v\b', full_raw_text) and 'verb' not in curr_poses:
            truncated_words.append((item['word'], 'missing verb', list(curr_poses)))
        elif re.search(r'\b2\.\s+n\b', full_raw_text) and 'noun' not in curr_poses:
            truncated_words.append((item['word'], 'missing noun', list(curr_poses)))
        elif re.search(r'\b2\.\s+a\b', full_raw_text) and 'adjective' not in curr_poses:
            truncated_words.append((item['word'], 'missing adjective', list(curr_poses)))

print(f"Total articles where section 2 was truncated: {len(truncated_words)}")
for it in truncated_words[:30]:
    print(f"  Word '{it[0]}': {it[1]} (current POS: {it[2]})")
