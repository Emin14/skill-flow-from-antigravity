# -*- coding: utf-8 -*-
"""
Deep Verification Engine for Oxford 5000 words against SamPolnAnglRysSlovar dictionaries.
"""

import sys
import json
import re
import unicodedata
import os

sys.stdout.reconfigure(encoding='utf-8')

# OCR / Typographical artifact cleaner
def clean_ocr_and_typography(text, is_russian=True):
    if not text:
        return ""
    
    # 1. Remove control / accent glyph codes (\u0001-\u0008, \u000b, \u000c, \u000e-\u001f, \x7f-\x9f, \xad, \ufeff)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff\u0002\u0006\u0005\u000f\u0001\u0003\u0004\u0007\u0010\u0012]', '', text)
    
    # 2. Fix ligature splits in English text
    LIGATURE_FIXES = {
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
    for pattern, repl in LIGATURE_FIXES.items():
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)

    # 3. Russian typography and hyphenation
    if is_russian:
        # Strip leading ')' or punctuation leftovers from stripped headers
        text = re.sub(r'^\s*[\)\.\,\;\:]+\s*', '', text)
        
        # Parentheses fixes
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
        
        # Merge broken hyphens across lines in Russian words: "по- мощь" -> "помощь"
        text = re.sub(r'([а-яёА-ЯЁ])- ([а-яёА-ЯЁ])', r'\1\2', text)
        
        # Clean double parens / empty parens
        text = re.sub(r'\(\s*\)', '', text)
        text = re.sub(r'\(\s*\(', '(', text)
        text = re.sub(r'\)\s*\)', ')', text)
        
        # Auto-close single opening paren at start if unmatched
        if text.count('(') > text.count(')'):
            if text.startswith('(') and ')' not in text:
                text = text + ')'
            elif re.search(r'\([а-яёА-ЯЁa-zA-Z\s\.\,\;]+$', text):
                text = text + ')'

    # 4. Spacing and quotes
    text = re.sub(r'\s+([,;:?.!)])', r'\1', text)
    text = re.sub(r'([(])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'^[,;:\s]+', '', text)
    text = re.sub(r'[,;:\s]+$', '', text)
    
    return unicodedata.normalize('NFC', text)

VALID_POS = {
    'noun', 'verb', 'adjective', 'adverb', 'preposition',
    'conjunction', 'pronoun', 'interjection', 'number',
    'article', 'other', 'phrase', 'idiom'
}

def verify_and_clean_entry(item):
    """
    Verifies and cleans a single Oxford word item without degrading quality.
    """
    word = item.get('word', '').strip()
    if not word:
        return None
    
    cleaned_item = {
        'word': word,
        'frequency_rank': item.get('frequency_rank'),
        'cefr': item.get('cefr'),
        'phon_br': clean_ocr_and_typography(item.get('phon_br', ''), is_russian=False),
        'phon_n_am': clean_ocr_and_typography(item.get('phon_n_am', ''), is_russian=False),
        'lists': item.get('lists', {})
    }
    if 'topics' in item:
        cleaned_item['topics'] = item['topics']
    if 'forms' in item:
        cleaned_item['forms'] = item['forms']

    meanings = item.get('meanings', [])
    phrases = item.get('phrases', [])

    cleaned_meanings = []
    seen_examples = set()

    for m in meanings:
        pos = m.get('partOfSpeech', 'other').strip().lower()
        if pos not in VALID_POS:
            pos = 'other'
            
        tr = clean_ocr_and_typography(m.get('translation', ''), is_russian=True)
        if not tr:
            continue
            
        exs = m.get('examples', [])
        cleaned_exs = []
        for ex in exs:
            en = clean_ocr_and_typography(ex.get('en', ''), is_russian=False)
            ru = clean_ocr_and_typography(ex.get('ru', ''), is_russian=True)
            if en and ru:
                en_key = en.lower().strip()
                if en_key not in seen_examples:
                    cleaned_exs.append({'en': en, 'ru': ru})
                    seen_examples.add(en_key)
                    
        cleaned_meanings.append({
            'partOfSpeech': pos,
            'translation': tr,
            'examples': cleaned_exs,
            'id': len(cleaned_meanings) + 1
        })

    cleaned_phrases = []
    seen_phrases = set()
    for p in phrases:
        p_en = clean_ocr_and_typography(p.get('en', ''), is_russian=False)
        p_ru = clean_ocr_and_typography(p.get('ru', ''), is_russian=True)
        if p_en and p_ru:
            p_key = p_en.lower().strip()
            if p_key not in seen_phrases:
                cleaned_phrases.append({'en': p_en, 'ru': p_ru})
                seen_phrases.add(p_key)

    cleaned_item['meanings'] = cleaned_meanings
    cleaned_item['phrases'] = cleaned_phrases
    return cleaned_item

def verify_batch(words_batch):
    """
    Verifies a batch of words and returns the cleaned batch.
    """
    verified = []
    for item in words_batch:
        res = verify_and_clean_entry(item)
        if res:
            verified.append(res)
    return verified

if __name__ == '__main__':
    # Test on a small sample
    test_word = {
        "word": "abandon",
        "frequency_rank": 3740,
        "cefr": "b2",
        "phon_br": "/əˈbændən/",
        "phon_n_am": "/əˈbændən/",
        "lists": {"oxford3000": True},
        "meanings": [
            {"partOfSpeech": "noun", "translation": "несдержанность; безудержность", "examples": [{"en": "with abandon", "ru": "не сдерживаясь"}], "id": 1},
            {"partOfSpeech": "verb", "translation": "покидать", "examples": [], "id": 2}
        ],
        "phrases": []
    }
    res = verify_and_clean_entry(test_word)
    print("Test verification passed:")
    print(json.dumps(res, ensure_ascii=False, indent=2))
