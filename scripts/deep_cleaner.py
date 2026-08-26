# -*- coding: utf-8 -*-
"""
Perfected deep cleaner function for Russian dictionary text:
- Expands Russian abbreviations:
  - '-л' -> '-либо' (кого-л -> кого-либо, что-л -> что-либо, каком-л -> каком-либо, etc.)
  - '(обыкн predic)' -> '(обыкн. в роли сказуемого)', 'predic' -> '(в роли сказуемого)', 'attr' -> '(в роли определения)'
- Cleans Russian OCR hyphenations.
- Cleans fused words.
- Balances parentheses.
- Cleans redundant and trailing punctuation (;;, ,;, trailing ;, trailing =, etc.).
"""
import re
import unicodedata
from ocr_hyphen_merger import clean_ocr_hyphenated_words

FUSED_WORDS_MAP = {
    'радиоили': 'радио- или',
    'телеили': 'теле- или',
    'киноили': 'кино- или',
    'фотоили': 'фото- или',
    'видеоили': 'видео- или'
}

REGISTER_DOT_MAP = {
    r'\bюр\b(?!\.)': 'юр.',
    r'\bмор\b(?!\.)': 'мор.',
    r'\bтех\b(?!\.)': 'тех.',
    r'\bмат\b(?!\.)': 'мат.',
    r'\bмед\b(?!\.)': 'мед.',
    r'\bбиол\b(?!\.)': 'биол.',
    r'\bвоен\b(?!\.)': 'воен.',
    r'\bлингв\b(?!\.)': 'лингв.',
    r'\bграм\b(?!\.)': 'грам.',
    r'\bфилос\b(?!\.)': 'филос.',
    r'\bмуз\b(?!\.)': 'муз.',
    r'\bспорт\b(?!\.)': 'спорт.',
    r'\bтеатр\b(?!\.)': 'театр.',
    r'\bзоол\b(?!\.)': 'зоол.',
    r'\bбот\b(?!\.)': 'бот.',
    r'\bгеогр\b(?!\.)': 'геогр.',
    r'\bгеол\b(?!\.)': 'геол.',
    r'\bанат\b(?!\.)': 'анат.',
    r'\bархит\b(?!\.)': 'архит.',
    r'\bастр\b(?!\.)': 'астр.',
    r'\bхим\b(?!\.)': 'хим.',
    r'\bфиз\b(?!\.)': 'физ.',
    r'\bэл\b(?!\.)': 'эл.',
    r'\bком\b(?!\.)': 'ком.',
    r'\bфин\b(?!\.)': 'фин.',
    r'\bполит\b(?!\.)': 'полит.',
    r'\bрел\b(?!\.)': 'рел.',
    r'\bс-х\b(?!\.)': 'с.-х.',
    r'\bразг\b(?!\.)': 'разг.',
    r'\bшутл\b(?!\.)': 'шутл.',
    r'\bирон\b(?!\.)': 'ирон.',
    r'\bбран\b(?!\.)': 'бран.',
    r'\bгруб\b(?!\.)': 'груб.',
    r'\bпоэт\b(?!\.)': 'поэт.',
    r'\bкнижн\b(?!\.)': 'книжн.',
    r'\bуст\b(?!\.)': 'уст.',
    r'\bредк\b(?!\.)': 'редк.',
    r'\bамер\b(?!\.)': 'амер.',
    r'\bавстрал\b(?!\.)': 'австрал.',
    r'\bшотл\b(?!\.)': 'шотл.'
}

# Expand Russian '-л' abbreviations to '-либо'
ABBR_LIBO_MAP = {
    r'\bкого-л\.?\b': 'кого-либо',
    r'\bкому-л\.?\b': 'кому-либо',
    r'\bкем-л\.?\b': 'кем-либо',
    r'\bком-л\.?\b': 'ком-либо',
    r'\bчто-л\.?\b': 'что-либо',
    r'\bчему-л\.?\b': 'чему-либо',
    r'\bчем-л\.?\b': 'чем-либо',
    r'\bчём-л\.?\b': 'чём-либо',
    r'\bкакой-л\.?\b': 'какой-либо',
    r'\bкакая-л\.?\b': 'какая-либо',
    r'\bкакое-л\.?\b': 'какое-либо',
    r'\bкакие-л\.?\b': 'какие-либо',
    r'\bкакого-л\.?\b': 'какого-либо',
    r'\bкакому-л\.?\b': 'какому-либо',
    r'\bкаким-л\.?\b': 'каким-либо',
    r'\bкаком-л\.?\b': 'каком-либо',
    r'\bкаких-л\.?\b': 'каких-либо',
    r'\bкакими-л\.?\b': 'какими-либо',
    r'\bкакую-л\.?\b': 'какую-либо',
    r'\bчьем-л\.?\b': 'чьём-либо',
    r'\bчьём-л\.?\b': 'чьём-либо',
    r'\bчьей-л\.?\b': 'чьей-либо',
    r'\bчьих-л\.?\b': 'чьих-либо',
    r'\bчья-л\.?\b': 'чья-либо',
    r'\bчьё-л\.?\b': 'чьё-либо',
    r'\bчье-л\.?\b': 'чьё-либо',
    r'\bчьи-л\.?\b': 'чьи-либо',
    r'\bгде-л\.?\b': 'где-либо',
    r'\bкуда-л\.?\b': 'куда-либо',
    r'\bкогда-л\.?\b': 'когда-либо',
    r'\bкак-л\.?\b': 'как-либо',
    r'\bоткуда-л\.?\b': 'откуда-либо',
    r'\bсколько-л\.?\b': 'сколько-либо'
}

BRACKET_PREFIXES = {
    'при', 'по', 'за', 'на', 'вы', 'от', 'до', 'из', 'ис', 'с', 'со', 
    'у', 'про', 'пере', 'пред', 'пре', 'раз', 'рас', 'вос', 'воз', 
    'под', 'над', 'об', 'обо', 'в', 'во', 'не', 'недо', 'сверх', 
    'радио', 'перво', 'благо', 'веро', 'кино', 'фото', 'теле'
}

def clean_bracketed_prefixes(text):
    if not text: return ""
    for pref in BRACKET_PREFIXES:
        pattern = re.compile(rf'\({pref}\)\s+([а-яёА-ЯЁ]+)', re.IGNORECASE)
        def repl(match):
            w = match.group(1).lower()
            if pref.lower() in ('в', 'на', 'из', 'с', 'по', 'до', 'у', 'от', 'за', 'о', 'об') and w in (
                'этот', 'этом', 'эту', 'этой', 'другой', 'другом', 'другую', 'другое', 
                'какой', 'каком', 'какую', 'какое', 'свой', 'своём', 'свою', 'своё', 
                'праву', 'себе', 'себя', 'собой', 'нём', 'ней', 'них', 'мне', 'меня',
                'год', 'время', 'некоторое'
            ):
                return match.group(0)
            return f"({match.group(0).split('(')[1].split(')')[0]}){match.group(1)}"
        text = pattern.sub(repl, text)
    return text

def clean_russian_text_deep(text):
    if not text: return ""
    
    # 1. OCR broken hyphen merger
    text = clean_ocr_hyphenated_words(text)
    
    # 1.1 Bracketed prefixes
    text = clean_bracketed_prefixes(text)
        
    # 2. Fused words
    for fused, fixed in FUSED_WORDS_MAP.items():
        text = text.replace(fused, fixed)
    text = text.replace('по радио- или телевизионной', 'по радио или телевизионной')
    
    # 3. Register dots
    for pat, rep in REGISTER_DOT_MAP.items():
        text = re.sub(pat, rep, text)
        
    # 4. Expand '-л' to '-либо'
    for pat, rep in ABBR_LIBO_MAP.items():
        text = re.sub(pat, rep, text)
        
    # 5. Grammar qualifiers (predic, attr)
    text = re.sub(r'\(?\s*обыкн\.?\s*predic\.?\s*\)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*обыкн\.?\s*attr\.?\s*\)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*predic\.?\s*\)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*attr\.?\s*\)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^predic\s+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^attr\s+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*\(?в роли сказуемого\)?\s*\)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*\(?в роли определения\)?\s*\)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*\(?обыкн\. в роли сказуемого\)?\s*\)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*\(?обыкн\. в роли определения\)?\s*\)?\s*', '', text, flags=re.IGNORECASE)
        
    # 6. Normalize grammar patterns
    text = text.replace('глаголсвязка', 'глагол-связка')
    text = re.sub(r'^(как )?глагол-связка в составном именном сказуемом\s+', '(как глагол-связка в составном именном сказуемом) ', text)
    text = re.sub(r'\(?\s*преим\.?\s*pass\s*\)?', '(преим. в страд. залоге)', text, flags=re.IGNORECASE)
    text = re.sub(r'\(?\s*обыкн\.?\s*pass\s*\)?', '(обыкн. в страд. залоге)', text, flags=re.IGNORECASE)
    text = re.sub(r'\bpass\b', 'в страд. залоге', text, flags=re.IGNORECASE)
    text = text.replace('(преим в страд. залоге)', '(преим. в страд. залоге)')
    text = text.replace('(обыкн в страд. залоге)', '(обыкн. в страд. залоге)')
    text = re.sub(r'\(pl\s+без\s+измен\)', '(во мн.ч. без изменений)', text, flags=re.IGNORECASE)
    text = re.sub(r'\(pl\s+тж\s+без\s+измен\)', '(во мн.ч. также без изменений)', text, flags=re.IGNORECASE)
    text = re.sub(r'\(употр\s+как\s+pl\)', '(употр. как во мн.ч.)', text, flags=re.IGNORECASE)
    text = re.sub(r'\bчаще\s+pl\b', 'чаще во мн.ч.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bpl\b', 'во мн.ч.', text, flags=re.IGNORECASE)

    # 6.1 Degree comparison reformatting
    def _fix_comp_superl(m):
        kind = m.group(1).lower()
        base = m.group(2).strip()
        meaning = m.group(3).strip()
        base_clean = re.sub(r'\s+[IVXLCDM]+', '', base).strip()
        kind_ru = "превосх. ст." if "superl" in kind else "сравн. ст."
        return f"{meaning} ({kind_ru} от {base_clean})"

    text = re.sub(r'^(superl|compar)\s+от\s+([^()]+)\s*\(([^()]+)\)$', _fix_comp_superl, text, flags=re.IGNORECASE)
    text = re.sub(r'\bsuperl\b', 'превосх. ст.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcompar\b', 'сравн. ст.', text, flags=re.IGNORECASE)

    # 6.2 Abbreviation dots
    text = re.sub(r'\bи\s+т\s+д\b', 'и т.д.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bи\s+т\s+п\b', 'и т.п.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bи\s+др\b', 'и др.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bи\s+пр\b', 'и пр.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bт\s+е\b', 'т.е.', text, flags=re.IGNORECASE)
    text = re.sub(r'\bт\s+к\b', 'т.к.', text, flags=re.IGNORECASE)

    # 6.3 Special fixed phrases
    text = text.replace('в сочетаниях there is, there are и т д: имеется, есть', 'имеется, есть (в оборотах there is, there are и т.д.)')
    text = text.replace('в сочетаниях there is, there are и т.д.: имеется, есть', 'имеется, есть (в оборотах there is, there are и т.д.)')

    # 7. Clean any nested/double parenthesis artifacts
    text = re.sub(r'\(во\(во\s+мн\.ч\.\)\s*', '(во мн.ч. ', text)
    text = re.sub(r'\(в\(в\s+ед\.ч\.\)\s*', '(в ед.ч. ', text)
    text = re.sub(r'\(во\s+мн\.ч\.\)\s*([a-zA-Z]+)\)', r'(во мн.ч. \1)', text)
    text = re.sub(r'\(в\s+ед\.ч\.\)\s*([a-zA-Z]+)\)', r'(в ед.ч. \1)', text)

    text = text.replace('(во мн.ч.) без измен)', '(во мн.ч. без измен.)')
    text = text.replace('(во мн.ч.) также без измен)', '(во мн.ч. также без измен.)')
    text = text.replace('(во мн.ч.) (the)', '(the, во мн.ч.)')
    
    # 8. Fix unmatched leading or trailing parentheses
    text = re.sub(r'^\)\s*', '', text)
    text = re.sub(r'\(\s*часто\s*$', '(часто во мн.ч.)', text)
    text = re.sub(r'\(\s*тк\s*$', '(только в ед.ч.)', text)
    text = re.sub(r'\(\s*обыкн\s*$', '(обыкн. во мн.ч.)', text)
    
    if text.count('(') > text.count(')'):
        diff = text.count('(') - text.count(')')
        text = text + (')' * diff)
    elif text.count(')') > text.count('('):
        diff = text.count(')') - text.count('(')
        text = ('(' * diff) + text

    # 9. Collapse any double parentheses like '((...))'
    text = re.sub(r'\(\s*\(', '(', text)
    text = re.sub(r'\)\s*\)', ')', text)
    text = re.sub(r'\(\s*\)', '', text)
    
    # 10. Clean punctuation and trailing leftovers (;;, ,;, ;, 4 =, etc.)
    text = text.replace('в (составе, числе), с', 'в составе, в числе; с')
    text = re.sub(r';+', ';', text)
    text = re.sub(r',\s*;', ';', text)
    text = re.sub(r';\s*,', ';', text)
    text = re.sub(r',\s*,', ',', text)
    
    text = re.sub(r'\s+\d+\s*=$', '', text)
    text = re.sub(r'\s*=\s*$', '', text)
    
    text = re.sub(r'\)\s*([а-яёА-ЯЁa-zA-Z])', r') \1', text)
    text = re.sub(r'\s+([,;:?.!)])', r'\1', text)
    text = re.sub(r'([(])\s+', r'\1', text)
    text = re.sub(r'^\s*[,;:]+\s*', '', text)
    text = re.sub(r'[,;:]+\s*$', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # 11. Final pass for bracketed prefixes
    text = clean_bracketed_prefixes(text)
    
    return unicodedata.normalize('NFC', text).strip()

def clean_russian_example_deep(text):
    if not text: return ""
    text = clean_russian_text_deep(text)
    # Strip leading register labels from examples/phrases
    reg_pat = r'^(?:(?:разг|библ|ист|воен|мед|юр|мат|тех|мор|муз|книжн|уст|поэт|шутл|ирон|жарг|сленг|театр|спорт|амер|австрал|шотл|вчт|информ|кино|тлв|фото|иск|авиа|рел|церк)\.?\s*[,;:]?\s*)+'
    text = re.sub(reg_pat, '', text, flags=re.IGNORECASE).strip()
    return unicodedata.normalize('NFC', text).strip()
