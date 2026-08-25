# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

def clean_syllables_capture(text):
    text = re.sub(r'([а-яёА-ЯЁ]{2,4})\s+([а-яё]{2,4}\b)', r'\1\2', text)
    text = re.sub(r'([а-яёА-ЯЁ]{2,4})\s+([а-яё]{2,4}\b)', r'\1\2', text)
    return text

print(clean_syllables_capture("со гла сие, еди но ду шие"))
print(clean_syllables_capture("из ве щать, пуб ли ко вать, объ яв лять"))
print(clean_syllables_capture("объяв лять, объяв ление, диктор"))
