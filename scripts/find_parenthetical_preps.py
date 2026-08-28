# -*- coding: utf-8 -*-
"""
Find all parenthetical English prepositions like '(закон; against)', '(кого-л.; to)', etc.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

ENGLISH_PREPS = ['against', 'with', 'for', 'to', 'in', 'of', 'on', 'from', 'about', 'into', 'upon', 'by', 'at', 'after', 'before', 'over', 'under', 'between', 'among', 'through', 'toward', 'towards']

candidates = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        # Match parenthetical prepositions mixed with Russian: e.g. (закон; against), (to — кого-л.), (кого-л.; of), (кого-л.; for)
        for prep in ENGLISH_PREPS:
            # Pattern: (Russian; prep) or (prep — Russian) or (prep - Russian)
            pat = r'\([^\)]*?[\u0400-\u04FF][^\)]*?[;—\-]\s*' + prep + r'\b[^\)]*?\)'
            pat2 = r'\([^\)]*?\b' + prep + r'\b\s*[;—\-]\s*[^\)]*?[\u0400-\u04FF][^\)]*?\)'
            if re.search(pat, t) or re.search(pat2, t):
                candidates.append((w, 'meaning', m['id'], t, prep))
                break

print(f"Found {len(candidates)} mixed preposition parentheses in dataset:\n")
for w, kind, id_, t, prep in candidates[:30]:
    print(f"[{w}] (id {id_}): '{t}'")
