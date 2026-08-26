# -*- coding: utf-8 -*-
import pymupdf
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

for p in range(300, 330):
    text = doc[p].get_text()
    if 'on the jury' in text or 'on the programme' in text:
        print(f"--- Page {p} ---")
        lines = text.split('\n')
        for i, l in enumerate(lines):
            if 'jury' in l or 'составе' in l or 'repertoire' in l:
                print("\n".join(lines[max(0, i-5):min(len(lines), i+10)]))

doc.close()
