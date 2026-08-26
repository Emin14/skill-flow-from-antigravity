# -*- coding: utf-8 -*-
"""
Precision Alignment and Repair Engine for oxford_5000.json
Cross-referenced against Muller 2021 (PDF 1, DOCX 2, PDF 3).
"""

import json
import re
import sys
import copy
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
OXFORD_PATH = ROOT / "oxford_5000.json"
APP_OXFORD_PATH = ROOT / "src" / "data" / "oxford_5000.json"
MULLER_ARTICLES_PATH = ROOT / "tmp" / "muller_rebuild" / "articles.json"

print("1. Loading datasets...")
with open(OXFORD_PATH, 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open(MULLER_ARTICLES_PATH, 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

# Index Muller articles by headword
muller_index = {}
for a in muller_articles:
    hw_raw = a.get('headword', '').strip()
    hw_base = hw_raw.split()[0].lower().rstrip(',').rstrip(';').rstrip('.')
    if hw_base not in muller_index:
        muller_index[hw_base] = []
    muller_index[hw_base].append(a)

# Build authentic Russian vocabulary from Muller
vocab = set()
for a in muller_articles:
    body = a.get('body', '')
    for w in re.findall(r'[а-яА-ЯёЁ]{3,}', body):
        vocab.add(w.lower())

print(f"Loaded {len(oxford)} Oxford entries, {len(muller_articles)} Muller articles, {len(vocab)} Russian vocabulary words.")

# Specific manual map for 15 missing words + known cross references
EXPLICIT_CROSS_REFS = {
    'anyway': [
        {'id': 1, 'partOfSpeech': 'adverb', 'translation': 'так или иначе, во всяком случае; всё-таки', 'examples': []}
    ],
    'backwards': [
        {'id': 1, 'partOfSpeech': 'adverb', 'translation': 'назад, в обратном направлении; вспять; задом наперёд', 'examples': [{'en': 'bend backwards', 'ru': 'прогнуться назад'}]}
    ],
    'disk': [
        {'id': 1, 'partOfSpeech': 'noun', 'translation': 'диск; круг; пластинка; магнитный диск', 'examples': [{'en': 'optical disk', 'ru': 'оптический диск'}]}
    ],
    'downwards': [
        {'id': 1, 'partOfSpeech': 'adverb', 'translation': 'вниз, книзу, по направлению книзу', 'examples': []}
    ],
    'enquire': [
        {'id': 1, 'partOfSpeech': 'verb', 'translation': 'спрашивать; осведомляться, узнавать; наводить справки', 'examples': [{'en': 'to enquire after somebody', 'ru': 'справляться о здоровье кого-либо'}]}
    ],
    'enquiry': [
        {'id': 1, 'partOfSpeech': 'noun', 'translation': 'вопрос; расспрашивание; справка; наведение справок; расследование', 'examples': [{'en': 'enquiry office', 'ru': 'справочное бюро'}]}
    ],
    'everyone': [
        {'id': 1, 'partOfSpeech': 'pronoun', 'translation': 'каждый, всякий, все', 'examples': [{'en': 'everyone knows that', 'ru': 'все это знают'}]}
    ],
    'evolutionary': [
        {'id': 1, 'partOfSpeech': 'adjective', 'translation': 'эволюционный', 'examples': [{'en': 'evolutionary theory', 'ru': 'эволюционная теория'}]}
    ],
    'fridge': [
        {'id': 1, 'partOfSpeech': 'noun', 'translation': 'разг. холодильник', 'examples': []}
    ],
    'guerrilla': [
        {'id': 1, 'partOfSpeech': 'noun', 'translation': 'партизан; партизанский', 'examples': [{'en': 'guerrilla warfare', 'ru': 'партизанская война'}]}
    ],
    'hello': [
        {'id': 1, 'partOfSpeech': 'interjection', 'translation': 'алло!; привет!, здравствуйте!', 'examples': []}
    ],
    'info': [
        {'id': 1, 'partOfSpeech': 'noun', 'translation': 'разг. информация, сведения', 'examples': []}
    ],
    'long-time': [
        {'id': 1, 'partOfSpeech': 'adjective', 'translation': 'давний; продолжающийся долгое время', 'examples': [{'en': 'long-time friend', 'ru': 'давний друг'}]}
    ],
    'magical': [
        {'id': 1, 'partOfSpeech': 'adjective', 'translation': 'магический, волшебный', 'examples': [{'en': 'magical power', 'ru': 'магическая сила'}]}
    ],
    'until': [
        {'id': 1, 'partOfSpeech': 'preposition', 'translation': 'до, вплоть до; до тех пор пока', 'examples': [{'en': 'until now', 'ru': 'до сих пор'}]}
    ]
}

# Cross references map for specific English fragment translations
FRAGMENT_LOOKUPS = {
    '= aftergrass': 'второй укос, отава',
    '= aiiey ii': 'союзник; сторонник',
    '= anyhow': 'так или иначе, во всяком случае',
    'add together': 'складывать, суммировать',
    'to lay an': 'отдать якорь',
    'to get': 'обойти; распространиться',
    'in the': 'в течение, во время',
    'back of)': 'позади, сзади',
    'to go': 'идти против, отказываться',
    'to play': 'играть роль',
    'to make': 'делать, совершать',
    'to take': 'принимать, брать',
    'to be': 'быть, существовать',
    'to have': 'иметь, обладать'
}

def clean_text_typography(text):
    if not text:
        return ''
    # Replace soft hyphens, zero-width spaces, special control bytes
    text = text.replace('\xad', '').replace('\u200b', '').replace('\ufeff', '')
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text)
    
    # Clean known typos / spacing
    text = text.replace('таких-толет', 'таких-то лет')
    text = text.replace('такого - то', 'такого-то')
    text = text.replace('непо карману', 'не по карману')
    text = text.replace('страхи риск', 'страх и риск')
    text = text.replace('вту или', 'в ту или')
    text = text.replace('отдела', 'от дела')
    text = text.replace('  ', ' ')
    
    # Clean syllable splits where p1 + p2 is in vocab
    def repl_syllable(m):
        p1 = m.group(1)
        p2 = m.group(2)
        # Avoid Russian short words/prepositions/pronouns
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
    
    # Strip trailing English OCR fragments like "; to be", ", to have a", "; s", " B"
    text = re.sub(r'[\;\,]\s+(?:to\s+[a-zA-Z\s\(\)\'\’]+|[a-zA-Z]{1,3})\s*$', '', text)
    text = re.sub(r'\s+[a-zA-Z]\s*$', '', text)
    
    # Clean unbalanced brackets/parentheses at the end of string
    if text.count('(') > text.count(')'):
        text += ')' * (text.count('(') - text.count(')'))
    elif text.count(')') > text.count('('):
        text = re.sub(r'\)+$', '', text)
        
    if text.count('[') > text.count(']'):
        text += ']' * (text.count('[') - text.count(']'))
    elif text.count(']') > text.count('['):
        text = re.sub(r'\]+$', '', text)
        
    return text.strip()

print("\n2. Processing and repairing all 4982 entries...")

repaired_entries = []
stats = {
    'total_words': len(oxford),
    'fixed_empty_trans': 0,
    'fixed_english_fragments': 0,
    'fixed_explicit_missing': 0,
    'fixed_syllables_and_chars': 0
}

for entry_idx, entry in enumerate(oxford):
    w = entry.get('word', '').strip()
    w_low = w.lower()
    
    new_entry = copy.deepcopy(entry)
    
    # Handle explicit missing / cross-reference words
    if w_low in EXPLICIT_CROSS_REFS:
        # Check if current entry has empty or invalid meanings
        has_valid_ru = any(any('\u0400' <= c <= '\u04FF' for c in m.get('translation', '')) for m in entry.get('meanings', []))
        if not has_valid_ru:
            new_entry['meanings'] = copy.deepcopy(EXPLICIT_CROSS_REFS[w_low])
            stats['fixed_explicit_missing'] += 1
            repaired_entries.append(new_entry)
            continue
            
    meanings = new_entry.get('meanings', [])
    new_meanings = []
    
    for m_idx, m in enumerate(meanings):
        tr = m.get('translation', '').strip()
        pos = m.get('partOfSpeech', 'other')
        exs = m.get('examples', [])
        
        # Clean examples first
        cleaned_exs = []
        for ex in exs:
            en_ex = ex.get('en', '').strip()
            ru_ex = ex.get('ru', '').strip()
            ru_ex_clean = clean_text_typography(ru_ex)
            cleaned_exs.append({'en': en_ex, 'ru': ru_ex_clean})
            
        # Check if translation is empty
        if not tr:
            if cleaned_exs:
                # Extract translation from example
                ru_candidates = [ex['ru'] for ex in cleaned_exs if ex['ru'] and any('\u0400' <= c <= '\u04FF' for c in ex['ru'])]
                if ru_candidates:
                    # Use the primary Russian translation
                    tr = ru_candidates[0]
                    # If multiple examples with distinct meanings, join them
                    if len(ru_candidates) > 1 and len(ru_candidates[0]) < 40:
                        tr = "; ".join(ru_candidates[:2])
                    stats['fixed_empty_trans'] += 1
                else:
                    # Look up in Muller
                    if w_low in muller_index:
                        tr = muller_index[w_low][0].get('body', '').split('1)')[0].strip()
                        tr = clean_text_typography(tr)
            else:
                # Look up in Muller
                if w_low in muller_index:
                    tr = muller_index[w_low][0].get('body', '').split('1)')[0].strip()
                    tr = clean_text_typography(tr)
                    
        # Check if translation is an English fragment or cross-reference
        if tr:
            tr_low = tr.lower()
            if tr_low in FRAGMENT_LOOKUPS:
                tr = FRAGMENT_LOOKUPS[tr_low]
                stats['fixed_english_fragments'] += 1
            elif not any('\u0400' <= c <= '\u04FF' for c in tr):
                # English only
                if cleaned_exs and any(any('\u0400' <= c <= '\u04FF' for c in ex['ru']) for ex in cleaned_exs):
                    tr = next(ex['ru'] for ex in cleaned_exs if any('\u0400' <= c <= '\u04FF' for c in ex['ru']))
                    stats['fixed_english_fragments'] += 1
                elif w_low in muller_index:
                    # Get from Muller
                    body = muller_index[w_low][0].get('body', '')
                    # Extract first Russian snippet
                    ru_match = re.search(r'[а-яА-ЯёЁ][^;,\.\n]+', body)
                    if ru_match:
                        tr = ru_match.group(0)
                        stats['fixed_english_fragments'] += 1
                        
        tr_clean = clean_text_typography(tr)
        
        # If still empty or no Russian, fall back to Muller article
        if not tr_clean or not any('\u0400' <= c <= '\u04FF' for c in tr_clean):
            if w_low in muller_index:
                body = muller_index[w_low][0].get('body', '')
                ru_match = re.search(r'[а-яА-ЯёЁ][^;,\.\n]+', body)
                if ru_match:
                    tr_clean = clean_text_typography(ru_match.group(0))
                    
        m_cleaned = copy.deepcopy(m)
        m_cleaned['translation'] = tr_clean
        m_cleaned['examples'] = cleaned_exs
        if 'register' in m:
            m_cleaned['register'] = m['register']
            
        new_meanings.append(m_cleaned)
        
    # Reassign sequential IDs
    for idx, m in enumerate(new_meanings, start=1):
        m['id'] = idx
        
    new_entry['meanings'] = new_meanings
    repaired_entries.append(new_entry)

print("\n=== REPAIR STATISTICS ===")
print(f"Total words: {stats['total_words']}")
print(f"Fixed empty translations: {stats['fixed_empty_trans']}")
print(f"Fixed English fragments: {stats['fixed_english_fragments']}")
print(f"Fixed explicit missing words: {stats['fixed_explicit_missing']}")

# Verify the repaired dataset
print("\n3. Verifying quality of repaired dataset...")
empty_count = 0
english_only_count = 0
no_ru_words = []

for entry in repaired_entries:
    w = entry['word']
    has_ru = False
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        if not tr:
            empty_count += 1
        elif not any('\u0400' <= c <= '\u04FF' for c in tr):
            english_only_count += 1
        else:
            has_ru = True
    if not has_ru:
        no_ru_words.append(w)

print(f"Post-repair empty translations: {empty_count}")
print(f"Post-repair English-only translations: {english_only_count}")
print(f"Words with NO Russian translations: {len(no_ru_words)} -> {no_ru_words}")

# Save to files
print("\n4. Saving updated datasets...")
with open(OXFORD_PATH, 'w', encoding='utf-8') as f:
    json.dump(repaired_entries, f, ensure_ascii=False, indent=2)

with open(APP_OXFORD_PATH, 'w', encoding='utf-8') as f:
    json.dump(repaired_entries, f, ensure_ascii=False, indent=2)

print("Saved successfully to:")
print(f"  - {OXFORD_PATH}")
print(f"  - {APP_OXFORD_PATH}")
