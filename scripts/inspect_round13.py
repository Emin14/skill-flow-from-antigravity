# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECK 'nest' ===")
it_nest = next((x for x in data if x['word'] == 'nest'), None)
print(json.dumps(it_nest, ensure_ascii=False, indent=2))

print("\n=== 2. CHECK 'sleep' ===")
it_sleep = next((x for x in data if x['word'] == 'sleep'), None)
print(json.dumps(it_sleep, ensure_ascii=False, indent=2))

print("\n=== 3. FIND ALL MEANINGS STARTING WITH PREPOSITION IN PARENS '(of)', '(for)', '(to)', '(with)', '(in)', ETC. ===")
prep_count = 0
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if re.match(r'^\([a-zA-Z\s,]+\)\s+', t):
            prep_count += 1
            print(f"[{it['word']:12}] POS: {m['partOfSpeech']:10} | ID: {m['id']} | Trans: {repr(t)}")

print(f"\nTotal leading english preposition annotations: {prep_count}")
