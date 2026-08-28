# -*- coding: utf-8 -*-
"""
Clean and repair all meanings anomalies:
1. Fix 'ушатель' -> 'слушатель' (listener) and 'ушать' -> 'слушать' (follow)
2. Filter out garbage single-character meanings (']', '[', 'и', '=', '')
3. Clean dangling incomplete parenthetical tails: '(обыкн.', '(также', '(тж.', '(напр.', '(bet', '(blew', etc.
4. Close unclosed valid parentheses: '(лошадь к поводьям' -> '(лошадь к поводьям)', etc.
5. Re-index meanings cleanly.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Trailing incomplete parenthesis removals
TRAILING_INCOMPLETE_PARENS = [
    r'\s*\(\s*(?:обыкн|также|тж|напр|часто|см|редк|прост)\.?\s*$',
    r'\s*;\s*(?:обыкн|также|тж|напр|часто|см|редк|прост)\.?\s*$',
    r'\s*,\s*(?:обыкн|также|тж|напр|часто|см|редк|прост)\.?\s*$',
    r'\s*\(\s*(?:bet|blew|past|pres)\s*$',
    r'\s*;\s*to\s*$',
    r'\s*;\s*at\s*—\s*$',
    r'\s*;\s*on\s*—\s*$',
    r'\s*;\s*to\s*—\s*$',
    r'\s*;\s*for\s*—\s*$',
    r'\s*;\s*with\s*—\s*$',
    r'\s*\(\s*$'
]

def clean_meaning_text(t):
    # 1. Specific repairs
    t = re.sub(r'\bушатель\b', 'слушатель', t)
    t = re.sub(r'\bушать\b', 'слушать', t)
    
    # 2. Incomplete parenthetical tails
    for pat in TRAILING_INCOMPLETE_PARENS:
        t = re.sub(pat, '', t)
        
    # 3. Fix unclosed parentheses at the end of definitions
    # e.g., 'приучать (лошадь к поводьям' -> 'приучать (лошадь к поводьям)'
    if t.count('(') > t.count(')'):
        # Find last open paren that has Russian words inside and no closing paren
        if re.search(r'\([^\)]*[\u0400-\u04FF\w\s,;=\'-]+$', t):
            t = t + ')'
            
    # 4. Clean trailing punctuation
    t = re.sub(r'[,;:\-—]\s*$', '', t)
    t = re.sub(r'\s+', ' ', t).strip(' ;:,-')
    return t

for item in data:
    w = item['word']
    
    clean_meanings = []
    seen = set()
    
    for m in item.get('meanings', []):
        t = m.get('translation', '').strip()
        pos = m.get('partOfSpeech', '')
        
        # Skip garbage single character meanings
        if t in [']', '[', 'и', '=', '', 'а', 'в']:
            continue
            
        # Clean text
        t = clean_meaning_text(t)
        
        # Skip empty after cleaning
        if not t or t in [']', '[', 'и', '=']:
            continue
            
        # Deduplicate identical meaning within same POS if trivial
        key = (pos, t.lower())
        if key in seen and len(t) < 30:
            continue
        seen.add(key)
        
        m['translation'] = t
        m['id'] = len(clean_meanings) + 1
        clean_meanings.append(m)
        
    item['meanings'] = clean_meanings

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully cleaned all meanings anomalies and synced files!")
