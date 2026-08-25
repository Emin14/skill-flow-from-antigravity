# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
print(f"Total pages: {len(doc)}")

# Let's inspect how blocks and lines flow across columns/pages
# In dictionary pages (10 to 507), usually there are 2 columns per page.
# Let's verify column geometry.
for p in [10, 11, 50, 100, 200, 300, 400, 500]:
    page = doc[p]
    w, h = page.rect.width, page.rect.height
    d = page.get_text('dict')
    print(f"Page {p}: size=({w:.1f}, {h:.1f}), blocks={len(d['blocks'])}")
