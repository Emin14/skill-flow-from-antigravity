# -*- coding: utf-8 -*-
"""
Complete Precision Alignment and Repair for oxford_5000.json
incorporating full Muller 2021 dictionary corrections.
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

# Authentic Russian vocabulary from Muller
vocab = set()
for a in muller_articles:
    body = a.get('body', '')
    for w in re.findall(r'[а-яА-ЯёЁ]{3,}', body):
        vocab.add(w.lower())

# Explicit fixes for specific word IDs / ghost entries / phrasal idioms
EXPLICIT_FIXES = {
    ('aspect', 5): {'translation': 'вид, точка зрения; ракурс'},
    ('bank2', 9): {'translation': 'надеяться, полагаться на (on, upon)', 'examples': [{'en': 'to bank on someone', 'ru': 'полагаться на кого-либо'}]},
    ('bear2', 17): {'translation': 'налетать; нажимать, наседать (down on/upon)', 'examples': [{'en': 'bear down on', 'ru': 'налетать, наседать'}]},
    ('bear2', 21): {'translation': 'терпеть, выдерживать; мириться с (with)', 'examples': [{'en': 'bear with me', 'ru': 'потерпите меня'}]},
    ('boost', 8): {'translation': 'разг. рекламировать; поддерживать; поднимать престиж'},
    ('carry', 25): {'translation': 'переносить (на другой счёт, в следующую графу)', 'examples': [{'en': 'carry over', 'ru': 'переносить на другой счёт'}]},
    ('cheer', 9): {'translation': 'утешать(ся); ободрять(ся); воспрянуть духом', 'examples': [{'en': 'cheer up', 'ru': 'не унывай!, взбодрись!'}]},
    ('chunk', 2): {'translation': 'лошадь плотного сложения; коренастый человек'},
    ('dig', 8): {'translation': 'уст. глубоко исследовать, раскапывать'},
    ('draw', 49): {'translation': 'сокращать, уменьшать; истощать (запасы)', 'examples': [{'en': 'draw down', 'ru': 'сокращать, истощать'}]},
    ('file', 9): {'translation': 'напильник (тех.)'},
    ('file', 10): {'translation': 'пилочка (для ногтей)'},
    ('file', 26): {'translation': 'подпиливать, обрабатывать напильником'},
    ('file', 27): {'translation': 'доводить до совершенства, отделывать'},
    ('film', 6): {'translation': 'плёночный; кинематографический, кино-'},
    ('fly1', 3): {'translation': 'самонадеянный глупец; ложка дёгтя в бочке мёда', 'examples': [{'en': 'a fly in the ointment', 'ru': 'ложка дёгтя в бочке мёда'}]},
    ('fly2', 21): {'translation': 'нападать, набрасываться (at)', 'examples': [{'en': 'fly at', 'ru': 'нападать, набрасываться'}]},
    ('fly2', 23): {'translation': 'приходить в ярость, выходить из себя (into a passion/rage)', 'examples': [{'en': 'fly into a rage', 'ru': 'прийти в ярость'}]},
    ('fly2', 25): {'translation': 'отлетать; срываться (off)', 'examples': [{'en': 'fly off', 'ru': 'отлетать, срываться'}]},
    ('fly2', 27): {'translation': 'вспылить, сорваться (out)', 'examples': [{'en': 'fly out', 'ru': 'вспылить'}]},
    ('get', 25): {'translation': 'уст. порождать, производить на свет'},
    ('get', 30): {'translation': 'уст. отправляться, уходить'},
    ('get', 32): {'translation': 'уст. постигать, понимать'},
    ('get', 38): {'translation': 'уст. приобретать, наживать'},
    ('get', 42): {'translation': 'уст. доставать, добывать'},
    ('hang', 14): {'translation': 'вид, покрой (платья); посадка (одежды)'},
    ('hang', 19): {'translation': 'смысл, значение, суть (чего-либо)'},
    ('hang', 22): {'translation': 'освоиться с чем-либо, приобрести навык'},
    ('hang', 31): {'translation': 'медлить, колебаться (back)'},
    ('hang', 33): {'translation': 'цепляться, держаться за (on/onto)'},
    ('hi', 2): {'translation': 'привет!, салют!, здорово!'},
    ('hip', 8): {'translation': 'ура!, ура!, ура! (в возгласах hip, hip, hurrah!)', 'examples': [{'en': 'hip, hip, hurrah!', 'ru': 'ура!, ура!, ура!'}]},
    ('job', 10): {'translation': 'библ. Иов; многострадальный, терпеливый человек'},
    ('look', 32): {'translation': 'рассчитывать на (что-либо), надеяться (на что-либо; to)', 'examples': [{'en': 'look to', 'ru': 'рассчитывать на, надеяться'}]},
    ('mate', 1): {'translation': 'шахм. мат', 'examples': [{'en': "fool's mate", 'ru': 'дурацкий мат'}]},
    ('mum', 4): {'translation': 'разг. тише!, тс!; молчаливый (mum is the word)'},
    ('rope', 18): {'translation': 'разг. втянуть, вовлечь (во что-либо; in)', 'examples': [{'en': 'rope in', 'ru': 'втянуть, вовлечь'}]},
    ('row1', 3): {'translation': 'трудная задача, нелёгкое дело (a hard row to hoe)', 'examples': [{'en': 'a hard row to hoe', 'ru': 'трудная задача'}]},
    ('sheep', 5): {'translation': 'пергамент (из овечьей кожи); переплёт из овечьей кожи'},
    ('species', 2): {'translation': 'биол. вид; разновидность, порода'},
    ('staff', 9): {'translation': 'нотный стан, нотоносец'},
    ('strike', 25): {'translation': 'уст. поражать (болезнью)'},
    ('tear1', 15): {'translation': 'сносить (здание); срывать (объявление; down)', 'examples': [{'en': 'tear down', 'ru': 'сносить, срывать'}]},
    ('theatre', 1): {'translation': 'театр; театральное искусство; драматургия'},
    ('tissue', 2): {'translation': 'биол. ткань; структура ткани'},
    ('well1', 6): {'translation': 'чернильница'},
    ('write', 9): {'translation': 'уст. называть; обозначать'},
    ('write', 14): {'translation': 'уст. вписывать, регистрировать'},
    ('write', 16): {'translation': 'уст. предписывать, приказывать'},
    ('write', 18): {'translation': 'уст. завещать, отписывать'}
}

# Explicit fixes for 15 missing words
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

print("2. Applying all precision corrections across 4982 words...")

final_entries = []

for entry_idx, entry in enumerate(oxford):
    w = entry.get('word', '').strip()
    w_low = w.lower()
    
    new_entry = copy.deepcopy(entry)
    
    if w_low in EXPLICIT_CROSS_REFS:
        has_valid_ru = any(any('\u0400' <= c <= '\u04FF' for c in m.get('translation', '')) for m in entry.get('meanings', []))
        if not has_valid_ru:
            new_entry['meanings'] = copy.deepcopy(EXPLICIT_CROSS_REFS[w_low])
            final_entries.append(new_entry)
            continue
            
    meanings = new_entry.get('meanings', [])
    new_meanings = []
    
    for m_idx, m in enumerate(meanings):
        mid = m.get('id')
        tr = m.get('translation', '').strip()
        pos = m.get('partOfSpeech', 'other')
        exs = m.get('examples', [])
        
        # Check explicit dictionary fix first
        if (w, mid) in EXPLICIT_FIXES:
            fix_data = EXPLICIT_FIXES[(w, mid)]
            tr = fix_data.get('translation', tr)
            if 'examples' in fix_data:
                exs = fix_data['examples']
                
        # Clean examples
        cleaned_exs = []
        for ex in exs:
            en_ex = ex.get('en', '').strip()
            ru_ex = ex.get('ru', '').strip()
            ru_ex_clean = clean_text_typography(ru_ex)
            cleaned_exs.append({'en': en_ex, 'ru': ru_ex_clean})
            
        tr_clean = clean_text_typography(tr)
        
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
    final_entries.append(new_entry)

print("\n3. QA Verification...")
empty_count = 0
english_only = []
dangling_parens = 0

for entry in final_entries:
    w = entry['word']
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        if not tr:
            empty_count += 1
        elif not any('\u0400' <= c <= '\u04FF' for c in tr):
            english_only.append((w, m['id'], tr))
        if tr.count('(') != tr.count(')'):
            dangling_parens += 1

print(f"Empty translations: {empty_count}")
print(f"English-only translations: {len(english_only)} -> {english_only}")
print(f"Dangling parens: {dangling_parens}")

# Save to files
print("\n4. Saving final verified datasets...")
with open(OXFORD_PATH, 'w', encoding='utf-8') as f:
    json.dump(final_entries, f, ensure_ascii=False, indent=2)

with open(APP_OXFORD_PATH, 'w', encoding='utf-8') as f:
    json.dump(final_entries, f, ensure_ascii=False, indent=2)

print("Saved cleanly to:")
print(f"  - {OXFORD_PATH}")
print(f"  - {APP_OXFORD_PATH}")
