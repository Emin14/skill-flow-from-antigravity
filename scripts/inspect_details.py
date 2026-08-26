# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

for target in ['couple', 'get', 'set', 'cabin', 'fade', 'behalf', 'camp', 'random', 'sake']:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n================ WORD: {target} ================")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] {m['partOfSpeech']}: {m['translation']}")
            for ex in m.get('examples', []):
                print(f"       ex: {ex['en']} -> {ex['ru']}")
