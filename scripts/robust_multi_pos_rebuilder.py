# -*- coding: utf-8 -*-
"""
Robust Multi-POS Rebuilder with full QA validation.
"""
import json, os, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from clean_all_examples_registers import REGISTER_MAP
from extract_all_embedded_examples import expand_tilde

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

POS_MAP = {
    'n': 'noun',
    'v': 'verb',
    'a': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'conj': 'conjunction',
    'pron': 'pronoun',
    'num': 'numeral',
    'int': 'interjection',
    'art': 'article'
}

def clean_ocr_text(text):
    text = text.replace('\u00ad', '').replace('\u200b', '')
    # Fix OCR split words with hyphens
    text = re.sub(r'(?<=[А-Яа-яA-Za-z])-[\s\n]+(?=[а-яa-z])', '', text)
    # Fix OCR split spaces inside words like "продвиже ние" -> "продвижение"
    # But preserve normal spaces
    text = re.sub(r'[\r\n]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_full_article(word, raw_text):
    text = clean_ocr_text(raw_text)
    
    # 1. Split into numbered POS sections: "1. n", "2. v", "3. a" etc.
    sec_pattern = re.compile(r'(?:^|\s)(?:(\d+)\.\s+)?(n|v|a|adv|prep|conj|pron|num|int)\b')
    matches = list(sec_pattern.finditer(text))
    
    # Filter matches to only true POS sections
    valid_sections = []
    for m in matches:
        pos_code = m.group(2)
        sec_num = m.group(1)
        valid_sections.append((m.start(), pos_code, sec_num))
        
    if not valid_sections:
        return None, None
        
    # Split text into sections
    raw_sections = []
    for i in range(len(valid_sections)):
        start_idx = valid_sections[i][0]
        end_idx = valid_sections[i+1][0] if i + 1 < len(valid_sections) else len(text)
        pos_code = valid_sections[i][1]
        sec_str = text[start_idx:end_idx].strip()
        raw_sections.append((pos_code, sec_str))
        
    all_meanings = []
    all_phrases = []
    
    m_id = 1
    p_id = 1
    
    for pos_code, sec_str in raw_sections:
        canonical_pos = POS_MAP.get(pos_code, 'noun')
        
        # Split section into Body, Phrasal Verbs (¬), and Idioms (♦)
        phrasal_parts = re.split(r'[¬\u00ac]\s*', sec_str)
        main_part = phrasal_parts[0]
        phrasal_chunks = phrasal_parts[1:] if len(phrasal_parts) > 1 else []
        
        idiom_parts = re.split(r'[♦\u2666]\s*', main_part)
        body_part = idiom_parts[0]
        idiom_chunks = idiom_parts[1:] if len(idiom_parts) > 1 else []
        
        # Parse points in body
        point_matches = list(re.finditer(r'(?:^|\s)(\d+)\)\s*', body_part))
        if point_matches:
            for i in range(len(point_matches)):
                p_start = point_matches[i].end()
                p_end = point_matches[i+1].start() if i + 1 < len(point_matches) else len(body_part)
                pt_text = body_part[p_start:p_end].strip()
                
                # Check for sub-points like attr.
                m_obj = build_meaning_entry(m_id, canonical_pos, pt_text, word)
                if m_obj and len(m_obj['translation']) > 1:
                    all_meanings.append(m_obj)
                    m_id += 1
        else:
            # Single unnumbered point
            clean_body = re.sub(r'^[a-zA-Z1-9\s\-\'\[\]\.\,/:—]+\b(?:n|v|a|adv|prep|conj|pron|num|int)\s*', '', body_part).strip()
            if clean_body:
                m_obj = build_meaning_entry(m_id, canonical_pos, clean_body, word)
                if m_obj and len(m_obj['translation']) > 1:
                    all_meanings.append(m_obj)
                    m_id += 1
                    
        # Parse idioms
        for id_chunk in idiom_chunks:
            idiom_list = extract_idioms_from_chunk(p_id, canonical_pos, id_chunk, word)
            for ip in idiom_list:
                all_phrases.append(ip)
                p_id += 1
                
        # Parse phrasal verbs
        for pv_chunk in phrasal_chunks:
            pv_list = extract_phrasals_from_chunk(p_id, pv_chunk, word)
            for pp in pv_list:
                all_phrases.append(pp)
                p_id += 1
                
    return all_meanings, all_phrases

def build_meaning_entry(m_id, pos, text, base_word):
    text = text.strip('; \t\n')
    regs = []
    
    # Extract register abbreviations
    tokens = re.split(r'[,;\s]+', text)
    matched_len = 0
    for tok in tokens:
        tok_clean = tok.strip('(),:; \t\n').lower()
        if not tok_clean.endswith('.') and tok_clean + '.' in REGISTER_MAP:
            tok_clean += '.'
        if tok_clean in REGISTER_MAP:
            r_name = REGISTER_MAP[tok_clean]
            if r_name not in regs:
                regs.append(r_name)
            matched_len += len(tok) + 1
        else:
            break
            
    if matched_len > 0:
        text = text[matched_len:].strip('(),:; \t\n')
        
    # Standardize plural prefixes
    if re.match(r'^\(?обыкн\.\s*pl\)?\s*', text, re.I):
        text = "обыкн. при англ. мн. ч.: " + re.sub(r'^\(?обыкн\.\s*pl\)?\s*', '', text, flags=re.I).strip()
    elif re.match(r'^\(?собир\.\s*pl\)?\s*|^\(?pl\s+собир\.\)?\s*', text, re.I):
        text = "собир. при англ. мн. ч.: " + re.sub(r'^\(?собир\.\s*pl\)?\s*|^\(?pl\s+собир\.\)?\s*', '', text, flags=re.I).strip()
    elif re.match(r'^\(?часто\s*pl\)?\s*', text, re.I):
        text = "часто при англ. мн. ч.: " + re.sub(r'^\(?часто\s*pl\)?\s*', '', text, flags=re.I).strip()
    elif re.match(r'^\(?pl\)?\s*', text, re.I):
        text = "при англ. мн. ч.: " + re.sub(r'^\(?pl\)?\s*', '', text, flags=re.I).strip()
        
    # Split into translation and examples
    parts = re.split(r';\s*', text)
    clean_parts = []
    examples = []
    
    for p in parts:
        p = p.strip()
        if not p: continue
        
        # Check if this part is an example
        if '~' in p or (re.search(r'^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}', p) and re.search(r'[А-Яа-яЁё]{3,}', p)):
            m_ex = re.search(r'^(.*?)\s+([А-Яа-яЁё\d\(\)\.\,\—\-\s≈]+)$', p)
            if m_ex and ('~' in m_ex.group(1) or re.search(r'[a-zA-Z]{2,}', m_ex.group(1))):
                en_str = expand_tilde(m_ex.group(1).strip(), base_word)
                ru_str = m_ex.group(2).strip()
                # Sub-numbering
                ru_str = re.sub(r'(?:^|\s)а\)\s*', '1) ', ru_str)
                ru_str = re.sub(r'(?:^|\s)б\)\s*', '; 2) ', ru_str)
                ru_str = re.sub(r'(?:^|\s)в\)\s*', '; 3) ', ru_str)
                examples.append({"en": en_str, "ru": ru_str})
            else:
                clean_parts.append(p)
        else:
            clean_parts.append(p)
            
    tr_final = '; '.join(clean_parts).strip('; \t\n')
    if not tr_final and examples:
        tr_final = "в роли определения к другому слову"
    tr_final = expand_tilde(tr_final, base_word)
    
    return {
        "id": m_id,
        "partOfSpeech": pos,
        "translation": tr_final,
        "examples": examples,
        "register": regs
    }

def extract_idioms_from_chunk(start_id, pos, text, base_word):
    phrases = []
    parts = re.split(r';\s*(?=(?:to\s+|a\s+|the\s+|in\s+|at\s+|on\s+|[a-zA-Z~]))', text)
    for p_idx, p in enumerate(parts):
        p = p.strip('; \t\n')
        if not p: continue
        m = re.search(r'^(.*?)\s+([А-Яа-яЁё\d\(\)\.\,\—\-\s≈\≅]+)$', p)
        if m:
            en_str = expand_tilde(m.group(1).strip(), base_word)
            ru_str = m.group(2).strip().replace('≅', '≈')
            if not ru_str.startswith('≈') and '≅' in p:
                ru_str = '≈ ' + ru_str
            phrases.append({
                "id": start_id + p_idx,
                "phrase": en_str,
                "partOfSpeech": pos,
                "translation": ru_str,
                "examples": [],
                "register": []
            })
    return phrases

def extract_phrasals_from_chunk(start_id, text, base_word):
    phrases = []
    # e.g. "off отмерять; out отмерять; up (to, with) а) достигать..."
    items = re.split(r';\s*~?\s*', text)
    for i_idx, it in enumerate(items):
        it = it.strip('; \t\n')
        if not it: continue
        m = re.search(r'^~?\s*([a-zA-Z\s\(\)]+)\s+(.+)$', it)
        if m:
            prep = m.group(1).strip()
            ru_str = m.group(2).strip()
            ru_str = re.sub(r'(?:^|\s)а\)\s*', '1) ', ru_str)
            ru_str = re.sub(r'(?:^|\s)б\)\s*', '; 2) ', ru_str)
            ru_str = re.sub(r'(?:^|\s)в\)\s*', '; 3) ', ru_str)
            phrases.append({
                "id": start_id + i_idx,
                "phrase": f"{base_word} {prep}".strip(),
                "partOfSpeech": "verb",
                "translation": ru_str,
                "examples": [],
                "register": []
            })
    return phrases

print("Rebuilder engine defined successfully!")
