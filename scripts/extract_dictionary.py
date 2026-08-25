# -*- coding: utf-8 -*-
"""
Этап 1: Извлечение текста из обоих PDF и построение индекса словарных статей.

Создаёт dictionary_index.json с полным текстом каждой статьи.
"""

import json
import re
import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# ── Пути к файлам ────────────────────────────────────────────────────────
PARSED_PDF = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf'
ORIGINAL_PDF = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'

def extract_pdf_text(path):
    """Extract all text from a PDF, page by page."""
    doc = pymupdf.open(path)
    pages = []
    for page in doc:
        pages.append(page.get_text())
    doc.close()
    return "\n".join(pages)

def clean_text(text):
    """Remove control characters but keep valid unicode."""
    # Remove control chars except newline, tab
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    return cleaned

def build_entry_index(text):
    """
    Build an index of dictionary entries from the full PDF text.
    
    Returns dict: {headword_lower: [{headword, start, end, text, homonym}]}
    
    Dictionary entries start with a headword pattern:
    - word [transcription]
    - word I [transcription]
    - word-compound [transcription]
    """
    # Pattern to match headword at start of line
    # Headword: Latin letters, possibly with hyphen, space, optional Roman numeral,
    # then space and [ for transcription
    # Also handle: headword [transcription] without Roman numeral
    headword_pattern = re.compile(
        r'^([A-Za-z][\w\'-]*(?:\s[\w\'-]+)?)'  # headword (possibly multi-word like "ice cream")
        r'(?:\s+(I{1,3}V?|IV|V|VI{0,3}))?'     # optional Roman numeral
        r'\s+\['                                  # space + opening bracket for transcription
        , re.MULTILINE
    )
    
    entries = []
    for match in headword_pattern.finditer(text):
        headword = match.group(1).strip()
        homonym = match.group(2) if match.group(2) else None
        start = match.start()
        entries.append({
            'headword': headword,
            'headword_lower': headword.lower(),
            'homonym': homonym,
            'start': start,
        })
    
    # Set end positions (each entry ends where the next begins)
    for i in range(len(entries) - 1):
        entries[i]['end'] = entries[i + 1]['start']
    if entries:
        entries[-1]['end'] = len(text)
    
    # Extract text for each entry
    for entry in entries:
        entry['text'] = text[entry['start']:entry['end']].strip()
    
    # Build lookup dict: headword_lower -> list of entries
    index = {}
    for entry in entries:
        key = entry['headword_lower']
        if key not in index:
            index[key] = []
        index[key].append({
            'headword': entry['headword'],
            'homonym': entry['homonym'],
            'text': entry['text'],
        })
    
    return index, len(entries)

# ── Main ─────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("=" * 60)
    print("ЭТАП 1: Извлечение текста и построение индекса")
    print("=" * 60)
    
    # 1. Extract parsed PDF
    print("\n[1/4] Извлечение текста из спарсенного PDF...")
    parsed_text = extract_pdf_text(PARSED_PDF)
    parsed_text = clean_text(parsed_text)
    print(f"       Извлечено {len(parsed_text):,} символов")
    
    # 2. Extract original PDF
    print("[2/4] Извлечение текста из оригинального PDF...")
    original_text = extract_pdf_text(ORIGINAL_PDF)
    original_text = clean_text(original_text)
    print(f"       Извлечено {len(original_text):,} символов")
    
    # 3. Build index from parsed PDF
    print("[3/4] Построение индекса из спарсенного PDF...")
    parsed_index, parsed_count = build_entry_index(parsed_text)
    print(f"       Найдено {parsed_count:,} статей, {len(parsed_index):,} уникальных headword")
    
    # 4. Build index from original PDF
    print("[4/4] Построение индекса из оригинального PDF...")
    original_index, original_count = build_entry_index(original_text)
    print(f"       Найдено {original_count:,} статей, {len(original_index):,} уникальных headword")
    
    # Save indices
    # We save the parsed index (primary) and original index (verification)
    # But text can be very large, so we save to separate files
    
    with open('scripts/parsed_index.json', 'w', encoding='utf-8') as f:
        json.dump(parsed_index, f, ensure_ascii=False)
    print(f"\nСохранён scripts/parsed_index.json ({len(parsed_index):,} headwords)")
    
    with open('scripts/original_index.json', 'w', encoding='utf-8') as f:
        json.dump(original_index, f, ensure_ascii=False)
    print(f"Сохранён scripts/original_index.json ({len(original_index):,} headwords)")
    
    # Quick test: look up a few words
    test_words = ['care', 'charge', 'break', 'light', 'run', 'set', 'abandon', 'ability']
    print("\n--- Тест поиска ---")
    for w in test_words:
        p = parsed_index.get(w, [])
        o = original_index.get(w, [])
        homonyms_p = [e['homonym'] for e in p if e['homonym']]
        print(f"  {w}: parsed={len(p)} entries (homonyms: {homonyms_p}), original={len(o)} entries")
    
    print("\n✅ Этап 1 завершён!")
