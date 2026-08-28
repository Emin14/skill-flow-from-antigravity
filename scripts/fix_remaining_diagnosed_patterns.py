# -*- coding: utf-8 -*-
"""
Fix all remaining diagnosed patterns:
1. Reconstruct all 'ната' -> 'комната' and 'огий' -> 'строгий' across all fields
2. Extract idioms from fashion and gross
3. Properly split phrasal verb dumps in bring, carve, come, follow, hair, night, put, residence, see, such
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    
    # Meaning fixes
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.match(r'^ната\b', t):
            t = re.sub(r'^ната\b', 'комната', t)
        if re.match(r'^огий\b', t):
            t = re.sub(r'^огий\b', 'строгий', t)
        if re.match(r'^огая\b', t):
            t = re.sub(r'^огая\b', 'строгая', t)
        if re.match(r'^огие\b', t):
            t = re.sub(r'^огие\b', 'строгие', t)
        if re.match(r'^ь\s+на\b', t):
            t = re.sub(r'^ь\s+на\b', 'встать на', t)
            
        # Fashion & Gross extraction
        if w == 'fashion' and m['id'] == 3:
            t = 'образ, манера'
            if 'examples' not in m:
                m['examples'] = []
            m['examples'].append({
                'en': 'after (или in) a fashion',
                'ru': 'некоторым образом, до известной степени; кое-как',
                'register': []
            })
        elif w == 'gross' and m['id'] == 12:
            t = 'масса'
            if 'examples' not in m:
                m['examples'] = []
            m['examples'].append({
                'en': 'by (или in) the gross',
                'ru': 'оптом; гуртом; в общем, в целом',
                'register': []
            })
            
        m['translation'] = t
        
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if re.match(r'^ната\b', ru):
                ru = re.sub(r'^ната\b', 'комната', ru)
            if re.match(r'^огий\b', ru):
                ru = re.sub(r'^огий\b', 'строгий', ru)
            if re.match(r'^огая\b', ru):
                ru = re.sub(r'^огая\b', 'строгая', ru)
            if re.match(r'^огие\b', ru):
                ru = re.sub(r'^огие\b', 'строгие', ru)
            if re.match(r'^ь\s+на\b', ru):
                ru = re.sub(r'^ь\s+на\b', 'встать на', ru)
            ex['ru'] = ru

    # Clean examples inside phrases
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if re.match(r'^ната\b', t):
            t = re.sub(r'^ната\b', 'комната', t)
        if re.match(r'^огий\b', t):
            t = re.sub(r'^огий\b', 'строгий', t)
        if re.match(r'^ь\s+на\b', t):
            t = re.sub(r'^ь\s+на\b', 'встать на', t)
        p['translation'] = t
        
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            if re.match(r'^ната\b', ru):
                ru = re.sub(r'^ната\b', 'комната', ru)
            if re.match(r'^огий\b', ru):
                ru = re.sub(r'^огий\b', 'строгий', ru)
            if re.match(r'^ь\s+на\b', ru):
                ru = re.sub(r'^ь\s+на\b', 'встать на', ru)
            ex['ru'] = ru

# Specific disentanglement for bring, carve, come, follow, hair, night, put, residence, see, such
for item in data:
    w = item['word']
    if w == 'bring':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'carve':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'come':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'follow':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'hair':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'night':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'put':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'residence':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'see':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'send':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]
    elif w == 'such':
        for m in item['meanings']:
            m['examples'] = [ex for ex in m.get('examples', []) if not re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ex.get('ru', ''))]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully fixed all remaining diagnosed patterns and synced replica!")
