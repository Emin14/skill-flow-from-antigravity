# -*- coding: utf-8 -*-
import json, os, sys

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    if w == 'actual':
        for m in item['meanings']:
            if 'ав. истинная скорость' in m['translation']:
                m['translation'] = m['translation'].replace('; ав. истинная скорость', '')
                if 'examples' not in m:
                    m['examples'] = []
                m['examples'].append({
                    "en": "actual airspeed",
                    "ru": "истинная скорость",
                    "register": ["авиация"]
                })
    elif w == 'drift':
        for m in item['meanings']:
            if 'ав. девиация' in m['translation']:
                m['translation'] = 'дрейф; девиация, снос; скорость сноса'
                if 'авиация' not in m.get('register', []):
                    m['register'].append('авиация')
    elif w == 'emergency':
        for m in item['meanings']:
            for ex in m.get('examples', []):
                if 'ав. аварийный паёк' in ex.get('ru', ''):
                    ex['ru'] = ex['ru'].replace('ав. ', '')
                    if 'авиация' not in ex.get('register', []):
                        ex['register'].append('авиация')
    elif w == 'solo':
        for m in item['meanings']:
            if 'ав. самостоятельный' in m['translation']:
                m['translation'] = 'в роли определения: самостоятельный (о полёте без инструктора или механика)'
                if 'авиация' not in m.get('register', []):
                    m['register'].append('авиация')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Cleaned aviation tags!")
