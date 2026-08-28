# -*- coding: utf-8 -*-
"""
Fix:
1. 'by' meaning 7 example 'учайно' -> 'случайно' (and remove false 'жаргон' register)
2. 'by' meaning 3 example 'написаназнаменитым' -> 'написана знаменитым'
3. 'by' meaning 6 'тж.' -> 'также'
4. All spaced reflexive postfixes: 'портить (-ся)' -> 'портить(ся)', ' (-сь)' -> '(сь)', etc.
5. 'твор. падежом' -> 'творительным падежом'
6. Trailing 'тж.' in bleed
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

SPACED_POSTFIX_REPAIRS = [
    (r'([а-яёА-ЯЁ]+)\s+\(-ся\)', r'\1(ся)'),
    (r'([а-яёА-ЯЁ]+)\s+\(-сь\)', r'\1(сь)'),
    (r'([а-яёА-ЯЁ]+)\s+\(-тся\)', r'\1(тся)'),
    (r'([а-яёА-ЯЁ]+)\s+\(-ться\)', r'\1(ться)')
]

for item in data:
    w = item['word']
    
    # 1. Clean 'by'
    if w == 'by':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                for ex in m.get('examples', []):
                    ex['ru'] = ex['ru'].replace('написаназнаменитым', 'написана знаменитым')
            elif m['id'] == 6:
                m['translation'] = m['translation'].replace('тж. творительным падежом', 'также творительным падежом')
            elif m['id'] == 7:
                for ex in m.get('examples', []):
                    if ex.get('en') == 'by chance':
                        ex['ru'] = 'случайно'
                        ex['register'] = []
                        
    elif w == 'bleed':
        for m in item.get('meanings', []):
            if m['id'] == 8:
                m['translation'] = 'обрезать страницу в край (не оставляя полей)'

    # Clean meanings
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for pat, repl in SPACED_POSTFIX_REPAIRS:
            t = re.sub(pat, repl, t)
        t = t.replace('твор. падежом', 'творительным падежом')
        t = t.replace('передаётся тж.', 'передаётся также')
        m['translation'] = t
        
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in SPACED_POSTFIX_REPAIRS:
                ru = re.sub(pat, repl, ru)
            ru = ru.replace('твор. падежом', 'творительным падежом')
            ex['ru'] = ru

    # Clean phrases
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for pat, repl in SPACED_POSTFIX_REPAIRS:
            t = re.sub(pat, repl, t)
        t = t.replace('твор. падежом', 'творительным падежом')
        t = t.replace('передаётся тж.', 'передаётся также')
        p['translation'] = t
        
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in SPACED_POSTFIX_REPAIRS:
                ru = re.sub(pat, repl, ru)
            ru = ru.replace('твор. падежом', 'творительным падежом')
            ex['ru'] = ru

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully fixed by and spaced reflexive postfixes!")
