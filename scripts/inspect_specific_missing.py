# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

test_words = [
    'catch', 'cater', 'category', 'deprive', 'disk', 'enquire', 'enquiry',
    'enthusiastic', 'gene', 'genetic', 'globalization', 'historic', 'imagery',
    'innovative', 'liable', 'memorable', 'motorist', 'mum', 'participate',
    'problematic', 'remain', 'terrain', 'terrify', 'transcript', 'trustee', 'upon'
]

doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
pages_text = [(p, doc2[p].get_text('text')) for p in range(10, 508)]
doc2.close()

for w in test_words:
    found = False
    for p, txt in pages_text:
        m = re.search(r'(?m)^(' + re.escape(w) + r'[0-9\sI|V|X]*\s*\[[^\]\n]+(?:\]|j).*)$', txt, flags=re.IGNORECASE)
        if m:
            print(f"[{w}] Page {p}: {repr(m.group(0))}")
            found = True
            break
    if not found:
        # Check without brackets
        for p, txt in pages_text:
            m = re.search(r'(?m)^(' + re.escape(w) + r'\b.*)$', txt, flags=re.IGNORECASE)
            if m:
                print(f"[{w}] Page {p} (no bracket match): {repr(m.group(0)[:80])}")
                found = True
                break
    if not found:
        print(f"[{w}] NOT found at line start in Doc2")
