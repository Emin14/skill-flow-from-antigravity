# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

dummy_words = [
    'agenda', 'beef', 'businessman', 'cargo', 'criterion', 'hypothesis', 
    'maximum', 'medium', 'momentum', 'piano', 'policeman', 'potato', 
    'ratio', 'solo', 'stadium', 'synthesis', 'that', 'thief', 'this', 
    'tobacco', 'wife'
]

for w in dummy_words:
    it = next((x for x in data if x['word'] == w), None)
    if it:
        print(f"\n==================== WORD: {w} ====================")
        for m in it.get('meanings', []):
            print(f"[{m['id']}] POS: {m['partOfSpeech']:12} | Trans: {repr(m['translation'])}")
