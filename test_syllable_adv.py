# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

def clean_syllables_advanced(text):
    # Multiple passes to merge broken Russian syllables (2-4 chars)
    # Don't merge distinct common short prepositions: в, на, за, под, над, из, от, до, по, о, об, обо, без, для, при, не, ни, то, как, так
    preps = {'в', 'на', 'за', 'под', 'над', 'из', 'от', 'до', 'по', 'о', 'об', 'обо', 'без', 'для', 'при', 'не', 'ни', 'то', 'как', 'так', 'же', 'ли', 'бы', 'он', 'она', 'они', 'мы', 'вы', 'я', 'ты', 'или', 'что', 'кто', 'где', 'чем', 'кем'}
    
    parts = re.split(r'([\,\;\.\:\(\)\/])', text)
    cleaned = []
    for p in parts:
        if p in [',', ';', '.', ':', '(', ')', '/']:
            cleaned.append(p)
        else:
            words = p.strip().split()
            if not words: continue
            new_words = []
            skip = False
            for i in range(len(words)):
                if skip:
                    skip = False
                    continue
                w = words[i]
                if i + 1 < len(words):
                    next_w = words[i+1]
                    if w.lower() not in preps and next_w.lower() not in preps and len(w) <= 4 and len(next_w) <= 4 and re.match(r'^[а-яёА-ЯЁ]+$', w) and re.match(r'^[а-яёА-ЯЁ]+$', next_w):
                        # merge!
                        new_words.append(w + next_w)
                        skip = True
                        continue
                new_words.append(w)
            # Run one more pass if still fragmented
            cleaned.append(' '.join(new_words))
            
    res = ' '.join(cleaned)
    res = re.sub(r'\s+([\,\;\.\)])', r'\1', res)
    res = re.sub(r'([\(\/])\s+', r'\1', res)
    res = re.sub(r'\s+', ' ', res).strip()
    return res

print(clean_syllables_advanced("из ве щать, пуб ли ко вать, объ яв лять"))
print(clean_syllables_advanced("со гла сие, еди но ду шие"))
print(clean_syllables_advanced("объяв лять, объяв ление, диктор"))
