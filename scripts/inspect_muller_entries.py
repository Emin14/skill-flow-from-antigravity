# -*- coding: utf-8 -*-
import sys
import pymupdf
import re

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
doc = pymupdf.open(pdf_path)

# Let's inspect pages 14, 15, 20, 50, 100, 300, 600, 920
test_pages = [14, 15, 20, 50, 100, 300, 600, 920]

for p in test_pages:
    page = doc[p]
    page_text = page.get_text('text')
    print(f"\n=================== PAGE {p} PLAIN TEXT SAMPLE ===================")
    lines = [l for l in page_text.split('\n') if l.strip()]
    for l in lines[:25]:
        print("  ", l)

doc.close()
