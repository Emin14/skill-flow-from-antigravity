# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

def fix_russian_syllables(text):
    # Regex to repeatedly join 1-3 letter Russian syllables separated by spaces:
    # e.g. "из ве щать" -> "извещать", "объ яв лять" -> "объявлять"
    # Also handle punctuation: "со гла сие, еди но ду шие"
    # Split by punctuation/commas, then for each part join small tokens
    parts = re.split(r'([\,\;\.\:\(\)\/])', text)
    cleaned_parts = []
    for p in parts:
        if re.match(r'^[\,\;\.\:\(\)\/]$', p):
            cleaned_parts.append(p)
        else:
            tokens = p.strip().split()
            if not tokens:
                continue
            # If all or most tokens are <=3 chars, join them into one word
            # or iteratively join:
            curr_words = []
            buf = []
            for t in tokens:
                if len(t) <= 3 and re.match(r'^[а-яёА-ЯЁ]+$', t):
                    buf.append(t)
                else:
                    if buf:
                        curr_words.append(''.join(buf))
                        buf = []
                    curr_words.append(t)
            if buf:
                curr_words.append(''.join(buf))
            cleaned_parts.append(' '.join(curr_words))
            
    res = ' '.join(cleaned_parts)
    # clean multiple spaces and punctuation spaces
    res = re.sub(r'\s+([\,\;\.\)])', r'\1', res)
    res = re.sub(r'([\(\/])\s+', r'\1', res)
    res = re.sub(r'\s+', ' ', res).strip()
    return res

t1 = "со гла сие, еди но ду шие"
t2 = "из ве щать, пуб ли ко вать, объ яв лять"
t3 = "объяв лять, объяв ление, диктор"

print("t1 fixed:", fix_russian_syllables(t1))
print("t2 fixed:", fix_russian_syllables(t2))
print("t3 fixed:", fix_russian_syllables(t3))
