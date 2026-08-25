# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
symbol_chars = {}
font_symbols = {}

for p in range(10, 508):
    page = doc[p]
    d = page.get_text('dict')
    page_h = page.rect.height
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 50 or y1 > page_h - 25: continue
            for s in l['spans']:
                f = s['font']
                t = s['text']
                if 'Symbol' in f or 'Wingdings' in f or any(c in t for c in ['', '◊', '', '□', '■', '▫', '▼', '\uf0e0', '\uf0a1']):
                    key = (f, t.strip())
                    symbol_chars[key] = symbol_chars.get(key, 0) + 1

print("All symbol tokens detected in dictionary pages:")
for (font, txt), count in sorted(symbol_chars.items(), key=lambda x: -x[1]):
    print(f"  Count: {count:4d} | Font: {font:15s} | Text: {repr(txt)} | Ords: {[ord(c) for c in txt]}")
