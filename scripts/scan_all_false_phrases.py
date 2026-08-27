# -*- coding: utf-8 -*-
"""
Scan all words in oxford_5000_2026-08-27.json with phrases where raw text has NO ♦ and NO ¬.
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

PHRASAL_PARTICLES = {
    'in', 'out', 'up', 'down', 'off', 'on', 'away', 'back', 'by', 
    'over', 'through', 'about', 'across', 'ahead', 'along', 'around', 
    'forth', 'forward', 'into', 'onto', 'to', 'together', 'under', 
    'apart', 'aside', 'behind', 'between', 'round'
}

false_phrase_words = []

for item in oxford_data:
    if not item.get('phrases'):
        continue
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    # Check if raw text has ♦ or ¬ or \xad ~ or - ~
    has_diamond = '♦' in raw_text
    has_phrasal = ('¬' in raw_text or '­ ~' in raw_text or '- ~' in raw_text)
    
    if not has_diamond and not has_phrasal:
        # Every phrase here is a false phrase (just an example or collocation)!
        false_phrase_words.append((w, item['phrases']))

print(f"Total words with false phrases (NO ♦ and NO ¬ in raw dictionary): {len(false_phrase_words)}")
for w, phrs in false_phrase_words:
    print(f"Word: '{w}' -> {len(phrs)} phrases:")
    for p in phrs:
        print(f"   phr: '{p['phrase']}' ({p['partOfSpeech']}) -> '{p['translation']}'")
