# -*- coding: utf-8 -*-
"""
Inspect font styles and text layout in diamond blocks (♦) from PDF.
"""
import fitz # PyMuPDF
import sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')

# Let's inspect page with 'ice' or 'bird' or 'break'
# In ice: page 399
page = doc[398] # 0-indexed 398 -> page 399
text_page = page.get_text("blocks")
for b in text_page:
    if 'to break the' in b[4] or 'ice' in b[4][:20]:
        print("=== Block in ICE ===")
        print(b[4])

# Let's also inspect span-level fonts in page 399 for ♦
page_dict = page.get_text("dict")
for block in page_dict.get("blocks", []):
    for line in block.get("lines", []):
        line_text = "".join([span.get("text", "") for span in line.get("spans", [])])
        if '♦' in line_text or 'to break the' in line_text:
            print("=== Line Spans ===")
            for span in line.get("spans", []):
                print(f"  font: {span.get('font')}, size: {span.get('size')}, text: '{span.get('text')}'")
