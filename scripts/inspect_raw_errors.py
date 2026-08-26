# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('audit_report_raw.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

print("=== TRANSLATION ERRORS SAMPLE (first 25) ===")
for t in raw['translation_error'][:25]:
    print(f"Word: {t['word']:15s} | M_ID: {t['meaning_id']:2d} | Val: {repr(t['current_value']):30s} | Pages: {t['pages']}")

print("\n=== EXAMPLE ERRORS SAMPLE (first 25) ===")
for e in raw['example_error'][:25]:
    print(f"Word: {e['word']:15s} | M_ID: {e['meaning_id']:2d} | Ex_en: {repr(e['example_en']):30s} | Ex_ru: {repr(e['current_value']):30s} | Pages: {e['pages']}")

print("\n=== PHRASE ERRORS (all 20) ===")
for p in raw['phrase_error']:
    print(f"Word: {p['word']:15s} | P_idx: {p['phrase_index']:2d} | Ph_en: {repr(p['phrase_en']):30s} | Ph_ru: {repr(p['current_value']):30s} | Pages: {p['pages']}")
