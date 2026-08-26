# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

targets = ['about', 'above', 'abroad', 'absent', 'absolute', 'absolutely', 'absorb', 'lawsuit', 'sister']

for target in targets:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n==================== WORD: '{target}' ====================")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] POS: {m['partOfSpeech']:12} | Reg: {repr(m.get('register'))} | Trans: {repr(m['translation'])}")
            for ex in m.get('examples', []):
                print(f"       ex: {repr(ex['en'])} -> {repr(ex['ru'])}")
        if it.get('phrases'):
            print(f"Phrases ({len(it['phrases'])}):")
            for p in it['phrases']:
                print(f"  ◊ {repr(p['en'])} -> {repr(p['ru'])}")

print("\n==================== SAMPLE REGISTER EXTRACTION CHECK ====================")
reg_samples = 0
for it in data:
    for m in it.get('meanings', []):
        if m.get('register') and reg_samples < 15:
            print(f"Word: {it['word']:15} | Reg: {m.get('register')} | Trans: {repr(m['translation'])}")
            reg_samples += 1
