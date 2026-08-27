# -*- coding: utf-8 -*-
"""
Inspect skipped words to see their exact OCR format.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

skipped = []
for idx, item in enumerate(oxford_data):
    w = item['word']
    raw_texts = []
    if w in parsed_index:
        raw_texts.extend([e.get('text', '') for e in parsed_index[w]])
    else:
        for k in parsed_index:
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                raw_texts.extend([e.get('text', '') for e in parsed_index[k]])
    
    combined_raw = '\n'.join(raw_texts)
    has_pos_2 = bool(re.search(r'\b2\.\s*(?:v|n|a|adv)\b', combined_raw))
    current_poses = set(m['partOfSpeech'] for m in item.get('meanings', []))
    
    if has_pos_2 and len(current_poses) < 2:
        skipped.append((w, combined_raw))

print(f"Total remaining skipped words: {len(skipped)}")
for i, (w, raw) in enumerate(skipped[:10]):
    print(f"\n==================== {i+1}. {w} ====================")
    print(raw[:500])
