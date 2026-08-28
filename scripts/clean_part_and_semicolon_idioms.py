# -*- coding: utf-8 -*-
"""
Extract idioms separated by semicolons like:
'роль; to play (или to act) a part; играть роль; притворяться'
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
        
        # Pattern: Russian ; English idiom ; Russian translation
        # e.g., 'роль; to play (или to act) a part; играть роль; притворяться'
        # or 'состояние боевой готовности; on the alert; быть настороже, наготове'
        m_idiom = re.search(r'^(.*?);\s*([a-zA-Z\s\',/()-]{3,})\s*;\s*([\u0400-\u04FF].*)$', t)
        if m_idiom:
            pure_ru = m_idiom.group(1).strip(' ;:,-')
            en_phr = m_idiom.group(2).strip(' ;:,-')
            ru_phr = m_idiom.group(3).strip(' ;:,-')
            
            # Ensure pure_ru is Russian
            if re.search(r'[\u0400-\u04FF]', pure_ru) and not re.match(r'^(?:past\s+)?p\.\s*p\.', en_phr):
                m['translation'] = pure_ru
                if 'examples' not in m:
                    m['examples'] = []
                m['examples'].append({
                    "en": en_phr,
                    "ru": ru_phr,
                    "register": []
                })
                count += 1
                
        # Also handle pattern without semicolon between en and ru:
        # e.g., 'поручитель; to grant bail выпустить на поруки'
        m_idiom2 = re.search(r'^(.*?);\s*(\b(?:to\s+[a-zA-Z\s\',/()-]+|[a-zA-Z\s\',/()-]{4,}))\s+([\u0400-\u04FF].*)$', m['translation'])
        if m_idiom2:
            pure_ru = m_idiom2.group(1).strip(' ;:,-')
            en_phr = m_idiom2.group(2).strip(' ;:,-')
            ru_phr = m_idiom2.group(3).strip(' ;:,-')
            if re.search(r'[\u0400-\u04FF]', pure_ru) and len(en_phr) >= 3 and len(ru_phr) >= 3 and not re.match(r'^(?:past\s+)?p\.\s*p\.', en_phr):
                m['translation'] = pure_ru
                if 'examples' not in m:
                    m['examples'] = []
                m['examples'].append({
                    "en": en_phr,
                    "ru": ru_phr,
                    "register": []
                })
                count += 1

print(f"Extracted {count} semicolon-separated idioms into examples!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Synced with src/data/oxford_5000.json successfully!")
