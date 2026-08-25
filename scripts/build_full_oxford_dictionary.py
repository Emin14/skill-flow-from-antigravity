# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import time
import pymupdf

from parse_utils import REGISTER_MAP, POS_MAP
from parse_entry_meanings import (
    is_headword_span,
    parse_entry_meanings_and_phrases,
    normalize_text_nfc,
    clean_russian_text,
    clean_english_example
)
from additional_fallbacks import ADDITIONAL_FALLBACKS
from cross_references import CROSS_REFERENCE_MAP

sys.stdout.reconfigure(encoding='utf-8')

print("=== Starting Full Oxford 5000 Dictionary Generation (Meanings + Deduplicated Phrases) ===")
t0 = time.time()

# 1. Load source Oxford 5000
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_list = json.load(f)

print(f"Loaded {len(oxford_list)} words from oxford_5000.json.")

# 2. Extract and index all entries from SamPolnAnglRysSlovar.pdf
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
raw_entries = []
curr_entry = None

for p in range(10, 508):
    page = doc[p]
    d = page.get_text('dict')
    page_h = page.rect.height
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 50 or y1 > page_h - 25: continue
            if not l['spans']: continue
            first_s = l['spans'][0]
            if is_headword_span(first_s):
                if curr_entry:
                    raw_entries.append(curr_entry)
                curr_entry = {'page': p, 'hw_spans': [], 'body_spans': []}
                hw_done = False
                for s in l['spans']:
                    if not hw_done and is_headword_span(s):
                        curr_entry['hw_spans'].append(s)
                    else:
                        hw_done = True
                        curr_entry['body_spans'].append(s)
            else:
                if curr_entry:
                    for s in l['spans']:
                        curr_entry['body_spans'].append(s)
if curr_entry:
    raw_entries.append(curr_entry)

doc.close()
print(f"Extracted {len(raw_entries)} raw dictionary entries from PDF in {time.time()-t0:.2f}s.")

# 3. Build fast lookup indexes
index_by_exact = {}
index_by_base = {}

for e in raw_entries:
    raw_hw = ''.join(normalize_text_nfc(s['text']) for s in e['hw_spans']).strip()
    raw_hw_clean = re.sub(r'\s+', ' ', raw_hw).strip()
    raw_hw_lower = raw_hw_clean.lower()
    
    if raw_hw_lower not in index_by_exact:
        index_by_exact[raw_hw_lower] = e
        
    base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+|\s+I{1,3}|1|2|3|4|5)$', '', raw_hw_clean, flags=re.IGNORECASE).strip().lower()
    base_hw = re.sub(r'[\,\.\/].*$', '', base_hw).strip()
    
    if base_hw not in index_by_base:
        index_by_base[base_hw] = []
    index_by_base[base_hw].append((raw_hw_clean, e))

print(f"Indexed {len(index_by_base)} unique base headwords.")

FALLBACK_DEFINITIONS = {
    'according to': [{'partOfSpeech': 'preposition', 'translation': 'согласно; в соответствии с; по словам', 'examples': [{'en': 'according to the report', 'ru': 'согласно отчёту'}]}],
    'any more': [{'partOfSpeech': 'adverb', 'translation': 'больше не, уже не', 'examples': [{'en': 'not any more', 'ru': 'больше нет, уже нет'}]}],
    'have to': [{'partOfSpeech': 'verb', 'translation': 'быть должным, вынужденным (сделать что-л.)', 'examples': [{'en': 'I have to go', 'ru': 'я должен идти'}]}],
    'next to': [{'partOfSpeech': 'preposition', 'translation': 'рядом с, возле; почти, едва ли не', 'examples': [{'en': 'next to the window', 'ru': 'возле окна'}]}],
    'app': [{'partOfSpeech': 'noun', 'translation': 'компьютерная программа, приложение (для смартфона, компьютера)', 'examples': []}],
    'blog': [{'partOfSpeech': 'noun', 'translation': 'блог, интернет-дневник', 'examples': []}],
    'broadband': [{'partOfSpeech': 'adjective', 'translation': 'широкополосный (о связи, интернете)', 'examples': []}],
    'bye': [{'partOfSpeech': 'interjection', 'translation': 'пока!, до свидания!', 'examples': []}],
    'cafe': [{'partOfSpeech': 'noun', 'translation': 'кафе, кофейня', 'examples': []}],
    'dvd': [{'partOfSpeech': 'noun', 'translation': 'DVD, цифровой видеодиск', 'examples': []}],
    'email': [{'partOfSpeech': 'noun', 'translation': 'электронная почта, имейл; электронное письмо', 'examples': [{'en': 'send an email', 'ru': 'отправить электронное письмо'}]}],
    'healthcare': [{'partOfSpeech': 'noun', 'translation': 'здравоохранение, медицинское обслуживание', 'examples': []}],
    'marketplace': [{'partOfSpeech': 'noun', 'translation': 'рыночная площадь; рынок, сфера торговли', 'examples': []}],
    'memo': [{'partOfSpeech': 'noun', 'translation': 'памятная записка, служебная записка', 'examples': []}],
    'mentor': [{'partOfSpeech': 'noun', 'translation': 'наставник, ментор; руководитель', 'examples': []}],
    'ok': [{'partOfSpeech': 'other', 'translation': 'хорошо, ладно; правильный, в порядке', 'examples': []}],
    'online': [{'partOfSpeech': 'adverb/adjective', 'translation': 'онлайн, в сети, через интернет; интерактивный', 'examples': []}],
    'ongoing': [{'partOfSpeech': 'adjective', 'translation': 'происходящий в настоящее время, продолжающийся, непрерывный', 'examples': []}],
    'pathway': [{'partOfSpeech': 'noun', 'translation': 'тропинка, дорожка; путь, направление', 'examples': []}],
    'smartphone': [{'partOfSpeech': 'noun', 'translation': 'смартфон, умный телефон', 'examples': []}],
    'spokesperson': [{'partOfSpeech': 'noun', 'translation': 'представитель, официальный представитель, пресс-секретарь', 'examples': []}],
    'spokeswoman': [{'partOfSpeech': 'noun', 'translation': 'представительница, пресс-секретарь (женщина)', 'examples': []}],
    'sustainable': [{'partOfSpeech': 'adjective', 'translation': 'устойчивый; экологически безопасный; жизнеспособный', 'examples': []}],
    'thought-provoking': [{'partOfSpeech': 'adjective', 'translation': 'заставляющий задуматься, глубокий', 'examples': []}],
    'upcoming': [{'partOfSpeech': 'adjective', 'translation': 'наступающий, предстоящий', 'examples': []}],
    'whatsoever': [{'partOfSpeech': 'adverb', 'translation': 'какой бы ни, совершенно, абсолютно (в отрицаниях)', 'examples': [{'en': 'none whatsoever', 'ru': 'решительно ничего'}]}],
    'whilst': [{'partOfSpeech': 'conjunction', 'translation': 'в то время как, пока', 'examples': []}],
    'workplace': [{'partOfSpeech': 'noun', 'translation': 'рабочее место, предприятие', 'examples': []}],
    'yeah': [{'partOfSpeech': 'interjection', 'translation': 'да, ага', 'examples': []}],
    'aide': [{'partOfSpeech': 'noun', 'translation': 'помощник, советник; адъютант', 'examples': []}],
    'albeit': [{'partOfSpeech': 'conjunction', 'translation': 'хотя, пусть даже, тем не менее', 'examples': []}],
    'asylum': [{'partOfSpeech': 'noun', 'translation': 'убежище, приют; психиатрическая лечебница', 'examples': []}],
    'awareness': [{'partOfSpeech': 'noun', 'translation': 'осведомлённость, знание, понимание', 'examples': []}],
    'duo': [{'partOfSpeech': 'noun', 'translation': 'дуэт, пара', 'examples': []}],
    'decision-making': [{'partOfSpeech': 'noun', 'translation': 'принятие решений', 'examples': []}],
    'film-maker': [{'partOfSpeech': 'noun', 'translation': 'кинорежиссёр, создатель фильмов', 'examples': []}],
    'high-profile': [{'partOfSpeech': 'adjective', 'translation': 'привлекающий внимание, высокопоставленный, заметный', 'examples': []}],
    'long-standing': [{'partOfSpeech': 'adjective', 'translation': 'давний, многолетний', 'examples': []}],
    'long-time': [{'partOfSpeech': 'adjective', 'translation': 'давний, давнишний', 'examples': []}],
    'non-profit': [{'partOfSpeech': 'adjective', 'translation': 'некоммерческий, бесприбыльный', 'examples': []}],
    'post-war': [{'partOfSpeech': 'adjective', 'translation': 'послевоенный', 'examples': []}],
    'line-up': [{'partOfSpeech': 'noun', 'translation': 'расстановка; состав (команды, участников); очередь', 'examples': []}],
    'enquire': [{'partOfSpeech': 'verb', 'translation': 'спрашивать, наводить справки', 'examples': []}],
    'enquiry': [{'partOfSpeech': 'noun', 'translation': 'вопрос, расспрашивание, наведение справок; расследование', 'examples': []}],
    'program': [{'partOfSpeech': 'noun', 'translation': 'программа, план работы', 'examples': []}, {'partOfSpeech': 'verb', 'translation': 'составлять программу, программировать', 'examples': []}],
    'upon': [{'partOfSpeech': 'preposition', 'translation': 'на, по, после (более формальный вариант on)', 'examples': []}]
}

FALLBACK_DEFINITIONS.update(ADDITIONAL_FALLBACKS)
FALLBACK_DEFINITIONS.update(CROSS_REFERENCE_MAP)

def resolve_word_entries(word):
    w = word.strip().lower()
    w_clean = re.sub(r'\d+$', '', w)
    
    candidates = [
        w,
        w_clean,
        w.replace('_', ' '),
        w_clean.replace('_', ' '),
        w.replace('-', ' '),
        w.replace(' ', '-'),
        w.replace("'", "’"),
        w.replace("’", "'")
    ]
    
    for c in candidates:
        if c in index_by_base:
            return index_by_base[c]
            
    stem_candidates = []
    if w.endswith('ly') and len(w) > 4:
        stem_candidates.append(w[:-2])
        if w.endswith('ally'):
            stem_candidates.append(w[:-4])
        if w.endswith('ily'):
            stem_candidates.append(w[:-3] + 'y')
    if w.endswith('ed') and len(w) > 4:
        stem_candidates.append(w[:-2])
        stem_candidates.append(w[:-1])
    if w.endswith('ing') and len(w) > 5:
        stem_candidates.append(w[:-3])
        stem_candidates.append(w[:-3] + 'e')
    if w.endswith('s') and len(w) > 3:
        stem_candidates.append(w[:-1])
        if w.endswith('es'):
            stem_candidates.append(w[:-2])
    if w.endswith('tion') and len(w) > 6:
        stem_candidates.append(w[:-4] + 'te')
        stem_candidates.append(w[:-4] + 't')
        stem_candidates.append(w[:-4])
    if w.endswith('ment') and len(w) > 6:
        stem_candidates.append(w[:-4])
    if w.endswith('ness') and len(w) > 6:
        stem_candidates.append(w[:-4])
        if w.endswith('iness'):
            stem_candidates.append(w[:-5] + 'y')

    for sc in stem_candidates:
        if sc in index_by_base:
            return index_by_base[sc]
            
    return None

# 4. Process all Oxford 5000 items
total_processed = 0
total_meanings_count = 0
total_phrases_count = 0
updated_oxford = []

for item in oxford_list:
    w = item['word'].strip()
    w_lower = w.lower()
    
    meanings_list = []
    phrases_list = []
    m_id = 1
    
    if w_lower in FALLBACK_DEFINITIONS and (w_lower in CROSS_REFERENCE_MAP or ' ' in w_lower or '-' in w_lower or w_lower in ['app', 'blog', 'dvd', 'email', 'memo', 'mentor', 'ok', 'online', 'ongoing', 'smartphone', 'yeah', 'aide', 'albeit', 'duo', 'enquire', 'enquiry', 'upon', 'program']):
        for m in FALLBACK_DEFINITIONS[w_lower]:
            m_copy = dict(m)
            m_copy['id'] = m_id
            m_id += 1
            meanings_list.append(m_copy)
    else:
        matched_entries = resolve_word_entries(w)
        if matched_entries:
            for raw_hw, entry in matched_entries:
                entry_meanings, entry_phrases = parse_entry_meanings_and_phrases(raw_hw, entry['body_spans'])
                for m in entry_meanings:
                    m['id'] = m_id
                    m_id += 1
                    meanings_list.append(m)
                for ph in entry_phrases:
                    if ph not in phrases_list:
                        phrases_list.append(ph)
        elif w_lower in FALLBACK_DEFINITIONS:
            for m in FALLBACK_DEFINITIONS[w_lower]:
                m_copy = dict(m)
                m_copy['id'] = m_id
                m_id += 1
                meanings_list.append(m_copy)
        else:
            print(f"Warning: No match found for '{w}', preserving cleaned original.")
            for idx, m in enumerate(item.get('meanings', []), 1):
                m_copy = dict(m)
                m_copy['id'] = idx
                m_copy['translation'] = clean_russian_text(m_copy.get('translation', ''))
                meanings_list.append(m_copy)
            
    filtered_meanings = [m for m in meanings_list if m.get('translation') or m.get('examples')]
    
    # DEDUPLICATION: Remove any examples that are already in phrases_list
    phrase_en_set = set(p['en'].lower().strip() for p in phrases_list if p.get('en'))
    
    for m in filtered_meanings:
        dedup_examples = []
        for ex in m.get('examples', []):
            ex_en = ex.get('en', '').lower().strip()
            # If this example is already in phrases, exclude it from meaning examples
            if ex_en not in phrase_en_set:
                dedup_examples.append(ex)
        m['examples'] = dedup_examples
        
    for idx, m in enumerate(filtered_meanings, 1):
        m['id'] = idx
        
    item_updated = dict(item)
    item_updated['meanings'] = filtered_meanings
    item_updated['phrases'] = phrases_list
    updated_oxford.append(item_updated)
    
    total_processed += 1
    total_meanings_count += len(filtered_meanings)
    total_phrases_count += len(phrases_list)

# 5. Write to oxford_5000_updated.json
with open('oxford_5000_updated.json', 'w', encoding='utf-8') as f:
    json.dump(updated_oxford, f, ensure_ascii=False, indent=2)

print(f"=== Successfully processed {total_processed} words ===")
print(f"Total meanings generated: {total_meanings_count}")
print(f"Total phrases (idioms) generated: {total_phrases_count} in {time.time()-t0:.2f}s")
