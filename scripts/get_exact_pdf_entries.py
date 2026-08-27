# -*- coding: utf-8 -*-
"""
Extract exact raw text for 10 target words from PDF:
account, advance, anchor, balance, board, book, call, clear, close, fall
"""
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

target_words = ['account', 'advance', 'anchor', 'balance', 'board', 'book', 'call', 'clear', 'close', 'fall']

doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')

found_texts = {}

for target in target_words:
    print(f"======================================== {target} ========================================")
    pattern = f"{target} ["
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        if pattern in text:
            lines = text.split('\n')
            for i, l in enumerate(lines):
                if l.startswith(pattern):
                    # Extract up to 100 lines
                    entry_lines = lines[i:i+100]
                    entry_text = '\n'.join(entry_lines)
                    print(f"PAGE {page_num+1}:\n{entry_text}")
                    print("-" * 50)
                    found_texts[target] = entry_text
                    break
            if target in found_texts:
                break
