# -*- coding: utf-8 -*-
"""
Perfected parse_entry_meanings_v2.py with English homoglyph sanitizer and plural marker filters.
"""
import sys
import os
import json
import re
import unicodedata

from parse_utils import REGISTER_MAP, POS_MAP
from hyphen_protection import protect_hyphenated_russian, restore_hyphenated_russian
from deep_cleaner import clean_russian_text_deep
from ocr_hyphen_merger import sanitize_english_homoglyphs

sys.stdout.reconfigure(encoding='utf-8')

def normalize_text_nfc(t):
    if not t: return ""
    t = t.replace('ﬁ ', 'fi').replace('ﬂ ', 'fl').replace('ﬃ ', 'ffi').replace('ﬀ ', 'ff').replace('ﬄ ', 'ffl')
    t = t.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('ﬃ', 'ffi').replace('ﬀ', 'ff').replace('ﬄ', 'ffl')
    t = t.replace('\ufb01 ', 'fi').replace('\ufb02 ', 'fl').replace('\ufb03 ', 'ffi').replace('\ufb00 ', 'ff').replace('\ufb04 ', 'ffl')
    t = t.replace('\ufb01', 'fi').replace('\ufb02', 'fl').replace('\ufb03', 'ffi').replace('\ufb00', 'ff').replace('\ufb04', 'ffl')
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    t = t.replace('Ј', '£')
    t = unicodedata.normalize('NFC', t)
    return t

def clean_russian_text(text):
    if not text: return ""
    text = re.sub(r'^\s*,\s*', '', text) # remove leading commas like ', тлв, кино...'
    return clean_russian_text_deep(text)

def clean_english_example(text):
    if not text: return ""
    text = sanitize_english_homoglyphs(text)
    text = re.sub(r'([a-zA-Z])-\s*([a-zA-Z])', r'\1\2', text)
    text = re.sub(r'(£|\$|€)\s*(\d+)\s+(\d+)', r'\1\2\3', text)
    text = re.sub(r'(£|\$|€)\s+(\d+)', r'\1\2', text)
    text = re.sub(r'\s+\d+$', '', text)
    text = re.sub(r'\s+([,;:?.!\'\"])', r'\1', text)
    text = re.sub(r'([\'\"])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'^[,;:\s]+', '', text)
    text = re.sub(r'[,;:\s]+$', '', text)
    
    # Filter stray plural marks that are not examples
    if text.strip() in ['genii )', 'monies ) pl', '-es )', 'pennies )', '-os )', '-da )', 'staves )', 'pl', 'pl )', ')', '(']:
        return ""
    if text.endswith('('):
        text = text[:-1].strip()
    if text.endswith(')'):
        if text.count(')') > text.count('('):
            text = text[:-1].strip()
            
    return unicodedata.normalize('NFC', text).strip()

def is_headword_span(s):
    font = s['font']
    text = normalize_text_nfc(s['text']).strip()
    if not text: return False
    if any(hf in font for hf in ['PragmaticaBold', 'Pragmatica-Bold', 'PragmaticaBoldA-Reg', 'PragmaticaBoldT', 'PragmaticaBoldA-Obl']):
        if text.isdigit(): return False
        if len(text) == 1 and text.isupper() and s['size'] > 11: return False
        return True
    return False

def parse_entry_meanings_and_phrases(raw_hw, body_spans, default_pos='other'):
    raw_tokens = []
    in_phonetic = False
    
    for s in body_spans:
        txt = normalize_text_nfc(s['text'])
        if not txt: continue
        font = s['font']
        
        if 'Phonetic' in font:
            continue
            
        if '[' in txt and ']' not in txt:
            in_phonetic = True
            txt = txt[:txt.find('[')]
            if not txt.strip(): continue
        elif in_phonetic:
            if ']' in txt:
                in_phonetic = False
                txt = txt[txt.find(']')+1:]
                if not txt.strip(): continue
            else:
                continue
        elif '[' in txt and ']' in txt:
            txt = re.sub(r'\[.*?\]', '', txt)
            if not txt.strip(): continue
            
        f_type = 'REG'
        if 'Bold' in font and 'Pragmatica' not in font:
            f_type = 'BOLD'
        elif 'Italic' in font:
            f_type = 'ITAL'
        elif 'Symbol' in font or 'Wingdings' in font:
            f_type = 'SYMB'
            
        parts = re.split(r'([◊\uf0e0□■▫▼\uf0a1])', txt)
        for p in parts:
            if not p: continue
            if p in ['', '◊', '\uf0e0']:
                raw_tokens.append({'text': p, 'type': 'IDIOM_MARKER', 'font': font})
            elif p in ['', '□', '■', '▫', '▼', '\uf0a1']:
                raw_tokens.append({'text': p, 'type': 'PHRASAL_MARKER', 'font': font})
            else:
                raw_tokens.append({'text': p, 'type': f_type, 'font': font})

    entry_pos = default_pos
    
    header_idx = 0
    while header_idx < len(raw_tokens) and header_idx < 15:
        tok = raw_tokens[header_idx]
        t_clean = tok['text'].strip()
        m_pos = re.search(r'\b(n|v|adj|adv|prep|cj|num|pron|int|part|art|predic|attr)\b', t_clean)
        if m_pos:
            p_code = m_pos.group(1)
            entry_pos = POS_MAP.get(p_code, entry_pos)
            header_idx += 1
            break
        if tok['type'] == 'BOLD' and re.match(r'^\d+$', t_clean):
            break
        header_idx += 1
        
    remaining_tokens = raw_tokens[header_idx:]

    sections = []
    curr_sec = {'type': 'main', 'tokens': []}
    
    for tok in remaining_tokens:
        t_type = tok['type']
        
        if t_type == 'PHRASAL_MARKER':
            if curr_sec['tokens']:
                sections.append(curr_sec)
            curr_sec = {'type': 'phrasal', 'tokens': []}
        elif t_type == 'IDIOM_MARKER':
            if curr_sec['tokens']:
                sections.append(curr_sec)
            curr_sec = {'type': 'idiom', 'tokens': []}
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
            phrasal_pos = entry_pos if entry_pos != 'other' else 'verb'
            
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
                    m_item = _parse_token_block(pb['tokens'], phrasal_pos)
                    if m_item:
                        if phrasal_verb and not m_item['examples']:
                            m_item['examples'] = [{'en': phrasal_verb, 'ru': m_item['translation']}]
                        meanings.append(m_item)
            else:
                m_item = _parse_token_block(phrasal_body, phrasal_pos)
                if m_item:
                    if phrasal_verb and not m_item['examples']:
                        m_item['examples'] = [{'en': phrasal_verb, 'ru': m_item['translation']}]
                    meanings.append(m_item)
                    
        elif sec_type == 'idiom':
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
        
        has_cyrillic = bool(re.search(r'[а-яёА-ЯЁ]', t))
        is_bold_en = (t_type == 'BOLD' or 'NewtonTd-Bold' in tok['font'] or 'Bold' in tok['font']) and bool(re.search(r'[a-zA-Z£]', t)) and not has_cyrillic
        
        if is_bold_en:
            if mode == 'RU':
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
                curr_en.append(t)
                mode = 'EN'
        elif has_cyrillic:
            curr_ru.append(t)
            mode = 'RU'
        else:
            if mode == 'EN':
                curr_en.append(t)
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
    
    raw_block_text = ''.join(t['text'] for t in tokens[idx:]).strip()
    if raw_block_text.startswith('='):
        return {
            'partOfSpeech': entry_pos,
            'translation': clean_russian_text(raw_block_text),
            'examples': []
        }
    
    while idx < len(tokens):
        tok = tokens[idx]
        t = tok['text']
        t_type = tok['type']
        
        has_cyrillic = bool(re.search(r'[а-яёА-ЯЁ]', t))
        is_bold_en = (t_type == 'BOLD' or 'NewtonTd-Bold' in tok['font'] or 'Bold' in tok['font']) and bool(re.search(r'[a-zA-Z£]', t)) and not has_cyrillic
        
        if is_bold_en:
            if curr_mode == 'EX_RU':
                en_str = clean_english_example(' '.join(curr_en))
                ru_str = clean_russian_text(' '.join(curr_ru))
                if en_str and ru_str:
                    examples.append({'en': en_str, 'ru': ru_str})
                    curr_en = [t]
                    curr_ru = []
                    curr_mode = 'EX_EN'
                else:
                    curr_en.append(t)
                    curr_mode = 'EX_EN'
            elif curr_mode == 'EX_EN':
                curr_en.append(t)
            else:
                curr_en = [t]
                curr_mode = 'EX_EN'
        elif has_cyrillic:
            if curr_mode == 'EX_EN':
                curr_ru.append(t)
                curr_mode = 'EX_RU'
            elif curr_mode == 'EX_RU':
                curr_ru.append(t)
            else:
                translations.append(t)
        else:
            if curr_mode == 'EX_EN':
                curr_en.append(t)
            elif curr_mode == 'EX_RU':
                curr_ru.append(t)
            else:
                translations.append(t)
                
        idx += 1
        
    if curr_mode in ['EX_EN', 'EX_RU'] and curr_en:
        en_str = clean_english_example(' '.join(curr_en))
        ru_str = clean_russian_text(' '.join(curr_ru))
        if en_str and ru_str:
            examples.append({'en': en_str, 'ru': ru_str})

    trans_str = clean_russian_text(''.join(translations))
    
    if not trans_str and examples:
        first_ex = examples[0]
        if first_ex.get('ru'):
            trans_str = first_ex['ru']
            
    if not trans_str and not examples:
        return None
        
    # Clean examples
    filtered_examples = []
    for ex in examples:
        clean_en = clean_english_example(ex.get('en', ''))
        clean_ru = clean_russian_text(ex.get('ru', ''))
        if clean_en and clean_ru:
            filtered_examples.append({'en': clean_en, 'ru': clean_ru})
            
    m_item = {
        'partOfSpeech': entry_pos,
        'translation': trans_str,
        'examples': filtered_examples
    }
    if registers:
        m_item['register'] = list(dict.fromkeys(registers))
    return m_item
