# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

it = next((x for x in data if x['word'] == 'wire'), None)
if it:
    for m in it.get('meanings', []):
        print(f"[{m['id']}] {m['partOfSpeech']}: {repr(m['translation'])}")
