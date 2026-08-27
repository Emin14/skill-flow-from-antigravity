# -*- coding: utf-8 -*-
"""
Extract the exact, full raw text of 'measure' directly from PDF.
"""
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')

for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text()
    if 'measure [' in text or 'measure [' in text.replace('  ', ' '):
        print(f"=== PAGE {page_num + 1} ===")
        lines = text.split('\n')
        for i, l in enumerate(lines):
            if 'measure [' in l or 'measure [' in l.replace('  ', ' '):
                print('\n'.join(lines[max(0, i-5):min(len(lines), i+80)]))
                break
