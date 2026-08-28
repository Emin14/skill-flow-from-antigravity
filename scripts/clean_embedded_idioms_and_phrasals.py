# -*- coding: utf-8 -*-
"""
Extract embedded English idioms from 'translation' into 'examples' or 'phrases'
and clean all definitions and letter markers.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

PHRASAL_VERB_ROOTS = [
    'about', 'across', 'after', 'against', 'ahead', 'along', 'apart', 'around',
    'aside', 'away', 'back', 'before', 'behind', 'below', 'by', 'down', 'for',
    'forth', 'forward', 'in', 'into', 'off', 'on', 'out', 'over', 'round',
    'through', 'to', 'together', 'under', 'up', 'upon', 'with', 'without'
]

def split_embedded_phrases(item):
    w = item['word']
    changed = False
    
    # 1. Clean meanings
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # Check if t contains phrasal verb dump: e.g. "pass away...", "pay away...", "farm out..."
        phr_match = re.search(r'\b(?:' + re.escape(w) + r')\s+(?:' + '|'.join(PHRASAL_VERB_ROOTS) + r')\b', t)
        if phr_match and phr_match.start() > 0:
            pure_t = t[:phr_match.start()].strip(' ;:,-')
            phr_chunk = t[phr_match.start():]
            
            # Parse phr_chunk into phrases
            phr_items = re.split(r'\b(' + re.escape(w) + r'\s+(?:' + '|'.join(PHRASAL_VERB_ROOTS) + r'))\b', phr_chunk)
            # Add to phrases array
            if 'phrases' not in item:
                item['phrases'] = []
            
            for idx in range(1, len(phr_items), 2):
                p_name = phr_items[idx].strip()
                p_trans = phr_items[idx+1].strip(' ;:,-') if idx + 1 < len(phr_items) else ''
                p_trans = re.sub(r'\s+[a-dA-Dа-дА-Д]\)\s*', '; ', p_trans)
                p_trans = re.sub(r';;+', ';', p_trans).strip(' ;:,-')
                
                if p_name and p_trans:
                    item['phrases'].append({
                        "id": len(item['phrases']) + 1,
                        "phrase": p_name,
                        "partOfSpeech": "verb",
                        "translation": p_trans,
                        "examples": [],
                        "register": []
                    })
            t = pure_t
            
        # Check if t contains embedded idiom like: "роль; to play (или to act) a part a) играть роль; притворяться"
        # or "(to be) on the alert (быть) настороже, наготове"
        # Match pattern: "; [English text] [Russian text]"
        idiom_match = re.search(r';\s*(\b(?:to\s+[a-zA-Z\s\',/()-]+|[a-zA-Z\s\',/()-]+\b))\s+([\u0400-\u04FF].*)$', t)
        if idiom_match:
            pure_t = t[:idiom_match.start()].strip(' ;:,-')
            en_part = idiom_match.group(1).strip(' ;:,-')
            ru_part = idiom_match.group(2).strip(' ;:,-')
            ru_part = re.sub(r'^[a-dA-Dа-дА-Д]\)\s*', '', ru_part)
            ru_part = re.sub(r'\s+[a-dA-Dа-дА-Д]\)\s*', '; ', ru_part)
            ru_part = re.sub(r';;+', ';', ru_part).strip(' ;:,-')
            
            # Check if valid English idiom
            if len(en_part) >= 3 and len(ru_part) >= 3 and not re.match(r'^(?:past\s+)?p\.\s*p\.', en_part):
                if 'examples' not in m:
                    m['examples'] = []
                m['examples'].append({
                    "en": en_part,
                    "ru": ru_part,
                    "register": []
                })
                t = pure_t
                
        # Clean detached letter markers: "a) ...; b) ..." -> "; "
        t = re.sub(r'^[a-dA-Dа-дА-Д]\)\s*', '', t)
        t = re.sub(r'\s+[a-dA-Dа-дА-Д]\)\s*', '; ', t)
        t = re.sub(r';;+', ';', t)
        t = re.sub(r'\s+', ' ', t).strip(' ;:,-')
        
        if t != m.get('translation'):
            m['translation'] = t
            changed = True
            
    # Clean phrases
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        t = re.sub(r'^[a-dA-Dа-дА-Д]\)\s*', '', t)
        t = re.sub(r'\s+[a-dA-Dа-дА-Д]\)\s*', '; ', t)
        t = re.sub(r';;+', ';', t)
        t = re.sub(r'\s+', ' ', t).strip(' ;:,-')
        if t != p.get('translation'):
            p['translation'] = t
            changed = True
            
    # Re-index phrases id
    if 'phrases' in item and item['phrases']:
        for p_idx, p in enumerate(item['phrases'], 1):
            p['id'] = p_idx
            
    return changed

updated_words = 0
for item in data:
    if split_embedded_phrases(item):
        updated_words += 1

print(f"Successfully processed and cleaned {updated_words} words!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Synced with src/data/oxford_5000.json successfully!")
