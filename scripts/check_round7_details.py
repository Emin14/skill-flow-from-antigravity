# -*- coding: utf-8 -*-
import json
import re
import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECK RESISTANCE IN VERIFIED DATA ===")
it_res = next((x for x in data if x['word'] == 'resistance'), None)
print(json.dumps(it_res, ensure_ascii=False, indent=2))

print("\n=== 2. CHECK ON IN PDF AND VERIFIED DATA ===")
it_on = next((x for x in data if x['word'] == 'on'), None)
if it_on:
    for m in it_on.get('meanings', []):
        if 'составе' in m.get('translation', ''):
            print(f"on meaning {m['id']}: {m}")

print("\n=== 3. CHECK NOR IN VERIFIED DATA ===")
it_nor = next((x for x in data if x['word'] == 'nor'), None)
print(json.dumps(it_nor, ensure_ascii=False, indent=2))

print("\n=== 4. CHECK SOLICITOR IN VERIFIED DATA ===")
it_sol = next((x for x in data if x['word'] == 'solicitor'), None)
print(json.dumps(it_sol, ensure_ascii=False, indent=2))
