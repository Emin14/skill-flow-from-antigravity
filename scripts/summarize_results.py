# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('muller_100_words_comparison.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total words: {len(data)}")
found_pdf1 = sum(1 for r in data if r['pdf1_text'] != '(не найдено)')
found_docx2 = sum(1 for r in data if r['docx2_text'] != '(не найдено)')
found_pdf3 = sum(1 for r in data if r['pdf3_text'] != '(не найдено)')

print(f"Found in PDF 1: {found_pdf1}/100")
print(f"Found in DOCX 2: {found_docx2}/100")
print(f"Found in PDF 3: {found_pdf3}/100")

# Detailed metrics
# 1. OCR typos in IPA brackets:
ipa_corrupted_pdf3 = 0
for r in data:
    txt = r['pdf3_text']
    # Check if contains OCR symbols in IPA bracket like @, s for ash, ® etc.
    if re_match := json.dumps(txt):
        if any(c in txt for c in ['®', '©', '™', 'sks', 'oænd', 'zii', 'ssi', 'A']):
            ipa_corrupted_pdf3 += 1

print(f"PDF 3 entries with detected OCR phonetic corruptions: {ipa_corrupted_pdf3}/100")

# 2. DOCX broken stress marks:
docx_broken_stress = sum(1 for r in data if "'" in r['docx2_text'] and "  " in r['docx2_text'])
print(f"DOCX entries with broken stress marks / column gaps: {docx_broken_stress}/100")

# 3. PDF 1 control bytes (stress marks):
pdf1_control_bytes = sum(1 for r in data if '\x02' in r['pdf1_text'] or '\x0b' in r['pdf1_text'])
print(f"PDF 1 entries with authentic control byte stress marks: {pdf1_control_bytes}/100")
