# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

def clean_syllables_loop(text):
    preps = {'в', 'на', 'за', 'под', 'над', 'из', 'от', 'до', 'по', 'о', 'об', 'обо', 'без', 'для', 'при', 'не', 'ни', 'то', 'как', 'так', 'же', 'ли', 'бы', 'он', 'она', 'они', 'мы', 'вы', 'я', 'ты', 'или', 'что', 'кто', 'где', 'чем', 'кем', 'его', 'ее', 'их', 'том', 'чем'}
    
    parts = re.split(r'([\,\;\.\:\(\)\/])', text)
    cleaned = []
    for p in parts:
        if p in [',', ';', '.', ':', '(', ')', '/']:
            cleaned.append(p)
        else:
            tokens = p.strip().split()
            if not tokens: continue
            # merge loop
            changed = True
            while changed:
                changed = False
                new_tokens = []
                i = 0
                while i < len(tokens):
                    if i + 1 < len(tokens):
                        w1, w2 = tokens[i], tokens[i+1]
                        if w1.lower() not in preps and w2.lower() not in preps and len(w1) <= 5 and len(w2) <= 5 and re.match(r'^[а-яёА-ЯЁ]+$', w1) and re.match(r'^[а-яёА-ЯЁ]+$', w2):
                            new_tokens.append(w1 + w2)
                            i += 2
                            changed = True
                            continue
                    new_tokens.append(tokens[i])
                    i += 1
                tokens = new_tokens
            cleaned.append(' '.join(tokens))
            
    res = ' '.join(cleaned)
    res = re.sub(r'\s+([\,\;\.\)])', r'\1', res)
    res = re.sub(r'([\(\/])\s+', r'\1', res)
    res = re.sub(r'\s+', ' ', res).strip()
    return res

print("t1:", clean_syllables_loop("со гла сие, еди но ду шие"))
print("t2:", clean_syllables_loop("из ве щать, пуб ли ко вать, объ яв лять"))
print("t3:", clean_syllables_loop("объяв лять, объяв ление, диктор"))
