# -*- coding: utf-8 -*-
"""
Inspect the exact Unicode and glyph info of ≅ in the PDF.
"""
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')
page = doc[18] # Page 19 with accident

# Extract words with detailed font and character info
blocks = page.get_text("rawjson")
import json
data = json.loads(blocks)

found_chars = []
for b in data.get('blocks', []):
    for l in b.get('lines', []):
        for s in l.get('spans', []):
            if 'regulated' in s.get('text', '') or '≅' in s.get('text', '') or 'уро' in s.get('text', ''):
                for ch in s.get('chars', []):
                    found_chars.append(ch)

print(f"Sample characters around diamond of accident ({len(found_chars)}):")
for ch in found_chars:
    c = ch.get('c', '')
    font = ch.get('font', '')
    print(f"Char: '{c}' (U+{ord(c):04X}), font: {font}")
