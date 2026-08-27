# -*- coding: utf-8 -*-
"""
Fix 3 specific examples with empty ru.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    w = item['word']
    if w == 'hit':
        for m in item['meanings']:
            if m['id'] == 1:
                for e in m['examples']:
                    if e.get('en') == 'to hit the drink':
                        e['ru'] = '1) сесть на воду; 2) упасть в море'
                        e['register'] = ['жаргон']
    elif w == 'picture':
        for m in item['meanings']:
            if m['id'] == 6:
                for e in m['examples']:
                    if 'pictures' in e.get('en', ''):
                        e['ru'] = 'кинофильм, кино'
    elif w == 'pole':
        for m in item['meanings']:
            if m['id'] == 1:
                for e in m['examples']:
                    if e.get('en') == 'up the pole':
                        e['ru'] = 'в затруднительном положении; ошарашенный'
                        e['register'] = ['сленг']

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed 3 specific examples successfully!")
