# -*- coding: utf-8 -*-
import sys
import os
import json
import pymupdf

from parse_entry_meanings import (
    is_headword_span,
    parse_entry_meanings,
    normalize_text_nfc
)

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

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

charge_entries = []
for e in entries:
    hw = ''.join(normalize_text_nfc(s['text']) for s in e['hw_spans']).strip()
    if hw.lower() in ['charge i', 'charge ii', 'charge']:
        charge_entries.append((hw, e))

print(f"Found {len(charge_entries)} entries for charge:")
all_meanings = []
m_id = 1
for hw, e in charge_entries:
    print(f"--- Parsing {hw} (p. {e['page']}) ---")
    meanings = parse_entry_meanings(hw, e['body_spans'])
    for m in meanings:
        m['id'] = m_id
        m_id += 1
        all_meanings.append(m)

print(json.dumps(all_meanings, ensure_ascii=False, indent=2))
