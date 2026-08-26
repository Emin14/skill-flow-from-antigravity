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

class FullDocxCollector(xml.sax.ContentHandler):
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
collector = FullDocxCollector()
with zipfile.ZipFile(docx_path, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, collector)

print(f"Read {len(collector.paragraphs)} paragraphs in {time.time()-t0:.2f}s")

# Let's inspect paragraphs around 'abandon', 'cat', 'charge', 'dog', 'run'
# Collect all paragraph text for each word
def find_entry_paragraphs(word):
    for idx, p in enumerate(collector.paragraphs):
        if not p: continue
        txt, b, _ = p[0]
        full_p = ''.join(r[0] for r in p).strip()
        if b and re.match(rf'^{re.escape(word)}(\s+[IVXLCDM]+|\s+\d+)?\s*(\[[^\]]+\]|\b[1-9]\.|\bn\b|\bv\b|\badj\b|\ba\b|\badv\b)', full_p, re.IGNORECASE):
            # Collect until next headword
            entry_paras = [p]
            for n_idx in range(idx+1, min(idx+30, len(collector.paragraphs))):
                np = collector.paragraphs[n_idx]
                if not np: continue
                n_txt, n_b, _ = np[0]
                n_full = ''.join(r[0] for r in np).strip()
                # Check if np is a new headword
                if n_b and re.match(r'^[a-zA-Z\-\'\s]{1,45}(?:\s+[IVXLCDM]+|\s+\d+)?\s*(\[[^\]]+\]|\b[1-9]\.|\bn\b|\bv\b|\badj\b|\ba\b|\badv\b|\bprep\b)', n_full):
                    break
                entry_paras.append(np)
            return idx, entry_paras
    return None, None

for test_w in ['abandon', 'ability', 'cat', 'charge', 'dog', 'take', 'zeal', 'zero']:
    idx, paras = find_entry_paragraphs(test_w)
    print(f"\n====================== Word: {test_w} (P#{idx}) ======================")
    if paras:
        for p in paras:
            p_str = "".join([f"[{'B' if b else ' '}{'I' if i else ' '}]{repr(t)}" for t, b, i in p])
            print("  ", p_str)
