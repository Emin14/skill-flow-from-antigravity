# -*- coding: utf-8 -*-
"""
Audit and identify all Russian words mutilated by overly aggressive abbreviation strippers.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Patterns of broken Russian syntax
broken_patterns = [
    r'\bиз\s+в\s+а\b',           # из [уст] в [уст]а
    r'\bиз\s+в\s+уста\b',
    r'\bиз\s+уст\s+в\s+а\b',
    r'\bаться\s+',               # [собир]аться
    r'\bаясь\s+',                # [собир]аясь
    r'\bание\s+',                # [собир]ание
    r'\bпунктуа\b',              # пунктуа[ция]
    r'\bв\s+е\b',                # в [банк]е
    r'\bпо\s+,\b',               # по [радио],
    r'\bпо\s+и\s+телевидению\b', # по [радио] и телевидению
    r'\bв\s+е\s+и\b',
    r'\b\s[а-я]\s[а-я]\s',       # isolated single letters
]

mutilated_cases = []

for item in oxford_data:
    w = item['word']
    for m in item['meanings']:
        tr = m.get('translation', '')
        for pat in broken_patterns:
            if re.search(pat, tr):
                mutilated_cases.append((w, f"m:{m['id']}", tr))
                break
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        for pat in broken_patterns:
            if re.search(pat, tr):
                mutilated_cases.append((w, f"p:{p['id']}", tr))
                break

print(f"Total mutilated cases found: {len(mutilated_cases)}")
for w, mid, tr in mutilated_cases:
    print(f"  {w} [{mid}]: '{tr}'")
