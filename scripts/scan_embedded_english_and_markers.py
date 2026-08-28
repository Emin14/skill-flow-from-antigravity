# -*- coding: utf-8 -*-
"""
Scan for:
1. Embedded English idioms/phrases inside 'translation' fields
2. Embedded English prepositions in parentheses (e.g. '(against)', '(of)', '(for)')
3. Leftover lettered markers like 'a)', 'b)', 'а)', 'б)'
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Class 1: Embedded English phrases inside translation
# (strings containing English verbs or phrases with English alphabet followed by Russian or marker)
embedded_english = []

# Class 2: English prepositions in parentheses
prep_in_parens = []

# Class 3: Lettered sub-point markers: a), b), c), а), б), в)
letter_markers = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # Check Class 1: English phrase starting with 'to [a-z]+' or multi-word English inside translation
        # e.g., 'роль; to play (или to act) a part a) играть роль...'
        if re.search(r'\bto\s+[a-z]+(?:\s+[a-z]+)*\b', t) or re.search(r'[a-zA-Z]{2,}\s+[a-zA-Z]{2,}\s+[a-zA-Z]{2,}', t):
            # Exclude standard Latin abbreviations like 'p. p.', 'pres. p.'
            if not re.match(r'^(?:past\s+)?(?:и\s+)?p\.\s*p\.\s+от\b', t):
                embedded_english.append((w, 'meaning', m['id'], t))
                
        # Check Class 2: English prepositions in parentheses: (against), (for), (to), (in), (with), (of), (on), (from), (about)
        if re.search(r'\((?:[a-zA-Z\s,;/-]*\b(?:against|with|for|to|in|of|on|from|about|into|upon|by|at)\b[a-zA-Z\s,;/-]*)\)', t):
            prep_in_parens.append((w, 'meaning', m['id'], t))
            
        # Check Class 3: Letter markers: a), b), c), а), б), в), г), д)
        if re.search(r'(?:^|\s|[;:,])(?:[a-dA-Dа-дА-Д]\))\s*', t):
            letter_markers.append((w, 'meaning', m['id'], t))

print(f"Class 1 (Embedded English phrases inside translation): {len(embedded_english)} occurrences")
print(f"Class 2 (English prepositions in parentheses): {len(prep_in_parens)} occurrences")
print(f"Class 3 (Lettered markers like 'a)', 'а)'): {len(letter_markers)} occurrences")

print("\n--- SAMPLE CLASS 1 (Embedded English Phrases) ---")
for w, kind, id_, t in embedded_english[:15]:
    print(f"[{w}] (id {id_}): '{t}'")

print("\n--- SAMPLE CLASS 2 (Prepositions in Parentheses) ---")
for w, kind, id_, t in prep_in_parens[:15]:
    print(f"[{w}] (id {id_}): '{t}'")

print("\n--- SAMPLE CLASS 3 (Lettered Markers) ---")
for w, kind, id_, t in letter_markers[:15]:
    print(f"[{w}] (id {id_}): '{t}'")
