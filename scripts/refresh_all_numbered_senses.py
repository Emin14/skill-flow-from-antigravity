# -*- coding: utf-8 -*-
"""
Re-run numbered senses parser for all candidate words.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

from flawless_numbered_senses_parser import parse_single_numbered_section

count = 0
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
    if not raw_text:
        continue
        
    if w in ['about', 'round', 'act', 'out', 'air', 'ice']:
        continue
        
    pre_diamond = raw_text.split('♦')[0] if '♦' in raw_text else raw_text
    nums_in_raw = [int(n) for n in re.findall(r'\b(\d+)\)', pre_diamond)]
    
    # If raw text has multiple numbered senses and does NOT have macro POS split (like "2. v")
    if nums_in_raw and max(nums_in_raw) > 1 and not re.search(r'\b[2-9]\.\s*(?:n|v|a|adv|prep)\b', pre_diamond):
        pos = item['meanings'][0]['partOfSpeech']
        new_meanings = parse_single_numbered_section(pre_diamond, w, pos)
        if len(new_meanings) > 1:
            item['meanings'] = new_meanings
            count += 1

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Refreshed {count} words with flawless numbered senses!")
