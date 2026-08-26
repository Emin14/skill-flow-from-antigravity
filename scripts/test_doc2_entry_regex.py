# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect how articles start in Doc2
# An article starts with a headword line: e.g. "gag I [gæg] n ..." or "gainsay [,geɪn'seɪ] v ..." or "A, a [eɪ] n ..."
# Let's write a regex that detects the headword pattern at the start of a paragraph/line

def get_doc2_full_text():
    doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
    pages_text = []
    for p in range(10, 508):
        txt = doc2[p].get_text('text')
        # Remove page header lines: e.g. "191\ngang\n" or "101 convention"
        lines = txt.split('\n')
        # Filter out first 1-2 lines if they are page numbers / headers
        cleaned_lines = []
        for i, l in enumerate(lines):
            l_str = l.strip()
            if i < 3 and (l_str.isdigit() or (len(l_str) < 25 and not '[' in l_str and not ']' in l_str and (i == 0 or lines[0].strip().isdigit()))):
                continue
            cleaned_lines.append(l)
        pages_text.append('\n'.join(cleaned_lines))
    doc2.close()
    return '\n'.join(pages_text)

full_text = get_doc2_full_text()
print(f"Total cleaned text length from Doc2: {len(full_text)}")

# Let's find entries
# Pattern: Headword followed by transcription in brackets [...], e.g.:
# gain I [geɪn] n 1 ...
# or A, a [eɪ] n ...
# or without transcription for some words (e.g. cross references or abbreviations)

# Let's test finding entries
entry_starts = list(re.finditer(r'(?m)^([A-Za-z][A-Za-z0-9\-\'\,\.\s/]{0,40}?)\s+(\[[^\]\n]+\])\s+(n|v|adj|adv|prep|cj|num|pron|int|part|art|predic|attr|сокр)\b', full_text))
print(f"Found {len(entry_starts)} standard dictionary entry starts with transcription.")

# Let's see first 20 entry starts
for m in entry_starts[:20]:
    print(f"HW: {repr(m.group(1).strip())} | Trans: {repr(m.group(2))} | POS: {m.group(3)}")
