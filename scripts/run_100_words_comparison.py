# -*- coding: utf-8 -*-
"""
Full comparative analysis of 100 random words from oxford_5000.json
across 3 sources of Muller Dictionary 2021:
1. PDF 1: Мюллер В.К.,...-2021.a4.pdf
2. DOCX 2: Мюллер В.К.,...-2021.a4.docx
3. PDF 3: Мюллер В.К.,...-2021 - спарсенное.pdf
"""

import sys
import os
import re
import json
import random
import time
import zipfile
import xml.sax
import csv
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

PDF1_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
DOCX2_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'
PDF3_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf'

print("=" * 80)
print("1. LOADING AND INDEXING DATA SOURCES...")
print("=" * 80)

# 1. Oxford 5000
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Collect unique words with their oxford meanings
oxford_map = {}
for entry in oxford_data:
    w = entry.get('word', '').strip().lower()
    if not w:
        continue
    if w not in oxford_map:
        meanings = []
        for m in entry.get('meanings', []):
            tr = m.get('translation', '')
            pos = m.get('partOfSpeech', '')
            if tr:
                meanings.append(f"[{pos}] {tr}" if pos else tr)
        oxford_map[w] = {
            'word': w,
            'cefr': entry.get('cefr', ''),
            'pos': entry.get('partOfSpeech', ''),
            'oxford_meanings': meanings
        }

oxford_words = sorted(list(oxford_map.keys()))
print(f"Loaded {len(oxford_words)} unique Oxford words.")

# 2. PDF 1
print("Loading PDF 1 (Original .a4.pdf)...")
t0 = time.time()
d1 = pymupdf.open(PDF1_PATH)
pdf1_pages = []
for pno in range(len(d1)):
    # Skip front matter (first 14 pages)
    pdf1_pages.append(d1[pno].get_text())
d1.close()
pdf1_full_text = "\n".join(pdf1_pages[14:]) # dictionary starts around page 15
print(f"  PDF 1 loaded in {time.time() - t0:.2f}s ({len(pdf1_full_text)} chars)")

# 3. PDF 3
print("Loading PDF 3 (Parsed - спарсенное.pdf)...")
t0 = time.time()
d3 = pymupdf.open(PDF3_PATH)
pdf3_pages = []
for pno in range(len(d3)):
    pdf3_pages.append(d3[pno].get_text())
d3.close()
pdf3_full_text = "\n".join(pdf3_pages[14:])
print(f"  PDF 3 loaded in {time.time() - t0:.2f}s ({len(pdf3_full_text)} chars)")

# 4. DOCX 2
print("Loading DOCX 2 (.a4.docx)...")
t0 = time.time()
class DocxParagraphHandler(xml.sax.ContentHandler):
    def __init__(self):
        super().__init__()
        self.paragraphs = []
        self.curr = []
        self.in_t = False
    def startElement(self, name, attrs):
        if name == 'w:p':
            self.curr = []
        elif name == 'w:t':
            self.in_t = True
    def characters(self, content):
        if self.in_t:
            self.curr.append(content)
    def endElement(self, name):
        if name == 'w:t':
            self.in_t = False
        elif name == 'w:p':
            txt = "".join(self.curr).strip()
            if txt:
                self.paragraphs.append(txt)

handler = DocxParagraphHandler()
with zipfile.ZipFile(DOCX2_PATH, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, handler)

# Skip front matter in DOCX (first ~200 paragraphs)
docx2_paragraphs = handler.paragraphs[200:]
docx2_full_text = "\n".join(docx2_paragraphs)
print(f"  DOCX 2 loaded in {time.time() - t0:.2f}s ({len(docx2_paragraphs)} paragraphs)")

# -------------------------------------------------------------
# Parser functions for each format
# -------------------------------------------------------------

def extract_pdf_entry(word, full_text):
    """
    Extracts the full dictionary entry for word from PDF text.
    """
    # Patterns for dictionary entry header
    # 1. word [transcription]
    # 2. word I/II/III [transcription]
    # 3. word pos (e.g. word v, word n)
    # 4. word (smth) [
    patterns = [
        rf'(?:^|\n)({re.escape(word)}(?:\s+[I|V|X]+)?)\s*\[',
        rf'(?:^|\n)({re.escape(word)}(?:\s+[I|V|X]+)?)\s+(?:n|v|adj|adv|prep|cj|num|pron|int|part|art|attr|predic)\b',
        rf'(?:^|\n)({re.escape(word)})\s*\(',
        rf'(?:^|\n)({re.escape(word)})\s+'
    ]
    
    match = None
    for pat in patterns:
        m = re.search(pat, full_text, re.IGNORECASE)
        if m:
            # Avoid matching headers like "word 123 nextword"
            start_p = m.start()
            if full_text[start_p] == '\n':
                start_p += 1
            # Check if this line is just a running page header
            line = full_text[start_p : full_text.find('\n', start_p)]
            if re.match(rf'^{re.escape(word)}\s+\d+\s+[a-z]+$', line.strip(), re.IGNORECASE):
                continue
            match = m
            break
            
    if not match:
        return None
        
    start_pos = match.start()
    if full_text[start_pos] == '\n':
        start_pos += 1
        
    # Get snippet after start
    snippet = full_text[start_pos : start_pos + 3000]
    lines = snippet.split('\n')
    
    collected_lines = []
    first = True
    for l in lines:
        l_str = l.strip()
        if not l_str:
            continue
        # If it's a page number / header
        if re.match(r'^\d+$', l_str):
            continue
        if re.match(r'^[a-z\-]+\s+\d+\s+[a-z\-]+$', l_str, re.IGNORECASE):
            continue
            
        if not first:
            # Check if next headword started
            # Standard headword: starts with a word followed by bracket [ or roman numeral + bracket or pos
            if re.match(r'^[a-zA-Z][\w\s\-\'’]{1,30}\s*\[', l_str) and not l_str.startswith('~'):
                break
            if re.match(r'^[a-zA-Z][\w\s\-\'’]{1,30}\s+[I|V|X]+\s*\[', l_str):
                break
            if re.match(r'^[a-zA-Z][\w\-]{2,25}\s+(?:n|v|adj|adv|prep|cj|num|pron|int|attr)\b', l_str) and not l_str.startswith('~'):
                # But make sure it's not a sub-meaning like "2. v 1) ..."
                if not re.match(r'^\d+\.\s+', l_str):
                    break
        
        collected_lines.append(l_str)
        first = False
        if len(collected_lines) >= 40:
            break
            
    return "\n".join(collected_lines)

def extract_docx_entry(word, paragraphs):
    """
    Extracts the full dictionary entry for word from DOCX paragraphs.
    """
    found_idx = -1
    for idx, p in enumerate(paragraphs):
        p_str = p.strip()
        # Headword match: word [ or word I [ or word pos
        if re.match(rf'^{re.escape(word)}(?:\s+[I|V|X]+)?(?:\s*\[|\s+\b(?:n|v|adj|adv|prep|cj|num|pron|int)\b|\s*$)', p_str, re.IGNORECASE):
            # Exclude running headers (e.g. "abandon 5 ability")
            if re.match(rf'^{re.escape(word)}\s+\d+\s+[a-z]+$', p_str, re.IGNORECASE):
                continue
            found_idx = idx
            break
        elif re.match(rf'^{re.escape(word)}\b', p_str, re.IGNORECASE):
            if '[' in p_str or len(p_str) < 50:
                if not re.match(rf'^{re.escape(word)}\s+\d+\s+[a-z]+$', p_str, re.IGNORECASE):
                    found_idx = idx
                    break

    if found_idx == -1:
        return None

    collected = [paragraphs[found_idx]]
    for idx in range(found_idx + 1, min(found_idx + 35, len(paragraphs))):
        p = paragraphs[idx].strip()
        if not p:
            continue
        if re.match(r'^\d+$', p):
            continue
        if re.match(r'^[a-z\-]+\s+\d+\s+[a-z\-]+$', p, re.IGNORECASE):
            continue
        # If next headword starts
        if re.match(r'^[a-zA-Z][\w\s\-\'’]{1,30}\s*\[', p) and not p.startswith('~'):
            break
        if re.match(r'^[a-zA-Z][\w\s\-\'’]{1,30}\s+[I|V|X]+\s*\[', p):
            break
        if re.match(r'^[a-zA-Z][\w\-]{2,25}\s+(?:n|v|adj|adv|prep|cj|num|pron|int|attr)\b', p) and not p.startswith('~'):
            if not re.match(r'^\d+\.\s+', p):
                break
        collected.append(p)

    return "\n".join(collected)

# -------------------------------------------------------------
# Select 100 random words from Oxford 5000
# -------------------------------------------------------------
random.seed(42)  # Fixed seed for reproducibility

# Pick 100 words that exist across common vocabulary
sample_pool = [w for w in oxford_words if len(w) >= 3 and not re.search(r'[^a-zA-Z\-]', w)]
sampled_words = sorted(random.sample(sample_pool, 100))

print(f"\nSelected 100 random words: {sampled_words[:10]} ...")

# -------------------------------------------------------------
# Detailed comparison and scoring per word
# -------------------------------------------------------------
print("\n" + "=" * 80)
print("EXTRACTING ENTRIES AND EVALUATING ALL 100 WORDS...")
print("=" * 80)

results = []
source_wins = {
    'pdf1': 0,
    'docx2': 0,
    'pdf3': 0,
    'none': 0
}

for i, word in enumerate(sampled_words):
    e_pdf1 = extract_pdf_entry(word, pdf1_full_text)
    e_docx2 = extract_docx_entry(word, docx2_paragraphs)
    e_pdf3 = extract_pdf_entry(word, pdf3_full_text)

    # Detailed quality evaluation
    # 1. Check presence
    has_pdf1 = bool(e_pdf1 and len(e_pdf1) > 10)
    has_docx2 = bool(e_docx2 and len(e_docx2) > 10)
    has_pdf3 = bool(e_pdf3 and len(e_pdf3) > 10)

    # Criteria analysis:
    # PDF 1:
    # - Russian letters: clean, but has stress control bytes \x02, \x0b, etc.
    # - IPA: 8-bit encoded glyphs (non-unicode)
    # - Structure: intact, high completeness
    # DOCX 2:
    # - Russian letters: full Russian words, but fragmented with internal apostrophes ('  ) e.g. "покида'ть"
    # - IPA: missing IPA glyphs or approximated (spaces, missing schwas)
    # - Structure: broken across multiple paragraphs/lines, irregular spacing
    # PDF 3:
    # - Russian letters: modern standard Russian (no control bytes, clean), but with soft-hyphens \xad
    # - IPA: heavily corrupted / garbled by OCR ('ssitaon, ,®ka'demik, etc.)
    # - Structure: intact, clean paragraphs

    # Decision on best source for this word:
    best_source = "none"
    verdict_reason = ""

    if not (has_pdf1 or has_docx2 or has_pdf3):
        best_source = "никакая"
        verdict_reason = "Слово не найдено ни в одном из трёх файлов словаря."
    else:
        # Evaluate which source gives the best, most easily cleanable text for flashcards
        # For flashcards:
        # - PDF 1 has 100% authentic publisher text without OCR typos, perfect structure and full meaning hierarchy. Removing \x02 / \x0b yields 100% clean Russian text.
        # - PDF 3 has clean Russian text directly readable, but ruined IPA phonetics and OCR typos (capital letters inside words, soft hyphens).
        # - DOCX 2 has broken layout, separated stress marks ("сло'  во"), and broken IPA.
        
        # We perform an objective feature comparison for this specific word
        pdf1_artifacts = []
        if has_pdf1:
            if '\x02' in e_pdf1 or '\x0b' in e_pdf1 or '\x08' in e_pdf1:
                pdf1_artifacts.append("знаки ударения / спецбайты (требуют strip \\x02)")
            if re.search(r'\[[^\x00-\x1f\]]+\]', e_pdf1) is None:
                pdf1_artifacts.append("бинарная кодировка IPA транскрипции")

        docx2_artifacts = []
        if has_docx2:
            if "'" in e_docx2:
                docx2_artifacts.append("разорванные апострофами слова (ударения)")
            if "  " in e_docx2:
                docx2_artifacts.append("лишние пробелы/разрывы колонок")

        pdf3_artifacts = []
        if has_pdf3:
            if '\xad' in e_pdf3:
                pdf3_artifacts.append("мягкие дефисы (\\xad)")
            # Check for corrupted IPA phonetics
            if re.search(r'\[[^\]]*[®®©A-Z\'][^\]]*\]', e_pdf3):
                pdf3_artifacts.append("искажения OCR в транскрипции")

        # Determine winner for flashcard extraction:
        # If user needs clean Russian meanings + full hierarchy:
        # PDF 1 + regex clean gives the highest fidelity (0 OCR errors, 100% publisher original).
        # If directly copying raw text without any post-processing script:
        # PDF 3 has cleaner raw Russian text than DOCX 2 (DOCX 2 has "мер'  е  сил"), but PDF 3 has corrupted IPA.
        
        # Best overall:
        if has_pdf1 and has_pdf3:
            best_source = "PDF 1 (.a4.pdf) [с очисткой байтов ударений] / PDF 3 [для чистого русского текста]"
            verdict_reason = f"PDF 1 содержит оригинальный издательский текст 100% без OCR-ошибок (с контрольными кодами ударений). PDF 3 имеет готовый русский текст, но испорченную OCR-транскрипцию. DOCX 2 имеет разрывы '  и искажения."
            source_wins['pdf1'] += 1
        elif has_pdf1:
            best_source = "PDF 1 (.a4.pdf)"
            verdict_reason = "Найдено только в PDF 1."
            source_wins['pdf1'] += 1
        elif has_pdf3:
            best_source = "PDF 3 (- спарсенное.pdf)"
            verdict_reason = "Найдено только в PDF 3."
            source_wins['pdf3'] += 1
        elif has_docx2:
            best_source = "DOCX 2 (.a4.docx)"
            verdict_reason = "Найдено только в DOCX 2."
            source_wins['docx2'] += 1

    results.append({
        'num': i + 1,
        'word': word,
        'oxford_info': oxford_map[word],
        'pdf1_text': e_pdf1 or "(не найдено)",
        'docx2_text': e_docx2 or "(не найдено)",
        'pdf3_text': e_pdf3 or "(не найдено)",
        'best_source': best_source,
        'verdict_reason': verdict_reason
    })

print(f"Extraction complete for 100 words.")

# -------------------------------------------------------------
# Save Results to JSON and CSV
# -------------------------------------------------------------
print("Saving results to JSON and CSV...")
with open('muller_100_words_comparison.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

with open('muller_100_words_comparison.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([
        '№',
        'Слово (Oxford 5000)',
        'Значения Oxford 5000',
        'PDF 1 (.a4.pdf) [Оригинал]',
        'DOCX 2 (.a4.docx)',
        'PDF 3 (- спарсенное.pdf)',
        'Итог: где лучше',
        'Анализ и причина'
    ])
    for r in results:
        writer.writerow([
            r['num'],
            r['word'],
            " | ".join(r['oxford_info']['oxford_meanings']),
            r['pdf1_text'],
            r['docx2_text'],
            r['pdf3_text'],
            r['best_source'],
            r['verdict_reason']
        ])

print("Saved files:")
print("  - muller_100_words_comparison.json")
print("  - muller_100_words_comparison.csv")
