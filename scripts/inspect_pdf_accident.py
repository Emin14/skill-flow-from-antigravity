# -*- coding: utf-8 -*-
"""
Inspect physical PDF text and fonts for 'accident'.
"""
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')

# Find page with accident
for page_num in range(14, 30):
    page = doc[page_num]
    text = page.get_text()
    if 'accident' in text:
        print(f"Found 'accident' on page {page_num + 1}:")
        for line in text.split('\n'):
            if 'accident' in line or 'regulated' in line or 'семействе' in line:
                print("  ", line)
        break
