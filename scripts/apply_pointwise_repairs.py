# -*- coding: utf-8 -*-
"""
Precise Error Correction & Enrichment for oxford_5000_updated.json
Cross-referencing with SamPolnAnglRysSlovar - распарсенное.pdf (Doc2) and SamPolnAnglRysSlovar.pdf (Doc1)
"""

import sys
import json
import re
import unicodedata
import copy

sys.stdout.reconfigure(encoding='utf-8')

print("=== Starting Pointwise Repair of oxford_5000_updated.json ===")

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} entries.")

# 1. Ligature mapping for English text
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

def clean_english_text(text):
    if not text: return ""
    for pattern, repl in LIGATURE_MAP.items():
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    # Fix trailing digits or punctuation
    text = re.sub(r'\s+([,;:?.!\'\"])', r'\1', text)
    text = re.sub(r'([\'\"])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return unicodedata.normalize('NFC', text)

# 2. Fix specific junk / '=' translations
EQUAL_FIXES = {
    'ambassador': {2: 'посол, представитель'},
    'bat': {2: 'разг. гулянка, кутёж'},
    'bay': {13: 'залив, бухта; лавровое дерево'},
    'boom': {11: 'разг. делать рекламу; поднимать шумиху; греметь'},
    'bow': {16: 'нос (корабля)'},
    'cable': {4: 'кабельное телевидение; кабель'},
    'fork': {13: 'раскошелиться, раскошеливаться', 14: 'раскошелиться, раскошеливаться'},
    'ground': {11: 'муз. бассо остинато'},
    'hi': {1: 'разг. привет!, алло!'},
    'legitimate': {4: 'театр классический, серьёзный (о драматургии)'},
    'log': {2: 'судовой журнал, вахтенный журнал; бортовой журнал'},
    'main': {3: 'мор. грот-мачта; магистраль'},
    'nurse': {2: 'няня, воспитательница'},
    'opera': {3: 'оперный театр'},
    'plastic': {3: 'пластическая взрывчатка; пластик'},
    'punk': {4: 'панк-рок; панк, панк-рокер'},
    'push': {14: 'помыкать, третировать'},
    'regime': {2: 'режим, диета'},
    'return': {9: 'билет туда и обратно; обратный билет'},
    'risky': {2: 'двусмысленный, рискованный, пикантный'},
    'rose': {4: 'архит. окно-роза, круглое окно'},
    'round': {36: 'наброситься, резко повернуться (против кого-л.)'},
    'scare': {6: 'отпугивать, спугивать'},
    'scratch': {7: 'парик'},
    'skip': {11: 'пропускать, перескакивать'},
    'stick': {26: 'разг. слоняться поблизости, торчать'},
    'title': {3: 'титульный лист'},
    'western': {2: 'житель запада'}
}

# 3. Clean Russian translation text and fix dangling parens
def clean_russian_translation(text, word=''):
    if not text: return ""
    
    # Strip leading ')' or stray punctuation
    text = re.sub(r'^\s*[\)\.\,\;\:]+\s*', '', text)
    
    # Fix broken parentheses from pl/sg substitutions
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
    
    # Fix unclosed parens for known cases
    if text == '(амер.':
        text = '(амер. in behalf of, брит. on behalf of) от имени, ради'
    elif text.startswith('(superl от'):
        text = '(превосх. ст.) наилучший; лучше всего'
    elif text.startswith('(compar от'):
        text = '(сравн. ст.) худший; (ещё) хуже'
    elif text == 'разг. объект ненависти (часто':
        text = 'разг. объект ненависти'
    elif text.startswith('(косв п'):
        text = '(косв. п. me) я'
    elif text.startswith('(обыкн') and word in ['programme', 'programming']:
        text = 'вчт. программировать'
    elif text == '(тк past' and word == 'use':
        text = '(только past) имел обыкновение (делать что-л.)'
    elif text.startswith('past и p p также wound)'):
        text = '(past и p.p. также wound) поэт. трубить; играть на духовом инструменте'
        
    # Auto-close unclosed opening paren at the start if it has no closing paren
    if text.count('(') > text.count(')'):
        if text.startswith('(') and ')' not in text:
            text = text + ')'
        elif re.search(r'\([а-яёА-ЯЁa-zA-Z\s\.\,\;]+$', text):
            text = text + ')'
            
    # Remove empty parens
    text = re.sub(r'\(\s*\)', '', text)
    text = re.sub(r'\s+([,;:?.!)])', r'\1', text)
    text = re.sub(r'([(])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Clean leading/trailing punctuation
    text = re.sub(r'^[,;:\s]+', '', text)
    text = re.sub(r'[,;:\s]+$', '', text)
    
    return unicodedata.normalize('NFC', text)

# Process all entries
updated_entries = []
fixed_ligatures_count = 0
fixed_equals_count = 0
fixed_parens_count = 0
dedup_examples_count = 0

for item in data:
    item_copy = copy.deepcopy(item)
    w = item_copy['word']
    
    meanings = item_copy.get('meanings', [])
    phrases = item_copy.get('phrases', [])
    
    cleaned_meanings = []
    seen_ex_en = set()
    
    for m in meanings:
        m_id = m.get('id')
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', 'other')
        exs = m.get('examples', [])
        
        # 1. Fix equals / junk translations
        if w in EQUAL_FIXES and m_id in EQUAL_FIXES[w]:
            tr = EQUAL_FIXES[w][m_id]
            fixed_equals_count += 1
            
        # 2. Fix Russian translation typography & parens
        orig_tr = tr
        tr = clean_russian_translation(tr, w)
        if tr != orig_tr:
            fixed_parens_count += 1
            
        # 3. Clean examples
        cleaned_exs = []
        for ex in exs:
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            
            orig_en = en
            en = clean_english_text(en)
            if en != orig_en:
                fixed_ligatures_count += 1
                
            orig_ru = ru
            ru = clean_russian_translation(ru, w)
            if ru != orig_ru:
                fixed_parens_count += 1
                
            en_lower = en.lower().strip()
            # If example is valid and not a duplicate within the word
            if en and ru:
                if en_lower not in seen_ex_en:
                    cleaned_exs.append({'en': en, 'ru': ru})
                    seen_ex_en.add(en_lower)
                else:
                    dedup_examples_count += 1
            elif en and not ru:
                # If ru is empty, check if en is just a repeated phrasal verb or junk
                if en_lower not in seen_ex_en and len(en.split()) > 1:
                    # preserve if meaningful
                    pass
                    
        # Special check for hi
        if w == 'hi' and m_id == 1:
            cleaned_exs = [{'en': 'hi, John!', 'ru': 'здорово, Джон!'}]
            
        m_clean = {
            'partOfSpeech': pos,
            'translation': tr,
            'examples': cleaned_exs,
            'id': m_id
        }
        
        # Only keep meaning if translation is not empty
        if tr:
            cleaned_meanings.append(m_clean)
            
    # Clean phrases
    cleaned_phrases = []
    seen_phrases = set()
    for p in phrases:
        p_en = clean_english_text(p.get('en', ''))
        p_ru = clean_russian_translation(p.get('ru', ''), w)
        
        if p_en != p.get('en'):
            fixed_ligatures_count += 1
        if p_ru != p.get('ru'):
            fixed_parens_count += 1
            
        p_key = p_en.lower().strip()
        if p_en and p_ru and p_key not in seen_phrases:
            cleaned_phrases.append({'en': p_en, 'ru': p_ru})
            seen_phrases.add(p_key)
            
    # Ensure sequential IDs 1..N
    for idx, m in enumerate(cleaned_meanings, 1):
        m['id'] = idx
        
    item_copy['meanings'] = cleaned_meanings
    item_copy['phrases'] = cleaned_phrases
    updated_entries.append(item_copy)

print(f"\n--- Pointwise Fixes Summary ---")
print(f"Fixed ligature splits: {fixed_ligatures_count}")
print(f"Fixed '=' / junk translations: {fixed_equals_count}")
print(f"Fixed dangling parens / typography: {fixed_parens_count}")
print(f"Deduplicated repeated examples: {dedup_examples_count}")

# Save repaired JSON
with open('oxford_5000_updated.json', 'w', encoding='utf-8') as f:
    json.dump(updated_entries, f, ensure_ascii=False, indent=2)

print("\nSaved updated data to oxford_5000_updated.json")
