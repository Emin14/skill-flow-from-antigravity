# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

from parse_utils import REGISTER_MAP, POS_MAP
from parse_entry_meanings import (
    is_headword_span,
    normalize_text_nfc,
    clean_russian_text,
    clean_english_example
)

sys.stdout.reconfigure(encoding='utf-8')

# Function to parse an entry into both meanings and phrases
def parse_entry_meanings_and_phrases(raw_hw, body_spans, default_pos='other'):
    tokens = []
    in_phonetic = False
    
    for s in body_spans:
        txt = normalize_text_nfc(s['text'])
        if not txt: continue
        font = s['font']
        
        if '[' in txt and ']' not in txt:
            in_phonetic = True
            continue
        if in_phonetic:
            if ']' in txt:
                in_phonetic = False
            continue
        if '[' in txt and ']' in txt:
            txt = re.sub(r'\[.*?\]', '', txt)
            if not txt.strip(): continue
        if 'Phonetic' in font:
            continue
            
        f_type = 'REG'
        if 'Bold' in font and 'Pragmatica' not in font:
            f_type = 'BOLD'
        elif 'Italic' in font:
            f_type = 'ITAL'
        elif 'Symbol' in font or 'Wingdings' in font:
            f_type = 'SYMB'
            
        tokens.append({'text': txt, 'type': f_type, 'font': font})

    # Extract POS from header
    entry_pos = default_pos
    header_idx = 0
    while header_idx < len(tokens) and header_idx < 10:
        tok = tokens[header_idx]
        t_clean = tok['text'].strip()
        m_pos = re.match(r'^(n|v|adj|adv|prep|cj|num|pron|int|part|art|predic|attr)\b', t_clean)
        if m_pos and (tok['type'] in ['ITAL', 'REG']):
            p_code = m_pos.group(1)
            entry_pos = POS_MAP.get(p_code, entry_pos)
            header_idx += 1
            break
        if t_clean.startswith('(') and (t_clean.endswith(')') or header_idx + 1 < len(tokens)):
            header_idx += 1
            continue
        if tok['type'] == 'BOLD' and re.match(r'^\d+$', t_clean):
            break
        header_idx += 1
        
    remaining_tokens = tokens[header_idx:]

    # Split into sections:
    # 1. Main meanings
    # 2. Phrasal verbs: '', '□', '■', '▫'
    # 3. Idiom phrases: '', '◊', '\uf0e0'
    sections = []
    curr_sec = {'type': 'main', 'tokens': []}
    
    for tok in remaining_tokens:
        t_txt = tok['text'].strip()
        
        # Phrasal verb marker
        if tok['type'] == 'SYMB' and t_txt in ['', '□', '■', '▫', '▼', '\uf0a1']:
            if curr_sec['tokens']:
                sections.append(curr_sec)
            curr_sec = {'type': 'phrasal', 'tokens': []}
        # Idiom marker (romb)
        elif t_txt in ['', '◊', '\uf0e0'] or (tok['type'] == 'SYMB' and t_txt in ['', '\uf0e0', '◊']):
            if curr_sec['tokens']:
                sections.append(curr_sec)
            curr_sec = {'type': 'idiom', 'tokens': []}
        elif tok['type'] == 'SYMB':
            # Other symbol
            if t_txt == '\uf0e0': # SymbolMT arrow/diamond
                if curr_sec['tokens']:
                    sections.append(curr_sec)
                curr_sec = {'type': 'idiom', 'tokens': []}
            elif t_txt == '\uf0a1': # Wingdings square
                if curr_sec['tokens']:
                    sections.append(curr_sec)
                curr_sec = {'type': 'phrasal', 'tokens': []}
            else:
                curr_sec['tokens'].append(tok)
        else:
            curr_sec['tokens'].append(tok)
            
    if curr_sec['tokens']:
        sections.append(curr_sec)

    meanings = []
    phrases = []
    
    for sec in sections:
        sec_type = sec['type']
        sec_tokens = sec['tokens']
        if not sec_tokens: continue
        
        if sec_type == 'main':
            blocks = []
            curr_b = {'num': None, 'tokens': []}
            has_num = any(t['type'] == 'BOLD' and re.match(r'^\d+$', t['text'].strip()) for t in sec_tokens)
            
            for tok in sec_tokens:
                t_txt = tok['text'].strip()
                if tok['type'] == 'BOLD' and re.match(r'^\d+$', t_txt):
                    if curr_b['tokens']:
                        blocks.append(curr_b)
                    curr_b = {'num': int(t_txt), 'tokens': []}
                else:
                    curr_b['tokens'].append(tok)
            if curr_b['tokens']:
                blocks.append(curr_b)
                
            if has_num:
                blocks = [b for b in blocks if b['num'] is not None]
                
            for b in blocks:
                m_item = _parse_token_block(b['tokens'], entry_pos)
                if m_item:
                    meanings.append(m_item)
                    
        elif sec_type == 'phrasal':
            phrasal_head = []
            p_idx = 0
            while p_idx < len(sec_tokens):
                tok = sec_tokens[p_idx]
                if tok['type'] == 'BOLD' and not re.match(r'^\d+$', tok['text'].strip()) and re.search(r'[a-zA-Z]', tok['text']):
                    phrasal_head.append(tok['text'])
                    p_idx += 1
                else:
                    break
            phrasal_verb = clean_english_example(' '.join(phrasal_head))
            phrasal_body = sec_tokens[p_idx:]
            
            p_has_num = any(t['type'] == 'BOLD' and re.match(r'^\d+$', t['text'].strip()) for t in phrasal_body)
            if p_has_num:
                p_blocks = []
                curr_pb = {'num': None, 'tokens': []}
                for tok in phrasal_body:
                    t_txt = tok['text'].strip()
                    if tok['type'] == 'BOLD' and re.match(r'^\d+$', t_txt):
                        if curr_pb['tokens']:
                            p_blocks.append(curr_pb)
                        curr_pb = {'num': int(t_txt), 'tokens': []}
                    else:
                        curr_pb['tokens'].append(tok)
                if curr_pb['tokens']:
                    p_blocks.append(curr_pb)
                p_blocks = [pb for pb in p_blocks if pb['num'] is not None]
                
                for pb in p_blocks:
                    m_item = _parse_token_block(pb['tokens'], entry_pos)
                    if m_item:
                        if phrasal_verb and not m_item['examples']:
                            m_item['examples'] = [{'en': phrasal_verb, 'ru': m_item['translation']}]
                        meanings.append(m_item)
            else:
                m_item = _parse_token_block(phrasal_body, entry_pos)
                if m_item:
                    if phrasal_verb and not m_item['examples']:
                        m_item['examples'] = [{'en': phrasal_verb, 'ru': m_item['translation']}]
                    meanings.append(m_item)
                    
        elif sec_type == 'idiom':
            # Extract all idiom pairs (BOLD English + REG Russian)
            pairs = _extract_phrase_pairs(sec_tokens)
            for p in pairs:
                if p.get('en') and p.get('ru'):
                    phrases.append(p)

    if not meanings:
        fallback_trans = clean_russian_text(''.join(t['text'] for t in remaining_tokens))
        meanings = [{
            'partOfSpeech': entry_pos,
            'translation': fallback_trans,
            'examples': []
        }]
        
    return meanings, phrases

def _extract_phrase_pairs(tokens):
    pairs = []
    curr_en = []
    curr_ru = []
    mode = 'INIT'
    
    for tok in tokens:
        t = tok['text']
        t_type = tok['type']
        
        is_bold_en = (t_type == 'BOLD' or 'NewtonTd-Bold' in tok['font'] or 'Bold' in tok['font']) and bool(re.search(r'[a-zA-Z£]', t)) and not bool(re.search(r'[а-яёА-ЯЁ]', t))
        
        if is_bold_en:
            if mode == 'RU':
                # Previous phrase completed, start new phrase
                en_clean = clean_english_example(' '.join(curr_en))
                ru_clean = clean_russian_text(' '.join(curr_ru))
                if en_clean and ru_clean:
                    pairs.append({'en': en_clean, 'ru': ru_clean})
                curr_en = [t]
                curr_ru = []
                mode = 'EN'
            else:
                curr_en.append(t)
                mode = 'EN'
        else:
            if mode == 'EN':
                if re.match(r'^\s*[,;:\s]+\s*$', t):
                    curr_en.append(t)
                else:
                    curr_ru.append(t)
                    mode = 'RU'
            elif mode == 'RU':
                curr_ru.append(t)
                
    if curr_en and curr_ru:
        en_clean = clean_english_example(' '.join(curr_en))
        ru_clean = clean_russian_text(' '.join(curr_ru))
        if en_clean and ru_clean:
            pairs.append({'en': en_clean, 'ru': ru_clean})
            
    return pairs

def _parse_token_block(tokens, default_pos):
    if not tokens: return None
    
    registers = []
    translations = []
    examples = []
    entry_pos = default_pos
    
    idx = 0
    while idx < len(tokens):
        tok = tokens[idx]
        t_str = tok['text'].strip()
        if tok['type'] == 'ITAL':
            reg_clean = re.sub(r'[^а-яё\-]', '', t_str.lower())
            if reg_clean in REGISTER_MAP:
                registers.append(REGISTER_MAP[reg_clean])
                idx += 1
                continue
            m_sub_pos = re.match(r'^(n|v|adj|adv|prep|cj|num|pron|int)\b', t_str)
            if m_sub_pos and not translations:
                entry_pos = POS_MAP.get(m_sub_pos.group(1), entry_pos)
                idx += 1
                continue
        break
        
    curr_mode = 'TRANS'
    curr_en = []
    curr_ru = []
    
    while idx < len(tokens):
        tok = tokens[idx]
        t = tok['text']
        t_type = tok['type']
        
        is_bold_en = (t_type == 'BOLD' or 'NewtonTd-Bold' in tok['font'] or 'Bold' in tok['font']) and bool(re.search(r'[a-zA-Z£]', t)) and not bool(re.search(r'[а-яёА-ЯЁ]', t))
        
        if is_bold_en:
            if curr_mode == 'EX_RU':
                en_str = clean_english_example(' '.join(curr_en))
                ru_str = clean_russian_text(' '.join(curr_ru))
                if en_str:
                    examples.append({'en': en_str, 'ru': ru_str})
                curr_en = [t]
                curr_ru = []
                curr_mode = 'EX_EN'
            elif curr_mode == 'EX_EN':
                curr_en.append(t)
            else:
                curr_en = [t]
                curr_mode = 'EX_EN'
        else:
            if curr_mode == 'EX_EN':
                if re.match(r'^\s*[,;:\s]+\s*$', t):
                    curr_en.append(t)
                else:
                    curr_ru.append(t)
                    curr_mode = 'EX_RU'
            elif curr_mode == 'EX_RU':
                curr_ru.append(t)
            else:
                translations.append(t)
                
        idx += 1
        
    if curr_mode in ['EX_EN', 'EX_RU'] and curr_en:
        en_str = clean_english_example(' '.join(curr_en))
        ru_str = clean_russian_text(' '.join(curr_ru))
        if en_str:
            examples.append({'en': en_str, 'ru': ru_str})

    trans_str = clean_russian_text(''.join(translations))
    
    if not trans_str and examples:
        first_ex = examples[0]
        if first_ex.get('ru'):
            trans_str = first_ex['ru']
            
    if not trans_str and not examples:
        return None
        
    m_item = {
        'partOfSpeech': entry_pos,
        'translation': trans_str,
        'examples': examples
    }
    if registers:
        m_item['register'] = list(dict.fromkeys(registers))
    return m_item

# Test on breath and breathe
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
page = doc[60]
d = page.get_text('dict')
page_h = page.rect.height

test_entries = []
curr = None
for b in d['blocks']:
    if 'lines' not in b: continue
    for l in b['lines']:
        y0, y1 = l['bbox'][1], l['bbox'][3]
        if y0 < 50 or y1 > page_h - 25: continue
        if not l['spans']: continue
        first_s = l['spans'][0]
        if is_headword_span(first_s):
            if curr: test_entries.append(curr)
            curr = {'hw': ''.join(normalize_text_nfc(s['text']) for s in l['spans'] if is_headword_span(s)).strip(), 'body': []}
            hw_done = False
            for s in l['spans']:
                if not hw_done and is_headword_span(s): pass
                else:
                    hw_done = True
                    curr['body'].append(s)
        else:
            if curr:
                for s in l['spans']:
                    curr['body'].append(s)
if curr: test_entries.append(curr)

for te in test_entries:
    if te['hw'].lower() in ['breath', 'breathe']:
        print(f"\n==================== Word: {te['hw']} ====================")
        meanings, phrases = parse_entry_meanings_and_phrases(te['hw'], te['body'])
        print(f"Meanings count: {len(meanings)}")
        print(f"Phrases count: {len(phrases)}")
        print("Meanings:", json.dumps(meanings, ensure_ascii=False, indent=2))
        print("Phrases:", json.dumps(phrases, ensure_ascii=False, indent=2))
