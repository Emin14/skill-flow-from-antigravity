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

class EntryExtractor(xml.sax.ContentHandler):
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

print("Parsing DOCX...")
t0 = time.time()
extractor = EntryExtractor()
with zipfile.ZipFile(docx_path, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, extractor)

print(f"Parsed {len(extractor.paragraphs)} paragraphs in {time.time()-t0:.2f}s")

# Let's define the headword detection rule
# A paragraph starts a headword if:
# 1. First run is bold
# 2. Starts with ASCII letter (a-z, A-Z)
# 3. Contains '[' (transcription) or pos or '=' or is followed by pos in italics

POS_SET = {
    'n', 'v', 'vi', 'vt', 'a', 'adj', 'adv', 'prep', 'cj', 'conj',
    'int', 'pron', 'num', 'art', 'pres. p.', 'pres.p.', 'p. p.', 'p.p.',
    'pref', 'suff', 'predic', 'predic.'
}

def is_headword_paragraph(p):
    if not p: return False
    first_txt, first_b, first_i = p[0]
    if not first_b: return False
    first_strip = first_txt.strip()
    if not first_strip: return False
    # Check if starts with latin letter or prefix/suffix '-'
    if not (first_strip[0].isalpha() and ord(first_strip[0]) < 128 or first_strip.startswith('-') and len(first_strip) > 1 and first_strip[1].isalpha()):
        return False
    # If it's a single letter header e.g. "A", "B", "C"
    if len(first_strip) == 1 and first_strip.isupper():
        # Check if there is more text in the paragraph
        full_p = ''.join(r[0] for r in p).strip()
        if len(full_p) <= 2:
            return False
    # Check full paragraph text
    full_p = ''.join(r[0] for r in p).strip()
    
    # Must match typical dictionary headword pattern:
    # "abandon [əˈbændən] 1. v 1) ..." or "aback [əˈbæk]: taken ~ ..." or "abaci [...] pl от abacus"
    # or "abandonment n ..."
    if '[' in full_p:
        return True
    if re.search(r'\b(pl|past|p\. p\.|pres\. p\.|от)\b', full_p):
        return True
    if re.search(r'\b(n|v|adj|adv|prep|cj|int|pron|num|art|pref|suff|predic)\b', full_p):
        return True
    if '=' in full_p:
        return True
    return False

# Group into entries
entries = []
curr_entry_paras = []

for idx, p in enumerate(extractor.paragraphs):
    if idx < 500: # skip intro
        continue
    if idx > 107300: # skip appendices
        continue
    
    if is_headword_paragraph(p):
        if curr_entry_paras:
            entries.append(curr_entry_paras)
        curr_entry_paras = [p]
    else:
        if curr_entry_paras:
            curr_entry_paras.append(p)

if curr_entry_paras:
    entries.append(curr_entry_paras)

print(f"Total extracted dictionary entries: {len(entries)}")

# Print 20 sample extracted entries
print("\n--- Sample extracted entries ---")
for i in [0, 1, 2, 10, 50, 100, 500, 1000, 5000, 10000, 20000, 30000]:
    if i < len(entries):
        e_paras = entries[i]
        first_p_txt = ''.join(r[0] for r in e_paras[0])
        print(f"\nEntry #{i} ({len(e_paras)} paragraphs):")
        print(f"  First line: {first_p_txt[:120]}")
        if len(e_paras) > 1:
            for extra_p in e_paras[1:3]:
                print(f"  Continuation: {''.join(r[0] for r in extra_p)[:100]}")
