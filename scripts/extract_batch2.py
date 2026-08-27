# -*- coding: utf-8 -*-
"""
Extract exact PDF text for batch 2:
act, air, arm, back, bear, beat, box, care, case, cast
"""
import pymupdf, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

target_words = ['act', 'air', 'arm', 'back', 'bear', 'beat', 'box', 'care', 'case', 'cast']
doc = pymupdf.open('Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf')

for target in target_words:
    print(f"\n======================================== {target} ========================================")
    pattern = f"{target} ["
    found = False
    for page_num in range(len(doc)):
        text = doc[page_num].get_text()
        if pattern in text:
            lines = text.split('\n')
            for i, l in enumerate(lines):
                if l.startswith(pattern):
                    entry_lines = []
                    for j in range(i, min(len(lines), i + 150)):
                        line = lines[j]
                        if j > i and '[' in line and ']' in line and len(line.split('[')[0].strip().split()) == 1 and not line.strip().startswith('~') and not line.strip().startswith('to '):
                            break
                        entry_lines.append(line)
                    print(f"PAGE {page_num+1}:\n" + '\n'.join(entry_lines))
                    found = True
                    break
        if found:
            break
