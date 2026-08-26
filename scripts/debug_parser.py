# -*- coding: utf-8 -*-
import sys
import os
import pymupdf
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect raw articles on page 14-15
doc = pymupdf.open("Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf")

# Let's inspect what lines were captured on page 14
page = doc[14]
d = page.get_text('dict')
for b in d['blocks'][:20]:
    if 'lines' not in b: continue
    for l in b['lines']:
        text_line = "".join([f"<{s['font']}>{s['text']}" for s in l['spans']])
        print(text_line)

doc.close()
