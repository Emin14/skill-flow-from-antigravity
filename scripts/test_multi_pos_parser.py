# -*- coding: utf-8 -*-
"""
Prototype Multi-POS parser for Muller dictionary entries.
Tests on 10 critical words: account, advance, anchor, balance, board, book, call, clear, close, fall.
"""
import json, os, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Import REGISTER_MAP and morphological functions
from clean_all_examples_registers import REGISTER_MAP
from extract_all_embedded_examples import expand_tilde

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

def parse_full_muller_article(word, raw_text):
    # Clean OCR soft hyphens
    text = raw_text.replace('\u00ad', '').replace('\u200b', '')
    text = re.sub(r'(?<=[А-Яа-яA-Za-z])-[\s\n]+(?=[а-яa-z])', '', text)
    text = re.sub(r'[\r\n]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # 1. Detect major POS sections: "1. n", "2. v", "3. a" or standalone "n", "v", "a"
    # Find all sections like "1. n", "2. v", "3. a" or "1. a", "2. n"
    section_matches = list(re.finditer(r'(?:^|\s)(?:(\d+)\.\s+)?(n|v|a|adv|prep|conj|pron|num|int)\b', text))
    
    # Split text into sections
    sections = []
    if len(section_matches) > 1 and section_matches[0].group(1) == '1':
        for i in range(len(section_matches)):
            start_pos = section_matches[i].start()
            end_pos = section_matches[i+1].start() if i + 1 < len(section_matches) else len(text)
            pos_tag = section_matches[i].group(2)
            sec_text = text[start_pos:end_pos].strip()
            sections.append((pos_tag, sec_text))
    else:
        # Single section, find leading POS tag
        pos_match = re.search(r'\b(n|v|a|adv|prep|conj|pron|num|int)\b', text)
        pos_tag = pos_match.group(1) if pos_match else 'noun'
        sections.append((pos_tag, text))
        
    all_meanings = []
    all_phrases = []
    
    meaning_id = 1
    phrase_id = 1
    
    for pos_tag, sec_text in sections:
        canonical_pos = POS_MAP.get(pos_tag, 'noun')
        
        # Split section into Body, Phrasal Verbs (¬ or ­ ~), and Idioms (♦)
        # 1. Extract Phrasal Verbs (¬ or ­ ~)
        phrasal_split = re.split(r'[¬\u00ac]\s*|\s+­\s*~\s*', sec_text)
        main_sec_text = phrasal_split[0]
        phrasal_chunks = phrasal_split[1:] if len(phrasal_split) > 1 else []
        
        # 2. Extract Idioms (♦) from main_sec_text
        idiom_split = re.split(r'[♦\u2666]\s*', main_sec_text)
        body_text = idiom_split[0]
        idiom_chunks = idiom_split[1:] if len(idiom_split) > 1 else []
        
        # Parse meanings in body_text by numbered points "1)", "2)", "3)"
        point_matches = list(re.finditer(r'(?:^|\s)(\d+)\)\s*', body_text))
        if point_matches:
            for p_idx in range(len(point_matches)):
                p_start = point_matches[p_idx].end()
                p_end = point_matches[p_idx+1].start() if p_idx + 1 < len(point_matches) else len(body_text)
                point_text = body_text[p_start:p_end].strip()
                
                # Parse single meaning point
                m_obj = parse_meaning_point(meaning_id, canonical_pos, point_text, word)
                if m_obj:
                    all_meanings.append(m_obj)
                    meaning_id += 1
        else:
            # Single unnumbered meaning
            # Strip initial headword/transcription/pos
            clean_body = re.sub(r'^[a-zA-Z1-9\s\-\'\[\]\.\,/:—]+\b(?:n|v|a|adv|prep|conj|pron|num|int)\s*', '', body_text).strip()
            if clean_body:
                m_obj = parse_meaning_point(meaning_id, canonical_pos, clean_body, word)
                if m_obj:
                    all_meanings.append(m_obj)
                    meaning_id += 1
                    
        # Parse idioms
        for id_text in idiom_chunks:
            # Idioms can contain multiple phrases separated by ';'
            id_phrases = parse_idiom_block(phrase_id, canonical_pos, id_text, word)
            for p in id_phrases:
                all_phrases.append(p)
                phrase_id += 1
                
        # Parse phrasal verbs
        for pv_text in phrasal_chunks:
            pv_phrases = parse_phrasal_block(phrase_id, pv_text, word)
            for p in pv_phrases:
                all_phrases.append(p)
                phrase_id += 1

    return all_meanings, all_phrases

def parse_meaning_point(m_id, pos, text, base_word):
    # Extracts register, translation, and examples
    text = text.strip('; \t\n')
    regs = []
    
    # Check for leading registers
    # e.g. "ком. баланс; сальдо" or "астр., геол. складка"
    # Extract register abbreviations
    tokens = re.split(r'[,;\s]+', text)
    matched_len = 0
    for tok in tokens:
        tok_clean = tok.strip('(),:; \t\n')
        tok_lower = tok_clean.lower()
        if not tok_lower.endswith('.') and tok_lower + '.' in REGISTER_MAP:
            tok_lower += '.'
        if tok_lower in REGISTER_MAP:
            reg_name = REGISTER_MAP[tok_lower]
            if reg_name not in regs:
                regs.append(reg_name)
            matched_len += len(tok) + 1
        else:
            break
            
    if matched_len > 0:
        text = text[matched_len:].strip('(),:; \t\n')
        
    # Check for plural prefixes: pl, (обыкн. pl), (часто pl)
    if re.match(r'^\(?обыкн\.\s*pl\)?\s*', text, re.I):
        text = "обыкн. при англ. мн. ч.: " + re.sub(r'^\(?обыкн\.\s*pl\)?\s*', '', text, flags=re.I).strip()
    elif re.match(r'^\(?собир\.\s*pl\)?\s*|^\(?pl\s+собир\.\)?\s*', text, re.I):
        text = "собир. при англ. мн. ч.: " + re.sub(r'^\(?собир\.\s*pl\)?\s*|^\(?pl\s+собир\.\)?\s*', '', text, flags=re.I).strip()
    elif re.match(r'^\(?часто\s*pl\)?\s*', text, re.I):
        text = "часто при англ. мн. ч.: " + re.sub(r'^\(?часто\s*pl\)?\s*', '', text, flags=re.I).strip()
    elif re.match(r'^\(?pl\)?\s*', text, re.I):
        text = "при англ. мн. ч.: " + re.sub(r'^\(?pl\)?\s*', '', text, flags=re.I).strip()
        
    # Separate examples from translation
    # Split by semicolon
    parts = re.split(r';\s*', text)
    clean_parts = []
    examples = []
    
    for p in parts:
        p = p.strip()
        if not p: continue
        
        # Check if part is an example
        if '~' in p or (re.search(r'^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}', p) and re.search(r'[А-Яа-яЁё]{3,}', p)):
            # Try to match English + Russian
            m_ex = re.search(r'^(.*?)\s+([А-Яа-яЁё\d\(\)\.\,\—\-\s≈]+)$', p)
            if m_ex and ('~' in m_ex.group(1) or re.search(r'[a-zA-Z]{2,}', m_ex.group(1))):
                en_str = expand_tilde(m_ex.group(1).strip(), base_word)
                ru_str = m_ex.group(2).strip()
                # Clean sub-letters in ru_str
                ru_str = re.sub(r'(?:^|\s)а\)\s*', '1) ', ru_str)
                ru_str = re.sub(r'(?:^|\s)б\)\s*', '; 2) ', ru_str)
                examples.append({"en": en_str, "ru": ru_str})
            else:
                clean_parts.append(p)
        else:
            clean_parts.append(p)
            
    final_tr = '; '.join(clean_parts).strip('; \t\n')
    if not final_tr and examples:
        final_tr = "в роли определения к другому слову"
        
    final_tr = expand_tilde(final_tr, base_word)
    
    return {
        "id": m_id,
        "partOfSpeech": pos,
        "translation": final_tr,
        "examples": examples,
        "register": regs
    }

def parse_idiom_block(start_id, pos, text, base_word):
    phrases = []
    # Idioms inside block are often separated by ';'
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

def parse_phrasal_block(start_id, text, base_word):
    phrases = []
    # e.g. "out а) сбалансировать... б) уравновеситься"
    m = re.search(r'^([a-zA-Z\s]+)\s+(.+)$', text)
    if m:
        prep = m.group(1).strip()
        ru_str = m.group(2).strip()
        # Convert letters to 1), 2)
        ru_str = re.sub(r'(?:^|\s)а\)\s*', '1) ', ru_str)
        ru_str = re.sub(r'(?:^|\s)б\)\s*', '; 2) ', ru_str)
        ru_str = re.sub(r'(?:^|\s)в\)\s*', '; 3) ', ru_str)
        phrases.append({
            "id": start_id,
            "phrase": f"{base_word} {prep}",
            "partOfSpeech": "verb",
            "translation": ru_str,
            "examples": [],
            "register": []
        })
    return phrases

# Test on 3 words: account, advance, balance
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

for tw in ['account', 'advance', 'balance']:
    raw_entries = parsed_index.get(tw, [])
    full_text = ' '.join(e.get('text', '') for e in raw_entries)
    meanings, phrases = parse_full_muller_article(tw, full_text)
    print(f"\n==================== TEST RESULT: {tw} ====================")
    print(f"Meanings count: {len(meanings)}, POS types: {set(m['partOfSpeech'] for m in meanings)}")
    for m in meanings:
        print(f"  [{m['partOfSpeech']}] {m['id']}. {m['translation']} (examples: {len(m['examples'])}, regs: {m['register']})")
    print(f"Phrases count: {len(phrases)}")
    for p in phrases:
        print(f"  Phrase {p['id']}: '{p['phrase']}' -> '{p['translation']}'")
