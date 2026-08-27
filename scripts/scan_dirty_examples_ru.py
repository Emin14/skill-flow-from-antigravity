# -*- coding: utf-8 -*-
"""
Scan for raw register abbreviations inside examples[].ru across all 4980 words.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Register abbreviation triggers
REG_ABBRS = [
    r'ком\.', r'воен\.', r'мор\.', r'муз\.', r'мед\.', r'амер\.', r'разг\.', r'сл\.', r'уст\.',
    r'поэт\.', r'спорт\.', r'тех\.', r'юр\.', r'авт\.', r'ав\.', r'бот\.', r'зоол\.', r'грам\.',
    r'лингв\.', r'мат\.', r'астр\.', r'геол\.', r'геогр\.', r'физ\.', r'хим\.', r'эл\.', r'электр\.',
    r'библ\.', r'театр\.', r'фото\.', r'с\.-х\.', r'жел\.-дор\.', r'ж\.-д\.', r'горн\.', r'полигр\.',
    r'дипл\.', r'коммерч\.', r'шутл\.', r'ирон\.', r'груб\.', r'бран\.', r'презр\.', r'уничиж\.',
    r'редк\.', r'книжн\.', r'охот\.', r'шахм\.', r'кино\.', r'радио\.', r'тлв\.', r'вет\.',
    r'психол\.', r'филос\.', r'лог\.', r'экон\.', r'стат\.', r'фин\.', r'анат\.', r'биол\.'
]

reg_pattern = re.compile(r'^\(?(?:' + '|'.join(REG_ABBRS) + r')(?:\s*,\s*(?:' + '|'.join(REG_ABBRS) + r'))*\)?\s*', re.I)

dirty_examples = []

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        for e_idx, ex in enumerate(m.get('examples', [])):
            ru = ex.get('ru', '')
            if reg_pattern.search(ru):
                dirty_examples.append((w, 'meaning', m['id'], e_idx, ru))
                
    for p in item.get('phrases', []):
        for e_idx, ex in enumerate(p.get('examples', [])):
            ru = ex.get('ru', '')
            if reg_pattern.search(ru):
                dirty_examples.append((w, 'phrase', p['id'], e_idx, ru))

print(f"Total examples with unextracted register abbreviations in ru: {len(dirty_examples)}")
for it in dirty_examples[:25]:
    print(f"  Word '{it[0]}' [{it[1]} {it[2]}, ex {it[3]}]: '{it[4]}'")
