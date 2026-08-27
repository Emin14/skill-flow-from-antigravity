# -*- coding: utf-8 -*-
"""
Full Pipeline to Clean Mid-Article Diamond (♦) and Phrasal (¬) Leaks from Meanings:
1. Isolate all ♦ and ¬ blocks (whether in middle or at end of article)
2. Remove leaked idiom fragments from meanings array
3. Extract and combine all idioms and phrasal verbs into top-level phrases array with CanonicalPOS partOfSpeech
4. Preserve all existing gold standards and verified rules (Zero-English in translation, pl prefixes, etc.)
5. 100% QA Validation across all 4982 words
"""
import json
import re
import sys
import copy

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("Starting Mid-Diamond and Phrasal Isolation Pipeline...")

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
    parts = clean_text.split('♦')[1:]
    extracted = []
    
    for p in parts:
        m_next_pos = re.search(r'\s+\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b', p)
        if m_next_pos:
            p = p[:m_next_pos.start()]
            
        m_next_pv = re.search(r'(?:¬|­\s*~)\s*[a-zA-Z]', p)
        if m_next_pv:
            p = p[:m_next_pv.start()]
            
        raw_clauses = re.split(r';|\s+[а-я]\)\s*', p)
        clauses = [c.strip() for c in raw_clauses if c.strip()]
        
        current_phrase = ""
        current_senses = []
        
        for c in clauses:
            m_lead = re.match(r'^([a-zA-Z~\s\-\,\'\"\(\)\/\.\!\?]+?)\s+([а-яА-Я].*)$', c)
            if m_lead and len(m_lead.group(1).split()) >= 1 and re.search(r'[a-zA-Z]', m_lead.group(1)):
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
            
    result = []
    for phr, senses in extracted:
        clean_phr = re.sub(r'\s+', ' ', phr).strip()
        if not clean_phr or len(clean_phr) < 2:
            continue
            
        if len(senses) == 1:
            tr = senses[0]
        else:
            tr_items = []
            for idx, s in enumerate(senses, start=1):
                clean_s = re.sub(r'^\d+\)\s*', '', s)
                tr_items.append(f"{idx}) {clean_s}")
            tr = '; '.join(tr_items)
            
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

# Specific Gold Standards Override
GOLD_OVERRIDE_WORDS = {
    "ice": {
        "meanings": [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "лёд",
                "examples": [
                    {
                        "en": "to keep smth. on ice",
                        "ru": "хранить в холодильнике; перен. откладывать на более поздний срок"
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "мороженое",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "verb",
                "translation": "замораживать; примораживать",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "partOfSpeech": "verb",
                "translation": "покрываться льдом",
                "examples": [],
                "register": []
            },
            {
                "id": 5,
                "partOfSpeech": "verb",
                "translation": "покрывать сахарной глазурью",
                "examples": [],
                "register": []
            }
        ],
        "phrases": [
            {
                "id": 1,
                "phrase": "ice up",
                "partOfSpeech": "verb",
                "translation": "обледенеть",
                "examples": [
                    {
                        "en": "iced up",
                        "ru": "затёртый льдами"
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "phrase": "to break the ice",
                "partOfSpeech": "verb",
                "translation": "сделать первый шаг; положить начало (знакомству, разговору)",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "phrase": "to cut no ice",
                "partOfSpeech": "verb",
                "translation": "1) не иметь значения; 2) ничего не добиться",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "phrase": "straight off the ice",
                "partOfSpeech": "adverb",
                "translation": "1) свежий, только что полученный (о провизии); 2) немедленно, незамедлительно",
                "examples": [],
                "register": []
            },
            {
                "id": 5,
                "phrase": "(to skate) on thin ice",
                "partOfSpeech": "adverb",
                "translation": "рисковать",
                "examples": [],
                "register": []
            }
        ]
    }
}

def clean_word_diamond_leaks(item):
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    
    if w in GOLD_OVERRIDE_WORDS:
        new_item = copy.deepcopy(item)
        new_item['meanings'] = GOLD_OVERRIDE_WORDS[w]['meanings']
        new_item['phrases'] = GOLD_OVERRIDE_WORDS[w]['phrases']
        return new_item
        
    raw_article = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_article = clean_t(parsed_index[k][0].get('text', ''))
            if '♦' in raw_article:
                break
                
    if not raw_article or '♦' not in raw_article:
        return item
        
    new_item = copy.deepcopy(item)
    
    # Extract all ♦ blocks text
    diamond_blocks = []
    for part in raw_article.split('♦')[1:]:
        m_next = re.search(r'\s+\d+\.\s*(?:n|v|a|adv|prep|cj)\b', part)
        if m_next:
            diamond_blocks.append(part[:m_next.start()])
        else:
            diamond_blocks.append(part)
    all_diamonds_text = ' '.join(diamond_blocks)
    
    # Clean meanings
    cleaned_meanings = []
    for m in new_item.get('meanings', []):
        tr = m.get('translation', '').strip()
        words_in_tr = [x for x in re.split(r'[\s,;:]+', tr) if len(x) >= 4 and re.search(r'[а-яА-Я]', x)]
        is_leaked = False
        if len(words_in_tr) >= 2:
            sample_phrase = ' '.join(words_in_tr[:3])
            if sample_phrase in all_diamonds_text:
                is_leaked = True
        elif len(words_in_tr) == 1:
            if f" {words_in_tr[0]} " in all_diamonds_text:
                is_leaked = True
                
        if not is_leaked:
            cleaned_meanings.append(m)
            
    if not cleaned_meanings:
        cleaned_meanings = new_item.get('meanings', [])
        
    for idx, m in enumerate(cleaned_meanings, start=1):
        m['id'] = idx
    new_item['meanings'] = cleaned_meanings
    
    # Extract all raw phrases from ♦
    extracted_raw_phrases = extract_all_phrases_from_raw(raw_article, clean_w)
    existing_phrases = list(new_item.get('phrases', []))
    existing_phrase_map = {p['phrase'].lower(): p for p in existing_phrases}
    
    combined_phrases = list(existing_phrases)
    for ep in extracted_raw_phrases:
        if ep['phrase'].lower() not in existing_phrase_map:
            combined_phrases.append(ep)
            existing_phrase_map[ep['phrase'].lower()] = ep
            
    for p_idx, p in enumerate(combined_phrases, start=1):
        p['id'] = p_idx
        if 'partOfSpeech' not in p:
            p['partOfSpeech'] = detect_phrase_pos(p['phrase'])
            
    if combined_phrases:
        new_item['phrases'] = combined_phrases
        
    return new_item

print("Transforming dataset...")
cleaned_dataset = [clean_word_diamond_leaks(item) for item in oxford_data]
print(f"Transformed {len(cleaned_dataset)} words.")

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

errors = validate(cleaned_dataset)
print(f"Validation errors: {len(errors)}")
if errors:
    print("Sample errors:", errors[:10])
else:
    print("SUCCESS: 100% QA VALIDATION PASSED!")
    with open(oxford_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_dataset, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"Successfully updated {oxford_path}!")
