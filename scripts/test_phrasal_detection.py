# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

PHRASAL_PARTICLES = {
    'about', 'across', 'after', 'against', 'ahead', 'along',
    'apart', 'around', 'aside', 'away', 'back', 'before',
    'behind', 'below', 'between', 'by', 'down', 'for', 'forth',
    'forward', 'from', 'in', 'into', 'off', 'on', 'out', 'over',
    'round', 'through', 'to', 'together', 'towards', 'under',
    'up', 'upon', 'with', 'without'
}

def is_phrasal_meaning(item_word, m):
    w_base = re.sub(r'\d+$', '', item_word).lower()
    exs = m.get('examples', [])
    tr = m.get('translation', '').strip()
    
    # Check each example
    for ex in exs:
        en = ex.get('en', '').lower().strip()
        ru = ex.get('ru', '').strip()
        words = re.findall(r'[a-zA-Z\']+', en)
        
        # Case 1: "cross out ...", "give up ..."
        if len(words) >= 2 and words[0] == w_base and words[1] in PHRASAL_PARTICLES:
            ph_verb = f"{words[0]} {words[1]}"
            return True, ph_verb, (ru if ru else tr)
            
        # Case 2: "to cross out ...", "to give up ..."
        if len(words) >= 3 and words[0] == 'to' and words[1] == w_base and words[2] in PHRASAL_PARTICLES:
            ph_verb = f"{words[1]} {words[2]}"
            return True, ph_verb, (ru if ru else tr)
            
    return False, None, None

# Test on cross meaning 20 and 21
m20 = {
    "partOfSpeech": "verb",
    "translation": "вычёркивать; исключать (из списка и т.п.)",
    "examples": [{"en": "cross off", "ru": "вычёркивать; исключать (из списка и т.п.)"}],
    "id": 20
}
m21 = {
    "partOfSpeech": "verb",
    "translation": "вычёркивать, зачёркивать",
    "examples": [{"en": "to cross out a word", "ru": "зачеркнуть слово"}],
    "id": 21
}

print("m20 is phrasal:", is_phrasal_meaning('cross', m20))
print("m21 is phrasal:", is_phrasal_meaning('cross', m21))
