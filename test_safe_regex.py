# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

def clean_syllables_safe(text):
    # Join 2-4 letter Russian syllables separated by space
    # e.g. "со гла сие" -> "согласие", "объ яв лять" -> "объявлять"
    # We can do 2 passes of regex:
    text = re.sub(r'(?<=[а-яёА-ЯЁ]{2,4})\s+(?=[а-яё]{2,4}\b)', '', text)
    text = re.sub(r'(?<=[а-яёА-ЯЁ]{2,4})\s+(?=[а-яё]{2,4}\b)', '', text)
    return text

print(clean_syllables_safe("со гла сие, еди но ду шие"))
print(clean_syllables_safe("из ве щать, пуб ли ко вать, объ яв лять"))
print(clean_syllables_safe("объяв лять, объяв ление, диктор"))
