# -*- coding: utf-8 -*-
"""
Filter true multi-POS words where the SAME headword has multiple POS sections.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

true_multipos = []
clean_single_pos = []

for item in oxford_data:
    w = item['word']
    raw_texts = []
    if w in parsed_index:
        raw_texts.extend([e.get('text', '') for e in parsed_index[w]])
    else:
        for k in parsed_index:
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                raw_texts.extend([e.get('text', '') for e in parsed_index[k]])
    
    combined_raw = '\n'.join(raw_texts)
    
    # We must only look at the section BEFORE any subsequent headword
    # Split by lines that start with a new headword (e.g. "affect [", "absent 1.")
    lines = combined_raw.split('\n')
    current_entry_lines = []
    first_line = True
    for l in lines:
        l_str = l.strip()
        # Check if line looks like a new headword (different from w)
        if not first_line and re.match(r'^[a-zA-Z-]+\s*(?:[1-4]\.|\bI+\b|\[)', l_str):
            hw = l_str.split()[0].lower().rstrip('1234')
            if hw != w and not hw.startswith(w):
                # New word started!
                break
        current_entry_lines.append(l)
        first_line = False
        
    entry_text = '\n'.join(current_entry_lines)
    
    # Check if entry_text has 2. v / 2. n / 2. a / 2. adv
    has_pos_2 = bool(re.search(r'(?:^|\n)\s*2\.\s*(?:v|n|a|adv)\b', entry_text))
    current_poses = set(m['partOfSpeech'] for m in item.get('meanings', []))
    
    if has_pos_2 and len(current_poses) < 2:
        true_multipos.append((w, len(entry_text), entry_text))
    else:
        clean_single_pos.append(w)

print(f"Total dataset: {len(oxford_data)}")
print(f"True multi-POS words genuinely missing 2.v/2.n/2.a: {len(true_multipos)}")
print(f"Single-POS / Already complete words: {len(clean_single_pos)}")

print("\nFirst 30 True Multi-POS words that need completion:")
for i, (w, length, txt) in enumerate(true_multipos[:30]):
    print(f"{i+1:2d}. {w:15s} (len: {length})")
