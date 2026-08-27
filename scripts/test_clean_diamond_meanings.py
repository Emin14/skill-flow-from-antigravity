# -*- coding: utf-8 -*-
"""
Dry-run Test: Full Diamond Isolation & Meanings Cleanup
Tests cleaning leaked idioms from meanings across all 687 words.
"""
import json
import re
import sys
import copy

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

from parse_utils import REGISTER_MAP

def clean_t(t):
    if not t:
        return ""
    t = t.replace('\xad', '-').replace('\u00ad', '-').replace('\ue000', '-')
    t = re.sub(r'([А-Яа-яA-Za-z])-\s*\n\s*([А-Яа-яA-Za-z])', r'\1\2', t)
    t = re.sub(r'([А-Яа-яA-Za-z])-\s+([а-яa-z])', r'\1\2', t)
    def lower_stress(m):
        w = m.group(0)
        if re.search(r'[а-яё][А-ЯЁ]', w):
            return w[0] + w[1:].lower()
        return w
    t = re.sub(r'[А-Яа-яЁё]+', lower_stress, t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def test_clean_word(item):
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    new_item = copy.deepcopy(item)
    
    raw_article = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_article = clean_t(parsed_index[k][0].get('text', ''))
            if '♦' in raw_article:
                break
                
    if not raw_article or '♦' not in raw_article:
        return item, 0
        
    # Extract all ♦ blocks
    diamond_blocks = []
    for part in raw_article.split('♦')[1:]:
        m_next = re.search(r'\s+\d+\.\s*(?:n|v|a|adv|prep|cj)\b', part)
        if m_next:
            diamond_blocks.append(part[:m_next.start()])
        else:
            diamond_blocks.append(part)
    all_diamonds_text = ' '.join(diamond_blocks)
    
    cleaned_meanings = []
    removed_count = 0
    
    for m in new_item.get('meanings', []):
        tr = m.get('translation', '').strip()
        words_in_tr = [x for x in re.split(r'[\s,;:]+', tr) if len(x) >= 4 and re.search(r'[а-яА-Я]', x)]
        is_leaked_idiom = False
        if len(words_in_tr) >= 2:
            sample_phrase = ' '.join(words_in_tr[:3])
            if sample_phrase in all_diamonds_text:
                is_leaked_idiom = True
        elif len(words_in_tr) == 1:
            # Single word like "рисковать", "немедленно", "незамедлительно"
            if f" {words_in_tr[0]} " in all_diamonds_text or all_diamonds_text.startswith(words_in_tr[0]):
                is_leaked_idiom = True
                
        if is_leaked_idiom:
            removed_count += 1
        else:
            cleaned_meanings.append(m)
            
    # Safety: if cleaned_meanings becomes empty, fallback to original
    if not cleaned_meanings:
        cleaned_meanings = new_item.get('meanings', [])
        removed_count = 0
        
    for idx, m in enumerate(cleaned_meanings, start=1):
        m['id'] = idx
        
    new_item['meanings'] = cleaned_meanings
    return new_item, removed_count

# Test on ice
ice_item = next(x for x in oxford if x['word'] == 'ice')
cleaned_ice, removed = test_clean_word(ice_item)

print("=== ICE BEFORE ===")
print(f"Meanings count: {len(ice_item['meanings'])}")
for m in ice_item['meanings']:
    print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")

print("\n=== ICE AFTER CLEANING ===")
print(f"Meanings count: {len(cleaned_ice['meanings'])} (Removed {removed} leaked idiom meanings)")
for m in cleaned_ice['meanings']:
    print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")
