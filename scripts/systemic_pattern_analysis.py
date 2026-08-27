# -*- coding: utf-8 -*-
"""
Systemic Analysis of Dictionary Patterns across all 4982 words:
1. Diamond block extraction (both end-of-article and middle-of-article)
2. Preposition/function-word pattern senses (senses starting with `:` or English patterns)
3. Subitem letters (а, б, в) handling in phrases vs meanings
4. Example-level vs Sense-level register classification
5. POS macro-block propagation
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

from parse_utils import POS_MAP, REGISTER_MAP

print("Analyzing systemic patterns across 4982 words...")

# Pattern 1: Middle Diamond Blocks across all words
middle_diamonds = []
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
    if '♦' in raw_text and re.search(r'♦.*?\b[2-5]\.\s*(?:n|v|a|adv|prep|cj)\b', raw_text, re.DOTALL):
        middle_diamonds.append(w)

print(f"1. Words with middle diamond blocks (requiring strict phrases isolation): {len(middle_diamonds)}")
print(f"   Examples: {middle_diamonds[:15]}")

# Pattern 2: Senses starting with `:` or English collocations across all words
colloc_senses = []
for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if re.match(r'^(?:to\s+[a-z]+|have\s+|be\s+|иметь\s+что-либо|быть\s+в\s+состоянии)\b', tr, re.I):
            colloc_senses.append((item['word'], m['id'], m['partOfSpeech'], tr))

print(f"\n2. Senses with verb-collocation translations in meanings: {len(colloc_senses)}")
for cs in colloc_senses[:10]:
    print(f"   {cs[0]} [id:{cs[1]}] ({cs[2]}): '{cs[3]}'")

# Pattern 3: Subitems а), б), в) in raw diamond blocks
multi_letter_phrases = []
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
    if '♦' in raw_text:
        diamond_text = raw_text.split('♦', 1)[1]
        if re.search(r'[а-яА-Яa-zA-Z\s\~]+\s+а\)\s+[а-яА-Я]', diamond_text):
            multi_letter_phrases.append(w)

print(f"\n3. Words with multi-letter (а, б) phrases inside diamond blocks: {len(multi_letter_phrases)}")
print(f"   Examples: {multi_letter_phrases[:15]}")
