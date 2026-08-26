# -*- coding: utf-8 -*-
"""
Precision alignment and repair for oxford_5000.json
Dry-run script to inspect changes and ensure zero regression.
"""
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("1. Loading datasets...")
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

# Index Muller articles by headword
muller_index = {}
for a in muller_articles:
    hw_raw = a.get('headword', '').strip()
    # Normalize headword
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

print(f"Loaded {len(oxford)} Oxford entries, {len(muller_articles)} Muller articles, {len(vocab)} Russian words.")

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

# Helper to clean Russian text
def clean_text_typography(text):
    if not text:
        return ''
    # Replace soft hyphens, zero-width spaces, special bytes
    text = text.replace('\xad', '').replace('\u200b', '').replace('\ufeff', '')
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text)
    
    # Clean known typos / spacing
    text = text.replace('таких-толет', 'таких-то лет')
    text = text.replace('такого - то', 'такого-то')
    text = text.replace('непо карману', 'не по карману')
    text = text.replace('страхи риск', 'страх и риск')
    text = text.replace('вту или', 'в ту или')
    text = text.replace('отдела', 'от дела')
    
    # Clean syllable splits where p1 + p2 is in vocab
    def repl_syllable(m):
        p1 = m.group(1)
        p2 = m.group(2)
        # Avoid common Russian short prepositions/conjunctions like 'и', 'в', 'к', 'с', 'у', 'о', 'а', 'но', 'да', 'не', 'ни', 'же', 'ли', 'бы'
        if p1.lower() in {'и', 'в', 'к', 'с', 'у', 'о', 'а', 'но', 'да', 'не', 'ни', 'же', 'ли', 'бы', 'он', 'ты', 'мы', 'вы', 'их', 'ее', 'её', 'ей', 'им', 'за', 'на', 'от', 'до', 'из', 'по', 'со', 'ко', 'об'}:
            return m.group(0)
        if p2.lower() in {'и', 'в', 'к', 'с', 'у', 'о', 'а', 'но', 'да', 'не', 'ни', 'же', 'ли', 'бы', 'он', 'ты', 'мы', 'вы', 'их', 'ее', 'её', 'ей', 'им', 'за', 'на', 'от', 'до', 'из', 'по', 'со', 'ко', 'об', 'ли'}:
            return m.group(0)
            
        combined = (p1 + p2).lower()
        if combined in vocab and len(p1) >= 2 and len(p2) >= 2:
            if p1[0].isupper():
                return combined.capitalize()
            return combined
        return m.group(0)
        
    text = re.sub(r'\b([а-яА-ЯёЁ]{2,})\s+([а-яА-ЯёЁ]{2,})\b', repl_syllable, text)
    
    # Strip trailing trailing English OCR fragments like "; to be", ", to have a", "; s", " B"
    text = re.sub(r'[\;\,]\s+(?:to\s+[a-zA-Z\s\(\)\'\’]+|[a-zA-Z]{1,3})\s*$', '', text)
    text = re.sub(r'\s+[a-zA-Z]\s*$', '', text)
    
    # Clean unbalanced brackets/parentheses at the end of string
    if text.count('(') > text.count(')'):
        text += ')' * (text.count('(') - text.count(')'))
    elif text.count(')') > text.count('('):
        # Remove trailing unmatched ')'
        text = re.sub(r'\)+$', '', text)
        
    return text.strip()

print("Testing cleaner on samples...")
s1 = clean_text_typography("инте ресах кого-либо; to be")
s2 = clean_text_typography("платёже способность B")
s3 = clean_text_typography("а) правильно; б) здорово, основательно; to be")
print(f"s1: {repr(s1)}")
print(f"s2: {repr(s2)}")
print(f"s3: {repr(s3)}")
