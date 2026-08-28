# -*- coding: utf-8 -*-
import json, os, sys, re

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    if w == 'pad':
        for m in item['meanings']:
            if m['id'] == 13:
                m['translation'] = 'перегружать пустыми словами, излишними подробностями (рассказ, речь и т. п.)'
    elif w == 'proceed':
        for m in item['meanings']:
            if m['id'] == 2:
                m['translation'] = 'возобновлять (дело, игру и т. п.)'
    elif w == 'return':
        for m in item['meanings']:
            if m['id'] == 2:
                m['translation'] = 'отдача, возврат; возмещение; в обмен'
    elif w == 'review':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'смотр; парад'
    elif w == 'see':
        for m in item['meanings']:
            if m['id'] == 12:
                m['translation'] = 'подумать, размыслить; позвольте, постойте'
    elif w == 'speed':
        for m in item['meanings']:
            if m['id'] == 7:
                m['translation'] = 'ускорять (особенно)'
    elif w == 'top':
        for m in item['meanings']:
            if m['id'] == 18:
                m['translation'] = 'обрезать верхушку (дерева и т. п.)'
    elif w == 'true':
        for m in item['meanings']:
            if m['id'] == 4:
                m['translation'] = 'точный (об изображении, копии и т. п.)'
    elif w == 'tune':
        for m in item['meanings']:
            if m['id'] == 6:
                m['translation'] = 'налаживать, регулировать (машину и т. п.)'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Cleaned the final 9 items!")
