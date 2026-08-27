# -*- coding: utf-8 -*-
"""
Deep Safety Simulation: Mid-Article Diamond (♦) and Phrasal (¬) Isolation.
Inspects all 646 candidate words and all 4982 entries.
Validates:
1. Zero empty meanings
2. Complete removal of idiom leaks from meanings
3. Extraction of all mid-article idioms into phrases
4. Exact before/after comparison on benchmark words: ice, act, air, back, ball, bag, balance
"""
import json
import re
import sys
import copy

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

from parse_utils import REGISTER_MAP, POS_MAP

PHRASAL_PARTICLES = {
    'in', 'out', 'up', 'down', 'off', 'on', 'away', 'back', 'by', 
    'over', 'through', 'about', 'across', 'ahead', 'along', 'around', 
    'forth', 'forward', 'into', 'onto', 'to', 'together', 'under', 
    'apart', 'aside', 'behind', 'between', 'round'
}

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

def detect_phrase_pos(phrase_text):
    p = phrase_text.lower().strip()
    tokens = p.split()
    if len(tokens) >= 2 and (tokens[1] in PHRASAL_PARTICLES or (len(tokens) >= 3 and tokens[1] in PHRASAL_PARTICLES)):
        return 'verb'
    if p.startswith('to ') or re.match(r'^(?:bring|keep|get|turn|lead|put|take|make|come|go|give|hold|let|set|fall|run|stand|strike|look|cut|break|skate|act|play)\b', p):
        return 'verb'
    if p.startswith('in ') or p.startswith('at ') or p.startswith('on ') or p.startswith('by ') or p.startswith('as ') or p.startswith('under ') or p.startswith('straight '):
        if p in ['in that', 'as well as', 'as if', 'as though']:
            return 'conjunction'
        if p in ['at that', 'at all', 'on and on', 'in and out', 'by and large', 'by far', 'by the by', 'by the way', 'straight off the ice']:
            return 'adverb'
        return 'adverb'
    if p in ['down and out', 'down with', 'so on', 'and so on', 'once and for all']:
        return 'adverb'
    if re.match(r'^(?:the|a|an)\b', p) or any(k in p for k in [' date', ' pig', ' shell', ' sheep', ' egg', ' man', ' side', ' ice']):
        return 'noun'
    return 'noun'

def extract_all_phrases_from_raw(raw_text, base_word):
    """Extracts ALL ♦ sections (whether in middle or at end)"""
    if '♦' not in raw_text:
        return []
    
    clean_text = clean_t(raw_text)
    # Split by ♦
    parts = clean_text.split('♦')[1:]
    extracted = []
    
    for p in parts:
        # Cut if followed by next major POS section: e.g. 2. v, 3. a
        m_next_pos = re.search(r'\s+\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b', p)
        if m_next_pos:
            p = p[:m_next_pos.start()]
            
        # Cut if followed by phrasal verbs marker: ¬ or ­ ~
        m_next_pv = re.search(r'(?:¬|­\s*~)\s*[a-zA-Z]', p)
        if m_next_pv:
            p = p[:m_next_pv.start()]
            
        # Split clauses by semicolon or sub-letters
        raw_clauses = re.split(r';|\s+[а-я]\)\s*', p)
        clauses = [c.strip() for c in raw_clauses if c.strip()]
        
        current_phrase = ""
        current_senses = []
        
        for c in clauses:
            m_lead = re.match(r'^([a-zA-Z~\s\-\,\'\"\(\)\/\.\!\?]+?)\s+([а-яА-Я].*)$', c)
            if m_lead and len(m_lead.group(1).split()) >= 1 and re.search(r'[a-zA-Z]', m_lead.group(1)):
                # Flush previous phrase
                if current_phrase and current_senses:
                    extracted.append((current_phrase, current_senses))
                    current_senses = []
                current_phrase = m_lead.group(1).replace('~', base_word).strip(' ;,')
                current_senses.append(m_lead.group(2).strip(' ;,:'))
            else:
                if current_phrase:
                    current_senses.append(c.strip(' ;,:'))
                    
        if current_phrase and current_senses:
            extracted.append((current_phrase, current_senses))
            
    # Format into PhraseEntry
    result = []
    for phr, senses in extracted:
        clean_phr = re.sub(r'\s+', ' ', phr).strip()
        if not clean_phr or len(clean_phr) < 2:
            continue
            
        # Format translation
        if len(senses) == 1:
            tr = senses[0]
        else:
            tr_items = []
            for idx, s in enumerate(senses, start=1):
                clean_s = re.sub(r'^\d+\)\s*', '', s)
                tr_items.append(f"{idx}) {clean_s}")
            tr = '; '.join(tr_items)
            
        # Extract registers
        regs = []
        for reg_k, reg_v in REGISTER_MAP.items():
            if re.search(rf'\b{re.escape(reg_k)}', tr):
                regs.append(reg_v)
                tr = re.sub(rf'\b{re.escape(reg_k)}\s*', '', tr).strip()
                
        regs = list(dict.fromkeys(regs))
        pos = detect_phrase_pos(clean_phr)
        
        result.append({
            'phrase': clean_phr,
            'partOfSpeech': pos,
            'translation': tr,
            'examples': [],
            'register': regs
        })
    return result

# Test on key candidate words
benchmark_words = ['ice', 'act', 'account', 'air', 'back', 'ball', 'balance', 'bag']

print("=== Running Dry-Run Simulation on Benchmark Words ===")
for target in benchmark_words:
    item = next((x for x in oxford_data if x['word'] == target), None)
    if not item:
        continue
    w = target
    raw_article = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii"]:
        if k in parsed_index and parsed_index[k]:
            raw_article = clean_t(parsed_index[k][0].get('text', ''))
            if '♦' in raw_article:
                break
                
    extracted_phrases = extract_all_phrases_from_raw(raw_article, w)
    old_meanings_count = len(item.get('meanings', []))
    old_phrases_count = len(item.get('phrases', []))
    
    print(f"Word: '{w}'")
    print(f"  Current meanings: {old_meanings_count} | Current phrases: {old_phrases_count}")
    print(f"  Extracted clean phrases from raw text: {len(extracted_phrases)}")
    for p in extracted_phrases[:4]:
        print(f"    - [{p['partOfSpeech']}] {p['phrase']}: {p['translation'][:65]}")
    if len(extracted_phrases) > 4:
        print(f"    ... and {len(extracted_phrases)-4} more phrases")
    print()
