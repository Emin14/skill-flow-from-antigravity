# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

test_words = [
    'deprive', 'terrify', 'transcript', 'trustee', 'innovative', 'imagery',
    'memorable', 'motorist', 'historic', 'globalization', 'gene', 'enquire'
]

doc1 = pymupdf.open('SamPolnAnglRysSlovar.pdf')
pages_text1 = [(p, doc1[p].get_text('text')) for p in range(10, 508)]
doc1.close()

for w in test_words:
    found = False
    for p, txt in pages_text1:
        m = re.search(r'(?m)^(' + re.escape(w) + r'\b.*)$', txt, flags=re.IGNORECASE)
        if m:
            print(f"Doc1 [{w}] Page {p}: {repr(m.group(0)[:80])}")
            found = True
            break
    if not found:
        print(f"Doc1 [{w}] NOT found at line start")
