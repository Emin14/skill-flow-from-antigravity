# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

print("1. Extracting text from Doc2...")
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

# Clean soft hyphens
full_text = re.sub(r'([а-яёА-ЯЁa-zA-Z])\xad\n?([а-яёА-ЯЁa-zA-Z])', r'\1\2', full_text)
full_text = full_text.replace('\xad', '')

# Fix closing brackets OCR'd as 'j' after '[': e.g. '[kætʃj' -> '[kætʃ]'
full_text = re.sub(r'(\[[^\]\n]{1,60})j(?=\s+(?:n|v|adj|adv|prep|cj|num|pron|int|part|art|predic|attr|сокр|\d)\b)', r'\1]', full_text)

# Join multi-line bracketed transcriptions: e.g. "[tu\n...]" -> "[tu ...]"
def fix_brackets(m):
    return m.group(0).replace('\n', ' ')

full_text = re.sub(r'\[[^\]]{1,120}\]', fix_brackets, full_text)

# Robust entry pattern
# Matches start of line:
# 1) Headword: e.g. "to I", "catch II", "lead1 I", "A, a", "A1", "abandon"
# 2) Optional transcription: e.g. "[...]"
# 3) Part of speech or sense number: e.g. "n", "v", "adj", "adv", "prep", "cj", "num", "pron", "int", "part", "art", "predic", "attr"
entry_pattern = re.compile(
    r'(?m)^([A-Za-z][A-Za-z0-9\-\'\,\.\s/]{0,45}?)\s+'
    r'(?:(\[[^\]\n]+\])\s+)?'
    r'(n|v|adj|adv|prep|cj|num|pron|int|part|art|predic|attr|сокр)\b'
)

matches = list(entry_pattern.finditer(full_text))
print(f"Found {len(matches)} robust dictionary entry matches!")

def clean_base(hw):
    s = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|\d+|[IVXLCDM]+)$', '', hw, flags=re.IGNORECASE).strip()
    s = re.sub(r'\d+$', '', s).strip()
    s = re.sub(r'[\,\.\/].*$', '', s).strip()
    return s.lower()

dict_entries = []
for i, m in enumerate(matches):
    start_pos = m.start()
    end_pos = matches[i+1].start() if i+1 < len(matches) else len(full_text)
    raw_article = full_text[start_pos:end_pos].strip()
    
    hw_raw = m.group(1).strip()
    transcription = m.group(2) or ''
    pos_raw = m.group(3).strip()
    base_hw = clean_base(hw_raw)
    
    dict_entries.append({
        'raw_hw': hw_raw,
        'base_hw': base_hw,
        'transcription': transcription,
        'pos': pos_raw,
        'article_text': raw_article
    })

dict_by_base = {}
for e in dict_entries:
    bhw = e['base_hw']
    if bhw not in dict_by_base:
        dict_by_base[bhw] = []
    dict_by_base[bhw].append(e)

print(f"Indexed {len(dict_by_base)} unique base headwords.")

# Let's test the Oxford 5000 match rate
with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_list = json.load(f)

matched_direct = 0
unmatched_direct = []

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
            matched_direct += 1
            found = True
            break
    if not found:
        unmatched_direct.append(item['word'])

print(f"Direct match with robust parser: {matched_direct} / {len(oxford_list)} ({matched_direct/len(oxford_list)*100:.2f}%)")
print(f"Unmatched words count: {len(unmatched_direct)}")
print(f"Unmatched words: {unmatched_direct}")
