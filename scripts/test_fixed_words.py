# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import pymupdf

from parse_entry_meanings import is_headword_span, normalize_text_nfc, parse_entry_meanings_and_phrases

sys.stdout.reconfigure(encoding='utf-8')

pdf_doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
test_words = ['about', 'absurd', 'active', 'advance', 'affair', 'aid', 'aircraft', 'allegation', 'amount', 'animal', 'boom', 'broad', 'business', 'can1', 'heel', 'knock']

entries = {}
curr = None
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
                if curr:
                    w = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', curr['hw'].lower().strip()).strip()
                    if w in test_words or curr['hw'].lower().strip() in test_words:
                        entries.setdefault(w, []).append(curr)
                hw_text = ''.join(normalize_text_nfc(s['text']) for s in l['spans'] if is_headword_span(s)).strip()
                curr = {'hw': hw_text, 'page': p, 'spans': list(l['spans'])}
            else:
                if curr:
                    curr['spans'].extend(l['spans'])

print(f"Found entries for test words: {list(entries.keys())}")

for tw in test_words:
    clean_tw = re.sub(r'\d+$', '', tw)
    word_entries = entries.get(clean_tw, entries.get(tw, []))
    if not word_entries:
        print(f"Word {tw} not found in parsed entries!")
        continue
    print(f"\n==================== TEST WORD: {tw} ====================")
    for we in word_entries:
        m_list, p_list = parse_entry_meanings_and_phrases(we['hw'], we['spans'])
        print(f"Headword: {we['hw']} (page {we['page']})")
        print("Meanings:")
        for m in m_list:
            print(f"  [{m['id'] if 'id' in m else '-'}] ({m['partOfSpeech']}) {m['translation']}")
            if m.get('register'):
                print(f"      [register: {m['register']}]")
            for ex in m.get('examples', []):
                print(f"      • ex: {ex['en']} -> {ex['ru']}")
        if p_list:
            print("Phrases:")
            for p in p_list:
                print(f"  * {p['en']} -> {p['ru']}")
