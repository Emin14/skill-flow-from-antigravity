# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

def clean_pl_patterns(text):
    if not text: return ""
    
    # 1. глагол-связка fixes
    text = text.replace('глаголсвязка', 'глагол-связка')
    text = re.sub(r'^(как )?глагол-связка в составном именном сказуемом\s+', '(как глагол-связка в составном именном сказуемом) ', text)
    text = re.sub(r'^(как )?глагол-связка\s+', '(как глагол-связка) ', text)
    
    # 2. pl expansions
    text = re.sub(r'^\(the\)\s*pl\s+разг\.\s*', '(the; во мн.ч., разг.) ', text)
    text = re.sub(r'^\(the\)\s*pl\s*', '(the; во мн.ч.) ', text)
    text = re.sub(r'^\(обыкн\.?\s*pl\)\s*', '(обыкн. во мн.ч.) ', text)
    text = re.sub(r'^\(преим\.?\s*pl\)\s*', '(преим. во мн.ч.) ', text)
    text = re.sub(r'^\(pl\s*обыкн\.?\s*без измен\)\s*', '(во мн.ч. обыкн. без изменений) ', text)
    text = re.sub(r'^\(pl\)\s*$', '(употр. во мн.ч.)', text)
    text = re.sub(r'^\(pl\)\s*', '(во мн.ч.) ', text)
    text = re.sub(r'^pl\s+', 'во мн.ч. ', text, flags=re.IGNORECASE)
    text = re.sub(r'\bобыкн\s+pl\b', 'обыкн. во мн.ч.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bпреим\s+pl\b', 'преим. во мн.ч.', text, flags=re.IGNORECASE)
    text = re.sub(r'\b\(pl\)\b', '(во мн.ч.)', text)
    text = re.sub(r'\b\(the\)\s*во мн\.ч\.', '(the; во мн.ч.)', text)
    return text.strip()

count_pl = 0
for it in data:
    for m in it.get('meanings', []):
        old_t = m.get('translation', '')
        new_t = clean_pl_patterns(old_t)
        if old_t != new_t:
            count_pl += 1
            if count_pl <= 25:
                print(f"[{it['word']:12}] {repr(old_t)} -> {repr(new_t)}")

print(f"\nTotal matches cleaned: {count_pl}")
