# -*- coding: utf-8 -*-
import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
page = doc[10]
d = page.get_text('dict')
for b in d['blocks']:
    if 'lines' not in b: continue
    for l in b['lines']:
        y0, y1 = l['bbox'][1], l['bbox'][3]
        if y0 < 55 or y1 > 715: continue
        spans_summary = []
        for s in l['spans']:
            font_short = s['font'].replace('PragmaticaBoldA-Reg', 'HEAD').replace('Pragmatica-Bold', 'HEAD_BIG').replace('Newton-Bold', 'BOLD').replace('Newton-Italic', 'ITAL').replace('Newton-Regular', 'REG').replace('NewtonPhonetic', 'PHON')
            spans_summary.append(f"[{font_short}: {repr(s['text'])}]")
        print(' '.join(spans_summary))
