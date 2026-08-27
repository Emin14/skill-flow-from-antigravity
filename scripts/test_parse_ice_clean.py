# -*- coding: utf-8 -*-
"""
Robust Parser for Multi-POS Articles with Mid-Article Diamonds and Phrasal Verbs.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

from parse_utils import REGISTER_MAP, POS_MAP

def clean_t(t):
    if not t:
        return ""
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

def parse_article_properly(raw_text, base_word):
    clean_text = clean_t(raw_text)
    
    # 1. Extract ALL ♦ blocks
    diamond_phrases = []
    diamond_snippets = []
    for part in clean_text.split('♦')[1:]:
        m_end = re.search(r'(?:\s+\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b|¬|­\s*~)', part)
        if m_end:
            d_chunk = part[:m_end.start()]
        else:
            d_chunk = part
        diamond_snippets.append(d_chunk)
        
    # Remove diamond blocks from clean_text for meanings parsing
    clean_body = clean_text
    for d_chunk in diamond_snippets:
        clean_body = clean_body.replace('♦' + d_chunk, ' ')
        
    # 2. Extract ALL ¬ blocks (phrasal verbs)
    pv_snippets = []
    for part in re.split(r'(?:¬|­\s*~)', clean_body)[1:]:
        m_end = re.search(r'(?:\s+\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b|♦)', part)
        if m_end:
            pv_chunk = part[:m_end.start()]
        else:
            pv_chunk = part
        pv_snippets.append(pv_chunk)
        
    # 3. Parse POS sections from clean_body (meanings)
    # Split by major POS: e.g. 1. n, 2. v, or n ... 2. v
    pos_sections = re.split(r'(?=\b\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b)', clean_body)
    meanings = []
    
    for sec in pos_sections:
        m_pos = re.search(r'\b(?:\d+\.\s*)?(n|v|a|adv|prep|cj|int|pron|num)\b', sec)
        current_pos = 'noun'
        if m_pos:
            raw_pos = m_pos.group(1)
            current_pos = POS_MAP.get(raw_pos, 'other')
            sec = sec[m_pos.end():]
            
        # Cut if phrasal verbs start
        m_pv = re.search(r'(?:¬|­\s*~)', sec)
        if m_pv:
            sec = sec[:m_pv.start()]
            
        # Split numbered senses 1), 2), 3)
        senses = re.split(r'(?=\b\d+\)\s*)', sec)
        for s in senses:
            s = s.strip(' ;,')
            if not s:
                continue
            s_clean = re.sub(r'^\d+\)\s*', '', s).strip()
            # If contains Russian translation
            if re.search(r'[а-яА-Я]', s_clean):
                # Clean punctuation and examples
                m_ex = re.search(r';\s*([a-zA-Z\s\-\'\,\(\)\/\~\.]{4,})\s+([а-яА-Я].*)', s_clean)
                exs = []
                tr = s_clean
                if m_ex:
                    ex_en = m_ex.group(1).replace('~', base_word).strip(' ;,')
                    ex_ru = m_ex.group(2).strip(' ;,')
                    tr = s_clean[:m_ex.start()].strip(' ;,:')
                    exs.append({'en': ex_en, 'ru': ex_ru})
                    
                meanings.append({
                    'id': len(meanings) + 1,
                    'partOfSpeech': current_pos,
                    'translation': tr,
                    'examples': exs,
                    'register': []
                })
                
    return meanings

# Test on ice
raw_ice = parsed_index['ice'][0]['text']
ice_meanings = parse_article_properly(raw_ice, 'ice')
print(f"=== Parsed ICE Meanings Count: {len(ice_meanings)} ===")
for m in ice_meanings:
    print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")
    if m['examples']:
        print(f"       example: {m['examples']}")
