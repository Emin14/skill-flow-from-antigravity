# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

doc1 = pymupdf.open('SamPolnAnglRysSlovar.pdf')
doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')

print("Doc1 pages:", len(doc1))
print("Doc2 pages:", len(doc2))

# Let's inspect how doc2 fonts and text layout look
page10_doc2 = doc2[10]
d2 = page10_doc2.get_text('dict')
print(f"Doc2 page 10 has {len(d2['blocks'])} blocks")

# Let's see some lines and fonts in doc2
for b in d2['blocks'][:5]:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                print(f"  font: {s['font']} | size: {s['size']:.1f} | flags: {s['flags']} | text: {repr(s['text'])}")

doc1.close()
doc2.close()
