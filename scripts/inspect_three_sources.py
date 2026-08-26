# -*- coding: utf-8 -*-
import sys
import os
import pymupdf
import docx
import json

sys.stdout.reconfigure(encoding='utf-8')

pdf1_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
docx2_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'
pdf3_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf'

print("=== INSPECTING PDF 1 ===")
d1 = pymupdf.open(pdf1_path)
print("Page count:", len(d1))
for pno in [20, 50, 100]:
    page = d1[pno]
    txt = page.get_text()
    print(f"\n--- Page {pno} (first 300 chars) ---")
    print(repr(txt[:300]))
    print(txt[:300])
d1.close()

print("\n=== INSPECTING PDF 3 (спарсенное) ===")
d3 = pymupdf.open(pdf3_path)
print("Page count:", len(d3))
for pno in [20, 50, 100]:
    page = d3[pno]
    txt = page.get_text()
    print(f"\n--- Page {pno} (first 300 chars) ---")
    print(repr(txt[:300]))
    print(txt[:300])
d3.close()

print("\n=== INSPECTING DOCX 2 ===")
import zipfile
import xml.etree.ElementTree as ET

# Read docx via zipfile directly to be super fast and see raw XML text
with zipfile.ZipFile(docx2_path, 'r') as z:
    doc_xml = z.read('word/document.xml')
    root = ET.fromstring(doc_xml)
    # namespaces
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = root.findall('.//w:p', ns)
    print(f"Total XML paragraphs in docx: {len(paragraphs)}")
    
    samples = []
    for p in paragraphs[100:150]:
        texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
        if texts:
            samples.append("".join(texts))
    
    print("\n--- DOCX Samples (paragraphs 100-150) ---")
    for s in samples[:20]:
        print(repr(s))
