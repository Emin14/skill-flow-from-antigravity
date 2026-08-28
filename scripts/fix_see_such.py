# -*- coding: utf-8 -*-
import json, os, sys, re

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    if w == 'see':
        for m in item['meanings']:
            clean_ex = []
            for ex in m.get('examples', []):
                if not re.search(r'\b1\)\s*.*?\b2\)\s*', ex.get('ru', '')) and not re.search(r'\b2\)\s*.*?\b3\)\s*', ex.get('ru', '')):
                    clean_ex.append(ex)
            m['examples'] = clean_ex
    elif w == 'such':
        for m in item['meanings']:
            clean_ex = []
            for ex in m.get('examples', []):
                if not re.search(r'\b1\)\s*.*?\b2\)\s*', ex.get('ru', '')) and not re.search(r'\b2\)\s*.*?\b3\)\s*', ex.get('ru', '')):
                    clean_ex.append(ex)
            m['examples'] = clean_ex

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Cleaned see and such!")
