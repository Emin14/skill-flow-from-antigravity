# -*- coding: utf-8 -*-
"""
Comprehensive Deep Batch Verifier and Cleaner with Full Register Separation.
"""

import sys
import json
import re
import unicodedata
import os
import copy

sys.stdout.reconfigure(encoding='utf-8')

# Thematic Register Map (abbreviation -> full Russian name)
REGISTER_TO_FULL = {
    'ав': 'авиация',
    'авт': 'автомобильное',
    'амер': 'американизм',
    'анат': 'анатомия',
    'археол': 'археология',
    'архит': 'архитектура',
    'астр': 'астрономия',
    'банк': 'банковское',
    'библ': 'библейское',
    'биол': 'биологическое',
    'бот': 'ботаника',
    'бухг': 'бухгалтерия',
    'воен': 'военное',
    'возвыш': 'возвышенное',
    'вчт': 'информатика',
    'геогр': 'география',
    'геод': 'геодезия',
    'геол': 'геология',
    'геом': 'геометрия',
    'геральд': 'геральдика',
    'грам': 'грамматика',
    'детск': 'детское',
    'дип': 'дипломатия',
    'дор': 'дорожное',
    'ж-д': 'железнодорожное',
    'ж.-д': 'железнодорожное',
    'жив': 'живопись',
    'зоол': 'зоология',
    'ирон': 'ироническое',
    'иск': 'искусство',
    'ист': 'историческое',
    'канад': 'канадское',
    'канц': 'канцелярское',
    'карт': 'карточный термин',
    'кино': 'кинематография',
    'книжн': 'книжное',
    'ком': 'коммерческое',
    'косм': 'космонавтика',
    'кул': 'кулинария',
    'лингв': 'лингвистика',
    'лит': 'литература',
    'лог': 'логика',
    'мат': 'математика',
    'мед': 'медицина',
    'метал': 'металлургия',
    'метео': 'метеорология',
    'мех': 'механика',
    'мин': 'минералогия',
    'миф': 'мифология',
    'мор': 'морское',
    'муз': 'музыка',
    'неодобр': 'неодобрительное',
    'опт': 'оптика',
    'охот': 'охота',
    'парл': 'парламентское',
    'перен': 'переносное',
    'полигр': 'полиграфия',
    'полит': 'политика',
    'поэт': 'поэтическое',
    'презр': 'презрительное',
    'пренебр': 'пренебрежительное',
    'психол': 'психология',
    'радио': 'радио',
    'разг': 'разговорное',
    'рел': 'религия',
    'собир': 'собирательное',
    'спорт': 'спорт',
    'стат': 'статистика',
    'стр': 'строительное',
    'студ': 'студенческое',
    'с-х': 'сельское хозяйство',
    'с.-х': 'сельское хозяйство',
    'театр': 'театр',
    'текст': 'текстильное',
    'тех': 'техника',
    'тлв': 'телевидение',
    'топ': 'топография',
    'унив': 'университетское',
    'уст': 'устаревшее',
    'фарм': 'фармакология',
    'физ': 'физика',
    'физиол': 'физиология',
    'филос': 'философия',
    'фин': 'финансовое',
    'хим': 'химия',
    'церк': 'церковное',
    'шахм': 'шахматы',
    'эк': 'экономика',
    'экол': 'экология',
    'эл': 'электротехника',
    'юр': 'юридическое',
    'шутл': 'шутливое',
    'бран': 'бранное',
    'груб': 'грубое',
    'редк': 'редкое',
    'австрал': 'австралийское',
    'шотл': 'шотландское'
}

LIGATURE_MAP = {
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

POS_WORDS = {
    'noun', 'verb', 'adjective', 'adverb', 'preposition',
    'conjunction', 'pronoun', 'interjection', 'number',
    'article', 'other', 'phrase', 'idiom'
}

PHRASAL_PARTICLES = {
    'about', 'across', 'after', 'against', 'ahead', 'along',
    'apart', 'around', 'aside', 'away', 'back', 'before',
    'behind', 'below', 'between', 'by', 'down', 'for', 'forth',
    'forward', 'from', 'in', 'into', 'off', 'on', 'out', 'over',
    'round', 'through', 'to', 'together', 'towards', 'under',
    'up', 'upon', 'with', 'without'
}

def clean_ocr_and_formatting(text, is_russian=True):
    if not text:
        return ""
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff\u0002\u0006\u0005\u000f\u0001\u0003\u0004\u0007\u0010\u0012]', '', text)
    
    for pat, rep in LIGATURE_MAP.items():
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
        text = re.sub(r'\(\s*\)', '', text)
        text = re.sub(r'\(\s*\(', '(', text)
        text = re.sub(r'\)\s*\)', ')', text)
        
        if text.count('(') > text.count(')'):
            if text.startswith('(') and ')' not in text:
                text = text + ')'
            elif re.search(r'\([а-яёА-ЯЁa-zA-Z\s\.\,\;]+$', text):
                text = text + ')'

    text = re.sub(r'\s+([,;:?.!)])', r'\1', text)
    text = re.sub(r'([(])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'^[,;:\s]+', '', text)
    text = re.sub(r'[,;:\s]+$', '', text)
    return unicodedata.normalize('NFC', text)

def extract_registers_from_text(text, existing_registers=None):
    if not text:
        return "", []
    registers = list(existing_registers) if existing_registers else []
    sorted_regs = sorted(REGISTER_TO_FULL.keys(), key=len, reverse=True)
    
    for r in sorted_regs:
        full_name = REGISTER_TO_FULL[r]
        pat_start = r'^(?:' + re.escape(r) + r'\.?|\(' + re.escape(r) + r'\.?\))\s*'
        if re.search(pat_start, text, flags=re.IGNORECASE):
            text = re.sub(pat_start, '', text, flags=re.IGNORECASE).strip()
            if full_name not in registers:
                registers.append(full_name)
                
        pat_mid = r'(?<=[;\(\[\{])\s*(?:' + re.escape(r) + r'\.?|\(' + re.escape(r) + r'\.?\))\s+'
        if re.search(pat_mid, text, flags=re.IGNORECASE):
            text = re.sub(pat_mid, ' ', text, flags=re.IGNORECASE).strip()
            if full_name not in registers:
                registers.append(full_name)
                
    text = re.sub(r'^\s*[\)\.\,\;\:]+\s*', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return clean_ocr_and_formatting(text, is_russian=True), registers

def is_phrasal_meaning(item_word, m):
    pos = m.get('partOfSpeech', '').strip().lower()
    if pos != 'verb':
        return False, None, None
        
    w_base = re.sub(r'\d+$', '', item_word).lower()
    exs = m.get('examples', [])
    tr = m.get('translation', '').strip()
    
    for ex in exs:
        en = ex.get('en', '').lower().strip()
        ru = ex.get('ru', '').strip()
        words = re.findall(r'[a-zA-Z\']+', en)
        
        # Exact 2-word phrasal verb: "cross off", "give up", "break down", "call back"
        if len(words) == 2 and words[0] == w_base and words[1] in PHRASAL_PARTICLES:
            ph_verb = f"{words[0]} {words[1]}"
            meaning_ru = tr if tr else ru
            return True, ph_verb, meaning_ru
            
        # Exact 3-word phrasal verb: "to cross off", "look forward to", "put up with", "back out of"
        if len(words) == 3 and words[0] == 'to' and words[1] == w_base and words[2] in PHRASAL_PARTICLES:
            ph_verb = f"{words[1]} {words[2]}"
            meaning_ru = tr if tr else ru
            return True, ph_verb, meaning_ru
            
        if len(words) == 3 and words[0] == w_base and words[1] in PHRASAL_PARTICLES and words[2] in PHRASAL_PARTICLES:
            ph_verb = f"{words[0]} {words[1]} {words[2]}"
            meaning_ru = tr if tr else ru
            return True, ph_verb, meaning_ru
            
    return False, None, None

def verify_single_word(item):
    w = item.get('word', '').strip()
    if not w:
        return None
        
    cleaned_item = {
        'word': w,
        'frequency_rank': item.get('frequency_rank'),
        'cefr': item.get('cefr'),
        'phon_br': clean_ocr_and_formatting(item.get('phon_br', ''), is_russian=False),
        'phon_n_am': clean_ocr_and_formatting(item.get('phon_n_am', ''), is_russian=False),
        'lists': item.get('lists', {})
    }
    if 'topics' in item:
        cleaned_item['topics'] = item['topics']
    if 'forms' in item:
        cleaned_item['forms'] = item['forms']
        
    meanings = item.get('meanings', [])
    phrases = item.get('phrases', [])
    
    extracted_phrases = []
    seen_phrases = set()
    
    # 1. Existing phrases
    for p in phrases:
        p_en = clean_ocr_and_formatting(p.get('en', ''), is_russian=False)
        p_ru, _ = extract_registers_from_text(p.get('ru', ''))
        if p_en and p_ru:
            pkey = p_en.lower().strip()
            if pkey not in seen_phrases:
                extracted_phrases.append({'en': p_en, 'ru': p_ru})
                seen_phrases.add(pkey)
                
    # 2. Process meanings & separate phrasals
    cleaned_meanings = []
    seen_ex = set()
    
    for m in meanings:
        is_phrasal, ph_en, ph_ru = is_phrasal_meaning(w, m)
        if is_phrasal and ph_en:
            ph_en_c = clean_ocr_and_formatting(ph_en, is_russian=False)
            ph_ru_c, _ = extract_registers_from_text(ph_ru)
            if ph_en_c and ph_ru_c:
                pkey = ph_en_c.lower().strip()
                if pkey not in seen_phrases:
                    extracted_phrases.append({'en': ph_en_c, 'ru': ph_ru_c})
                    seen_phrases.add(pkey)
            continue
            
        pos = m.get('partOfSpeech', 'other').strip().lower()
        if pos not in POS_WORDS:
            pos = 'other'
            
        raw_tr = m.get('translation', '')
        clean_tr, regs = extract_registers_from_text(raw_tr, m.get('register', []))
        if not clean_tr:
            continue
            
        cleaned_exs = []
        for ex in m.get('examples', []):
            en = clean_ocr_and_formatting(ex.get('en', ''), is_russian=False)
            ru, ex_regs = extract_registers_from_text(ex.get('ru', ''))
            if en and ru:
                en_key = en.lower().strip()
                if en_key not in seen_ex:
                    ex_obj = {'en': en, 'ru': ru}
                    if ex_regs:
                        ex_obj['register'] = ex_regs[0]
                    elif ex.get('register'):
                        ex_obj['register'] = ex.get('register')
                    cleaned_exs.append(ex_obj)
                    seen_ex.add(en_key)
                    
        meaning_obj = {
            'partOfSpeech': pos,
            'translation': clean_tr,
            'examples': cleaned_exs,
            'id': len(cleaned_meanings) + 1
        }
        if regs:
            meaning_obj['register'] = regs
        if m.get('primary'):
            meaning_obj['primary'] = m['primary']
        if m.get('synonyms'):
            meaning_obj['synonyms'] = m['synonyms']
            
        cleaned_meanings.append(meaning_obj)
        
    cleaned_item['meanings'] = cleaned_meanings
    cleaned_item['phrases'] = extracted_phrases
    return cleaned_item

def verify_batch_items(batch):
    return [verify_single_word(item) for item in batch if verify_single_word(item)]

if __name__ == '__main__':
    with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    cross_orig = next(item for item in data if item['word'] == 'cross')
    cross_ver = verify_single_word(cross_orig)
    
    print("=== Verification Test for 'cross' with Registers ===")
    for m in cross_ver['meanings']:
        reg_str = f" [register: {m['register']}]" if 'register' in m else ""
        print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}{reg_str}")
