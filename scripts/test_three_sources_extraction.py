# -*- coding: utf-8 -*-
import sys
import os
import re
import json
import random
import time
import zipfile
import xml.sax
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# File paths
PDF1_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
DOCX2_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'
PDF3_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf'

print("1. Loading Oxford 5000...")
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

oxford_words = []
for entry in oxford_data:
    w = entry.get('word', '').strip().lower()
    if w and w not in oxford_words:
        oxford_words.append(w)

print(f"Oxford unique words: {len(oxford_words)}")

# 2. Load PDF 1 text
print("2. Loading PDF 1 (.a4.pdf)...")
t0 = time.time()
d1 = pymupdf.open(PDF1_PATH)
pdf1_pages = [page.get_text() for page in d1]
pdf1_full_text = "\n".join(pdf1_pages)
d1.close()
print(f"  PDF 1 loaded: {len(pdf1_pages)} pages, {len(pdf1_full_text)} chars in {time.time() - t0:.2f}s")

# 3. Load PDF 3 text
print("3. Loading PDF 3 (- спарсенное.pdf)...")
t0 = time.time()
d3 = pymupdf.open(PDF3_PATH)
pdf3_pages = [page.get_text() for page in d3]
pdf3_full_text = "\n".join(pdf3_pages)
d3.close()
print(f"  PDF 3 loaded: {len(pdf3_pages)} pages, {len(pdf3_full_text)} chars in {time.time() - t0:.2f}s")

# 4. Load DOCX 2 text via SAX
print("4. Loading DOCX 2 (.a4.docx)...")
t0 = time.time()
class DocxHandler(xml.sax.ContentHandler):
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

handler = DocxHandler()
with zipfile.ZipFile(DOCX2_PATH, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, handler)

docx2_paragraphs = handler.paragraphs
docx2_full_text = "\n".join(docx2_paragraphs)
print(f"  DOCX 2 loaded: {len(docx2_paragraphs)} paragraphs, {len(docx2_full_text)} chars in {time.time() - t0:.2f}s")

# Quick test of lookups
def extract_entry_from_pdf(word, text, max_chars=1500):
    """
    Extracts dictionary entry for headword from PDF text.
    Headwords in Muller dictionary are formatted as:
    <headword> [<transcription>] or <headword> I/II [...] or <headword> <pos>
    """
    # Regex pattern for headword at the start of a line
    # Must match whole word followed by transcription bracket, roman numeral, pos, or punctuation
    pat = rf'(?:^|\n)({re.escape(word)}(?:\s+[I|V|X]+)?)\s*(?:\[|\b(?:n|v|adj|adv|prep|cj|num|pron|int)\b)'
    m = re.search(pat, text, re.IGNORECASE)
    if not m:
        # Fallback to word at start of line followed by space
        pat2 = rf'(?:^|\n)({re.escape(word)})\s+'
        m = re.search(pat2, text, re.IGNORECASE)
        if not m:
            return None
    
    start_pos = m.start()
    if text[start_pos] == '\n':
        start_pos += 1
    
    # Context window
    snippet = text[start_pos : start_pos + max_chars]
    lines = snippet.split('\n')
    
    entry_lines = [lines[0]]
    # Collect subsequent lines until the next headword appears
    # A next headword is typically a lowercase/uppercase word at start of line followed by '[' or pos
    for line in lines[1:]:
        l_str = line.strip()
        if not l_str:
            continue
        # Check if this line looks like page header/number (e.g. "abandon 5 ability" or digits)
        if re.match(r'^\d+$', l_str):
            continue
        # If line looks like next entry: word [transcription]
        if re.match(r'^[a-zA-Z][\w\s\-\']{1,25}\s+\[', l_str) and not l_str.startswith('~'):
            break
        # If line looks like next entry: word I [ or word II [
        if re.match(r'^[a-zA-Z][\w\-]{1,25}\s+[I|V|X]+\s+\[', l_str):
            break
        entry_lines.append(l_str)
        if len(entry_lines) >= 30:  # limit very long entries
            break
    
    return " ".join(entry_lines)

def extract_entry_from_docx(word, paragraphs, max_paragraphs=20):
    """
    Extracts dictionary entry for headword from DOCX paragraphs.
    """
    pat = rf'^{re.escape(word)}(?:\s+[I|V|X]+)?(?:\s+\[|\s+\b(?:n|v|adj|adv|prep|cj|num|pron|int)\b|\s*$)'
    
    found_idx = -1
    for idx, p in enumerate(paragraphs):
        if re.match(pat, p, re.IGNORECASE) or re.match(rf'^{re.escape(word)}\b', p, re.IGNORECASE):
            # Check if this looks like a headword line (has brackets or is short headword)
            if '[' in p or len(p) < 40 or re.search(r'\b(?:n|v|adj|adv)\b', p):
                found_idx = idx
                break
    
    if found_idx == -1:
        return None
    
    collected = [paragraphs[found_idx]]
    for idx in range(found_idx + 1, min(found_idx + max_paragraphs, len(paragraphs))):
        p = paragraphs[idx]
        # If next paragraph starts with a new headword
        if re.match(r'^[a-zA-Z][\w\s\-\']{1,25}\s+\[', p) and not p.startswith('~'):
            break
        if re.match(r'^[a-zA-Z][\w\-]{1,25}\s+[I|V|X]+\s+\[', p):
            break
        # If paragraph is header or page number
        if re.match(r'^\d+$', p):
            continue
        collected.append(p)
    
    return " ".join(collected)

print("\nTesting sample words extraction...")
test_sample = ['abandon', 'ability', 'academic', 'accept', 'accident', 'accompany', 'brazier', 'cat', 'take']
for w in test_sample:
    e1 = extract_entry_from_pdf(w, pdf1_full_text)
    e2 = extract_entry_from_docx(w, docx2_paragraphs)
    e3 = extract_entry_from_pdf(w, pdf3_full_text)
    print(f"\nWord: {w}")
    print(f"  PDF 1: {repr(e1[:100]) if e1 else 'None'}")
    print(f"  DOCX 2: {repr(e2[:100]) if e2 else 'None'}")
    print(f"  PDF 3: {repr(e3[:100]) if e3 else 'None'}")
