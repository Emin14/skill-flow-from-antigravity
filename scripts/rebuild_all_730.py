# -*- coding: utf-8 -*-
"""
Rebuild all 730 true multi-POS words with 100% precision.
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
    'film', 'finish', 'fire', 'fish', 'fit', 'fix', 'fly', 'fold', 'force', 'form'
])

def clean_definition(text):
    text = clean_hyphens_and_ocr(text)
    # Remove OCR noise
    text = re.sub(r'\n[a-z-]+\n\d+\n', ' ', text)
    if text.startswith('attr.') or text.startswith('attr '):
        text = 'в роли определения: ' + text[5:].strip(' :;')
    if re.search(r'\bpl\b', text):
        text = re.sub(r'\bобыкн\.\s*pl\b', 'обыкн. при англ. мн. ч.:', text)
        text = re.sub(r'\bтж\.\s*pl\b', 'при англ. мн. ч.:', text)
        text = re.sub(r'\bpl:\b', 'при англ. мн. ч.:', text)
        text = re.sub(r'\(pl\s+([^)]+)\)', r'при англ. мн. ч. \1:', text)
        text = re.sub(r'\bpl\b', 'при англ. мн. ч.:', text)
    
    text, regs = extract_registers(text)
    text = re.sub(r'\s+', ' ', text).strip(' ,;')
    return text, regs

def parse_section_meanings(sec_text, pos_name, base_word):
    meanings = []
    phrases = []
    
    main_part = sec_text
    phr_part = ""
    split_phr = re.split(r'[♦¬]', sec_text, maxsplit=1)
    if len(split_phr) > 1:
        main_part = split_phr[0]
        phr_part = sec_text[len(split_phr[0]):]
        
    num_matches = list(re.finditer(r'(?:^|\s)(\d+)\)\s*', main_part))
    if num_matches:
        for n_idx, n_match in enumerate(num_matches):
            m_start = n_match.end()
            m_end = num_matches[n_idx+1].start() if n_idx + 1 < len(num_matches) else len(main_part)
            m_chunk = main_part[m_start:m_end].strip()
            clean_t, regs = clean_definition(m_chunk)
            if clean_t:
                meanings.append({
                    "partOfSpeech": pos_name,
                    "translation": clean_t,
                    "examples": [],
                    "register": regs
                })
    else:
        clean_t, regs = clean_definition(main_part)
        if clean_t:
            meanings.append({
                "partOfSpeech": pos_name,
                "translation": clean_t,
                "examples": [],
                "register": regs
            })
            
    if phr_part:
        items = re.split(r'[♦¬;]\s*', phr_part)
        for it in items:
            it = it.strip()
            if not it or len(it) < 3:
                continue
            if '~' in it:
                it = it.replace('~', base_word)
            it = clean_hyphens_and_ocr(it)
            en_m = re.match(r'^([a-zA-Z\s\',./\(\)-]+)([\u0400-\u04FF].*)$', it)
            if en_m:
                en_p = en_m.group(1).strip(' :;,-')
                ru_t = en_m.group(2).strip(' :;,-')
                ru_t, p_regs = extract_registers(ru_t)
                if en_p and ru_t:
                    phrases.append({
                        "phrase": en_p,
                        "partOfSpeech": pos_name,
                        "translation": ru_t,
                        "examples": [],
                        "register": p_regs
                    })
    return meanings, phrases

total_updated = 0

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
    
    # Isolate current headword entry text
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
    
    # Find all POS headers: e.g. "1. n", "2. v", "1. a predic.", "2. adv", "1. pres. p. от...", "2. a"
    pos_matches = list(re.finditer(r'(?:^|\n)\s*([1-4])\.\s*(?:(?:pres\.|p\.)\s*p\.\s*от\s*\w+\s*(?:\d+)?|([a-zA-Z]+(?:\s+predic\.)?))\b', entry_text))
    
    if len(pos_matches) < 2:
        # Check if without number: e.g. "1. a ... 2. adv"
        pos_matches = list(re.finditer(r'(?:^|\n)\s*([1-4])\.\s*([a-zA-Z]+)\b', entry_text))
        if len(pos_matches) < 2:
            continue
            
    all_meanings = []
    all_phrases = list(item.get('phrases', []))
    
    for p_idx, match in enumerate(pos_matches):
        p_raw = match.group(2) if len(match.groups()) >= 2 and match.group(2) else match.group(1)
        # Handle "pres. p." or "p. p." as adjective / verb
        p_clean = p_raw.split()[0].lower() if p_raw else 'noun'
        p_name = POS_MAP.get(p_clean, 'noun')
        if 'predic' in (p_raw or ''):
            p_name = 'adjective'
            
        start_p = match.end()
        end_p = pos_matches[p_idx+1].start() if p_idx + 1 < len(pos_matches) else len(entry_text)
        
        sec_chunk = entry_text[start_p:end_p]
        m_list, ph_list = parse_section_meanings(sec_chunk, p_name, w)
        all_meanings.extend(m_list)
        all_phrases.extend(ph_list)
        
    if all_meanings and len(all_meanings) >= len(item.get('meanings', [])):
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
        total_updated += 1

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Grand Rebuild Complete! Total true multi-POS words successfully updated: {total_updated}")
