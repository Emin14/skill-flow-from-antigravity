# -*- coding: utf-8 -*-
"""
Resolve all label/abbreviation translations (e.g. 'тех', 'уст', 'мор', 'вид', 'to', 'a')
and repair with genuine full Russian translations from Muller 2021.
"""

import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

# Helper to find all sub-meanings in Muller body
def extract_meanings_from_body(body):
    # Split body by numbered markers 1), 2), 3)... or ♦ or ¬
    # Also clean italic tags
    clean_body = re.sub(r'</?[a-z]+>', '', body)
    return clean_body

ABBREVIATIONS = {
    'тех', 'уст', 'мор', 'юр', 'разг', 'амер', 'воен', 'рел', 'муз', 'авт', 'ав',
    'горн', 'сл', 'карт', 'с-х', 'с.-х', 'книжн', 'шутл', 'ирон', 'бран', 'библ',
    'анат', 'биол', 'бот', 'грам', 'зоол', 'лингв', 'мат', 'мед', 'мин', 'полит',
    'психол', 'рад', 'спорт', 'строит', 'театр', 'физ', 'филос', 'фин', 'фото',
    'хим', 'шахм', 'экон', 'эл'
}

# Test finding replacements
fixes_needed = []

for entry in oxford:
    w = entry['word']
    base = re.sub(r'\d+$', '', w).lower()
    for m in entry.get('meanings', []):
        tr = m.get('translation', '').strip()
        tr_low = tr.lower().rstrip('.')
        
        # Check if translation is an abbreviation or single letter or fragment
        if tr_low in ABBREVIATIONS or tr_low in ('б', 'г', 'и', 'тж', 'вид', 'уте', 'a', 'to', 'a hard', 'в значении прилагательного -', '= inkwell'):
            fixes_needed.append((w, m.get('id'), tr, m.get('examples')))

print(f"Found {len(fixes_needed)} abbreviation/fragment translations needing precision replacement:")
for w, mid, tr, exs in fixes_needed[:30]:
    print(f"  Word: {w:12} ID: {mid:2} tr: {repr(tr):20} exs: {exs}")
