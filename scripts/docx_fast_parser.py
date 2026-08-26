# -*- coding: utf-8 -*-
import sys
import zipfile
import xml.sax
import time
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

docx_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'

class FastDocxParser(xml.sax.ContentHandler):
    def __init__(self):
        super().__init__()
        self.paragraphs = [] # list of [(text, is_bold, is_italic)]
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
                # Merge consecutive runs with identical bold/italic
                if self.current_runs and self.current_runs[-1][1] == self.is_bold and self.current_runs[-1][2] == self.is_italic:
                    prev_txt, b, i = self.current_runs[-1]
                    self.current_runs[-1] = (prev_txt + txt, b, i)
                else:
                    self.current_runs.append((txt, self.is_bold, self.is_italic))
        elif name == 'w:p':
            self.in_p = False
            if self.current_runs:
                self.paragraphs.append(self.current_runs)

print("Starting SAX parse...")
t0 = time.time()
parser = FastDocxParser()
with zipfile.ZipFile(docx_path, 'r') as z:
    with z.open('word/document.xml') as f:
        xml.sax.parse(f, parser)

print(f"Parsed {len(parser.paragraphs)} paragraphs in {time.time()-t0:.2f}s")

sample_words = ['abandon', 'ability', 'about', 'accept', 'cat', 'charge', 'dog', 'make', 'run', 'take', 'zeal']

for target in sample_words:
    print(f"\n================ Target: {target} ================")
    for idx, p in enumerate(parser.paragraphs):
        full_text = ''.join(r[0] for r in p)
        first_t, first_b, _ = p[0]
        if first_b and re.match(rf'^{re.escape(target)}\b', full_text.strip(), re.IGNORECASE):
            print(f"Found at P#{idx}:")
            for r_txt, r_b, r_i in p:
                b_str = 'B' if r_b else ' '
                i_str = 'I' if r_i else ' '
                print(f"  [{b_str}][{i_str}] {repr(r_txt)}")
            # Show subsequent paragraphs until next headword
            for n_idx in range(idx+1, min(idx+6, len(parser.paragraphs))):
                np = parser.paragraphs[n_idx]
                n_full = ''.join(r[0] for r in np).strip()
                n_first_b = np[0][1]
                # If bold and starts with a new English word followed by transcription or POS
                if n_first_b and re.match(r'^[a-zA-Z\-\s]{2,}\s*(\[|\b[1-9]\.|\bn\b|\bv\b|\badj\b|\ba\b)', n_full):
                    print(f"  --> Next headword reached at P#{n_idx}: {repr(n_full[:60])}")
                    break
                print(f"  Continuation P#{n_idx}:")
                for r_txt, r_b, r_i in np:
                    b_str = 'B' if r_b else ' '
                    i_str = 'I' if r_i else ' '
                    print(f"    [{b_str}][{i_str}] {repr(r_txt)}")
            break
