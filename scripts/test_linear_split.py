# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def split_en_ru_pair(chunk: str) -> tuple:
    cyr_idx = -1
    for idx, ch in enumerate(chunk):
        if '\u0400' <= ch <= '\u04FF':
            cyr_idx = idx
            break
    if cyr_idx <= 0:
        return None
        
    en_part = chunk[:cyr_idx].strip()
    ru_part = chunk[cyr_idx:].strip()
    
    if en_part and len(en_part) >= 2 and all(ord(c) < 128 or c in '’\'—– ' for c in en_part):
        return en_part, ru_part
    return None

test_samples = [
    "to play high карт. играть по большой",
    "to run high подыматься, вздыматься (о море)",
    "high and low повсюду, везде",
    "pure English text with no cyrillic at all",
    "простой русский текст без английского",
    "to put (or to lick) into shape придавать форму",
    "passions ran high страсти разгорелись"
]

print("=== TESTING split_en_ru_pair ===")
for s in test_samples:
    res = split_en_ru_pair(s)
    print(f"INPUT:  {s}")
    print(f"OUTPUT: {res}\n")
