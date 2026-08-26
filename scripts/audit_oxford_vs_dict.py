# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

print("1. Loading oxford_5000_updated.json...")
with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_list = json.load(f)

print(f"Loaded {len(oxford_list)} Oxford words.")

print("2. Loading full dictionary text from Doc2...")
doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
pages_text = []
for p in range(10, 508):
    txt = doc2[p].get_text('text')
    lines = txt.split('\n')
    cleaned_lines = []
    for i, l in enumerate(lines):
        l_str = l.strip()
        if i < 3 and (l_str.isdigit() or (len(l_str) < 25 and not '[' in l_str and not ']' in l_str and (i == 0 or lines[0].strip().isdigit()))):
            continue
        cleaned_lines.append(l)
    pages_text.append('\n'.join(cleaned_lines))
doc2.close()
full_text = '\n'.join(pages_text)

# Replace soft hyphens within lines: e.g. "за\xadрабатывать" -> "зарабатывать"
full_text = re.sub(r'([а-яёА-ЯЁa-zA-Z])\xad\n?([а-яёА-ЯЁa-zA-Z])', r'\1\2', full_text)
full_text = full_text.replace('\xad', '')

# Pattern for entry start
entry_pattern = re.compile(r'(?m)^([A-Za-z][A-Za-z0-9\-\'\,\.\s/]{0,40}?)\s+(\[[^\]\n]+\])\s+(n|v|adj|adv|prep|cj|num|pron|int|part|art|predic|attr|сокр)\b')

matches = list(entry_pattern.finditer(full_text))
print(f"Found {len(matches)} dictionary entries in Doc2.")

# Build dictionary entries by slicing text between matches
dict_entries = []
for i, m in enumerate(matches):
    start_pos = m.start()
    end_pos = matches[i+1].start() if i+1 < len(matches) else len(full_text)
    raw_article = full_text[start_pos:end_pos].strip()
    
    hw_raw = m.group(1).strip()
    transcription = m.group(2).strip()
    pos_raw = m.group(3).strip()
    
    # Base headword (remove I, II, 1, 2, etc.)
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', hw_raw, flags=re.IGNORECASE).strip().lower()
    base_hw = re.sub(r'[\,\.\/].*$', '', base_hw).strip()
    
    dict_entries.append({
        'raw_hw': hw_raw,
        'base_hw': base_hw,
        'transcription': transcription,
        'pos': pos_raw,
        'article_text': raw_article
    })

# Group dictionary entries by base_hw
dict_by_base = {}
for e in dict_entries:
    bhw = e['base_hw']
    if bhw not in dict_by_base:
        dict_by_base[bhw] = []
    dict_by_base[bhw].append(e)

print(f"Indexed {len(dict_by_base)} unique base headwords from dictionary.")

# Check Oxford words coverage
matched_words = []
missing_words = []

for item in oxford_list:
    w = item['word'].strip().lower()
    w_clean = re.sub(r'\d+$', '', w)
    
    candidates = [
        w,
        w_clean,
        w.replace('_', ' '),
        w_clean.replace('_', ' '),
        w.replace('-', ' '),
        w.replace(' ', '-'),
        w.replace("'", "’"),
        w.replace("’", "'")
    ]
    
    found = False
    for c in candidates:
        if c in dict_by_base:
            matched_words.append((item['word'], c, dict_by_base[c]))
            found = True
            break
    if not found:
        missing_words.append(item['word'])

print(f"Oxford words matched directly to dictionary: {len(matched_words)} / {len(oxford_list)}")
print(f"Oxford words with no direct match: {len(missing_words)}")
print(f"Sample missing words (first 30): {missing_words[:30]}")
