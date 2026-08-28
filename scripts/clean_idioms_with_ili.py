# -*- coding: utf-8 -*-
"""
Handle idioms with Russian conjunctions inside like '(или to act)'
e.g. 'роль; to play (или to act) a part; играть роль; притворяться'
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # Match pattern: Russian ; to ... [English + (или ...)] ; Russian
        m_idiom = re.search(r'^(.*?);\s*(\bto\s+[a-zA-Z\s\',/()-]+(?:\(или\s+[a-zA-Z\s\',/()-]+\)[a-zA-Z\s\',/()-]*)*)\s*;\s*([\u0400-\u04FF].*)$', t)
        if m_idiom:
            pure_ru = m_idiom.group(1).strip(' ;:,-')
            en_phr = m_idiom.group(2).strip(' ;:,-')
            ru_phr = m_idiom.group(3).strip(' ;:,-')
            
            m['translation'] = pure_ru
            if 'examples' not in m:
                m['examples'] = []
            m['examples'].append({
                "en": en_phr,
                "ru": ru_phr,
                "register": []
            })
            count += 1
            
        # Also match: Russian ; to ... Russian
        m_idiom2 = re.search(r'^(.*?);\s*(\bto\s+[a-zA-Z\s\',/()-]+(?:\(или\s+[a-zA-Z\s\',/()-]+\)[a-zA-Z\s\',/()-]*)*)\s+([\u0400-\u04FF].*)$', m['translation'])
        if m_idiom2:
            pure_ru = m_idiom2.group(1).strip(' ;:,-')
            en_phr = m_idiom2.group(2).strip(' ;:,-')
            ru_phr = m_idiom2.group(3).strip(' ;:,-')
            
            m['translation'] = pure_ru
            if 'examples' not in m:
                m['examples'] = []
            m['examples'].append({
                "en": en_phr,
                "ru": ru_phr,
                "register": []
            })
            count += 1

print(f"Extracted {count} idioms with '(или ...)' into examples!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Synced with src/data/oxford_5000.json successfully!")
