# -*- coding: utf-8 -*-
import re

def fix_russian_syllables(text):
    # Muller 300k has spaces between almost every syllable: 'со гла сие, еди но ду шие'
    # Shkolnik has broken words at line breaks: 'объяв лять'
    # If text is like 'со гла сие', where multiple 1-3 letter chunks are space-separated:
    # Let us merge consecutive 1-3 letter lowercase russian words
    words = text.split()
    merged = []
    buffer = []
    for w in words:
        # strip punctuation
        w_clean = re.sub(r'[^\w\-]', '', w)
        if re.match(r'^[а-яё]{1,3}$', w_clean, re.I):
            buffer.append(w)
        else:
            if buffer:
                merged.append(''.join(buffer))
                buffer = []
            merged.append(w)
    if buffer:
        merged.append(''.join(buffer))
    res = ' '.join(merged)
    # also fix single space between russian letters if short:
    res = re.sub(r'(?<=[а-яё])\s+(?=[а-яё]{1,3}\b)', '', res)
    return res

t1 = "со гла сие, еди но ду шие"
t2 = "из ве щать, пуб ли ко вать, объ яв лять"
t3 = "объяв лять, объяв ление, диктор"

print("t1 fixed:", fix_russian_syllables(t1))
print("t2 fixed:", fix_russian_syllables(t2))
print("t3 fixed:", fix_russian_syllables(t3))
