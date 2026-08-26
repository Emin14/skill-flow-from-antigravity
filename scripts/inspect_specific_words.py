# -*- coding: utf-8 -*-
import json
import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

for w in ['ambassador', 'bat', 'bay', 'look']:
    for item in data:
        if item['word'] == w:
            print(f"==================== {w} ====================")
            print(json.dumps(item, ensure_ascii=False, indent=2))
