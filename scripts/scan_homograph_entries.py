# -*- coding: utf-8 -*-
import pymupdf
import sys
import re

from parse_entry_meanings_v2 import is_headword_span, normalize_text_nfc

sys.stdout.reconfigure(encoding='utf-8')

pdf_doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
raw_entries = []
curr_entry = None

for p in range(10, 508):
    page = pdf_doc[p]
    d = page.get_text('dict')
    page_h = page.rect.height
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 50 or y1 > page_h - 25: continue
            if not l['spans']: continue
            first_s = l['spans'][0]
            if is_headword_span(first_s):
                if curr_entry:
                    raw_entries.append(curr_entry)
                curr_entry = {'page': p, 'hw_spans': [], 'body_spans': []}
                hw_done = False
                for s in l['spans']:
                    if not hw_done and is_headword_span(s):
                        curr_entry['hw_spans'].append(s)
                    else:
                        hw_done = True
                        curr_entry['body_spans'].append(s)
            else:
                if curr_entry:
                    for s in l['spans']:
                        curr_entry['body_spans'].append(s)
if curr_entry:
    raw_entries.append(curr_entry)

pdf_doc.close()

targets = ['bank', 'bear', 'can', 'fly', 'match', 'mean', 'mine', 'row', 'sound', 'tear', 'well', 'wind', 'march', 'may', 'it']

for e in raw_entries:
    raw_hw = ''.join(normalize_text_nfc(s['text']) for s in e['hw_spans']).strip()
    raw_hw_clean = re.sub(r'\s+', ' ', raw_hw).strip()
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', raw_hw_clean, flags=re.IGNORECASE).strip().lower()
    if base_hw in targets:
        print(f"Entry: '{raw_hw_clean}' (page {e['page']}) -> base: '{base_hw}'")
