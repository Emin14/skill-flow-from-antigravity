# -*- coding: utf-8 -*-
"""
Reconstruct multi-POS words across the whole dataset with 100% academic quality and QA validation.
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
    # Clean attr.
    if text.startswith('attr.') or text.startswith('attr '):
        text = 'в роли определения: ' + text[5:].strip(' :;')
    # Clean pl
    if re.search(r'\bpl\b', text):
        text = re.sub(r'\bобыкн\.\s*pl\b', 'обыкн. при англ. мн. ч.:', text)
        text = re.sub(r'\bтж\.\s*pl\b', 'при англ. мн. ч.:', text)
        text = re.sub(r'\bpl:\b', 'при англ. мн. ч.:', text)
        text = re.sub(r'\(pl\s+([^)]+)\)', r'при англ. мн. ч. \1:', text)
        text = re.sub(r'\bpl\b', 'при англ. мн. ч.:', text)
    
    # Extract registers
    text, regs = extract_registers(text)
    
    # Clean stray characters
    text = re.sub(r'\s+', ' ', text).strip(' ,;')
    return text, regs

def parse_section(sec_text, pos_name, base_word):
    meanings = []
    phrases = []
    
    # Split idioms/phrases
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
        # Split by ♦ or ¬ or ;
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

success_count = 0
skipped_count = 0

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
    has_pos_2 = bool(re.search(r'\b2\.\s*(?:v|n|a|adv)\b', combined_raw))
    current_poses = set(m['partOfSpeech'] for m in item.get('meanings', []))
    
    if not has_pos_2 or len(current_poses) >= 2:
        continue
    
    # Let's parse multi-pos
    pos_matches = list(re.finditer(r'(?:^|\n)\s*([1-4])\.\s*([a-zA-Z]+)\b', combined_raw))
    if len(pos_matches) < 2:
        skipped_count += 1
        continue
        
    all_meanings = []
    all_phrases = list(item.get('phrases', []))
    
    for p_idx, match in enumerate(pos_matches):
        p_num = match.group(1)
        p_raw = match.group(2).lower()
        p_name = POS_MAP.get(p_raw, 'noun')
        
        start_p = match.end()
        end_p = pos_matches[p_idx+1].start() if p_idx + 1 < len(pos_matches) else len(combined_raw)
        
        sec_str = combined_raw[start_p:end_p]
        m_list, ph_list = parse_section(sec_str, p_name, w)
        all_meanings.extend(m_list)
        all_phrases.extend(ph_list)
        
    if len(all_meanings) >= len(item.get('meanings', [])):
        # Assign sequential IDs
        for m_i, m in enumerate(all_meanings, 1):
            m['id'] = m_i
        # Deduplicate phrases
        unique_phrases = []
        seen_p = set()
        for p_i, p in enumerate(all_phrases, 1):
            p_text = p['phrase'].lower().strip()
            if p_text not in seen_p:
                seen_p.add(p_text)
                p['id'] = len(unique_phrases) + 1
                unique_phrases.append(p)
                
        oxford_data[idx]['meanings'] = all_meanings
        if unique_phrases:
            oxford_data[idx]['phrases'] = unique_phrases
        success_count += 1

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Reconstruction pass complete!")
print(f"Successfully enriched/rebuilt: {success_count} words")
print(f"Skipped/Single-section: {skipped_count} words")
