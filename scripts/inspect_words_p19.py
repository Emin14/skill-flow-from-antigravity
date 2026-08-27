# -*- coding: utf-8 -*-
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')
page = doc[18]
text_instances = page.get_text("words")
for w in text_instances:
    if '≅' in w[4] or 'accident' in w[4] or 'семье' in w[4] or 'урод' in w[4]:
        print(w)
