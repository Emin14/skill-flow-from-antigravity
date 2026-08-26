# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

words_to_check = [
    'buddy', 'aware', 'certain', 'clever', 'comfortable', 'conscious', 
    'copyright', 'due', 'fond', 'forthcoming', 'glad', 'great', 'ill', 
    'sick', 'slow', 'sorry'
]

for w in words_to_check:
    it = next((x for x in data if x['word'] == w), None)
    if it:
        print(f"\n==================== WORD: {w} ====================")
        for m in it.get('meanings', []):
            print(f"[{m['id']}] POS: {m['partOfSpeech']:12} | Trans: {repr(m['translation'])}")
