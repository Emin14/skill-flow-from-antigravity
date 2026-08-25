# -*- coding: utf-8 -*-
"""
Compare meanings from oxford_5000.json against two PDF sources:
1. Original: Мюллер В.К.,...-2021.a4.pdf
2. Parsed:   Мюллер В.К.,...-2021 - спарсенное.pdf

Picks 100 random words and creates a comparison table.
"""

import json
import sys
import re
import random
import pymupdf  # fitz

sys.stdout.reconfigure(encoding='utf-8')

# ── 1. Load oxford_5000.json ──────────────────────────────────────────────
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

print(f"Loaded {len(oxford)} words from oxford_5000.json")

# Build a dict: word -> list of meanings (translation strings)
word_meanings = {}
for entry in oxford:
    w = entry['word'].lower().strip()
    meanings = []
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        meanings.append(f"[{pos}] {tr}")
    word_meanings[w] = meanings

# ── 2. Extract full text from both PDFs ───────────────────────────────────
def extract_pdf_text(path):
    """Extract all text from a PDF, page by page."""
    doc = pymupdf.open(path)
    pages = []
    for page in doc:
        pages.append(page.get_text())
    doc.close()
    full_text = "\n".join(pages)
    return full_text

print("Extracting text from parsed PDF...")
parsed_text = extract_pdf_text(
    'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf'
)
print(f"  Parsed PDF: {len(parsed_text)} chars")

print("Extracting text from original PDF...")
original_text = extract_pdf_text(
    'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
)
print(f"  Original PDF: {len(original_text)} chars")

# ── 3. Build lookup function ──────────────────────────────────────────────
def find_word_entry_in_text(word, text, context_chars=500):
    """
    Find a dictionary entry for a word in the PDF text.
    Returns the text fragment containing the entry.
    """
    # Try various patterns to find the word as a headword
    # Dictionary entries typically start with the word followed by transcription in brackets
    patterns = [
        # word [transcription] - standard dictionary format
        rf'(?:^|\n){re.escape(word)}\s*\[[^\]]+\]',
        # word [transcription] with possible line breaks
        rf'(?:^|\n){re.escape(word)}\s+\[',
        # Just the word at start of line
        rf'(?:^|\n){re.escape(word)}\s',
    ]
    
    for pattern in patterns:
        matches = list(re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE))
        if matches:
            # Take the first match
            match = matches[0]
            start = match.start()
            # Get context after the match - up to the next headword or context_chars
            end = min(start + context_chars, len(text))
            fragment = text[start:end].strip()
            # Try to cut at next headword (word at start of line followed by bracket)
            lines = fragment.split('\n')
            result_lines = [lines[0]]
            for line in lines[1:]:
                # Check if this line looks like a new headword entry
                if re.match(r'^[a-zA-Z][\w-]*\s+\[', line):
                    break
                result_lines.append(line)
            return '\n'.join(result_lines)
    
    return None


# ── 4. Pick 100 random words and compare ─────────────────────────────────
random.seed(42)  # For reproducibility
all_words = list(word_meanings.keys())
sample_words = sorted(random.sample(all_words, 100))

print(f"\nSelected {len(sample_words)} random words for comparison")
print("Looking up entries in PDFs...\n")

results = []
found_in_parsed = 0
found_in_original = 0

for i, word in enumerate(sample_words):
    current_meanings = word_meanings[word]
    current_str = " | ".join(current_meanings)
    
    parsed_entry = find_word_entry_in_text(word, parsed_text)
    original_entry = find_word_entry_in_text(word, original_text)
    
    if parsed_entry:
        found_in_parsed += 1
    if original_entry:
        found_in_original += 1
    
    results.append({
        'word': word,
        'current': current_str,
        'parsed_pdf': parsed_entry or "(не найдено)",
        'original_pdf': original_entry or "(не найдено)"
    })
    
    if (i + 1) % 20 == 0:
        print(f"  Processed {i+1}/100 words...")

print(f"\nFound in parsed PDF: {found_in_parsed}/100")
print(f"Found in original PDF: {found_in_original}/100")

# ── 5. Save results ──────────────────────────────────────────────────────
# Save as JSON for detailed analysis
with open('comparison_100_words.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

# Save as CSV for easy viewing
import csv
with open('comparison_100_words.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['Слово', 'Текущее (oxford_5000.json)', 'Оригинальный PDF (.a4.pdf)', 'Спарсенный PDF'])
    for r in results:
        writer.writerow([
            r['word'],
            r['current'],
            r['original_pdf'],
            r['parsed_pdf']
        ])

print("\nResults saved to:")
print("  - comparison_100_words.json")
print("  - comparison_100_words.csv")

# ── 6. Print summary table for first 20 words ────────────────────────────
print("\n" + "=" * 120)
print("SAMPLE COMPARISON (first 20 words)")
print("=" * 120)

for r in results[:20]:
    print(f"\n{'─' * 120}")
    print(f"📖 {r['word']}")
    print(f"  ТЕКУЩЕЕ:      {r['current'][:200]}")
    parsed_short = r['parsed_pdf'][:200] if r['parsed_pdf'] else "(не найдено)"
    original_short = r['original_pdf'][:200] if r['original_pdf'] else "(не найдено)"
    print(f"  ОРИГИНАЛ PDF: {original_short}")
    print(f"  СПАРСЕННОЕ:   {parsed_short}")
