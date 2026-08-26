# -*- coding: utf-8 -*-
"""
Deep scan of all 4,982 words to detect:
1. Words that matched directly to their own headword in PDF.
2. Words that stemmed to another word in index_by_base.
3. Words that have mismatched POS between Oxford 5000 and the assigned meanings.
4. Words in identical meanings groups.
"""
import sys
import os
import json
import re
import pymupdf
from collections import defaultdict

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

index_by_base = {}
for e in raw_entries:
    raw_hw = ''.join(normalize_text_nfc(s['text']) for s in e['hw_spans']).strip()
    raw_hw_clean = re.sub(r'\s+', ' ', raw_hw).strip()
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', raw_hw_clean, flags=re.IGNORECASE).strip().lower()
    base_hw = re.sub(r'[\,\.\/].*$', '', base_hw).strip()
    if base_hw not in index_by_base:
        index_by_base[base_hw] = []
    index_by_base[base_hw].append((raw_hw_clean, e))

data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

direct_matches = []
stem_matches = []
no_matches = []

for it in data:
    w = it['word']
    w_low = w.strip().lower()
    w_clean = re.sub(r'\d+$', '', w_low)
    candidates = [w_low, w_clean, w_low.replace('_', ' '), w_clean.replace('_', ' '), w_low.replace('-', ' '), w_low.replace(' ', '-')]
    found_direct = False
    for c in candidates:
        if c in index_by_base:
            direct_matches.append((w, c))
            found_direct = True
            break
    if found_direct:
        continue
    
    stems = []
    if w_low.endswith('ly') and len(w_low) > 4: stems.extend([w_low[:-2], w_low[:-4], w_low[:-3] + 'y'])
    if w_low.endswith('ed') and len(w_low) > 4: stems.extend([w_low[:-2], w_low[:-1]])
    if w_low.endswith('ing') and len(w_low) > 5: stems.extend([w_low[:-3], w_low[:-3] + 'e'])
    if w_low.endswith('s') and len(w_low) > 3: stems.extend([w_low[:-1], w_low[:-2]])
    if w_low.endswith('tion') and len(w_low) > 6: stems.extend([w_low[:-4] + 'te', w_low[:-4] + 't', w_low[:-4]])
    if w_low.endswith('ment') and len(w_low) > 6: stems.extend([w_low[:-4]])
    if w_low.endswith('ness') and len(w_low) > 6: stems.extend([w_low[:-4], w_low[:-5] + 'y'])
    found_stem = False
    for s in stems:
        if s in index_by_base:
            stem_matches.append((w, s))
            found_stem = True
            break
    if not found_stem:
        no_matches.append(w)

print(f"Direct matches: {len(direct_matches)}")
print(f"Stem fallback matches: {len(stem_matches)}")
print(f"No match in PDF index: {len(no_matches)}")

print("\nAll Stem Fallback Words and their Target Base Word:")
for w, s in stem_matches:
    print(f"  {w} -> {s}")
