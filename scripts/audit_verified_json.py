# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import time
import pymupdf

from parse_entry_meanings import is_headword_span, normalize_text_nfc

sys.stdout.reconfigure(encoding='utf-8')

print("=== Running Deep Audit Scanner on oxford_5000_verified.json ===")

with open('oxford_5000_verified.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

SUSPICIOUS_RU_START = re.compile(r'^(анс|мерческ|идическ|овое|отное|ой\/|ный |аться |ельба|ия |ость |ение |ание |ство |ный |ная |ное |ные |ого |ому |ых |им |ей |ом |е |а |л |р |с |м |я |=|£|\/|\?)')

findings = {
    'structural_error': [],
    'translation_error': [],
    'example_error': [],
    'phrase_error': []
}

for item in data:
    word = item.get('word', '')
    meanings = item.get('meanings', [])
    phrases = item.get('phrases', [])

    for m in meanings:
        m_id = m.get('id')
        trans = m.get('translation', '')
        examples = m.get('examples', [])

        if SUSPICIOUS_RU_START.search(trans) or len(trans.strip()) <= 2 or trans in ['=', '£', '/', '?', 'а', 'е', 'л', 'р', 'с', 'м', 'я']:
            findings['translation_error'].append({'word': word, 'm_id': m_id, 'trans': trans})

        for ex_idx, ex in enumerate(examples):
            ex_en = ex.get('en', '')
            ex_ru = ex.get('ru', '')
            if 'register' in ex:
                findings['structural_error'].append({'word': word, 'm_id': m_id, 'ex_idx': ex_idx, 'reg': ex.get('register')})
            if SUSPICIOUS_RU_START.search(ex_ru) or (len(ex_ru.strip()) <= 2 and len(ex_en) > 3) or ex_ru in ['=', '£', '/', '?', 'а', 'е', 'л', 'р', 'с', 'м', 'я']:
                findings['example_error'].append({'word': word, 'm_id': m_id, 'ex_idx': ex_idx, 'ex_en': ex_en, 'ex_ru': ex_ru})

    for p_idx, ph in enumerate(phrases):
        ph_en = ph.get('en', '')
        ph_ru = ph.get('ru', '')
        if 'register' in ph:
            findings['structural_error'].append({'word': word, 'p_idx': p_idx, 'reg': ph.get('register')})
        if SUSPICIOUS_RU_START.search(ph_ru) or len(ph_ru.strip()) <= 2 or ph_ru in ['=', '£', '/', '?', 'а', 'е', 'л', 'р', 'с', 'м', 'я']:
            findings['phrase_error'].append({'word': word, 'p_idx': p_idx, 'ph_en': ph_en, 'ph_ru': ph_ru})

print(f"Audit Results on oxford_5000_verified.json:")
print(f"  Structural errors: {len(findings['structural_error'])}")
print(f"  Translation errors: {len(findings['translation_error'])}")
print(f"  Example errors: {len(findings['example_error'])}")
print(f"  Phrase errors: {len(findings['phrase_error'])}")

if findings['translation_error']:
    print("\nSample Translation Errors:")
    for t in findings['translation_error'][:10]:
        print(t)

if findings['example_error']:
    print("\nSample Example Errors:")
    for e in findings['example_error'][:10]:
        print(e)

if findings['phrase_error']:
    print("\nSample Phrase Errors:")
    for p in findings['phrase_error'][:10]:
        print(p)
