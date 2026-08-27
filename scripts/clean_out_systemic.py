# -*- coding: utf-8 -*-
"""
Systemic clean for 'out' and inspection of 'account', 'air', 'ice', 'act', 'about'.
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

from parse_utils import POS_MAP, REGISTER_MAP, clean_russian_text, clean_english_example

# Let's inspect 'out' in parsed_index
raw_out = parsed_index.get('out', [{}])[0].get('text', '')
print(f"Raw 'out' length: {len(raw_out)}")

# Let's see the clean meanings of out
for item in oxford_data:
    if item['word'] == 'out':
        # Remove meanings that are phrases (e.g. 7, 8, 9, 10, 11, 19, 20, 21, 22, 31, 32, 33, 34)
        clean_meanings = []
        for m in item['meanings']:
            tr = m['translation']
            if tr in [
                'несравненно, намного, гораздо',
                'вполне',
                'несомненно',
                'она напрашивается на комплименты',
                'быть с кем-либо в ссоре, не в ладах',
                'не участвовать в чём-либо',
                'не быть допущенным к чему-либо',
                'избавиться от чего-либо',
                'вы совершенно не в курсе дела',
                'стыдитесь!',
                '(вон!',
                'выгонять)',
                '(выставьте этого человека! гасить, тушить (фонарь, лампу и т. п.) нокаутировать)'
            ]:
                continue
            clean_meanings.append(m)
            
        for idx, m in enumerate(clean_meanings, start=1):
            m['id'] = idx
        item['meanings'] = clean_meanings
        
        # Deduplicate and clean phrases of out
        seen_phrs = set()
        clean_phrases = []
        for p in item.get('phrases', []):
            if p['phrase'] not in seen_phrs:
                seen_phrs.add(p['phrase'])
                clean_phrases.append(p)
        for p_idx, p in enumerate(clean_phrases, start=1):
            p['id'] = p_idx
        item['phrases'] = clean_phrases

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Applied clean to 'out' successfully!")
