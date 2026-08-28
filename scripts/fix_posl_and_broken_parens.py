# -*- coding: utf-8 -*-
"""
Fix:
1. All 13 proverb entries (extract 'посл.' to register: ["пословица"] and clean translation)
2. All broken/unbalanced parenthetical text errors (late, abandon, absolute, action, active, adhere, appeal, application, ask, authority, etc.)
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    
    # 1. Clean 'посл.' from phrases and meanings
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if re.search(r'\bпосл\.\s*', t):
            t = re.sub(r'^\s*посл\.\s*(?:=\s*)?', '', t)
            t = re.sub(r'\s*посл\.\s*(?:=\s*)?', '', t)
            t = re.sub(r'^\s*s\s+', '', t) # clean stray 's' in sun
            p['translation'] = t.strip(' ;:,-')
            if 'пословица' not in p.get('register', []):
                p['register'].append('пословица')
                
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\bпосл\.\s*', t):
            t = re.sub(r'^\s*посл\.\s*(?:=\s*)?', '', t)
            t = re.sub(r'\s*посл\.\s*(?:=\s*)?', '', t)
            m['translation'] = t.strip(' ;:,-')
            if 'пословица' not in m.get('register', []):
                m['register'].append('пословица')
                
    # 2. Specific repairs for broken parentheses & brackets
    if w == 'late':
        for m in item.get('meanings', []):
            for ex in m.get('examples', []):
                if 'бывший)' in ex.get('ru', ''):
                    ex['ru'] = ex['ru'].replace('покойный бывший) президент', 'покойный (бывший) президент')
                    
    elif w == 'abandon':
        clean_meanings = []
        for m in item.get('meanings', []):
            if m.get('translation') == 'to)':
                continue
            for ex in m.get('examples', []):
                if ex.get('ru') == 'предаваться (страсти, отчаянию и т.п.':
                    ex['ru'] = 'предаваться (страсти, отчаянию и т. п.)'
            m['id'] = len(clean_meanings) + 1
            clean_meanings.append(m)
        item['meanings'] = clean_meanings
        
    elif w == 'absolute':
        for m in item.get('meanings', []):
            if 'подсудимого, заключённого)' in m.get('translation', ''):
                m['translation'] = 'полный; безусловный, неограниченный'
            for ex in m.get('examples', []):
                if ex.get('ru') == 'полное освобождение (от должности':
                    ex['ru'] = 'полное освобождение (от должности, обязанностей)'
                    
    elif w in ['action', 'active']:
        clean_meanings = []
        for m in item.get('meanings', []):
            if m.get('translation') in [']', '[', '']:
                continue
            m['id'] = len(clean_meanings) + 1
            clean_meanings.append(m)
        item['meanings'] = clean_meanings
        
    elif w == 'adhere':
        for m in item.get('meanings', []):
            if m.get('translation') == 'твёрдо держаться, придерживаться (чего-либо':
                m['translation'] = 'твёрдо держаться, придерживаться (чего-либо)'
                
    elif w == 'appeal':
        for m in item.get('meanings', []):
            if m.get('translation') == 'просьба, мольба (for —':
                m['translation'] = 'просьба, мольба (for — о чём-либо)'
            elif m.get('translation') == 'апеллировать, обращаться, прибегать, взывать (to —':
                m['translation'] = 'апеллировать, обращаться, прибегать, взывать (to — к кому-либо)'
                
    elif w == 'application':
        clean_phrases = []
        for p in item.get('phrases', []):
            if p.get('translation') == 'work)':
                continue
            p['id'] = len(clean_phrases) + 1
            clean_phrases.append(p)
        item['phrases'] = clean_phrases
        
    elif w == 'ask':
        for m in item.get('meanings', []):
            if m.get('translation') == 'приглашать (разг. тж.':
                m['translation'] = 'приглашать (разговорное)'
                
    elif w == 'authority':
        for m in item.get('meanings', []):
            if 'обыкн. при англ. мн. ч.: the authorities)' in m.get('translation', ''):
                m['translation'] = 'власти (обыкн. the authorities)'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully fixed proverbs and unbalanced parentheses!")
