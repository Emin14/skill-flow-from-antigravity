# -*- coding: utf-8 -*-
"""
Inspect raw text of 'house' in PDF.
"""
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')

for page_num in range(350, 420):
    text = doc[page_num].get_text()
    if 'house [' in text or 'house [' in text.replace('  ', ' '):
        print(f"Found 'house' on page {page_num + 1}:")
        for line in text.split('\n'):
            if 'house' in line or 'Lancaster' in line or 'Commons' in line:
                print("  ", line)
        print("\nFull block around house:")
        print(text[:1500])
        break
