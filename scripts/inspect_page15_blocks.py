# -*- coding: utf-8 -*-
import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
doc = pymupdf.open(pdf_path)

page = doc[15]
d = page.get_text('dict')

print(f"Page 15 size: width={page.rect.width}, height={page.rect.height}")
print(f"Number of blocks: {len(d['blocks'])}")

blocks_by_x = []
for bi, b in enumerate(d['blocks']):
    if 'lines' not in b:
        continue
    x0, y0, x1, y1 = b['bbox']
    first_text = ""
    for l in b['lines']:
        for s in l['spans']:
            first_text += s['text'] + " "
        break
    blocks_by_x.append((round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1), first_text.strip()[:60]))

for item in sorted(blocks_by_x, key=lambda x: (x[0], x[1])):
    print(f"x0={item[0]:<5} y0={item[1]:<5} x1={item[2]:<5} y1={item[3]:<5} : {item[4]}")

doc.close()
