# -*- coding: utf-8 -*-
"""
Scan for embedded English examples inside translation strings across all 4980 words.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

embedded_examples = []

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        # Detect embedded English examples: contains tilde '~', or English words of 3+ letters followed by Russian translation
        # e.g. "the train left (или jumped) the ~s", "to ~ smb.", "in ~", "fair ~ попутный ветер"
        if '~' in tr or re.search(r'\b[a-zA-Z]{2,}\s+[a-zA-Z]{2,}', tr):
            embedded_examples.append((w, 'meaning', m['id'], tr))
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if '~' in tr or re.search(r'\b[a-zA-Z]{2,}\s+[a-zA-Z]{2,}', tr):
            embedded_examples.append((w, 'phrase', p['id'], tr))

print(f"Total entries with embedded English examples inside translation: {len(embedded_examples)}")
for it in embedded_examples[:25]:
    print(f"Word '{it[0]}' [{it[1]} {it[2]}]: '{it[3]}'")
