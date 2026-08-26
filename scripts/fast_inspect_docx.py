# -*- coding: utf-8 -*-
import sys
import zipfile
import lxml.etree as ET
import time
import re

sys.stdout.reconfigure(encoding='utf-8')

docx2_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'

t0 = time.time()
print("Reading docx zip...")
with zipfile.ZipFile(docx2_path, 'r') as z:
    with z.open('word/document.xml') as f:
        print("Iterparsing document.xml...")
        paragraphs = []
        curr_p_runs = []
        
        # We can extract text directly
        for event, elem in ET.iterparse(f, events=('end',)):
            tag = elem.tag.split('}')[-1]
            if tag == 'p':
                # Paragraph ended
                p_text = "".join(curr_p_runs)
                if p_text.strip():
                    paragraphs.append(p_text.strip())
                curr_p_runs = []
                elem.clear()
            elif tag == 't':
                if elem.text:
                    curr_p_runs.append(elem.text)

print(f"Extracted {len(paragraphs)} non-empty paragraphs in {time.time() - t0:.2f}s")

# Let's inspect some headwords
test_words = ['abandon', 'able', 'aspect', 'brazier', 'cat', 'take', 'run', 'break', 'system', 'word']

for tw in test_words:
    print(f"\n--- Look up in DOCX: '{tw}' ---")
    matches = [p for p in paragraphs if re.match(rf'^{re.escape(tw)}\b', p, re.IGNORECASE)]
    for m in matches[:3]:
        print(m[:300])
