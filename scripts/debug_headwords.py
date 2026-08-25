# -*- coding: utf-8 -*-
import pymupdf
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

for search_w in ['benefit', 'confidence', 'certificate', 'artificial']:
    print(f"\n================ SEARCH: {search_w} ================")
    for p in range(10, 508):
        t = doc[p].get_text()
        if search_w in t.lower():
            d = doc[p].get_text('dict')
            for b in d['blocks']:
                if 'lines' not in b: continue
                for l in b['lines']:
                    txt = ''.join(s['text'] for s in l['spans'])
                    if search_w in txt.lower():
                        s0 = l['spans'][0]
                        print("P.%d | font=%s | size=%.1f | text=%r | line=%r" % (p, s0['font'], s0['size'], s0['text'][:25], txt[:70]))
