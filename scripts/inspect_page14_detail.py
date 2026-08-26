# -*- coding: utf-8 -*-
import sys
import pymupdf
import json

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
doc = pymupdf.open(pdf_path)

print("=== Page 14 detail (lines & spans) ===")
page = doc[14]
d = page.get_text('dict')
for bi, b in enumerate(d['blocks'][:15]):
    if 'lines' not in b:
        continue
    print(f"\n--- Block {bi} bbox={b['bbox']} ---")
    for li, l in enumerate(b['lines']):
        line_str = " | ".join([f"[{s['font']} {s['size']:.1f} flag={s['flags']} '{s['text']}']" for s in l['spans']])
        print(f"  Line {li}: {line_str}")

doc.close()
