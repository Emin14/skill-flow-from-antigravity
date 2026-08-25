# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

def clean_str(t):
    if not t: return ""
    t = unicodedata.normalize('NFKD', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    t = t.replace('ﬂ', 'fl').replace('ﬁ', 'fi').replace('ﬃ', 'ffi').replace('ﬀ', 'ff')
    t = t.replace('Ј', '£')
    return t

doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

def is_headword_span(s):
    font = s['font']
    text = s['text'].strip()
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

print(f"Total entries: {len(entries)}")

# Group entries by base headword (e.g. 'charge I', 'charge II' -> 'charge')
index_by_hw = {}
for e in entries:
    raw_hw = ''.join(s['text'] for s in e['hw_spans']).strip()
    raw_hw = clean_str(raw_hw)
    # Remove homonym marker (e.g. ' I', ' II', ' 1', ' 2', etc.)
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', raw_hw, flags=re.IGNORECASE).strip().lower()
    base_hw = re.sub(r'[\,\.\/].*$', '', base_hw).strip() # e.g. "A, a" -> "a"
    if base_hw not in index_by_hw:
        index_by_hw[base_hw] = []
    index_by_hw[base_hw].append((raw_hw, e))

print(f"Total unique base headwords: {len(index_by_hw)}")

# Let's inspect test words
test_words = ['charge', 'abandon', 'bank', 'light', 'able', 'abide', 'break', 'call', 'accept']
for tw in test_words:
    if tw in index_by_hw:
        print(f"\n==================== Word: {tw} ({len(index_by_hw[tw])} entries) ====================")
        for raw_hw, entry in index_by_hw[tw]:
            print(f"--- Entry: {raw_hw} (p. {entry['page']}) ---")
            spans_info = []
            for s in entry['body_spans']:
                t = clean_str(s['text'])
                if not t.strip(): continue
                f = s['font']
                font_type = 'REG'
                if 'Bold' in f and 'Pragmatica' not in f:
                    font_type = 'BOLD'
                elif 'Italic' in f:
                    font_type = 'ITAL'
                elif 'Phonetic' in f:
                    font_type = 'PHON'
                elif 'Symbol' in f:
                    font_type = 'SYMB'
                spans_info.append(f"<{font_type}>{t}</{font_type}>")
            print(' '.join(spans_info[:40]))
