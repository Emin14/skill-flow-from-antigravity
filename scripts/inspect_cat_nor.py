# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

it_cat = next((x for x in data if x['word'] == 'cat'), None)
print("=== CAT ===")
print(json.dumps(it_cat, ensure_ascii=False, indent=2))

print("\n=== NOR ===")
it_nor = next((x for x in data if x['word'] == 'nor'), None)
print(json.dumps(it_nor, ensure_ascii=False, indent=2))
