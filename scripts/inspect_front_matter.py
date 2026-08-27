# -*- coding: utf-8 -*-
"""
Inspect front matter (pages 1-14) of Muller's dictionary for conventional signs and symbols.
"""
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')

print("Scanning pages 1-14 for 'Условные знаки', 'О словаре', 'Специальные знаки'...")
for pno in range(14):
    text = doc[pno].get_text()
    for line in text.split('\n'):
        if any(term in line.lower() for term in ['знак', 'ромб', 'тильд', 'обозначен', 'структур', 'сокращен', 'мюллер', 'соответств', 'эквивалент']):
            print(f"[Page {pno+1}] {line}")
