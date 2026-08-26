# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for x in data:
    if x['word'] == 'get':
        print(f"Meanings count: {len(x['meanings'])}")
        for m in x['meanings']:
            print(f"[{m['id']}] tr: {repr(m['translation'][:60])}")
            if m.get('examples'):
                for ex in m['examples']:
                    print(f"    en: {repr(ex['en'][:40])}, ru: {repr(ex['ru'][:40])}")
        break
