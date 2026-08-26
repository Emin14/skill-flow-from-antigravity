# -*- coding: utf-8 -*-
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def split_en_ru_pair(chunk: str) -> tuple:
    chunk_norm = re.sub(r'\(или\s+([a-zA-Z\s\(\)\'\’\/\-,]+)\)', r'(or \1)', chunk)
    chunk_norm = re.sub(r'\(или\s+([a-zA-Z\s\(\)\'\’\/\-,]+)$', r'(or \1', chunk_norm)
    
    cyr_idx = -1
    for idx, ch in enumerate(chunk_norm):
        if '\u0400' <= ch <= '\u04FF':
            cyr_idx = idx
            break
            
    if cyr_idx <= 0:
        return None
        
    en_part = chunk_norm[:cyr_idx].strip(' ;,-(')
    ru_part = chunk_norm[cyr_idx:].strip()
    
    if en_part.count('(') > en_part.count(')'):
        en_part += ')' * (en_part.count('(') - en_part.count(')'))
    elif en_part.count(')') > en_part.count('('):
        en_part = en_part.rstrip(')')
        
    if en_part and len(en_part) >= 2:
        return en_part, ru_part
    return None

samples = [
    "to melt (или to vanish, to disappear) into thin air скрыться из виду, бесследно исчезнуть",
    "to tread (или to walk) on air ног под собой не чуять; ликовать, радоваться",
    "the ball is with you (или the ball is in your court) очередь за вами",
    "golden (или silver) key взятка, подкуп"
]

for s in samples:
    print(f"INPUT:  {s}")
    print(f"OUTPUT: {split_en_ru_pair(s)}\n")
