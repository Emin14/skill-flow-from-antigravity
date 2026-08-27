# -*- coding: utf-8 -*-
"""
Universal Multi-POS Splitter:
Splits an entry by '2. v', '2. n', '2. a', '2. adv', '3. a', '3. v', '3. adv', '4. adv'.
The part before '2.' is section 1!
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from robust_dictionary_rebuilder import REGISTER_MAP, POS_MAP, extract_registers
from run_batch_reconstructor import clean_hyphens_and_ocr

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

rebuilt_words = set([
    'measure',
    'account', 'advance', 'anchor', 'balance', 'board', 'book', 'call', 'clear', 'close', 'fall',
    'act', 'air', 'arm', 'back', 'bear', 'beat', 'box', 'care', 'case', 'cast',
    'catch', 'cause', 'charge', 'check', 'cook', 'cost', 'cover', 'cross', 'cry', 'cure',
    'cut', 'deal', 'demand', 'design', 'desire', 'die', 'doubt', 'draw', 'dress', 'drink',
    'drop', 'end', 'escape', 'excuse', 'face', 'fear', 'feel', 'fight', 'figure', 'fill',
    'film', 'finish', 'fire', 'fish', 'fit', 'fix', 'fly', 'fold', 'force', 'form',
    'in', 'no', 'set', 'up'
])

def clean_def_text(text, base_word):
    text = clean_hyphens_and_ocr(text)
    # Expand tildes
    text = re.sub(r'~(\w+)', lambda m: base_word + m.group(1), text)
    text = text.replace('~', base_word)
    # Remove new headword captures
    text = re.sub(r'\s+[a-zA-Z-]+\s+(?:[1-4]\.|\bI+\b|\[).*$', '', text)
    # Clean OCR line break noise
    text = re.sub(r'\n[a-z-]+\n\d+\n', ' ', text)
    if text.startswith('attr.') or text.startswith('attr '):
        text = 'в роли определения: ' + text[5:].strip(' :;')
    if re.search(r'\bpl\b', text):
        text = re.sub(r'\bобыкн\.\s*pl\b', 'обыкн. при англ. мн. ч.:', text)
        text = re.sub(r'\bтж\.\s*pl\b', 'при англ. мн. ч.:', text)
        text = re.sub(r'\bpl:\b', 'при англ. мн. ч.:', text)
        text = re.sub(r'\(pl\s+([^)]+)\)', r'при англ. мн. ч. \1:', text)
        text = re.sub(r'\bpl\b', 'при англ. мн. ч.:', text)
    # Clean detached letter markers: 'а) ...; б) ...' -> '; '
    text = re.sub(r'\s+[абвгде]\)\s*', '; ', text)
    text, regs = extract_registers(text)
    text = re.sub(r'\s+', ' ', text).strip(' ;:,.-')
    return text, regs

def parse_section(chunk_text, pos_type, base_word):
    meanings = []
    phrases = []
    
    main_p = chunk_text
    phr_p = ""
    sp = re.split(r'[♦¬]', chunk_text, maxsplit=1)
    if len(sp) > 1:
        main_p = sp[0]
        phr_p = chunk_text[len(sp[0]):]
        
    num_matches = list(re.finditer(r'(?:^|\s)(\d+)\)\s*', main_p))
    if num_matches:
        for n_idx, n_match in enumerate(num_matches):
            m_start = n_match.end()
            m_end = num_matches[n_idx+1].start() if n_idx + 1 < len(num_matches) else len(main_p)
            c_text = main_p[m_start:m_end].strip()
            clean_t, regs = clean_def_text(c_text, base_word)
            if clean_t:
                meanings.append({
                    "partOfSpeech": pos_type,
                    "translation": clean_t,
                    "examples": [],
                    "register": regs
                })
    else:
        clean_t, regs = clean_def_text(main_p, base_word)
        if clean_t:
            meanings.append({
                "partOfSpeech": pos_type,
                "translation": clean_t,
                "examples": [],
                "register": regs
            })
            
    if phr_p:
        items = re.split(r'[♦¬;]\s*', phr_p)
        for it in items:
            it = it.strip()
            if not it or len(it) < 3:
                continue
            it = clean_hyphens_and_ocr(it)
            it = it.replace('~', base_word)
            en_m = re.match(r'^([a-zA-Z\s\',./\(\)-]+)([\u0400-\u04FF].*)$', it)
            if en_m:
                en_p = en_m.group(1).strip(' :;,-')
                ru_t = en_m.group(2).strip(' :;,-')
                ru_t, p_regs = clean_def_text(ru_t, base_word)
                if en_p and ru_t:
                    phrases.append({
                        "phrase": en_p,
                        "partOfSpeech": pos_type,
                        "translation": ru_t,
                        "examples": [],
                        "register": p_regs
                    })
    return meanings, phrases

success_count = 0

for idx, item in enumerate(oxford_data):
    w = item['word']
    if w in rebuilt_words:
        continue
        
    raw_texts = []
    if w in parsed_index:
        raw_texts.extend([e.get('text', '') for e in parsed_index[w]])
    else:
        for k in parsed_index:
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                raw_texts.extend([e.get('text', '') for e in parsed_index[k]])
    
    combined_raw = '\n'.join(raw_texts)
    lines = combined_raw.split('\n')
    entry_lines = []
    first_line = True
    for l in lines:
        l_str = l.strip()
        if not first_line and re.match(r'^[a-zA-Z-]+\s*(?:[1-4]\.|\bI+\b|\[)', l_str):
            hw = l_str.split()[0].lower().rstrip('1234')
            if hw != w and not hw.startswith(w):
                break
        entry_lines.append(l)
        first_line = False
    entry_text = '\n'.join(entry_lines)
    
    # Find markers: 2. v/n/a/adv, 3. v/n/a/adv, 4. adv
    split_markers = list(re.finditer(r'(?:^|\n)\s*([2-4])\.\s*([a-zA-Z]+(?:\s+predic\.)?)\b', entry_text))
    if not split_markers:
        continue
        
    # We have section 1 (from start of entry to first split marker)
    # Determine section 1 POS
    first_pos = item.get('meanings', [{}])[0].get('partOfSpeech', 'noun')
    # Try to find if section 1 has an explicit POS like "1. n", "1. a", "1. v", "n", "v", "a"
    m1 = re.search(r'(?:^|\n)\s*(?:1\.\s*)?([a-zA-Z]+(?:\s+predic\.)?)\b', entry_text[:split_markers[0].start()])
    if m1:
        p_str = m1.group(1).split()[0].lower()
        if p_str in POS_MAP:
            first_pos = POS_MAP[p_str]
            
    sections = []
    # Section 1
    sec1_text = entry_text[:split_markers[0].start()]
    # Remove headword header line from sec1
    sec1_text = re.sub(r'^[a-zA-Z-]+\s*(?:I+\s*)?\[[^\]]*\]\s*(?:(?:1\.\s*)?[a-zA-Z]+\s*)?', '', sec1_text)
    sections.append((first_pos, sec1_text))
    
    for s_idx, sm in enumerate(split_markers):
        p_raw = sm.group(2).split()[0].lower()
        sec_pos = POS_MAP.get(p_raw, 'noun')
        start_idx = sm.end()
        end_idx = split_markers[s_idx+1].start() if s_idx + 1 < len(split_markers) else len(entry_text)
        sec_text = entry_text[start_idx:end_idx]
        sections.append((sec_pos, sec_text))
        
    all_meanings = []
    all_phrases = list(item.get('phrases', []))
    
    for sec_pos, sec_text in sections:
        m_list, ph_list = parse_section(sec_text, sec_pos, w)
        all_meanings.extend(m_list)
        all_phrases.extend(ph_list)
        
    if all_meanings:
        for m_i, m in enumerate(all_meanings, 1):
            m['id'] = m_i
        unique_phrases = []
        seen_p = set()
        for p in all_phrases:
            p_str = p['phrase'].lower().strip()
            if p_str not in seen_p:
                seen_p.add(p_str)
                p['id'] = len(unique_phrases) + 1
                unique_phrases.append(p)
                
        oxford_data[idx]['meanings'] = all_meanings
        if unique_phrases:
            oxford_data[idx]['phrases'] = unique_phrases
        success_count += 1

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Universal Rebuild Complete! Successfully processed and updated: {success_count} words")
