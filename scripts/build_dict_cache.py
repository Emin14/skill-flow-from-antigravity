# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf
import unicodedata
import os

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs('tmp', exist_ok=True)

print("Building complete dictionary caches from Doc2 and Doc1...")

# 1. Process Doc2
doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
pages_text2 = []
for p in range(10, 508):
    txt = doc2[p].get_text('text')
    lines = txt.split('\n')
    cleaned_lines = []
    for i, l in enumerate(lines):
        l_str = l.strip()
        if i < 3 and (l_str.isdigit() or (len(l_str) < 25 and not '[' in l_str and not ']' in l_str and (i == 0 or lines[0].strip().isdigit()))):
            continue
        cleaned_lines.append(l)
    pages_text2.append('\n'.join(cleaned_lines))
doc2.close()
full_text2 = '\n'.join(pages_text2)
full_text2 = re.sub(r'([а-яёА-ЯЁa-zA-Z])\xad\n?([а-яёА-ЯЁa-zA-Z])', r'\1\2', full_text2)
full_text2 = full_text2.replace('\xad', '')

# Pattern for entry start:
# e.g. "word [transcription] pos" or "word pos" or "word I [transcription] pos"
entry_pattern = re.compile(r'(?m)^([A-Za-z][A-Za-z0-9\-\'\,\.\s/]{0,45}?)\s+(\[[^\]\n]+\])\s+(n|v|adj|adv|prep|cj|num|pron|int|part|art|predic|attr|сокр)\b')

matches2 = list(entry_pattern.finditer(full_text2))
print(f"Doc2 matches: {len(matches2)}")

dict_entries2 = []
for i, m in enumerate(matches2):
    start_pos = m.start()
    end_pos = matches2[i+1].start() if i+1 < len(matches2) else len(full_text2)
    raw_article = full_text2[start_pos:end_pos].strip()
    
    hw_raw = m.group(1).strip()
    transcription = m.group(2).strip()
    pos_raw = m.group(3).strip()
    
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', hw_raw, flags=re.IGNORECASE).strip().lower()
    base_hw = re.sub(r'[\,\.\/].*$', '', base_hw).strip()
    
    dict_entries2.append({
        'raw_hw': hw_raw,
        'base_hw': base_hw,
        'transcription': transcription,
        'pos': pos_raw,
        'article_text': raw_article
    })

with open('tmp/dict_doc2_cache.json', 'w', encoding='utf-8') as f:
    json.dump(dict_entries2, f, ensure_ascii=False, indent=2)

print(f"Saved {len(dict_entries2)} entries to tmp/dict_doc2_cache.json")
