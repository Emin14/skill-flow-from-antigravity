# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load Oxford 5000
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

print(f"Loaded {len(oxford_data)} Oxford words.")

# 2. Open PDF and extract all lines/spans
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

# We will collect structured stream of tokens/spans for all pages 10 to 507
raw_pages = []
for p in range(10, 508):
    page = doc[p]
    d = page.get_text('dict')
    page_h = page.rect.height
    page_spans = []
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 50 or y1 > page_h - 30: continue
            if not l['spans']: continue
            line_spans = []
            for s in l['spans']:
                text = s['text']
                font = s['font']
                flags = s['flags']
                size = s['size']
                line_spans.append({
                    'text': text,
                    'font': font,
                    'flags': flags,
                    'size': size,
                    'bbox': s['bbox']
                })
            page_spans.append(line_spans)
    raw_pages.append((p, page_spans))

print(f"Extracted lines from {len(raw_pages)} pages.")

# Let's write an entry segmenter
# A new entry starts when a line starts with PragmaticaBold* (or Pragmatica-Bold) and contains a headword
