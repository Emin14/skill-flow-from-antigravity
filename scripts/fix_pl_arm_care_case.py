# -*- coding: utf-8 -*-
"""
Fix raw pl markers in arm, care, case.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'arm':
        for m in item['meanings']:
            if m['id'] == 6:
                m['translation'] = 'обыкн. при англ. мн. ч.: оружие'
    elif item['word'] == 'care':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'тревога, беспокойство; при англ. мн. ч.: заботы, тяготы'
    elif item['word'] == 'case':
        for m in item['meanings']:
            if m['id'] == 4:
                m['translation'] = 'судебное дело; прецедент; при англ. мн. ч.: судебная практика'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed pl markers in arm, care, case successfully!")
