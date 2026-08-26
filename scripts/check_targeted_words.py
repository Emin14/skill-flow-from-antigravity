# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

words_to_check = ['backwards', 'dual', 'look', 'remain', 'the', 'a', 'OK', 'abstract', 'nature', 'I', 'programme', 'use', 'hate']

for w in words_to_check:
    it = next((x for x in data if x['word'] == w), None)
    if it:
        print(f"\n==================== WORD: '{w}' ====================")
        print(f"Meanings count: {len(it.get('meanings', []))}")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] POS: {m['partOfSpeech']} | Trans: {m['translation']}")
            if m.get('examples'):
                for ex in m['examples']:
                    print(f"       ex: {ex['en']} -> {ex['ru']}")
        if it.get('phrases'):
            print(f"Phrases ({len(it['phrases'])}):")
            for p in it['phrases']:
                print(f"  ◊ {p['en']} -> {p['ru']}")
