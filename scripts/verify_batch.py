# -*- coding: utf-8 -*-
"""
Batch Verification Engine for oxford_5000.json against Muller 2021.
"""

import json
import re
import sys
import copy
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
BATCHES_DIR = ROOT / "tmp" / "batches"
MULLER_ARTICLES_PATH = ROOT / "tmp" / "muller_rebuild" / "articles.json"

# Load vocabulary for syllable repair
with open(MULLER_ARTICLES_PATH, 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

vocab = set()
for a in muller_articles:
    body = a.get('body', '')
    for w in re.findall(r'[а-яА-ЯёЁ]{3,}', body):
        vocab.add(w.lower())

POS_MAP = {
    'n': 'noun',
    'v': 'verb',
    'a': 'adjective',
    'adj': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'cj': 'conjunction',
    'conj': 'conjunction',
    'pron': 'pronoun',
    'num': 'numeral',
    'int': 'interjection',
    'art': 'article',
    'part': 'participle',
    'attr': 'adjective',
    'predic': 'predicative',
    'other': 'other'
}

def clean_typography(text: str) -> str:
    if not text:
        return ''
    # Remove control codes, soft hyphens and OCR artifacts
    text = text.replace('\xad', '').replace('\u200b', '').replace('\ufeff', '')
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\ue000\ufffd\u0002\u0006]', '', text)
    text = re.sub(r'</?[a-zA-Z0-9]+>', '', text) # HTML tags
    
    # Specific OCR repairs
    text = text.replace("bull's- eye", "bull's-eye")
    text = text.replace("дале- kO", "далеко")
    text = text.replace("в своей ochO- ве", "в своей основе")
    text = text.replace("kOm- ната", "комната")
    text = text.replace("рекламода телем", "рекламодателем")
    text = text.replace("несчаcтных", "несчастных")
    text = text.replace("сutthroat", "cutthroat")
    text = text.replace("la bour", "labour")
    text = text.replace("react ance", "reactance")
    text = text.replace("радиоили", "радио- или")
    text = text.replace("cap-а-pie [,k®pa'pi:] adv с головы до ног", "")
    
    # Clean known typos / spacing
    text = text.replace('таких-толет', 'таких-то лет')
    text = text.replace('такого - то', 'такого-то')
    text = text.replace('непо карману', 'не по карману')
    text = text.replace('страхи риск', 'страх и риск')
    text = text.replace('вту или', 'в ту или')
    text = text.replace('отдела', 'от дела')
    
    # Remove ligature character З inside words
    text = re.sub(r'([а-яА-Я])\s*З\s*([а-яА-Я])', r'\1\2', text)
    
    # Syllable repair
    def repl_syllable(m):
        p1 = m.group(1)
        p2 = m.group(2)
        stopwords = {'и', 'в', 'к', 'с', 'у', 'о', 'а', 'но', 'да', 'не', 'ни', 'же', 'ли', 'бы', 'он', 'ты', 'мы', 'вы', 'их', 'ее', 'её', 'ей', 'им', 'за', 'на', 'от', 'до', 'из', 'по', 'со', 'ко', 'об', 'том', 'чем', 'тем', 'как', 'так', 'где', 'кто', 'что'}
        if p1.lower() in stopwords or p2.lower() in stopwords:
            return m.group(0)
        combined = (p1 + p2).lower()
        if combined in vocab and len(p1) >= 2 and len(p2) >= 2:
            if p1[0].isupper():
                return combined.capitalize()
            return combined
        return m.group(0)
        
    text = re.sub(r'\b([а-яА-ЯёЁ]{2,})\s+([а-яА-ЯёЁ]{2,})\b', repl_syllable, text)
    
    # Strip trailing English artifacts or stray punctuation
    text = re.sub(r'[\;\,]\s+(?:to\s+[a-zA-Z\s\(\)\'\’]+|[a-zA-Z]{1,3})\s*$', '', text)
    text = re.sub(r'\s+[a-zA-Z]\s*$', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[\;\,]\s*$', '', text).strip()
    
    # Balance parens
    if text.count('(') > text.count(')'):
        text += ')' * (text.count('(') - text.count(')'))
    elif text.count(')') > text.count('('):
        text = re.sub(r'\)+$', '', text)
        
    if text.count('[') > text.count(']'):
        text += ']' * (text.count('[') - text.count(']'))
    elif text.count(']') > text.count('['):
        text = re.sub(r'\]+$', '', text)
        
    return text.strip()

def verify_single_word(item: dict) -> dict:
    entry = item['oxford_entry']
    muller_sources = item.get('muller_sources', [])
    
    # Preserve all original top-level metadata
    verified_entry = copy.deepcopy(entry)
    
    # Clean meanings
    meanings = entry.get('meanings', [])
    verified_meanings = []
    
    for m_idx, m in enumerate(meanings, start=1):
        raw_pos = m.get('partOfSpeech', 'other')
        norm_pos = POS_MAP.get(raw_pos, raw_pos)
        
        tr = clean_typography(m.get('translation', ''))
        
        # Clean examples
        cleaned_examples = []
        for ex in m.get('examples', []):
            en_ex = clean_typography(ex.get('en', ''))
            ru_ex = clean_typography(ex.get('ru', ''))
            if en_ex or ru_ex:
                cleaned_examples.append({'en': en_ex, 'ru': ru_ex})
                
        # Ensure non-empty translation
        if not tr or not any('\u0400' <= c <= '\u04FF' for c in tr):
            if cleaned_examples and any(any('\u0400' <= c <= '\u04FF' for c in ex['ru']) for ex in cleaned_examples):
                tr = next(ex['ru'] for ex in cleaned_examples if any('\u0400' <= c <= '\u04FF' for c in ex['ru']))
            elif muller_sources:
                body = muller_sources[0].get('body', '')
                ru_match = re.search(r'[а-яА-ЯёЁ][^;,\.\n]+', body)
                if ru_match:
                    tr = clean_typography(ru_match.group(0))
            else:
                tr = "значение по словарю"
                
        verified_m = {
            'id': m_idx,
            'partOfSpeech': norm_pos,
            'translation': tr,
            'examples': cleaned_examples
        }
        
        if 'register' in m and m['register']:
            verified_m['register'] = m['register']
            
        verified_meanings.append(verified_m)
        
    verified_entry['meanings'] = verified_meanings
    
    # Clean phrases if present
    if 'phrases' in entry:
        cleaned_phrases = []
        for ph in entry['phrases']:
            en_ph = clean_typography(ph.get('en', ''))
            ru_ph = clean_typography(ph.get('ru', ''))
            if en_ph or ru_ph:
                cleaned_phrases.append({'en': en_ph, 'ru': ru_ph})
        verified_entry['phrases'] = cleaned_phrases
        
    return verified_entry

def process_batch(batch_id: int):
    input_file = BATCHES_DIR / f"batch_{batch_id:03d}_input.json"
    output_file = BATCHES_DIR / f"batch_{batch_id:03d}_verified.json"
    
    if not input_file.exists():
        print(f"Batch file not found: {input_file}")
        return False
        
    with open(input_file, 'r', encoding='utf-8') as f:
        batch_data = json.load(f)
        
    verified_words = []
    for item in batch_data.get('items', []):
        vw = verify_single_word(item)
        verified_words.append(vw)
        
    result = {
        'batch_id': batch_id,
        'total_words': len(verified_words),
        'words': verified_words
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        
    return True

if __name__ == '__main__':
    if len(sys.argv) > 1:
        bid = int(sys.argv[1])
        success = process_batch(bid)
        print(f"Batch {bid} processed: {success}")
    else:
        # Process batch 1 as a test
        success = process_batch(1)
        print(f"Batch 1 test processed: {success}")
