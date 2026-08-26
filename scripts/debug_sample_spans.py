# -*- coding: utf-8 -*-
import sys
import os
import pymupdf
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open("Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf")
page = doc[14]
d = page.get_text('dict')

for b in d['blocks']:
    if 'lines' not in b: continue
    for l in b['lines']:
        text_line = "".join([s['text'] for s in l['spans']])
        if any(w in text_line for w in ['aardvark', 'aardwolf', 'abaca', 'abaci', 'ab-']):
            print("LINE:", [f"{s['font']}({s['size']:.1f}, {s['flags']}): {repr(s['text'])}" for s in l['spans']])

doc.close()
