# -*- coding: utf-8 -*-
import json
import re
import sys
import zipfile
import xml.sax
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# Load the 119 unresolved words from report.json
with open('tmp/muller_rebuild/report.json', 'r', encoding='utf-8') as f:
    rep = json.load(f)
unresolved = rep.get('unresolved', [])
print(f"Total unresolved in report: {len(unresolved)}")

PDF1_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
DOCX2_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'
PDF3_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf'

# Load docx paragraphs
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

print("Reading DOCX...")
h = DocxHandler()
with zipfile.ZipFile(DOCX2_PATH, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, h)
docx_text = "\n".join(h.paragraphs[200:])

print("Reading PDF3...")
d3 = pymupdf.open(PDF3_PATH)
pdf3_pages = [d3[pno].get_text() for pno in range(14, len(d3))]
pdf3_text = "\n".join(pdf3_pages)
d3.close()

# Test searching for some of these words
print("\nTesting presence in DOCX / PDF3:")
found_in_docx = []
found_in_pdf3 = []
not_found_anywhere = []

for w in unresolved:
    # Look for exact headword
    pat_hw = rf'(?:^|\n){re.escape(w)}(?:\s+[I|V|X]+)?\s*[\(\[]'
    # Look for derivative at end of entry e.g. ~ly, ~ing, or explicit word
    pat_any = rf'\b{re.escape(w)}\b'
    
    in_d = bool(re.search(pat_hw, docx_text, re.IGNORECASE))
    in_p3 = bool(re.search(pat_hw, pdf3_text, re.IGNORECASE))
    
    in_d_any = bool(re.search(pat_any, docx_text, re.IGNORECASE))
    in_p3_any = bool(re.search(pat_any, pdf3_text, re.IGNORECASE))
    
    print(f"Word: {w:18} HW docx:{in_d} pdf3:{in_p3} | ANY docx:{in_d_any} pdf3:{in_p3_any}")
