# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

words_with_mid_diamond = []

for item in oxford:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    
    raw_article = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_article = parsed_index[k][0].get('text', '')
            if '♦' in raw_article:
                break
                
    if '♦' in raw_article:
        # Check if ♦ is in the middle: ♦ ... \d+\. (n|v|a|adv)
        if re.search(r'♦.*?\s+\d+\.\s*(?:n|v|a|adv|prep|cj)\b', raw_article, re.S):
            words_with_mid_diamond.append(w)

print(f"Words where diamond ♦ appears in the MIDDLE of article before next POS: {len(words_with_mid_diamond)}")
print("Sample words:", words_with_mid_diamond[:25])
