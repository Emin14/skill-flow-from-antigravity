# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect how many idiom phrases are captured when splitting tokens on idiom markers anywhere in the span
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
idiom_count = 0
phrasal_count = 0

for p in range(10, 508):
    t = doc[p].get_text()
    # Count occurrences of diamond and square
    diamonds = len(re.findall(r'[◊\uf0e0]', t))
    squares = len(re.findall(r'[□■▫▼\uf0a1]', t))
    idiom_count += diamonds
    phrasal_count += squares

print(f"Total idiom diamond markers in PDF: {idiom_count}")
print(f"Total phrasal square markers in PDF: {phrasal_count}")
