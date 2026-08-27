# -*- coding: utf-8 -*-
"""
Scan for bound collocations and colon-senses across all 4982 words.
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

# Search for pattern: number followed by colon: e.g. "4):" or "2):" or "1):" in raw text
colon_senses = []

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
        
    # Match pattern: e.g. "1):" or "2):" or "3):" or "4):" or "5):"
    matches = re.findall(r'(\d+)\)\s*:\s*([^\n;]+)', raw_text)
    if matches:
        for m_num, m_content in matches:
            colon_senses.append({
                'word': w,
                'num': m_num,
                'content': m_content.strip()
            })

print(f"Total bound colon-senses found across entire dictionary: {len(colon_senses)}")
for cs in colon_senses:
    print(f"Word: '{cs['word']}' [{cs['num']}):] -> {cs['content']}")
