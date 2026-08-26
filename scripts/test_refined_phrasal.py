# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

from deep_batch_verifier import clean_ocr_and_formatting

PHRASAL_PARTICLES = {
    'about', 'across', 'after', 'against', 'ahead', 'along',
    'apart', 'around', 'aside', 'away', 'back', 'before',
    'behind', 'below', 'between', 'by', 'down', 'for', 'forth',
    'forward', 'from', 'in', 'into', 'off', 'on', 'out', 'over',
    'round', 'through', 'to', 'together', 'towards', 'under',
    'up', 'upon', 'with', 'without'
}

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
            
        # Exact 3-word phrasal verb with particle: "to cross off", "look forward to", "put up with", "back out of"
        if len(words) == 3 and words[0] == 'to' and words[1] == w_base and words[2] in PHRASAL_PARTICLES:
            ph_verb = f"{words[1]} {words[2]}"
            meaning_ru = tr if tr else ru
            return True, ph_verb, meaning_ru
            
        if len(words) == 3 and words[0] == w_base and words[1] in PHRASAL_PARTICLES and words[2] in PHRASAL_PARTICLES:
            ph_verb = f"{words[0]} {words[1]} {words[2]}"
            meaning_ru = tr if tr else ru
            return True, ph_verb, meaning_ru
            
    return False, None, None

words = ['accountant', 'beer', 'depart', 'sue', 'cross', 'give', 'break']
with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for w_name in words:
    item = next(it for it in data if it['word'] == w_name)
    phrasal_count = sum(1 for m in item.get('meanings', []) if is_phrasal_meaning(w_name, m)[0])
    print(f"Word: {w_name:12s} | total meanings: {len(item.get('meanings', [])):2d} | phrasal meanings detected: {phrasal_count:2d}")
