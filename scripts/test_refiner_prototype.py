# -*- coding: utf-8 -*-
"""
Prototype for deep dictionary refiner:
- Register extraction and clean translation
- POS correction
- Multi-idiom block splitting
- Syllable and word glue repair
- Orphan enumeration marker cleanup
- Broken idiom repair
"""

import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Dictionary of register abbreviations to standard Russian names
REGISTER_MAP = {
    'жив.': 'живопись',
    'лог.': 'логика',
    'карт.': 'карточный термин',
    'мор.': 'морской термин',
    'юр.': 'юриспруденция',
    'тех.': 'техника',
    'библ.': 'библеизм',
    'разг.': 'разговорное',
    'муз.': 'музыка',
    'авт.': 'автомобильное',
    'ав.': 'авиация',
    'горн.': 'горное дело',
    'с.-х.': 'сельское хозяйство',
    'с-х.': 'сельское хозяйство',
    'анат.': 'анатомия',
    'биол.': 'биология',
    'бот.': 'ботаника',
    'грам.': 'грамматика',
    'зоол.': 'зоология',
    'лингв.': 'лингвистика',
    'мат.': 'математика',
    'мед.': 'медицина',
    'мин.': 'минералогия',
    'полит.': 'политика',
    'психол.': 'психология',
    'рад.': 'радио',
    'спорт.': 'спорт',
    'строит.': 'строительство',
    'театр.': 'театр',
    'физ.': 'физика',
    'филос.': 'философия',
    'фин.': 'финансы',
    'фото.': 'фотография',
    'хим.': 'химия',
    'шахм.': 'шахматы',
    'экон.': 'экономика',
    'эл.': 'электротехника',
    'воен.': 'военное дело',
    'книжн.': 'книжное',
    'шутл.': 'шутливое',
    'ирон.': 'ироническое',
    'бран.': 'бранное',
    'редк.': 'редкое',
    'уст.': 'устаревшее',
    'амер.': 'американский английский',
    'австрал.': 'австралийский английский',
    'шотл.': 'шотландский английский',
    'комм.': 'коммерческое',
    'коммерч.': 'коммерческое',
    'архит.': 'архитектура',
    'жд.': 'железнодорожное',
    'ж.-д.': 'железнодорожное'
}

# Regex to match any register prefix at start of string or after open paren
REGISTER_PATTERN = rf'(?:^|[\(\[\s])({"|".join(re.escape(k) for k in REGISTER_MAP.keys())})'

def extract_registers_and_clean_tr(text: str, existing_registers: list = None) -> tuple[str, list]:
    registers = list(existing_registers) if existing_registers else []
    if not text:
        return '', registers
        
    cleaned = text
    
    # 1. Extract grammar forms at start: e.g. "(better; best)", "(bore; borne)", "(drew; drawn)", "(gave; given)"
    cleaned = re.sub(r'^\s*\((?:better;\s*best|worse;\s*worst|more;\s*most|[a-zA-Z\s,;]+)\)\s*', '', cleaned)
    
    # 2. Extract and strip register markers
    for abbrev, full_name in REGISTER_MAP.items():
        # Match at start e.g. "жив. грунт, фон" -> "грунт, фон"
        if cleaned.startswith(abbrev):
            cleaned = cleaned[len(abbrev):].strip()
            if full_name not in registers:
                registers.append(full_name)
        # Match inside string e.g. " (жив.) ", " [лог.] "
        pat = rf'\s*[\(\[]?{re.escape(abbrev)}[\)\]]?\s*'
        if re.search(pat, cleaned):
            cleaned = re.sub(pat, ' ', cleaned).strip()
            if full_name not in registers:
                registers.append(full_name)
                
    # 3. Clean orphan enumeration markers e.g. "^[а-яА-Я]\)\s*", "^[0-9]+\)\s*"
    cleaned = re.sub(r'^[а-яa-z0-9]\)\s*', '', cleaned)
    
    # 4. Clean word glues and typos
    cleaned = cleaned.replace('ис следовании', 'исследовании')
    cleaned = cleaned.replace('спроси тому подобное', 'спрос и тому подобное')
    cleaned = cleaned.replace('нив каком', 'ни в каком')
    cleaned = cleaned.replace('непо карману', 'не по карману')
    cleaned = cleaned.replace('таких-толет', 'таких-то лет')
    cleaned = cleaned.replace('вту или', 'в ту или')
    cleaned = cleaned.replace('отдела', 'от дела')
    cleaned = cleaned.replace('keies', 'keys')
    cleaned = re.sub(r'\s+', ' ', cleaned)
    
    # 5. Remove trailing cross references e.g. "[сравните также ...]"
    cleaned = re.sub(r'\[сравните\s+также[^\]]+\]', '', cleaned)
    
    return cleaned.strip(' ;,.-'), registers

# Test samples
test_samples = [
    ("(better; best) хороший; приятный", "other", []),
    ("а) по причине, на основании", "noun", []),
    ("быть широким (об ис следовании и тому подобное)", "noun", []),
    ("жив. грунт, фон", "noun", []),
    ("лог. выводить умозаключение (путём индукции)", "verb", []),
    ("повсюду, везде [сравните также high 1 ♦]; to play high карт. играть по большой; ходить с крупной карты; to run high a) подыматься, вздыматься (о море); б) возбуждаться; passions ran high страсти разгорелись", "adverb", [])
]

print("=== TESTING REFINER ON USER'S SAMPLES ===")
for text, pos, regs in test_samples:
    cl_text, cl_regs = extract_registers_and_clean_tr(text, regs)
    print(f"INPUT:  {text}")
    print(f"OUTPUT: text={repr(cl_text)}, registers={cl_regs}\n")
