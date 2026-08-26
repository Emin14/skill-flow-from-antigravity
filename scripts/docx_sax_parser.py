# -*- coding: utf-8 -*-
import sys
import zipfile
import xml.sax
import time
import re

sys.stdout.reconfigure(encoding='utf-8')

docx2_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'

class DocxParagraphHandler(xml.sax.ContentHandler):
    def __init__(self):
        super().__init__()
        self.paragraphs = []
        self.current_text = []
        self.in_t = False
        self.in_p = False

    def startElement(self, name, attrs):
        if name == 'w:p':
            self.in_p = True
            self.current_text = []
        elif name == 'w:t':
            self.in_t = True

    def characters(self, content):
        if self.in_t:
            self.current_text.append(content)

    def endElement(self, name):
        if name == 'w:t':
            self.in_t = False
        elif name == 'w:p':
            self.in_p = False
            full_p = "".join(self.current_text).strip()
            if full_p:
                self.paragraphs.append(full_p)

t0 = time.time()
print("Starting SAX parse of DOCX...")
handler = DocxParagraphHandler()
with zipfile.ZipFile(docx2_path, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, handler)

print(f"Parsed {len(handler.paragraphs)} paragraphs in {time.time() - t0:.2f}s!")

# Let's inspect some headwords and sample entries
print("\n--- First 30 paragraphs ---")
for p in handler.paragraphs[:30]:
    print(repr(p))

print("\n--- Sample dictionary entries (around index 1000, 5000, 10000) ---")
for idx in [1000, 2000, 5000, 10000, 20000, 50000]:
    if idx < len(handler.paragraphs):
        print(f"\nP#{idx}: {handler.paragraphs[idx][:200]}")
