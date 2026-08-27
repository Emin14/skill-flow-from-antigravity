# -*- coding: utf-8 -*-
"""
Test and build new rules pipeline:
1. Prepositional functional definition extraction (under, in, on, at, by, with, for, from, etc.)
2. Example unpacking from preposition translations
3. Homograph disambiguation (lead, wind1, wind2, minute, row1, row2, tear, a, etc.)
4. Top-level phrases property extraction from ♦ blocks
5. Full QA validation
"""
import json
import re
import sys
import os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("Loading datasets...")
oxford_data = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

from parse_utils import REGISTER_MAP, POS_MAP

print(f"Loaded {len(oxford_data)} oxford words and {len(parsed_index)} parsed index keys.")

def clean_stress_and_hyphen(t):
    t = t.replace('\xad', '-').replace('\u00ad', '-').replace('\ue000', '-')
    t = re.sub(r'([А-Яа-яA-Za-z])-\s*\n\s*([А-Яа-яA-Za-z])', r'\1\2', t)
    t = re.sub(r'([А-Яа-яA-Za-z])-\s+([а-яa-z])', r'\1\2', t)
    def lower_stress(m):
        w = m.group(0)
        if re.search(r'[а-яё][А-ЯЁ]', w):
            return w[0] + w[1:].lower()
        return w
    t = re.sub(r'[А-Яа-яЁё]+', lower_stress, t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def extract_phrases_from_raw_text(raw_text, base_word):
    if '♦' not in raw_text:
        return []
    
    clean_text = clean_stress_and_hyphen(raw_text)
    # Split by ♦
    parts = clean_text.split('♦')[1:]
    phrases = []
    phrase_id = 1
    
    for p in parts:
        # Check where next main POS section starts (e.g. '2. v' or '3. a')
        m_next = re.search(r'\s+\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b', p)
        if m_next:
            p = p[:m_next.start()]
        
        # Semicolon-separated chunks
        clauses = [c.strip() for c in p.split(';') if c.strip()]
        for c in clauses:
            m_phrase = re.match(r'^([a-zA-Z~\s\-\,\'\"\(\)\/\.\!\?]+?)\s+([а-яА-Я].*)$', c)
            if m_phrase:
                en_raw = m_phrase.group(1).strip()
                ru_raw = m_phrase.group(2).strip()
                
                en_clean = en_raw.replace('~', base_word).strip(' ;,')
                
                regs = []
                for reg_k, reg_v in REGISTER_MAP.items():
                    if re.search(rf'\b{re.escape(reg_k)}', ru_raw):
                        regs.append(reg_v)
                        ru_raw = re.sub(rf'\b{re.escape(reg_k)}\s*', '', ru_raw).strip()
                
                examples = []
                # Check for example sentence inside ru_raw
                m_ex = re.search(r'([a-zA-Z\s\-\,\'\"\(\)\/\.\!\?]{4,})\s+([а-яА-Я].*)', ru_raw)
                if m_ex and len(m_ex.group(1).split()) >= 2:
                    ex_en = m_ex.group(1).strip().replace('~', base_word).strip(' ;,')
                    ex_ru = m_ex.group(2).strip(' ;,')
                    ru_def = ru_raw[:m_ex.start()].strip(' ;,:')
                    if ru_def:
                        ru_raw = ru_def
                    examples.append({'en': ex_en, 'ru': ex_ru})
                
                if en_clean and ru_raw and len(en_clean) >= 2:
                    phrases.append({
                        'id': phrase_id,
                        'phrase': en_clean,
                        'translation': ru_raw,
                        'examples': examples,
                        'register': regs
                    })
                    phrase_id += 1
    return phrases

# Test on at, under, take, make, hand
for target in ['at', 'under', 'take i', 'make i', 'hand i']:
    if target in parsed_index:
        raw = parsed_index[target][0]['text']
        bw = target.split()[0]
        res = extract_phrases_from_raw_text(raw, bw)
        print(f"=== Extracted {len(res)} phrases for {target} ===")
        for ph in res[:3]:
            print(f"  [{ph['id']}] phrase: {ph['phrase']} -> tr: {ph['translation']}")
            if ph['examples']:
                print(f"      eg: {ph['examples'][0]['en']} -> {ph['examples'][0]['ru']}")
