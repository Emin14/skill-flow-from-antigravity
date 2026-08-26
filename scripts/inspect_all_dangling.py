# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

dangling_list = []

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if tr.count('(') != tr.count(')') or tr.count('[') != tr.count(']'):
            dangling_list.append((w, 'm_tr', m['id'], tr))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if ru.count('(') != ru.count(')') or ru.count('[') != ru.count(']'):
                dangling_list.append((w, 'ex_ru', m['id'], ru))
    for p in item.get('phrases', []):
        ru = p.get('ru', '')
        if ru.count('(') != ru.count(')') or ru.count('[') != ru.count(']'):
            dangling_list.append((w, 'p_ru', None, ru))

print(f"Total dangling parentheses / bracket occurrences: {len(dangling_list)}")
for item in dangling_list:
    print(f"[{item[0]}] ({item[1]} {item[2]}): {repr(item[3])}")
