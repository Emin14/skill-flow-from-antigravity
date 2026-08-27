# -*- coding: utf-8 -*-
"""
Resolve all remaining 'other' POS by checking raw article POS indicators.
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

from parse_utils import POS_MAP

RAW_POS_REGEX = re.compile(r'\b(predic\.\s*a|predic\.|n|v|vi|vt|a|adj|adv|prep|cj|conj|int|interj|pron|num|art|pl)\b')

def get_base_pos_from_raw(raw_text):
    if not raw_text:
        return None
    # find first occurrence of pos
    m = RAW_POS_REGEX.search(raw_text)
    if m:
        p = m.group(1).strip()
        if p.startswith('predic'):
            return 'adjective'
        return POS_MAP.get(p, 'noun')
    return None

fixed_other_count = 0
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    base_pos = get_base_pos_from_raw(raw_text)
    
    # Specific known words
    if w in ['against', 'amid', 'among', 'amongst', 'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by', 'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'near', 'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside', 'over', 'past', 'round', 'since', 'through', 'throughout', 'till', 'to', 'toward', 'towards', 'under', 'underneath', 'until', 'unto', 'up', 'upon', 'via', 'with', 'within', 'without']:
        if not base_pos:
            base_pos = 'preposition'
    if w in ['afraid', 'alive', 'alone', 'asleep', 'aware', 'awake', 'alike']:
        base_pos = 'adjective'
    if w in ['although', 'because', 'before', 'if', 'lest', 'once', 'since', 'than', 'that', 'though', 'till', 'unless', 'until', 'when', 'whenever', 'where', 'whereas', 'wherever', 'whether', 'while']:
        if not base_pos:
            base_pos = 'conjunction'
            
    current_pos = base_pos or 'noun'
    for m in item.get('meanings', []):
        pos = m.get('partOfSpeech')
        if pos and pos != 'other':
            current_pos = pos
        elif pos == 'other' or not pos:
            m['partOfSpeech'] = current_pos
            fixed_other_count += 1

print(f"Resolved {fixed_other_count} remaining 'other' meanings to canonical POS!")

# Check remaining other
remaining_other = sum(1 for item in oxford_data for m in item['meanings'] if m.get('partOfSpeech') == 'other')
print(f"Total meanings with 'other' remaining: {remaining_other}")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Updated {oxford_path} successfully!")
