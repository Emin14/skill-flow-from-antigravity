# -*- coding: utf-8 -*-
"""
Precise Dictionary Article Parser for SamPolnAnglRysSlovar
Extracts:
- Core Headword Meanings per POS
- Phrasal Verbs (◼)
- Idioms & Set Phrases (◊)
- Properly formatted register labels
- Correctly mapped examples
"""

import sys
import json
import re
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

from test_register_formatting import format_registers_in_text

POS_MAP = {
    'n': 'noun',
    'v': 'verb',
    'adj': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'conj': 'conjunction',
    'pron': 'pronoun',
    'int': 'interjection',
    'num': 'number',
    'art': 'article'
}

# OCR / accent cleaner
def clean_typography(text, is_russian=True):
    if not text: return ""
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff\u0002\u0006\u0005\u000f\u0001\u0003\u0004\u0007\u0010\u0012]', '', text)
    
    LIGATURES = {
        r'\btraffi\s+c\b': 'traffic',
        r'\bdiffi\s+cult\b': 'difficult',
        r'\bdiffi\s+culty\b': 'difficulty',
        r'\bdiffi\s+culties\b': 'difficulties',
        r'\boffi\s+cial\b': 'official',
        r'\boffi\s+cially\b': 'officially',
        r'\boffi\s+ce\b': 'office',
        r'\boffi\s+ces\b': 'offices',
        r'\boffi\s+cer\b': 'officer',
        r'\boffi\s+cers\b': 'officers',
        r'\beffi\s+ciency\b': 'efficiency',
        r'\beffi\s+cient\b': 'efficient',
        r'\beffi\s+ciently\b': 'efficiently',
        r'\bsuffi\s+cient\b': 'sufficient',
        r'\bsuffi\s+ciently\b': 'sufficiently',
        r'\baffl\s+uence\b': 'affluence',
        r'\baffl\s+uent\b': 'affluent',
        r'\baffi\s+liated\b': 'affiliated',
        r'\baffi\s+liate\b': 'affiliate',
        r'\baffi\s+liation\b': 'affiliation',
        r'\bconfi\s+dence\b': 'confidence',
        r'\bconfi\s+dent\b': 'confident',
        r'\bconfi\s+rm\b': 'confirm',
        r'\bprofi\s+t\b': 'profit',
        r'\bprofi\s+table\b': 'profitable',
        r'\bdefi\s+cit\b': 'deficit',
        r'\bdefi\s+nite\b': 'definite',
        r'\bdefi\s+nition\b': 'definition',
        r'\bfl\s+our\b': 'flour',
        r'\bfl\s+ow\b': 'flow',
        r'\bfl\s+ight\b': 'flight',
        r'\bfl\s+y\b': 'fly',
        r'\bfl\s+oor\b': 'floor',
        r'\bfi\s+nd\b': 'find',
        r'\bfi\s+re\b': 'fire',
        r'\bfi\s+rst\b': 'first',
        r'\bfi\s+sh\b': 'fish',
        r'\bfi\s+ve\b': 'five',
        r'\bfi\s+x\b': 'fix',
        r'\bfi\s+ne\b': 'fine',
        r'\bfi\s+eld\b': 'field',
        r'\bfi\s+gure\b': 'figure',
        r'\bfi\s+ll\b': 'fill',
        r'\bfi\s+lm\b': 'film',
        r'\bfi\s+nal\b': 'final',
        r'\bfi\s+nancial\b': 'financial'
    }
    for pat, rep in LIGATURES.items():
        text = re.sub(pat, rep, text, flags=re.IGNORECASE)
        
    if is_russian:
        text = re.sub(r'^\s*[\)\.\,\;\:]+\s*', '', text)
        text = text.replace('(часто (во мн.ч.)', '(часто во мн.ч.)')
        text = text.replace('(также (во мн.ч.)', '(также во мн.ч.)')
        text = text.replace('(во мн.ч.) без измен)', '(во мн.ч. без изменений)')
        text = text.replace('(во мн.ч.) также без измен)', '(во мн.ч. также без изменений)')
        text = text.replace('(во мн.ч.) обыкн без измен)', '(во мн.ч. обыкн. без изменений)')
        text = text.replace('(употр как (во мн.ч.)', '(употр. как во мн.ч.)')
        text = text.replace('(употр как (в ед.ч.)', '(употр. как в ед.ч.)')
        text = text.replace('(тк (в ед.ч.)', '(только в ед.ч.)')
        text = text.replace('(также как (в ед.ч.)', '(также как в ед.ч.)')
        text = text.replace('(часто употр как (в ед.ч.)', '(часто употр. как в ед.ч.)')
        text = text.replace('(the; тк (в ед.ч.)', '(the; только в ед.ч.)')
        text = re.sub(r'([а-яёА-ЯЁ])- ([а-яёА-ЯЁ])', r'\1\2', text)
        text = format_registers_in_text(text)
        text = re.sub(r'\(\s*\)', '', text)
        
    text = re.sub(r'\s+([,;:?.!)])', r'\1', text)
    text = re.sub(r'([(])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'^[,;:\s]+', '', text)
    text = re.sub(r'[,;:\s]+$', '', text)
    return unicodedata.normalize('NFC', text)

def parse_full_article(article_text, raw_pos='n'):
    """
    Parses a single dictionary section into:
    - meanings: list of {'translation': ..., 'examples': [...]}
    - phrasal_verbs: list of {'en': ..., 'ru': ...}
    - idioms: list of {'en': ..., 'ru': ...}
    """
    article_text = re.sub(r'([а-яёА-ЯЁa-zA-Z])\xad\n?([а-яёА-ЯЁa-zA-Z])', r'\1\2', article_text).replace('\xad', '')
    article_text = ' '.join(article_text.split())
    
    # 1. Extract Phrasal Verbs (◼, , □, ■)
    phrasal_chunks = re.split(r'[◼□■]\s*', article_text)
    main_part = phrasal_chunks[0]
    phrasal_parts = phrasal_chunks[1:] if len(phrasal_chunks) > 1 else []
    
    # 2. Extract Idioms (◊, ) from main_part
    idiom_chunks = re.split(r'[◊]\s*', main_part)
    meanings_part = idiom_chunks[0]
    idiom_parts = idiom_chunks[1:] if len(idiom_chunks) > 1 else []
    
    # Extract meanings (numbered 1, 2, 3...)
    # Split by sense numbers: e.g. " 1 ", " 2 ", " 3 "
    sense_chunks = re.split(r'\s+(\d+)\s+', ' ' + meanings_part)
    meanings = []
    
    if len(sense_chunks) > 1:
        for i in range(1, len(sense_chunks), 2):
            num = sense_chunks[i]
            body = sense_chunks[i+1].strip()
            if body:
                meanings.append(parse_sense_body(body))
    else:
        # Unnumbered single meaning
        cleaned = clean_meaning_header(meanings_part)
        if cleaned:
            meanings.append(parse_sense_body(cleaned))
            
    # Parse idioms
    extracted_idioms = []
    for ip in idiom_parts:
        extracted_idioms.extend(parse_idiom_chunk(ip))
        
    # Parse phrasals
    extracted_phrasals = []
    for pp in phrasal_parts:
        extracted_phrasals.extend(parse_phrasal_chunk(pp))
        
    return meanings, extracted_phrasals, extracted_idioms

def clean_meaning_header(text):
    text = re.sub(r'^[a-zA-Z0-9\sI|V|X\-\’\']+\s*\[[^\]]+\]\s*(?:n|v|adj|adv|prep|conj|pron|int|num|art)?\s*', '', text)
    return text.strip()

def parse_sense_body(body):
    parts = re.split(r';\s*(?=[a-zA-Z])', body)
    tr_parts = []
    examples = []
    
    for idx, p in enumerate(parts):
        m_ex = re.match(r'^([a-zA-Z\s\',./?!-]+)\s+([а-яёА-ЯЁ(].*)$', p.strip())
        if m_ex and len(m_ex.group(1).split()) > 1:
            en = clean_typography(m_ex.group(1), is_russian=False)
            ru = clean_typography(m_ex.group(2), is_russian=True)
            examples.append({'en': en, 'ru': ru})
        else:
            tr_parts.append(p.strip())
            
    full_tr = clean_typography('; '.join(tr_parts), is_russian=True)
    return {'translation': full_tr, 'examples': examples}

def parse_idiom_chunk(chunk):
    results = []
    items = re.split(r';\s*(?=[a-zA-Z])', chunk)
    for it in items:
        m = re.match(r'^([a-zA-Z\s\',./?!-]+?)\s+([а-яёА-ЯЁ(].*)$', it.strip())
        if m:
            en = clean_typography(m.group(1), is_russian=False)
            ru = clean_typography(m.group(2), is_russian=True)
            results.append({'en': en, 'ru': ru})
    return results

def parse_phrasal_chunk(chunk):
    results = []
    items = re.split(r';\s*(?=[a-zA-Z])', chunk)
    for it in items:
        m = re.match(r'^([a-zA-Z\s\',./?!-]+?)\s+(?:1\s+)?([а-яёА-ЯЁ(].*)$', it.strip())
        if m:
            en = clean_typography(m.group(1), is_russian=False)
            ru = clean_typography(m.group(2), is_russian=True)
            results.append({'en': en, 'ru': ru})
    return results

# Test on cross
with open('tmp/dict_doc2_cache.json', 'r', encoding='utf-8') as f:
    dict_cache = json.load(f)

cross_entries = [e for e in dict_cache if e.get('base_hw') == 'cross' and not ('section' in e.get('raw_hw') or 'stitch' in e.get('raw_hw'))]
print(f"Found {len(cross_entries)} entries for cross in cache.")

all_meanings = []
all_phrases = []

for e in cross_entries:
    pos_str = POS_MAP.get(e.get('pos', 'n'), 'other')
    m_list, phrasals, idioms = parse_full_article(e['article_text'], e.get('pos', 'n'))
    for m in m_list:
        m['partOfSpeech'] = pos_str
        m['id'] = len(all_meanings) + 1
        all_meanings.append(m)
    all_phrases.extend(idioms)
    all_phrases.extend(phrasals)

print("\n--- Parsed Cross Meanings (Total:", len(all_meanings), ") ---")
for m in all_meanings:
    print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")
    for ex in m['examples']:
        print(f"      • ex: {ex['en']} -> {ex['ru']}")

print("\n--- Parsed Cross Phrases (Total:", len(all_phrases), ") ---")
for p in all_phrases:
    print(f"  * {p['en']} — {p['ru']}")
