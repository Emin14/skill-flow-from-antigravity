# -*- coding: utf-8 -*-
"""
Inspect all 329 raw pl patterns in detail.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if 'pl' in tr and not 'при англ. мн. ч.' in tr:
            print(f"{w} [{m['id']}]: '{tr}'")
