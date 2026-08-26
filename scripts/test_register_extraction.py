# -*- coding: utf-8 -*-
"""
Test script for extracting registers from translations.
"""
import re

REGISTER_ABBR_MAP = {
    'юр': 'юриспруденция',
    'юрид': 'юриспруденция',
    'мед': 'медицина',
    'биол': 'биология',
    'мат': 'математика',
    'воен': 'военный термин',
    'муз': 'музыка',
    'тех': 'техника',
    'мор': 'морской термин',
    'спорт': 'спорт',
    'театр': 'театр',
    'грам': 'грамматика',
    'лингв': 'лингвистика',
    'анат': 'анатомия',
    'бот': 'ботаника',
    'зоол': 'зоология',
    'геогр': 'география',
    'геол': 'геология',
    'астр': 'астрономия',
    'хим': 'химия',
    'физ': 'физика',
    'филос': 'философия',
    'эл': 'электротехника',
    'ком': 'коммерция',
    'фин': 'финансы',
    'полит': 'политика',
    'рел': 'религия',
    'с.-х': 'сельское хозяйство',
    'разг': 'разговорное',
    'шутл': 'шутливое',
    'ирон': 'ироническое',
    'бран': 'бранное',
    'груб': 'грубое',
    'поэт': 'поэтическое',
    'книжн': 'книжное',
    'уст': 'устаревшее',
    'редк': 'редкое',
    'амер': 'американизм',
    'австрал': 'австралийское',
    'шотл': 'шотландское',
    'вчт': 'информатика',
    'информ': 'информатика',
    'кино': 'кинематограф',
    'тлв': 'телевидение',
    'иск': 'искусство',
    'авиа': 'авиация'
}

def extract_leading_registers(translation, existing_registers=None):
    regs = list(existing_registers) if existing_registers else []
    t = translation.strip()
    
    pattern = r'^(?:(?:(?:' + '|'.join(re.escape(k) for k in REGISTER_ABBR_MAP.keys()) + r')(?:\.|\b))\s*[,;\.]?\s*)+'
    
    m = re.match(pattern, t, flags=re.IGNORECASE)
    if m:
        matched_text = m.group(0)
        found_abbrs = re.findall(r'\b(?:' + '|'.join(re.escape(k) for k in REGISTER_ABBR_MAP.keys()) + r')\b', matched_text, flags=re.IGNORECASE)
        for a in found_abbrs:
            full_name = REGISTER_ABBR_MAP.get(a.lower())
            if full_name and full_name not in regs:
                regs.append(full_name)
        t = t[len(matched_text):].strip()
        t = re.sub(r'^\s*[,;:]+\s*', '', t)
        
    return t, (regs if regs else None)

# Tests
test_cases = [
    ("мед. преждевременное прекращение беременности, аборт, выкидыш", None),
    ("хим., физ. активировать; делать радиоактивным", None),
    ("кино, тлв. операторский кран, журавль", None),
    ("разг. красть, прикарманивать", None),
    ("юр. бенефициар(ий)", None),
    ("юр. неподсудность", None),
    ("обычный текст перевода", None)
]

for tc, ex_r in test_cases:
    clean_t, r = extract_leading_registers(tc, ex_r)
    print(f"Original: {tc}")
    print(f"  Clean:    {clean_t}")
    print(f"  Register: {r}\n")
