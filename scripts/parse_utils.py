# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# 1. Subject / Thematic Register mappings
REGISTER_MAP = {
    'ав': 'авиация',
    'авт': 'автомобильное дело',
    'амер': 'американизм',
    'анат': 'анатомия',
    'археол': 'археология',
    'архит': 'архитектура',
    'астр': 'астрономия',
    'банк': 'банковское дело',
    'библ': 'библеизм',
    'биол': 'биология',
    'бот': 'ботаника',
    'бухг': 'бухгалтерия',
    'воен': 'военное дело',
    'возвыш': 'возвышенное',
    'вчт': 'компьютерный термин',
    'геогр': 'география',
    'геод': 'геодезия',
    'геол': 'геология',
    'геом': 'геометрия',
    'геральд': 'геральдика',
    'грам': 'грамматика',
    'детск': 'детская речь',
    'дип': 'дипломатия',
    'дор': 'дорожное дело',
    'ж-д': 'железнодорожное дело',
    'жив': 'живопись',
    'зоол': 'зоология',
    'ирон': 'ироническое',
    'иск': 'искусство',
    'ист': 'история',
    'канад': 'употребительно в Канаде',
    'канц': 'канцелярское',
    'карт': 'карточный термин',
    'кино': 'кинематография',
    'книжн': 'книжное',
    'ком': 'коммерция',
    'косм': 'космонавтика',
    'кул': 'кулинария',
    'лингв': 'лингвистика',
    'лит': 'литература',
    'лог': 'логика',
    'мат': 'математика',
    'мед': 'медицина',
    'метал': 'металлургия',
    'метео': 'метеорология',
    'мех': 'механика',
    'мин': 'минералогия',
    'миф': 'мифология',
    'мор': 'морской термин',
    'муз': 'музыка',
    'неодобр': 'неодобрительное',
    'опт': 'оптика',
    'охот': 'охота',
    'парл': 'парламентское',
    'перен': 'переносное значение',
    'полигр': 'полиграфия',
    'полит': 'политика',
    'поэт': 'поэтическое',
    'презр': 'презрительное',
    'пренебр': 'пренебрежительное',
    'психол': 'психология',
    'радио': 'радио',
    'разг': 'разговорное',
    'рел': 'религия',
    'собир': 'собирательное',
    'спорт': 'спорт',
    'стат': 'статистика',
    'стр': 'строительное дело',
    'студ': 'студенческое выражение',
    'с-х': 'сельское хозяйство',
    'театр': 'театр',
    'текст': 'текстильное дело',
    'тех': 'техника',
    'тлв': 'телевидение',
    'топ': 'топография',
    'унив': 'университетское',
    'уст': 'устаревшее',
    'фарм': 'фармакология',
    'физ': 'физика',
    'физиол': 'физиология',
    'филос': 'философия',
    'фин': 'финансы',
    'хим': 'химия',
    'церк': 'церковное',
    'шахм': 'шахматы',
    'эк': 'экономика',
    'экол': 'экология',
    'эл': 'электротехника',
    'юр': 'юридическое'
}

# 2. POS map
POS_MAP = {
    'n': 'noun',
    'v': 'verb',
    'adj': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'cj': 'conjunction',
    'num': 'numeral',
    'pron': 'pronoun',
    'int': 'interjection',
    'part': 'particle',
    'art': 'article',
    'predic': 'adjective',
    'attr': 'adjective'
}

def normalize_raw_text(t):
    if not t: return ""
    # Normalize ligatures and font quirks
    t = t.replace('ﬁ ', 'fi').replace('ﬂ ', 'fl').replace('ﬃ ', 'ffi').replace('ﬀ ', 'ff').replace('ﬄ ', 'ffl')
    t = t.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('ﬃ', 'ffi').replace('ﬀ', 'ff').replace('ﬄ', 'ffl')
    t = t.replace('\ufb01 ', 'fi').replace('\ufb02 ', 'fl').replace('\ufb03 ', 'ffi').replace('\ufb00 ', 'ff').replace('\ufb04 ', 'ffl')
    t = t.replace('\ufb01', 'fi').replace('\ufb02', 'fl').replace('\ufb03', 'ffi').replace('\ufb00', 'ff').replace('\ufb04', 'ffl')
    t = unicodedata.normalize('NFKD', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    t = t.replace('Ј', '£')
    return t

def clean_russian_text(text):
    if not text: return ""
    # Fix hyphenated words across lines
    text = re.sub(r'([а-яёА-ЯЁa-zA-Z])-\s+([а-яёА-ЯЁa-zA-Z])', r'\1\2', text)
    
    # Standardize abbreviations
    text = re.sub(r'\bпреим\.\s*pl\b', '(преим. во мн.ч.)', text)
    text = re.sub(r'\bпреим\s+pl\b', '(преим. во мн.ч.)', text)
    text = re.sub(r'\bобыкн\.\s*pl\b', '(обыкн. во мн.ч.)', text)
    text = re.sub(r'\bобыкн\s+pl\b', '(обыкн. во мн.ч.)', text)
    text = re.sub(r'\bпреим\.\s*во\s+мн\.\s*ч\.\b', 'преим. во мн.ч.', text)
    text = re.sub(r'\bпреим\s+во\s+мн\s+ч\b', 'преим. во мн.ч.', text)
    text = re.sub(r'\bобыкн\s+во\s+мн\s+ч\b', 'обыкн. во мн.ч.', text)
    text = re.sub(r'\bмн\s+ч\b', 'во мн.ч.', text)
    text = re.sub(r'\bед\s+ч\b', 'в ед.ч.', text)
    text = re.sub(r'\bобыкн\s+pass\b', '(обыкн. в страд. залоге)', text)
    text = re.sub(r'\bпреим\s+pass\b', '(преим. в страд. залоге)', text)
    text = re.sub(r'\bpass\b', 'страд. залог', text)
    text = re.sub(r'\bpredic\b', 'в знач. сказуемого', text)
    text = re.sub(r'\battr\b', 'в роли определения', text)
    text = re.sub(r'\bsmb\b', 'кого-л.', text)
    text = re.sub(r'\bsmth\b', 'что-л.', text)
    text = re.sub(r'\bsmb’s\b', 'чей-л.', text)
    text = re.sub(r'\bsmb\'s\b', 'чей-л.', text)
    text = re.sub(r'\bтж\b', 'также', text)
    text = re.sub(r'\bпреим\b', 'преимущественно', text)
    text = re.sub(r'\bособ\b', 'особенно', text)
    text = re.sub(r'\bв\s+т\s+ч\b', 'в т.ч.', text)
    text = re.sub(r'\bи\s+т\s+п\b', 'и т.п.', text)
    text = re.sub(r'\bи\s+др\b', 'и др.', text)
    text = re.sub(r'\bи\s+пр\b', 'и пр.', text)
    text = re.sub(r'\bт\s+к\b', 'т.к.', text)
    text = re.sub(r'\bт\s+е\b', 'т.е.', text)

    # Clean double parens or broken parens
    text = re.sub(r'\(\s*\)', '', text)
    text = re.sub(r'\(\s*\(', '(', text)
    text = re.sub(r'\)\s*\)', ')', text)
    
    # Fix punctuation spacing
    text = re.sub(r'\s+([,;:?.!)])', r'\1', text)
    text = re.sub(r'([(])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Strip leading/trailing semicolons or commas
    text = re.sub(r'^[,;:\s]+', '', text)
    text = re.sub(r'[,;:\s]+$', '', text)
    return text.strip()

def clean_english_example(text):
    if not text: return ""
    text = re.sub(r'([a-zA-Z])-\s+([a-zA-Z])', r'\1\2', text)
    text = re.sub(r'\s+([,;:?.!\'\"])', r'\1', text)
    text = re.sub(r'([\'\"])\s+', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'^[,;:\s]+', '', text)
    text = re.sub(r'[,;:\s]+$', '', text)
    return text.strip()

print("Parser utilities loaded.")
