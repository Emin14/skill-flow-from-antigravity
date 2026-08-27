# -*- coding: utf-8 -*-
"""
Inspect all attr. / attributive senses across all 4982 words.
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

attr_words = []
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    if 'attr.' in raw_text or 'attr:' in raw_text or 'attr' in raw_text:
        # Check if any meaning has attr in raw text
        matches = re.findall(r'(\d+)\)\s*attr[.:\s]*([^\n;♦]+)', raw_text)
        if matches:
            attr_words.append((w, matches))

print(f"Total words with explicit 'attr.' numbered senses in Muller: {len(attr_words)}")
for aw in attr_words[:15]:
    print(f"Word: '{aw[0]}' -> senses: {aw[1]}")
