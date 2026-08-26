# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

def clean_all_pl(text):
    if not text: return ""
    text = re.sub(r'\(pl\s+без\s+измен\)', '(во мн.ч. без изменений)', text, flags=re.IGNORECASE)
    text = re.sub(r'\(pl\s+тж\s+без\s+измен\)', '(во мн.ч. также без изменений)', text, flags=re.IGNORECASE)
    text = re.sub(r'\(употр\s+как\s+pl\)', '(употр. как во мн.ч.)', text, flags=re.IGNORECASE)
    text = re.sub(r'\bчаще\s+pl\b', 'чаще во мн.ч.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bpl\b', 'во мн.ч.', text, flags=re.IGNORECASE)
    text = re.sub(r'\(L\.\)', '(Lady)', text)
    return text

print("=== CHECK CLEANING ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'pl' in t.lower() or '(L.)' in t:
            print(f"[{it['word']:12}] {repr(t)} -> {repr(clean_all_pl(t))}")
