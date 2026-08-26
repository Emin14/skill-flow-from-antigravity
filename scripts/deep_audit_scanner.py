# -*- coding: utf-8 -*-
"""
Auditing Engine for Subagents 2, 3, 4, 5:
- Fast indexed headword scanner across SamPolnAnglRysSlovar.pdf (pages 10-507).
- Scans oxford_5000_updated.json for:
  1. Misplaced register in examples.
  2. Truncated words / missing prefixes in translations, examples, and phrases.
  3. Single-character or placeholder translations.
  4. OCR corruptions.
- Produces audit_report.json.
"""
import sys
import os
import json
import re
import unicodedata
import time
import pymupdf

from parse_entry_meanings import is_headword_span, normalize_text_nfc

sys.stdout.reconfigure(encoding='utf-8')

print("=== Starting Fast Indexed Deep Audit of oxford_5000_updated.json ===")
t0 = time.time()

# 1. Load JSON
with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f"Loaded {len(data)} words from JSON.")

# 2. Open PDF and build word -> page index in 1 pass
pdf_doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
word_to_page = {}
word_to_entry = {}

curr_entry = None
for p in range(10, 508):
    page = pdf_doc[p]
    d = page.get_text('dict')
    page_h = page.rect.height
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 50 or y1 > page_h - 25: continue
            if not l['spans']: continue
            first_s = l['spans'][0]
            if is_headword_span(first_s):
                if curr_entry:
                    hw_clean = re.sub(r'\s+', ' ', curr_entry['hw']).strip().lower()
                    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', hw_clean, flags=re.IGNORECASE).strip()
                    if base_hw not in word_to_page:
                        word_to_page[base_hw] = []
                    word_to_page[base_hw].append(curr_entry['page'])
                    if base_hw not in word_to_entry:
                        word_to_entry[base_hw] = []
                    word_to_entry[base_hw].append(curr_entry)
                
                hw_text = ''.join(normalize_text_nfc(s['text']) for s in l['spans'] if is_headword_span(s)).strip()
                curr_entry = {'hw': hw_text, 'page': p, 'spans': list(l['spans'])}
            else:
                if curr_entry:
                    curr_entry['spans'].extend(l['spans'])

if curr_entry:
    hw_clean = re.sub(r'\s+', ' ', curr_entry['hw']).strip().lower()
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', hw_clean, flags=re.IGNORECASE).strip()
    if base_hw not in word_to_page:
        word_to_page[base_hw] = []
    word_to_page[base_hw].append(curr_entry['page'])
    if base_hw not in word_to_entry:
        word_to_entry[base_hw] = []
    word_to_entry[base_hw].append(curr_entry)

print(f"Built headword page index for {len(word_to_page)} words in {time.time()-t0:.2f}s.")

# Suspicious patterns to flag
SUSPICIOUS_RU_START = re.compile(r'^(анс|мерческ|идическ|овое|отное|ой\/|ный |аться |ельба|ия |ость |ение |ание |ство |ный |ная |ное |ные |ого |ому |ых |им |ей |ом |е |а |л |р |с |м |я |=|£|\/|\?)')

audit_findings = {
    'structural_error': [],
    'duplicate': [],
    'translation_error': [],
    'example_error': [],
    'phrase_error': [],
    'metadata_error': [],
    'OCR_corruption': [],
    'uncertain': []
}

def get_pages(word_text):
    w = re.sub(r'\d+$', '', word_text.lower()).strip()
    if w in word_to_page:
        return word_to_page[w]
    w_no_hyph = w.replace('-', ' ')
    if w_no_hyph in word_to_page:
        return word_to_page[w_no_hyph]
    return []

# Scan all entries
for item_idx, item in enumerate(data):
    word = item.get('word', '')
    meanings = item.get('meanings', [])
    phrases = item.get('phrases', [])
    pages = get_pages(word)

    # 1. Audit Meanings
    for m in meanings:
        m_id = m.get('id')
        trans = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        examples = m.get('examples', [])

        # Check translation for corruption or truncation
        if SUSPICIOUS_RU_START.search(trans) or len(trans.strip()) <= 2 or trans in ['=', '£', '/', '?', 'а', 'е', 'л', 'р', 'с', 'м', 'я']:
            audit_findings['translation_error'].append({
                'word': word,
                'meaning_id': m_id,
                'field': 'translation',
                'current_value': trans,
                'reason': 'suspicious_truncated_or_single_char',
                'pages': pages
            })

        # Check examples
        for ex_idx, ex in enumerate(examples):
            ex_en = ex.get('en', '')
            ex_ru = ex.get('ru', '')
            ex_reg = ex.get('register')

            # Check misplaced register
            if ex_reg is not None:
                audit_findings['structural_error'].append({
                    'word': word,
                    'meaning_id': m_id,
                    'example_index': ex_idx,
                    'field': 'examples.register',
                    'current_value': ex_reg,
                    'example_en': ex_en,
                    'example_ru': ex_ru,
                    'reason': 'misplaced_register_in_example',
                    'pages': pages
                })

            # Check truncated or corrupted example translation
            if SUSPICIOUS_RU_START.search(ex_ru) or (len(ex_ru.strip()) <= 2 and len(ex_en) > 3) or ex_ru in ['=', '£', '/', '?', 'а', 'е', 'л', 'р', 'с', 'м', 'я']:
                audit_findings['example_error'].append({
                    'word': word,
                    'meaning_id': m_id,
                    'example_index': ex_idx,
                    'field': 'examples.ru',
                    'example_en': ex_en,
                    'current_value': ex_ru,
                    'reason': 'suspicious_example_translation',
                    'pages': pages
                })

    # 2. Audit Phrases
    for p_idx, ph in enumerate(phrases):
        ph_en = ph.get('en', '')
        ph_ru = ph.get('ru', '')
        ph_reg = ph.get('register')

        if ph_reg is not None:
            audit_findings['structural_error'].append({
                'word': word,
                'phrase_index': p_idx,
                'field': 'phrases.register',
                'current_value': ph_reg,
                'phrase_en': ph_en,
                'phrase_ru': ph_ru,
                'reason': 'misplaced_register_in_phrase',
                'pages': pages
            })

        if SUSPICIOUS_RU_START.search(ph_ru) or len(ph_ru.strip()) <= 2 or ph_ru in ['=', '£', '/', '?', 'а', 'е', 'л', 'р', 'с', 'м', 'я']:
            audit_findings['phrase_error'].append({
                'word': word,
                'phrase_index': p_idx,
                'field': 'phrases.ru',
                'phrase_en': ph_en,
                'current_value': ph_ru,
                'reason': 'suspicious_phrase_translation',
                'pages': pages
            })

print("\nAudit Summary by Category:")
for cat, items in audit_findings.items():
    print(f"  {cat:20s}: {len(items)}")

with open('audit_report_raw.json', 'w', encoding='utf-8') as f:
    json.dump(audit_findings, f, ensure_ascii=False, indent=2)

print(f"\nSaved audit_report_raw.json in {time.time()-t0:.2f}s")
