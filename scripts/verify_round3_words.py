# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

words_to_check = ['alignment', 'fade', 'behalf', 'camp', 'random', 'sake', 'take', 'cabin', 'abstract', 'come', 'genius', 'money', 'mouse', 'penny', 'photo', 'referendum', 'square', 'staff']

for w in words_to_check:
    it = next((x for x in data if x['word'] == w), None)
    if it:
        print(f"\n==================== WORD: '{w}' ====================")
        print(f"Meanings count: {len(it.get('meanings', []))}")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] POS: {m['partOfSpeech']} | Trans: {repr(m['translation'])}")
            if m.get('examples'):
                for ex in m['examples']:
                    print(f"       ex: {repr(ex['en'])} -> {repr(ex['ru'])}")
        if it.get('phrases'):
            print(f"Phrases ({len(it['phrases'])}):")
            for p in it['phrases']:
                print(f"  ◊ {repr(p['en'])} -> {repr(p['ru'])}")
