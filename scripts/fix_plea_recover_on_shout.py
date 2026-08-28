# -*- coding: utf-8 -*-
import json, os, sys

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    if w == 'plea':
        for m in item['meanings']:
            if m['translation'] == 'посуду':
                m['translation'] = 'возражение по иску; ответ по суду'
    elif w == 'recover':
        for m in item['meanings']:
            if 'посуду' in m['translation']:
                m['translation'] = m['translation'].replace('посуду', 'по суду')
    elif w == 'on':
        for m in item['meanings']:
            if 'какому-л.' in m['translation']:
                m['translation'] = m['translation'].replace('какому-л.', 'какому-либо')
    elif w == 'shout':
        for m in item['meanings']:
            if 'чья-л.' in m['translation']:
                m['translation'] = m['translation'].replace('чья-л.', 'чья-либо')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Cleaned plea, recover, on, and shout!")
