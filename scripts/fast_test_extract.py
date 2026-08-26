# -*- coding: utf-8 -*-
import sys
import os
import pymupdf
import re
import json
import time

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
COLUMN_BOUNDS = ((35.0, 205.0), (205.0, 369.0), (369.0, 560.0))

def get_col(x0):
    for i, (c0, c1) in enumerate(COLUMN_BOUNDS):
        if c0 <= x0 < c1:
            return i
    return 0

doc = pymupdf.open(pdf_path)

t0 = time.time()
articles = []
current = None

for p in range(14, 25):  # test 11 pages
    page = doc[p]
    page_h = page.rect.height
    d = page.get_text('dict')
    
    lines_by_col = [[], [], []]
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 50 or y1 > page_h - 25: continue
            if not l['spans']: continue
            lines_by_col[get_col(l['bbox'][0])].append(l)
            
    for col_idx in range(3):
        col_lines = sorted(lines_by_col[col_idx], key=lambda l: l['bbox'][1])
        for l in col_lines:
            spans = l['spans']
            first_s = spans[0]
            f_txt = first_s['text'].strip()
            f_bold = ('Bold' in first_s['font'] or first_s['flags'] & 16)
            f_sz = first_s['size']
            
            is_sec_num = bool(re.match(r'^[1-9]\.$', f_txt)) or bool(re.match(r'^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.?$', f_txt))
            is_cyr = bool(re.search(r'[А-Яа-яЁё]', f_txt))
            
            is_hw = (f_bold and not is_sec_num and not is_cyr and f_sz >= 7.0 and bool(re.match(r'^[A-Za-z]', f_txt)))
            
            # Format line text with formatting markers
            line_pieces = []
            for s in spans:
                txt = s['text']
                if 'Italic' in s['font'] or (s['flags'] & 2):
                    line_pieces.append(f"<i>{txt}</i>")
                elif 'Bold' in s['font'] or (s['flags'] & 16):
                    line_pieces.append(f"<b>{txt}</b>")
                else:
                    line_pieces.append(txt)
            line_str = "".join(line_pieces)
            
            if is_hw:
                # Extract headword from spans
                hw_parts = []
                for s in spans:
                    s_bold = ('Bold' in s['font'] or s['flags'] & 16)
                    s_txt = s['text'].strip()
                    if '[' in s['text'] or 'Italic' in s['font'] or not s_bold or re.match(r'^[1-9]\.', s_txt):
                        break
                    hw_parts.append(s['text'])
                hw_str = re.sub(r'\s+', ' ', "".join(hw_parts)).strip()
                
                if current:
                    articles.append(current)
                current = {
                    'headword': hw_str,
                    'page': p + 1,
                    'col': col_idx + 1,
                    'text': line_str
                }
            else:
                if current:
                    current['text'] += "\n" + line_str

if current:
    articles.append(current)

doc.close()
print(f"Extracted {len(articles)} articles from 11 pages in {time.time()-t0:.2f}s", flush=True)

for i, a in enumerate(articles[:10]):
    print(f"\n--- [{i+1}] {a['headword']} (p.{a['page']}) ---")
    print(a['text'][:200])
