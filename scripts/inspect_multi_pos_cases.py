# -*- coding: utf-8 -*-
"""
Inspect multi-POS cases: compare raw text with current oxford entry.
"""
import json, os, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))
words_by_name = {item['word']: item for item in oxford_data}

test_words = ['balance', 'board', 'book', 'call', 'clear', 'close', 'cry', 'draw', 'drop', 'fall', 'account', 'advance', 'anchor']

for w in test_words:
    print(f"======================================== {w} ========================================")
    curr = words_by_name.get(w)
    if curr:
        print(f"CURRENT ENTRY: {len(curr['meanings'])} meanings, POS: {set(m['partOfSpeech'] for m in curr['meanings'])}, phrases: {len(curr.get('phrases', []))}")
        for m in curr['meanings'][:3]:
            print(f"  m{m['id']} [{m['partOfSpeech']}]: {m['translation']}")
        if len(curr['meanings']) > 3:
            print(f"  ... and {len(curr['meanings'])-3} more meanings")
            print(f"  last m{curr['meanings'][-1]['id']} [{curr['meanings'][-1]['partOfSpeech']}]: {curr['meanings'][-1]['translation']}")
        print(f"  phrases: {[p['phrase'] for p in curr.get('phrases', [])]}")
        
    raw_entries = parsed_index.get(w, [])
    if not raw_entries:
        for k in parsed_index:
            if k.startswith(w + ' '):
                raw_entries.extend(parsed_index[k])
    print(f"RAW MULLER TEXT (total chunks: {len(raw_entries)}):")
    for chunk in raw_entries:
        txt = chunk.get('text', '')
        print("  RAW CHUNK HEADER:", txt[:300].replace('\n', ' '))
        if '2. ' in txt:
            print("  FOUND '2. ' IN RAW:", txt[txt.find('2. '):txt.find('2. ')+300].replace('\n', ' '))
        if '3. ' in txt:
            print("  FOUND '3. ' IN RAW:", txt[txt.find('3. '):txt.find('3. ')+300].replace('\n', ' '))
