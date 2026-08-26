# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_data = json.load(f)

for x in muller_data:
    hw = x['headword'].lower()
    if hw.startswith('long') or hw.startswith('lie'):
        print(f"HW: {repr(x['headword'])}, Body: {repr(x['body'][:120])}")
