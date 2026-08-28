# -*- coding: utf-8 -*-
"""
Find all occurrences of grammatical headers and POS markers mashed in translations:
e.g., '(сравн. ст. от late) 1. a ...', '1. a ', '2. adv ', '1. v ', '2. n ', etc.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find matching patterns
matches = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        # Pattern 1: (сравн. ст. от...) or (превосх. ст. от...) or (past...)
        if re.search(r'\((?:сравн\.|превосх\.|past|p\.\s*p\.|pres\.)\s*[^)]*\)', t):
            matches.append((w, 'meaning', m['id'], t, m.get('partOfSpeech')))
            
        # Pattern 2: Mashed OCR section headers like '1. a ', '2. adv ', '1. n ', '2. v ', '3. a '
        elif re.search(r'\b[1-9]\.\s*(?:a|adv|n|v|prep|conj|pron|num|int)\b', t):
            matches.append((w, 'meaning', m['id'], t, m.get('partOfSpeech')))
            
        # Pattern 3: Stray letters from POS like ' 1. a ' or '^a '
        elif re.search(r'^[1-9]\.\s*[a-z]\s+', t) or re.search(r';\s*[1-9]\.\s*[a-z]\s+', t):
            matches.append((w, 'meaning', m['id'], t, m.get('partOfSpeech')))

print(f"Found {len(matches)} occurrences of mashed grammatical headers / OCR POS markers:\n")
for w, kind, id_, t, pos in matches[:35]:
    print(f"[{w}] (id {id_}, pos={pos}): '{t}'")
