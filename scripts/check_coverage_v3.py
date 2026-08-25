# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

def normalize_text(t):
    if not t: return ""
    # Explicit ligature replacements WITH potential trailing spaces from font metrics
    t = t.replace('ﬁ ', 'fi').replace('ﬂ ', 'fl').replace('ﬃ ', 'ffi').replace('ﬀ ', 'ff').replace('ﬄ ', 'ffl')
    t = t.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('ﬃ', 'ffi').replace('ﬀ', 'ff').replace('ﬄ', 'ffl')
    t = t.replace('\ufb01 ', 'fi').replace('\ufb02 ', 'fl').replace('\ufb03 ', 'ffi').replace('\ufb00 ', 'ff').replace('\ufb04 ', 'ffl')
    t = t.replace('\ufb01', 'fi').replace('\ufb02', 'fl').replace('\ufb03', 'ffi').replace('\ufb00', 'ff').replace('\ufb04', 'ffl')
    t = unicodedata.normalize('NFKD', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    t = t.replace('Ј', '£')
    return t

doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

def is_headword_span(s):
    font = s['font']
    text = normalize_text(s['text']).strip()
    if not text: return False
    if any(hf in font for hf in ['PragmaticaBold', 'Pragmatica-Bold', 'PragmaticaBoldA-Reg', 'PragmaticaBoldT', 'PragmaticaBoldA-Obl']):
        if text.isdigit(): return False
        if len(text) == 1 and text.isupper() and s['size'] > 11: return False
        return True
    return False

# Build raw entries
entries = []
curr_entry = None
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
            first_s = l['spans'][0]
            if is_headword_span(first_s):
                if curr_entry:
                    entries.append(curr_entry)
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
    entries.append(curr_entry)

index_by_hw = {}
for e in entries:
    raw_hw = ''.join(normalize_text(s['text']) for s in e['hw_spans']).strip()
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', raw_hw, flags=re.IGNORECASE).strip().lower()
    base_hw = re.sub(r'[\,\.\/].*$', '', base_hw).strip()
    if base_hw not in index_by_hw:
        index_by_hw[base_hw] = []
    index_by_hw[base_hw].append((raw_hw, e))

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

matched = []
unmatched = []
for item in oxford_data:
    w = item['word'].strip().lower()
    w_clean = re.sub(r'\d+$', '', w)
    candidates = [
        w,
        w_clean,
        w.replace('_', ' '),
        w_clean.replace('_', ' '),
        w.replace('-', ' '),
        w.replace(' ', '-'),
        w.replace("'", "’"),
        w.replace("’", "'"),
    ]
    found = False
    for c in candidates:
        if c in index_by_hw:
            matched.append(w)
            found = True
            break
    if not found:
        unmatched.append(w)

print(f"Matched: {len(matched)} / {len(oxford_data)} ({len(matched)/len(oxford_data)*100:.2f}%)")
print(f"Unmatched count: {len(unmatched)}")
print(f"Unmatched words: {unmatched}")
