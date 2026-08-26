# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for item in d:
    if item['word'] == 'cross':
        print(json.dumps(item, ensure_ascii=False, indent=2))
