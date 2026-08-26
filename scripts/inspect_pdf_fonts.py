# -*- coding: utf-8 -*-
import sys
import pymupdf
import json
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
doc = pymupdf.open(pdf_path)

fonts = Counter()
sizes = Counter()
font_samples = {}

for p in range(14, 25):
    page = doc[p]
    d = page.get_text('dict')
    for b in d['blocks']:
        if 'lines' not in b:
            continue
        for l in b['lines']:
            for s in l['spans']:
                f = s['font']
                sz = round(s['size'], 1)
                flags = s['flags']
                key = (f, sz, flags)
                fonts[key] += 1
                if key not in font_samples and s['text'].strip():
                    font_samples[key] = s['text'].strip()[:50]

print("Top fonts/sizes/flags on pages 14-24:")
for k, count in fonts.most_common(20):
    print(f"  {k}: count={count}, sample='{font_samples.get(k, '')}'")

doc.close()
