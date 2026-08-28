# -*- coding: utf-8 -*-
import json, os, sys, re

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for wd in re.findall(r'[а-яёА-ЯЁ]+', t):
            wd_l = wd.lower()
            if wd_l in ['аболетучий', 'абый', 'абость', 'едующий', 'анавливать', 'ановка', 'ремлять', 'ремиться', 'ройство', 'упать', 'ойчивый', 'ное', 'ный', 'ная', 'ское', 'ский', 'ская']:
                print(f"[{w}] (id {m['id']}): word='{wd}' in '{t}'")
