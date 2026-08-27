# -*- coding: utf-8 -*-
"""
Inspect the raw entries in oxford_5000.json for the duplicate words.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

orig_path = 'oxford_5000.json'
orig_data = json.load(open(orig_path, 'r', encoding='utf-8'))

dupe_words = ['house', 'it', 'live', 'march', 'may', 'minute', 'use', 'wind1', 'wind2', 'March', 'May']

print(f"Inspecting entries in original '{orig_path}':")
for w in dupe_words:
    matches = [(idx, item) for idx, item in enumerate(orig_data) if item.get('word', '').lower() == w.lower()]
    if matches:
        print(f"\nWord: '{w}' -> found {len(matches)} occurrences:")
        for idx, it in matches:
            print(f"  [Index {idx}]: word='{it.get('word')}', cefr={it.get('cefr')}, rank={it.get('frequency_rank')}, phon_br={it.get('phon_br')}, phon_n_am={it.get('phon_n_am')}, pos={it.get('partOfSpeech', [m.get('partOfSpeech') for m in it.get('meanings', [])][:2])}")
