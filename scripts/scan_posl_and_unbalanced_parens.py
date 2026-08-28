# -*- coding: utf-8 -*-
"""
Scan for:
1. 'посл.' / 'погов.' / 'пословица' register abbreviations in translations and examples
2. Unbalanced parentheses in translation and examples (e.g. 'покойный бывший) президент')
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Class 1: посл. / погов. in translations and examples
posl_candidates = []

# Class 2: Unbalanced parentheses
paren_issues = []

def check_parens(s):
    # Count ( and )
    # Ignore escaped or emoticons if any, but in dictionary it's standard text
    open_p = s.count('(')
    close_p = s.count(')')
    open_b = s.count('[')
    close_b = s.count(']')
    return open_p != close_p or open_b != close_b

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\b(?:посл|погов|цит)\.\s*', t):
            posl_candidates.append((w, 'meaning', m['id'], t))
            
        if check_parens(t):
            paren_issues.append((w, 'meaning', m['id'], t, t.count('('), t.count(')')))
            
        for ex_idx, ex in enumerate(m.get('examples', [])):
            ru = ex.get('ru', '')
            if re.search(r'\b(?:посл|погов|цит)\.\s*', ru):
                posl_candidates.append((w, 'meaning_ex', m['id'], ru))
            if check_parens(ru):
                paren_issues.append((w, f"meaning_{m['id']}_ex", ex_idx, ru, ru.count('('), ru.count(')')))
                
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if re.search(r'\b(?:посл|погов|цит)\.\s*', t):
            posl_candidates.append((w, 'phrase', p['id'], t))
        if check_parens(t):
            paren_issues.append((w, 'phrase', p['id'], t, t.count('('), t.count(')')))
            
        for ex_idx, ex in enumerate(p.get('examples', [])):
            ru = ex.get('ru', '')
            if re.search(r'\b(?:посл|погов|цит)\.\s*', ru):
                posl_candidates.append((w, 'phrase_ex', p['id'], ru))
            if check_parens(ru):
                paren_issues.append((w, f"phrase_{p['id']}_ex", ex_idx, ru, ru.count('('), ru.count(')')))

print(f"Class 1 (посл. / погов. / цит. candidates): {len(posl_candidates)}")
for c in posl_candidates:
    print(f"  [{c[0]}] ({c[1]} {c[2]}): '{c[3]}'")

print(f"\nClass 2 (Unbalanced parentheses): {len(paren_issues)}")
for c in paren_issues[:35]:
    print(f"  [{c[0]}] ({c[1]} {c[2]}): '({c[4]} vs {c[5]})' -> '{c[3]}'")
