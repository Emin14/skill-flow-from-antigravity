# -*- coding: utf-8 -*-
"""
Dry-run test for multi-POS rebuilder on 20 words.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from robust_multi_pos_rebuilder import parse_full_article

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))
words_by_name = {item['word']: item for item in oxford_data}

sample_words = ['account', 'advance', 'anchor', 'arm', 'bag', 'balance', 'ball', 'battle', 'beam', 'bed', 'beef', 'block', 'board', 'book', 'box', 'call', 'care', 'case', 'catch', 'charge']

for sw in sample_words:
    curr = words_by_name.get(sw)
    raw_entries = parsed_index.get(sw, [])
    full_text = ' '.join(e.get('text', '') for e in raw_entries)
    
    meanings, phrases = parse_full_article(sw, full_text)
    if meanings:
        curr_poses = set(m['partOfSpeech'] for m in curr['meanings']) if curr else set()
        new_poses = set(m['partOfSpeech'] for m in meanings)
        print(f"Word '{sw}':")
        print(f"  BEFORE: {len(curr['meanings'])} meanings, POS: {curr_poses}, {len(curr.get('phrases', []))} phrases")
        print(f"  AFTER:  {len(meanings)} meanings, POS: {new_poses}, {len(phrases)} phrases")
        for m in meanings[:3]:
            print(f"    m{m['id']} [{m['partOfSpeech']}]: {m['translation']}")
        if len(meanings) > 3:
            print(f"    last m{meanings[-1]['id']} [{meanings[-1]['partOfSpeech']}]: {meanings[-1]['translation']}")
        print(f"    phrases sample: {[p['phrase'] for p in phrases[:4]]}")
        print("-" * 50)
