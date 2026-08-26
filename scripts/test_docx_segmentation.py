# -*- coding: utf-8 -*-
import sys
import zipfile
import xml.sax
import time
import re
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

docx_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'

class DocxCollector(xml.sax.ContentHandler):
    def __init__(self):
        super().__init__()
        self.paragraphs = []
        self.current_runs = []
        self.current_text = []
        self.is_bold = False
        self.is_italic = False
        self.in_r = False
        self.in_t = False
        self.in_p = False

    def startElement(self, name, attrs):
        if name == 'w:p':
            self.in_p = True
            self.current_runs = []
        elif name == 'w:r':
            self.in_r = True
            self.is_bold = False
            self.is_italic = False
            self.current_text = []
        elif name == 'w:b':
            val = attrs.get('w:val', 'true')
            if val not in ('0', 'false', 'none'):
                self.is_bold = True
        elif name == 'w:i':
            val = attrs.get('w:val', 'true')
            if val not in ('0', 'false', 'none'):
                self.is_italic = True
        elif name == 'w:t':
            self.in_t = True

    def characters(self, content):
        if self.in_t:
            self.current_text.append(content)

    def endElement(self, name):
        if name == 'w:t':
            self.in_t = False
        elif name == 'w:r':
            self.in_r = False
            txt = ''.join(self.current_text)
            if txt:
                if self.current_runs and self.current_runs[-1][1] == self.is_bold and self.current_runs[-1][2] == self.is_italic:
                    prev_txt, b, i = self.current_runs[-1]
                    self.current_runs[-1] = (prev_txt + txt, b, i)
                else:
                    self.current_runs.append((txt, self.is_bold, self.is_italic))
        elif name == 'w:p':
            self.in_p = False
            if self.current_runs:
                self.paragraphs.append(self.current_runs)

print("Reading DOCX...")
t0 = time.time()
collector = DocxCollector()
with zipfile.ZipFile(docx_path, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, collector)

print(f"Read {len(collector.paragraphs)} paragraphs in {time.time()-t0:.2f}s")

# Let's write a headword detector
# What makes a paragraph the start of a dictionary entry?
# Let's analyze candidate headword paragraphs
entries = []
curr_entry = None

# English headword regex: starts with latin letters/hyphen/space/apostrophe, followed by [transcription] or pos
HW_START_RE = re.compile(r'^([a-zA-Z\-\'\s]{1,45}(?:\s+[IVXLCDM]+|\s+\d+)?)\s*(\[[^\]]+\])?')

# Known non-dictionary paragraphs (intro, appendix headers, etc.)
# Let's inspect where letter A begins and where dictionary ends

headword_candidates = []
for p_idx, p in enumerate(collector.paragraphs):
    if not p: continue
    first_txt, first_b, first_i = p[0]
    full_text = ''.join(r[0] for r in p).strip()
    
    # In Muller dictionary, headwords start with bold text
    # e.g. "abandon [əˈbændən] v ..." or "a [eɪ] 1. n ..."
    if first_b:
        # Check if first_txt starts with latin letters
        clean_first = first_txt.strip()
        if clean_first and clean_first[0].isalpha() and ord(clean_first[0]) < 128:
            # Let's check if the paragraph contains transcription [...] or POS
            has_brackets = '[' in full_text and ']' in full_text
            has_pos = re.search(r'\b(n|v|adj|adv|prep|cj|conj|int|pron|num|art|pres|p\.p|predic)\b', full_text)
            if has_brackets or has_pos:
                headword_candidates.append((p_idx, full_text[:80]))

print(f"Total headword candidate paragraphs found: {len(headword_candidates)}")
print("\nFirst 20 candidate headwords:")
for idx, text in headword_candidates[:20]:
    print(f"P#{idx}: {text}")

print("\nLast 20 candidate headwords:")
for idx, text in headword_candidates[-20:]:
    print(f"P#{idx}: {text}")
