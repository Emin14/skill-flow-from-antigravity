# -*- coding: utf-8 -*-
import sys
import pymupdf
import json

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
doc = pymupdf.open(pdf_path)

for p in [14, 15, 16, 100, 500, 900]:
    page = doc[p]
    print(f"\n================ PAGE {p} (rect: {page.rect}) ================")
    # Let's check x0 coordinates of headword spans
    d = page.get_text('dict')
    hw_list = []
    for b in d['blocks']:
        if 'lines' not in b:
            continue
        for l in b['lines']:
            for s in l['spans']:
                if 'Bold' in s['font'] and s['text'].strip() and s['size'] > 6.5 and not s['text'].strip().isdigit():
                    # check if this looks like a headword
                    hw_list.append((round(s['bbox'][0], 1), round(s['bbox'][1], 1), s['font'], round(s['size'], 1), s['text']))
    print(f"Bold items count: {len(hw_list)}")
    for item in hw_list[:10]:
        print(" ", item)

doc.close()
