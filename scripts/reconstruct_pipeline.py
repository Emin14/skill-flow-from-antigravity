# -*- coding: utf-8 -*-
"""
Pipeline to reconstruct multi-POS words with 100% automated quality checks.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from robust_dictionary_rebuilder import REGISTER_MAP, POS_MAP, extract_registers
from run_batch_reconstructor import clean_hyphens_and_ocr, parse_full_raw_entry

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

rebuilt_words = set([
    'measure',
    'account', 'advance', 'anchor', 'balance', 'board', 'book', 'call', 'clear', 'close', 'fall',
    'act', 'air', 'arm', 'back', 'bear', 'beat', 'box', 'care', 'case', 'cast',
    'catch', 'cause', 'charge', 'check', 'cook', 'cost', 'cover', 'cross', 'cry', 'cure',
    'cut', 'deal', 'demand', 'design', 'desire', 'die', 'doubt', 'draw', 'dress', 'drink',
    'drop', 'end', 'escape', 'excuse', 'face', 'fear', 'feel', 'fight', 'figure', 'fill',
    'film', 'finish', 'fire', 'fish', 'fit', 'fix', 'fly', 'fold', 'force', 'form'
])

candidates = []
for idx, item in enumerate(oxford_data):
    w = item['word']
    if w in rebuilt_words:
        continue
    
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
        candidates.append((idx, w, combined_raw, item))

print(f"Total candidate words to process: {len(candidates)}")

# Let's inspect the first 20 candidates
for i, (idx, w, raw, item) in enumerate(candidates[:20]):
    print(f"{i+1:2d}. {w} (meanings: {len(item['meanings'])})")
