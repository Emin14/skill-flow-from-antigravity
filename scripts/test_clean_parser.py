# -*- coding: utf-8 -*-
import sys
import os
import pymupdf
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

sys.path.append('scripts')
from build_from_parsing_json import (
    POS_MAP, REGISTER_MAP, extract_transcription, extract_forms,
    extract_registers, clean_final_text, parse_entry_meanings_and_phrases,
    COLUMN_BOUNDS, get_column_index
)

doc = pymupdf.open("Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf")

articles = []
current = None

for p in range(14, 16):  # pages 15-16
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
            lines_by_col[get_column_index(l['bbox'][0])].append(l)
            
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
            is_alphabet_header = (len(spans) == 1 and len(f_txt) == 1 and f_txt.isupper() and f_sz > 12.0)
            
            is_hw = (
                f_bold
                and not is_sec_num
                and not is_cyr
                and not is_alphabet_header
                and f_sz >= 7.0
                and bool(re.match(r'^[A-Za-z]', f_txt))
            )
            
            if is_hw:
                # Find all headword spans
                hw_parts = []
                body_start_span_idx = 0
                for s_idx, s in enumerate(spans):
                    s_bold = ('Bold' in s['font'] or s['flags'] & 16)
                    s_txt = s['text'].strip()
                    if '[' in s['text'] or 'Italic' in s['font'] or (not s_bold and s_txt) or re.match(r'^[1-9]\.', s_txt):
                        body_start_span_idx = s_idx
                        break
                    hw_parts.append(s['text'])
                    body_start_span_idx = s_idx + 1
                    
                hw_str = re.sub(r'\s+', ' ', "".join(hw_parts)).strip()
                
                # Format remaining spans
                body_spans = spans[body_start_span_idx:]
                body_pieces = []
                for s in body_spans:
                    txt = s['text']
                    if 'Italic' in s['font'] or (s['flags'] & 2):
                        body_pieces.append(f"<i>{txt}</i>")
                    else:
                        body_pieces.append(txt)
                body_line = "".join(body_pieces).strip()
                
                if current:
                    articles.append(current)
                current = {
                    'headword': hw_str,
                    'page': p + 1,
                    'body': body_line
                }
            else:
                body_pieces = []
                for s in spans:
                    txt = s['text']
                    if 'Italic' in s['font'] or (s['flags'] & 2):
                        body_pieces.append(f"<i>{txt}</i>")
                    else:
                        body_pieces.append(txt)
                body_line = "".join(body_pieces)
                if current:
                    current['body'] += ("\n" if current['body'] else "") + body_line

if current:
    articles.append(current)

doc.close()

print(f"Extracted {len(articles)} articles from pages 15-16.")

parsed_items = []
for a in articles:
    hw = a['headword']
    body = a['body']
    
    phon, body = extract_transcription(body)
    forms, body = extract_forms(body)
    meanings, phrases = parse_entry_meanings_and_phrases(hw, body)
    
    entry = {
        'word': hw,
        'phon_br': phon or None,
        'forms': forms if forms else None,
        'meanings': meanings,
        'phrases': phrases
    }
    parsed_items.append(entry)

for item in parsed_items[1:10]:
    print("\n" + "="*50)
    print(json.dumps({k: v for k, v in item.items() if v is not None}, ensure_ascii=False, indent=2))
