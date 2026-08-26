# -*- coding: utf-8 -*-
import sys
import os
import zipfile
import xml.etree.ElementTree as ET
import re

sys.stdout.reconfigure(encoding='utf-8')

docx2_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'

ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

print("Parsing DOCX XML...")
with zipfile.ZipFile(docx2_path, 'r') as z:
    doc_xml = z.read('word/document.xml')
    root = ET.fromstring(doc_xml)

paragraphs = root.findall('.//w:p', ns)
print(f"Total paragraphs: {len(paragraphs)}")

# Let's inspect paragraphs that contain bold runs, headwords, etc.
test_words = ['acetify', 'acetone', 'ache', 'as', 'aspect', 'brazier', 'cat', 'take', 'run', 'break']

for w in test_words:
    print(f"\n=================== SEARCHING DOCX FOR: {w} ===================")
    found = 0
    for idx, p in enumerate(paragraphs):
        # Extract runs and formatting
        p_text = ""
        runs_info = []
        for r in p.findall('.//w:r', ns):
            t_elem = r.find('.//w:t', ns)
            if t_elem is not None and t_elem.text:
                is_bold = r.find('.//w:b', ns) is not None
                is_italic = r.find('.//w:i', ns) is not None
                r_font = r.find('.//w:rFonts', ns)
                font_name = r_font.attrib.get(f'{{{ns["w"]}}}ascii', '') if r_font is not None else ''
                p_text += t_elem.text
                runs_info.append((t_elem.text, is_bold, is_italic, font_name))
        
        # Check if paragraph starts with the word (as headword)
        if re.match(rf'^{re.escape(w)}\b', p_text.strip(), re.IGNORECASE):
            print(f"P#{idx}: {p_text}")
            print(f"  Runs detail: {runs_info[:6]}")
            # Also show next 1-2 paragraphs if entry continues
            for next_idx in range(idx + 1, min(idx + 3, len(paragraphs))):
                next_p = paragraphs[next_idx]
                next_text = "".join([t.text for t in next_p.findall('.//w:t', ns) if t.text])
                print(f"  Next P#{next_idx}: {next_text[:100]}")
            found += 1
            if found >= 2:
                break
