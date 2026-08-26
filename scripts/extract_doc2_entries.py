# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

def extract_entries_doc2():
    doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
    entries = []
    curr = None
    
    for p in range(10, 508):
        page = doc2[p]
        d = page.get_text('dict')
        page_h = page.rect.height
        
        for b in d['blocks']:
            if 'lines' not in b: continue
            for l in b['lines']:
                y0, y1 = l['bbox'][1], l['bbox'][3]
                if y0 < 50 or y1 > page_h - 25: continue
                if not l['spans']: continue
                
                # Check if first span is headword in doc2 (Arial-BoldMT)
                first_s = l['spans'][0]
                font = first_s['font']
                text = first_s['text'].strip()
                
                is_hw = ('Arial-Bold' in font or 'ArialBold' in font) and bool(text) and not text.isdigit() and not (len(text) == 1 and text.isupper() and first_s['size'] > 12)
                
                if is_hw:
                    if curr:
                        entries.append(curr)
                    curr = {'page': p, 'hw_spans': [], 'body_spans': []}
                    hw_done = False
                    for s in l['spans']:
                        s_hw = ('Arial-Bold' in s['font'] or 'ArialBold' in s['font']) and not s['text'].strip().isdigit()
                        if not hw_done and s_hw:
                            curr['hw_spans'].append(s)
                        else:
                            hw_done = True
                            curr['body_spans'].append(s)
                else:
                    if curr:
                        for s in l['spans']:
                            curr['body_spans'].append(s)
    if curr:
        entries.append(curr)
    doc2.close()
    return entries

entries2 = extract_entries_doc2()
print(f"Total entries extracted from Doc2: {len(entries2)}")

# Print sample entries
for e in entries2[:15]:
    hw = ''.join(s['text'] for s in e['hw_spans']).strip()
    body = ''.join(s['text'] for s in e['body_spans'][:15]).strip()
    print(f"P.{e['page']} | HW: {repr(hw)} | BODY: {repr(body[:80])}")
