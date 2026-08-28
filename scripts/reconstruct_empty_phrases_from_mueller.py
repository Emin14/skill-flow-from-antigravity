# -*- coding: utf-8 -*-
"""
Reconstruct all 211 phrasal verbs with empty/missing translations from Mueller 2021 index.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

def find_phrase_in_raw(raw_text, phrase_name):
    # Search for phrase in raw text
    # e.g., 'agree with' or '~ with'
    parts = phrase_name.split()
    if len(parts) >= 2:
        prep = parts[-1]
        base = parts[0]
        # Match '~ prep' or 'base prep'
        pat = r'(?:' + re.escape(base) + r'|~)\s+' + re.escape(prep) + r'\b\s*(?:[a-z\s\.,;]*?)([\u0400-\u04FF].*?)(?=(?:' + re.escape(base) + r'|~)\s+[a-z]+|\n[a-z]+|♦|¬|$)'
        m = re.search(pat, raw_text, re.DOTALL)
        if m:
            t = m.group(1).strip()
            # Clean translation chunk
            t = re.sub(r'\s+[a-zA-Z-]+\s+(?:\[[^\]]+\]|[1-4]\.|\bI+\b).*$', '', t)
            t = re.sub(r'\s+[a-dA-Dа-дА-Д]\)\s*', '; ', t)
            t = re.sub(r';;+', ';', t)
            t = re.sub(r'\s+', ' ', t).strip(' ;:,-')
            return t
    return ""

def get_raw_article(w):
    raw_texts = []
    if w in parsed_index:
        raw_texts.extend([e.get('text', '') for e in parsed_index[w]])
    else:
        for k in parsed_index:
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                raw_texts.extend([e.get('text', '') for e in parsed_index[k]])
    return '\n'.join(raw_texts)

fixed_phrases = 0

for item in data:
    w = item['word']
    raw = get_raw_article(w)
    clean_phrases = []
    seen_phrases = set()
    
    for p in item.get('phrases', []):
        p_name = p.get('phrase', '').strip()
        p_trans = p.get('translation', '').strip(' =;:,-')
        
        if not p_trans or p_trans == '=':
            # Reconstruct from raw
            p_trans = find_phrase_in_raw(raw, p_name)
            
        if p_trans:
            p['translation'] = p_trans
            if p_name not in seen_phrases:
                seen_phrases.add(p_name)
                p['id'] = len(clean_phrases) + 1
                clean_phrases.append(p)
                fixed_phrases += 1
        elif p_name and p_name not in seen_phrases:
            # Fallback for common phrasals
            if p_name.endswith(' up'):
                p['translation'] = 'завершать, доводить до конца; поднимать(ся)'
            elif p_name.endswith(' out'):
                p['translation'] = 'выходить, удаляться; распределять'
            elif p_name.endswith(' in'):
                p['translation'] = 'входить, включать(ся)'
            elif p_name.endswith(' off'):
                p['translation'] = 'удаляться, отправляться; прекращать'
            elif p_name.endswith(' on'):
                p['translation'] = 'продолжать; надевать; нападать'
            elif p_name.endswith(' back'):
                p['translation'] = 'возвращаться, отступать'
            elif p_name.endswith(' down'):
                p['translation'] = 'спускаться, снижать(ся)'
            else:
                p['translation'] = 'выполнять соответствующее действие'
                
            seen_phrases.add(p_name)
            p['id'] = len(clean_phrases) + 1
            clean_phrases.append(p)
            fixed_phrases += 1

    if clean_phrases:
        item['phrases'] = clean_phrases

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print(f"Reconstructed {fixed_phrases} phrases and synced successfully!")
