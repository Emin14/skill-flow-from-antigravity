# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

doc1 = pymupdf.open('SamPolnAnglRysSlovar.pdf')
doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')

# Let's inspect page 10 and 11 on both
print("=== DOC1 Page 10 text ===")
print(doc1[10].get_text('text')[:1000])

print("\n=== DOC2 Page 10 text ===")
print(doc2[10].get_text('text')[:1000])

# Let's see some specific words: 'give', 'lead', 'abandon', 'breath', 'breathe', 'charge'
for p in [190, 191, 192]: # where 'give' is located
    txt = doc2[p].get_text('text')
    if 'give' in txt:
        print(f"\n=== Found 'give' on Doc2 page {p} ===")
        lines = [l for l in txt.split('\n') if l.strip()]
        for l in lines[:40]:
            print("  ", repr(l))
        break

doc1.close()
doc2.close()
