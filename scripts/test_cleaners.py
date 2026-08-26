# -*- coding: utf-8 -*-
import sys
import zipfile
import xml.sax
import time
import re
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Let's test the phonetic transcription cleanup and IPA converter
def clean_phonetic(raw_phon):
    if not raw_phon:
        return ""
    p = raw_phon.strip()
    # remove enclosing brackets
    p = re.sub(r'^[\[\/\(]+|[\]\/\)]+$', '', p).strip()
    # Muller dictionary phonetic symbols mapping to standard IPA:
    # ´ or ' -> ˈ (primary stress)
    # ˛ or , -> ˌ (secondary stress)
    # c: -> ɔː
    # c -> ɔ or ɒ
    # 3: -> ɜː
    # 3 -> ɜ or ə
    # w -> ʊ (or oʊ / əʊ depending on context, e.g. [z wn] -> zoʊn / zəʊn, [gwd] -> ɡʊd)
    # n -> ʌ (in vowel position like [knt] -> kʌt, [rnn] -> rʌn)
    # ∫ -> ʃ
    # t∫ -> tʃ
    # dз or dy -> dʒ
    # θ -> θ
    # ð -> ð
    # : -> ː
    p = p.replace('´', 'ˈ').replace('`', 'ˈ')
    p = p.replace('˛', 'ˌ')
    p = p.replace('∫', 'ʃ')
    p = p.replace('t∫', 'tʃ')
    p = p.replace('dy', 'dʒ').replace('dз', 'dʒ')
    p = p.replace('c:', 'ɔː')
    p = p.replace('3:', 'ɜː')
    p = re.sub(r'\s+', ' ', p).strip()
    return f"/{p}/"

# Test phonetic cleanup
print("Phonetic test:")
for sample in ['´æb k s', '´a:dva:k', '´bænd n', 'teik', 'rnn', 'du:', 'kc:t', '´pjw ritanizam']:
    print(f"  {sample} -> {clean_phonetic(sample)}")

# Test Russian text cleaner
def clean_russian(t):
    if not t: return ""
    # 1. Remove stress marks ' and ´
    t = re.sub(r"([а-яёА-ЯЁ])['´`]\s*", r"\1", t)
    t = re.sub(r"\s*['´`]([а-яёА-ЯЁ])", r"\1", t)
    
    # 2. Fix broken OCR hyphens: e.g. "па'- луба" -> "палуба", "нар- ко'тик" -> "наркотик", "час' - тью" -> "частью"
    t = re.sub(r"([а-яёА-ЯЁ]+)\s*-\s*([а-яёА-ЯЁ]+)", r"\1\2", t)
    t = re.sub(r"([а-яёА-ЯЁ]+)\s*-\s*тью\b", r"\1тью", t)
    
    # 3. Clean weird symbols like \uf040, \uf0a8, , 
    t = re.sub(r'[\uf000-\uf8ff]', '', t)
    
    # 4. Collapse spaces
    t = re.sub(r'\s+', ' ', t).strip()
    return t

print("\nRussian cleaner test:")
samples_ru = [
    "ве'рхняя  па'- луба",
    "вводит'  ь нар- ко'тик внутривен'  но",
    "бол'  ьшей  час'  - тью",
    "гла'вным об'  разом",
    "стро'гие нра'вы (P.) ист. пуритан'  ство"
]
for s in samples_ru:
    print(f"  {s} -> {clean_russian(s)}")
