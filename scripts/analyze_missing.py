# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect the 310 unmatched words and see how they appear in the PDF text
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

def clean_str(t):
    if not t: return ""
    t = unicodedata.normalize('NFKD', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    t = t.replace('ﬂ', 'fl').replace('ﬁ', 'fi').replace('ﬃ', 'ffi').replace('ﬀ', 'ff')
    t = t.replace('Ј', '£')
    return t

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

index_by_hw = {}
all_hw_raw = []
for e in entries:
    raw_hw = ''.join(s['text'] for s in e['hw_spans']).strip()
    raw_hw = clean_str(raw_hw)
    all_hw_raw.append((raw_hw, e))
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', raw_hw, flags=re.IGNORECASE).strip().lower()
    base_hw = re.sub(r'[\,\.\/].*$', '', base_hw).strip()
    if base_hw not in index_by_hw:
        index_by_hw[base_hw] = []
    index_by_hw[base_hw].append((raw_hw, e))

# Let's test smart lookup:
# 1. Direct base match
# 2. Number stripped: bank1 -> bank (and pick homonym 1 if present or all bank entries)
# 3. Lemmatization/suffixes: -ed -> base/verb, -ing -> base/verb, -ly -> base/adj, -ness -> base/adj, -tion -> base/verb
# 4. Plural -> singular (bacteria -> bacterium, arms -> arm)
# 5. Multiword phrase lookup (according to in accord/according)

still_missing = []
for item in oxford_data:
    w = item['word'].strip().lower()
    # Normalize variants
    w_clean = re.sub(r'\d+$', '', w) # bank1 -> bank
    w_alt1 = w.replace('_', ' ')
    w_alt2 = w_clean.replace('_', ' ')
    
    found = False
    for candidate in [w, w_clean, w_alt1, w_alt2, w.replace('-', ' '), w.replace(' ', '-')]:
        if candidate in index_by_hw:
            found = True
            break
    if not found:
        still_missing.append(w)

print(f"Still missing after basic normalization: {len(still_missing)}")
print("Sample still missing:")
for m in still_missing[:40]:
    print(' ', m)
