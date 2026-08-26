# -*- coding: utf-8 -*-
import pymupdf
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

pages = {'ambassador': 23, 'bat': 41, 'bay': 42}

for w, p in pages.items():
    print(f"==================== {w} (page {p}) ====================")
    d = doc[p].get_text('dict')
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            line_str = ''.join(s['text'] for s in l['spans'])
            if w in line_str.lower():
                print("LINE:", line_str)
                for s in l['spans']:
                    print("  span:", repr(s['text']), "| font:", s['font'])
