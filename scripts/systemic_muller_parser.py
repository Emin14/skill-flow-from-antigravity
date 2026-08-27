# -*- coding: utf-8 -*-
"""
Deterministic Systemic Mueller Grammar Parser.
Parses raw dictionary text into standard Oxford schema adhering to all 12 Gold Standard rules.
"""
import json, re, sys, copy
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from parse_utils import POS_MAP, REGISTER_MAP, clean_russian_text, clean_english_example

def clean_ocr(t):
    if not t: return ""
    t = re.sub(r'([А-Яа-яA-Za-z])-\s*≅?\s*([а-яa-z])', r'\1\2', t)
    t = t.replace('≅', '').replace('\xad', '').replace('\u00ad', '').replace('\ue000', '')
    t = re.sub(r'\.\s+\.\s+\.', '...', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def expand_tilde_local(text, base_word):
    stem = re.sub(r'[1-9]$', '', base_word).strip()
    y_stem = stem[:-1] if stem.endswith('y') and len(stem) > 1 and stem[-2] not in 'aeiou' else stem
    e_stem = stem[:-1] if stem.endswith('e') else stem
    replacements = [
        ('~est', stem + 'est'),
        ('~er', stem + 'er'),
        ('~ies', y_stem + 'ies'),
        ('~ied', y_stem + 'ied'),
        ('~ing', e_stem + 'ing'),
        ('~ed', e_stem + 'ed'),
        ('~d', e_stem + 'd'),
        ('~s', y_stem + 'ies' if stem.endswith('y') and len(stem) > 1 and stem[-2] not in 'aeiou' else stem + 's'),
        ("~'s", stem + "'s"),
        ('~', stem),
    ]
    for pattern, repl in replacements:
        text = text.replace(pattern, repl)
    return text

def extract_all_diamonds_and_phrasals(raw_text):
    """
    Extracts all ♦ (diamonds) from raw text,
    returning clean body text (without diamonds) and raw phrase chunks.
    """
    diamond_chunks = []
    clean_text = raw_text
    
    parts = clean_text.split('♦')
    main_body = parts[0]
    
    for p in parts[1:]:
        m_next_pos = re.search(r'\b([2-9])\.\s*(?:n|v|vi|vt|a|adj|adv|prep|cj|conj|int|pron|num)\b', p)
        if m_next_pos:
            d_content = p[:m_next_pos.start()]
            remaining_body = p[m_next_pos.start():]
            diamond_chunks.append(d_content)
            main_body += " " + remaining_body
        else:
            diamond_chunks.append(p)
            
    return main_body, diamond_chunks

def parse_diamond_chunk_to_phrases(d_text, base_word):
    """
    Parses diamond block text into structured PhraseEntry items.
    Handles multi-letter subitems (а) ... б) ...).
    """
    phrases = []
    text = clean_ocr(d_text)
    text = re.sub(r';\s*(?=[б-г]\))', '<SUB_SEMI> ', text)
    
    raw_phr_items = [x.strip() for x in text.split(';') if x.strip()]
    for item in raw_phr_items:
        item = item.replace('<SUB_SEMI>', ';')
        m = re.match(r'^([a-zA-Z\s\~\-\'\,\(\)\/\.\?\!\=]+?)\s+([а-яА-Я].*)$', item)
        if m:
            en_part = m.group(1).strip(' ;,')
            ru_part = m.group(2).strip(' ;,')
            
            en_exp = expand_tilde_local(en_part, base_word)
            
            if re.search(r'\bа\)\s+', ru_part):
                sub_parts = re.split(r'\s*[а-г]\)\s*', ru_part)
                sub_clean = [s.strip(' ;,') for s in sub_parts if s.strip()]
                ru_part = '; '.join(f"{i}) {s}" for i, s in enumerate(sub_clean, 1))
                
            p_regs = []
            for reg_k, reg_v in REGISTER_MAP.items():
                if re.search(rf'\b{re.escape(reg_k)}', ru_part):
                    if reg_v not in p_regs:
                        p_regs.append(reg_v)
                    ru_part = re.sub(rf'\b{re.escape(reg_k)}\s*', '', ru_part).strip(' ;,')
                    
            en_low = en_exp.lower()
            if en_low.startswith('to ') or en_low.startswith('be ') or en_low.startswith('what '):
                p_pos = 'verb'
            elif any(w in en_low for w in ['man', 'bird', 'house', 'dog', 'mr', 'mrs', 'egg', 'hand', 'eye']):
                p_pos = 'noun'
            else:
                p_pos = 'adverb'
                
            phrases.append({
                'phrase': en_exp,
                'partOfSpeech': p_pos,
                'translation': ru_part,
                'examples': [],
                'register': p_regs
            })
            
    return phrases
