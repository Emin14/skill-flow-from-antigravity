# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

from deep_batch_verifier import verify_single_word

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sample_words = ['add', 'answer', 'ask', 'back', 'bail', 'call', 'give', 'break', 'look', 'take', 'turn', 'put', 'come', 'go', 'run', 'set', 'stand', 'fall', 'hold', 'keep']

for w_name in sample_words:
    orig = next((item for item in data if item['word'] == w_name), None)
    if orig:
        ver = verify_single_word(orig)
        print(f"\n==================== Word: {w_name} ====================")
        print(f"Meanings count: {len(orig['meanings'])} -> {len(ver['meanings'])}")
        print(f"Phrases count : {len(orig['phrases'])} -> {len(ver['phrases'])}")
        print("Phrases list:")
        for p in ver['phrases']:
            print(f"  * {p['en']} — {p['ru']}")
