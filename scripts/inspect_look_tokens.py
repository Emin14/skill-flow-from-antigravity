# -*- coding: utf-8 -*-
import pymupdf
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

for p in range(10, 508):
    t = doc[p].get_text()
    if "look who" in t:
        print(f"Found 'look who' on page {p}:")
        d = doc[p].get_text('dict')
        for b in d['blocks']:
            if 'lines' not in b: continue
            for l in b['lines']:
                line_str = ''.join(s['text'] for s in l['spans'])
                if "look" in line_str.lower():
                    print("Line:", repr(line_str))
                    for s in l['spans']:
                        print("  span:", repr(s['text']), "| font:", s['font'])
