# -*- coding: utf-8 -*-
import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
doc = pymupdf.open(pdf_path)

page = doc[14]
d = page.get_text('dict')
for b in d['blocks']:
    if 'lines' not in b:
        continue
    for l in b['lines']:
        for s in l['spans']:
            if '[' in s['text']:
                print(f"Transcription span: font='{s['font']}', size={s['size']:.1f}, text='{s['text']}'")

doc.close()
