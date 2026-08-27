# -*- coding: utf-8 -*-
"""
Scan for middle diamond block leaks into meanings.
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

middle_diamond_words = []

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
        
    # Check if raw text has diamond BEFORE a second POS section (e.g. "♦ ... 2. v" or "♦ ... 2. prep" or "♦ ... 2. n")
    if re.search(r'♦.*?\b2\.\s*(?:v|n|a|adv|prep|cj)\b', raw_text, re.DOTALL):
        middle_diamond_words.append((w, item))

print(f"Words with middle diamond blocks: {len(middle_diamond_words)}")
for w, it in middle_diamond_words:
    print(f"Word: '{w}' -> meanings count: {len(it['meanings'])}, phrases count: {len(it.get('phrases', []))}")
