# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

def clean_text(t):
    if not t: return ""
    # Normalize unicode
    t = unicodedata.normalize('NFKD', t)
    # Remove control chars except spaces
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    # Ligatures
    t = t.replace('ﬂ', 'fl').replace('ﬁ', 'fi').replace('ﬃ', 'ffi').replace('ﬀ', 'ff')
    # Fix currency £ symbol if mapped weirdly (NewtonTd Ј -> £)
    t = t.replace('Ј', '£')
    return t

# Let's inspect the entire headword extraction logic
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

entries_list = [] # list of { 'headword': ..., 'raw_tokens': [...], 'page': p }
current_entry = None

# Font checks
def is_headword_span(s, is_line_start):
    font = s['font']
    text = s['text'].strip()
    if not text: return False
    # Pragmatica Bold fonts indicate headwords
    if any(hf in font for hf in ['PragmaticaBold', 'Pragmatica-Bold', 'PragmaticaBoldA-Reg', 'PragmaticaBoldT', 'PragmaticaBoldA-Obl']):
        # If it's a page number or single letter header, skip
        if text.isdigit(): return False
        if len(text) == 1 and text.isupper() and s['size'] > 11: return False # Big section letter like "A"
        return True
    return False

total_spans = 0
for p in range(10, 508):
    page = doc[p]
    d = page.get_text('dict')
    page_h = page.rect.height
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 50 or y1 > page_h - 25: continue
            if not l['spans']: continue
            
            # Check if first span is headword
            first_s = l['spans'][0]
            if is_headword_span(first_s, True):
                if current_entry:
                    entries_list.append(current_entry)
                current_entry = {
                    'page': p,
                    'headword_spans': [],
                    'body_spans': []
                }
                # Collect headword spans from this line start
                hw_done = False
                for s in l['spans']:
                    if not hw_done and is_headword_span(s, False):
                        current_entry['headword_spans'].append(s)
                    else:
                        hw_done = True
                        current_entry['body_spans'].append(s)
            else:
                if current_entry:
                    for s in l['spans']:
                        current_entry['body_spans'].append(s)

if current_entry:
    entries_list.append(current_entry)

print(f"Total raw headword entries extracted: {len(entries_list)}")

# Inspect first 20 entries
for e in entries_list[:20]:
    hw_text = ''.join(s['text'] for s in e['headword_spans']).strip()
    body_sample = ''.join(s['text'] for s in e['body_spans'][:10]).strip()
    print(f"P.{e['page']} | HW: {repr(hw_text)} | BODY: {repr(body_sample[:60])}")
