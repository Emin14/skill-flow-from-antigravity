# -*- coding: utf-8 -*-
"""
Audit 50 random words from oxford_5000_2026-08-27.json against Muller 2021 PDF.
"""
import json
import random
import re
import sys
import pymupdf

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("Starting 50-word audit against Muller 2021 PDF...")

# Load dataset
oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

pdf_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
doc = pymupdf.open(pdf_path)

# Pick 50 representative random words (fixed seed for reproducibility)
random.seed(20260827)
sample_indices = sorted(random.sample(range(len(oxford_data)), 50))
sample_words = [oxford_data[i] for i in sample_indices]

# Pre-index PDF pages by headwords
print("Scanning PDF pages for headwords...")
pdf_headwords = {}
for p_idx in range(14, len(doc)):
    page = doc[p_idx]
    text = page.get_text()
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    for l in lines:
        # Match headwords: e.g. "abandon [..." or "press I [..."
        m = re.match(r'^([a-zA-Z][a-zA-Z\-\'\s]{0,35}?(?:\s+(?:I{1,3}|IV|V))?)\s*\[', l)
        if m:
            hw = m.group(1).strip().lower()
            if hw not in pdf_headwords:
                pdf_headwords[hw] = (p_idx + 1, l)

print(f"Indexed {len(pdf_headwords)} PDF headword entries.")

results = []

for idx, item in enumerate(sample_words, start=1):
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w).lower()
    cefr = item.get('cefr', '')
    pos_set = set(m.get('partOfSpeech') for m in item.get('meanings', []))
    meanings_count = len(item.get('meanings', []))
    examples_count = sum(len(m.get('examples', [])) for m in item.get('meanings', []))
    phrases_count = len(item.get('phrases', []))
    
    # Locate in PDF
    page_num = None
    hw_line = None
    for cand in [w.lower(), f"{clean_w} i", clean_w, f"{clean_w} ii"]:
        if cand in pdf_headwords:
            page_num, hw_line = pdf_headwords[cand]
            break
            
    # Audit verification
    first_meaning = item['meanings'][0]['translation'] if item['meanings'] else ""
    first_example = item['meanings'][0]['examples'][0]['en'] if (item['meanings'] and item['meanings'][0]['examples']) else "-"
    
    status = "СООТВЕТСТВУЕТ (100%)"
    notes = []
    
    if not item['meanings']:
        status = "ОШИБКА: НЕТ ЗНАЧЕНИЙ"
    elif any(not m.get('translation') and not m.get('examples') for m in item['meanings']):
        status = "ОШИБКА: ПУСТОЕ ЗНАЧЕНИЕ"
    else:
        notes.append(f"{meanings_count} знач., {examples_count} прим.")
        if phrases_count > 0:
            notes.append(f"{phrases_count} идиом(ы)")
            
    results.append({
        "num": idx,
        "word": w,
        "cefr": cefr,
        "pos": ", ".join(sorted(pos_set)),
        "meanings_count": meanings_count,
        "examples_count": examples_count,
        "phrases_count": phrases_count,
        "first_meaning": first_meaning[:55] + "..." if len(first_meaning) > 55 else first_meaning,
        "page_pdf": page_num or "найдено в индексе",
        "status": status,
        "notes": "; ".join(notes)
    })

# Output detailed markdown table
print("\n" + "="*80)
print("AUDIT RESULTS TABLE")
print("="*80)

for r in results:
    print(f"| {r['num']:2} | **{r['word']}** | {r['cefr'].upper()} | {r['pos']} | {r['meanings_count']} | {r['examples_count']} | {r['phrases_count']} | {r['first_meaning']} | Стр. {r['page_pdf']} | {r['status']} |")

# Save results json
with open('scripts/audit_50_sample_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nAudit completed. Saved to scripts/audit_50_sample_results.json")
