# -*- coding: utf-8 -*-
"""
Full Transformation Pipeline:
1. Extract Phrasal Verbs from 'meanings' and raw articles ('¬' blocks) into top-level 'phrases' with partOfSpeech: 'verb'
2. Combine multi-sense phrasal verbs with structured numbers: '1) ...; 2) ...; 3) ...'
3. Clean meanings array of phrasal verb pollution and self-repeating duplicate examples
4. Keep plural prefixes ('при англ. мн. ч.: ') and zero-English translation strings
5. 100% QA validation across all 4982 words
"""
import json
import re
import sys
import copy

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("Starting Full Phrasal Verb Extraction Pipeline...")

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
    if p.startswith('to ') or re.match(r'^(?:bring|keep|get|turn|lead|put|take|make|come|go|give|hold|let|set|fall|run|stand|strike|look)\b', p):
        return 'verb'
    if p.startswith('in ') or p.startswith('at ') or p.startswith('on ') or p.startswith('by ') or p.startswith('as ') or p.startswith('under '):
        if p in ['in that', 'as well as', 'as if', 'as though']:
            return 'conjunction'
        if p in ['at that', 'at all', 'on and on', 'in and out', 'by and large', 'by far', 'by the by', 'by the way']:
            return 'adverb'
        return 'preposition'
    if p in ['down and out', 'down with', 'so on', 'and so on', 'once and for all']:
        return 'adverb'
    if re.match(r'^(?:the|a|an)\b', p) or any(k in p for k in [' date', ' pig', ' shell', ' sheep', ' egg', ' man', ' side']):
        return 'noun'
    return 'noun'

def extract_phrases_from_article_text(raw_text, base_word):
    if '♦' not in raw_text:
        return []
    
    clean_text = clean_t(raw_text)
    parts = clean_text.split('♦')[1:]
    phrases = []
    
    for p in parts:
        m_next = re.search(r'\s+\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b', p)
        if m_next:
            p = p[:m_next.start()]
        
        raw_clauses = re.split(r';|\s+[а-я]\)\s*', p)
        clauses = [c.strip() for c in raw_clauses if c.strip()]
        
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
                m_ex = re.search(r'([a-zA-Z\s\-\,\'\"\(\)\/\.\!\?]{4,})\s+([а-яА-Я].*)', ru_raw)
                if m_ex and len(m_ex.group(1).split()) >= 2:
                    ex_en = m_ex.group(1).strip().replace('~', base_word).strip(' ;,')
                    ex_ru = m_ex.group(2).strip(' ;,')
                    ru_def = ru_raw[:m_ex.start()].strip(' ;,:')
                    if ru_def:
                        ru_raw = ru_def
                    examples.append({'en': ex_en, 'ru': ex_ru})
                
                ru_raw = re.sub(r'^[,\s;:]+', '', ru_raw).strip()
                ru_raw = re.sub(r'[,\s;:]+$', '', ru_raw).strip()
                
                if en_clean and ru_raw and len(en_clean) >= 2:
                    pos = detect_phrase_pos(en_clean)
                    phrases.append({
                        'phrase': en_clean,
                        'partOfSpeech': pos,
                        'translation': ru_raw,
                        'examples': examples,
                        'register': regs
                    })
    return phrases

def transform_word(item):
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    new_item = copy.deepcopy(item)
    
    meanings = new_item.get('meanings', [])
    existing_phrases = list(new_item.get('phrases', []))
    
    # 1. Check raw article for ♦ idioms if not present
    raw_article = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_article = clean_t(parsed_index[k][0].get('text', ''))
            if '♦' in raw_article:
                break
    if raw_article and '♦' in raw_article and not existing_phrases:
        existing_phrases = extract_phrases_from_article_text(raw_article, clean_w)
    
    # 2. Extract phrasal verbs from meanings
    direct_meanings = []
    pv_groups = {} # pv_name -> list of sub-senses
    
    for m in meanings:
        tr = m.get('translation', '').strip()
        exs = m.get('examples', [])
        regs = m.get('register', [])
        pos = m.get('partOfSpeech', 'other')
        
        pv_name = None
        for ex in exs:
            en = ex.get('en', '').strip().lower()
            tokens = en.split()
            if len(tokens) == 2 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
                pv_name = f"{clean_w} {tokens[1]}"
                break
            elif len(tokens) == 3 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
                pv_name = f"{clean_w} {tokens[1]} {tokens[2]}"
                break
                
        if pv_name:
            if pv_name not in pv_groups:
                pv_groups[pv_name] = []
            # Keep only real context examples, discard self-duplicating examples
            real_exs = [ex for ex in exs if ex.get('en', '').strip().lower() != pv_name and ex.get('ru', '').strip() != tr]
            pv_groups[pv_name].append({
                'tr': tr,
                'exs': real_exs,
                'regs': regs
            })
        else:
            # Clean duplicate examples in regular meanings
            cleaned_exs = [ex for ex in exs if ex.get('ru', '').strip() != tr]
            m['examples'] = cleaned_exs
            direct_meanings.append(m)
            
    # If all meanings were flagged as phrasal verbs (fallback safety), keep direct_meanings
    if not direct_meanings:
        direct_meanings = meanings
        pv_groups = {}
        
    # Re-index direct meanings
    for idx, dm in enumerate(direct_meanings, start=1):
        dm['id'] = idx
    new_item['meanings'] = direct_meanings
    
    # 3. Combine phrasal verbs into structured phrases
    combined_phrases = []
    
    # First, add extracted phrasal verbs
    for pv_name, senses in pv_groups.items():
        if len(senses) == 1:
            combined_tr = senses[0]['tr']
            combined_exs = senses[0]['exs']
            combined_regs = senses[0]['regs']
        else:
            tr_parts = []
            combined_exs = []
            combined_regs = []
            for idx, s in enumerate(senses, start=1):
                clean_sense_tr = re.sub(r'^\d+\)\s*', '', s['tr'])
                tr_parts.append(f"{idx}) {clean_sense_tr}")
                combined_exs.extend(s['exs'])
                combined_regs.extend(s['regs'])
            combined_tr = '; '.join(tr_parts)
            combined_regs = list(dict.fromkeys(combined_regs))
            
        combined_phrases.append({
            'phrase': pv_name,
            'partOfSpeech': 'verb',
            'translation': combined_tr,
            'examples': combined_exs,
            'register': combined_regs
        })
        
    # Second, add existing idioms (avoid duplicate phrases)
    existing_phrase_names = {p['phrase'].lower(): p for p in combined_phrases}
    for ep in existing_phrases:
        if ep['phrase'].lower() not in existing_phrase_names:
            combined_phrases.append(ep)
            
    # Re-index phrases
    for p_idx, p in enumerate(combined_phrases, start=1):
        p['id'] = p_idx
        if 'partOfSpeech' not in p:
            p['partOfSpeech'] = detect_phrase_pos(p['phrase'])
            
    if combined_phrases:
        new_item['phrases'] = combined_phrases
    elif 'phrases' in new_item:
        del new_item['phrases']
        
    return new_item

print("Transforming dataset...")
final_data = [transform_word(item) for item in oxford_data]
print(f"Transformed {len(final_data)} words.")

# QA Validation
def validate(entries):
    errs = []
    if len(entries) != 4982:
        errs.append(f"Expected 4982 entries, got {len(entries)}")
    for item in entries:
        w = item['word']
        meanings = item.get('meanings', [])
        if not meanings:
            errs.append(f"Word {w} has 0 meanings")
        for idx, m in enumerate(meanings, start=1):
            if m.get('id') != idx:
                errs.append(f"Word {w}: meaning id {m.get('id')} != {idx}")
            if not m.get('translation') and not m.get('examples'):
                errs.append(f"Word {w}: empty meaning {idx}")
        for p_idx, p in enumerate(item.get('phrases', []), start=1):
            if p.get('id') != p_idx:
                errs.append(f"Word {w}: phrase id {p.get('id')} != {p_idx}")
            if not p.get('partOfSpeech'):
                errs.append(f"Word {w}: phrase {p_idx} missing partOfSpeech")
    return errs

errors = validate(final_data)
print(f"Validation errors: {len(errors)}")
if errors:
    print("Sample errors:", errors[:10])
else:
    print("SUCCESS: 100% QA VALIDATION PASSED!")
    with open(oxford_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"Successfully updated {oxford_path}!")
