# -*- coding: utf-8 -*-
"""
Scan for unextracted register abbreviations at the start of translation strings.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Comprehensive list of Russian dictionary register abbreviations
KNOWN_ABBRS = [
    'ав.', 'авт.', 'амер.', 'анат.', 'археол.', 'архит.', 'астр.', 'библ.', 'биол.', 'бот.',
    'бран.', 'бухг.', 'вет.', 'воен.', 'геод.', 'геогр.', 'геол.', 'геом.', 'гидр.', 'горн.',
    'грам.', 'груб.', 'дипл.', 'детск.', 'жарг.', 'жел.-дор.', 'ж.-д.', 'живоп.', 'зоол.',
    'ирон.', 'иск.', 'ист.', 'ихт.', 'карт.', 'кино', 'кино.', 'книжн.', 'ком.', 'коммерч.',
    'кулин.', 'лес.', 'лингв.', 'лит.', 'лог.', 'мат.', 'мед.', 'метал.', 'метео.', 'минер.',
    'миф.', 'мор.', 'муз.', 'науч.', 'опт.', 'охот.', 'парл.', 'пед.', 'полигр.', 'полит.',
    'посл.', 'поэт.', 'презр.', 'преим.', 'прос.', 'психол.', 'радио', 'радио.', 'разг.',
    'редк.', 'рел.', 'рит.', 'рыб.', 'с.-х.', 'спорт.', 'стат.', 'стихосл.', 'стр.', 'суд.',
    'схоласт.', 'тв', 'тлв.', 'театр.', 'текст.', 'тех.', 'тип.', 'топогр.', 'торг.', 'унив.',
    'уничиж.', 'уст.', 'фарм.', 'физ.', 'физиол.', 'филос.', 'фин.', 'фолькл.', 'фот.', 'фото.',
    'хим.', 'церк.', 'шахм.', 'школ.', 'шутл.', 'экон.', 'экспр.', 'эл.', 'электр.', 'этногр.',
    'юр.', 'сл.'
]

sorted_abbrs = sorted(KNOWN_ABBRS, key=lambda x: -len(x))
abbr_regex = re.compile(r'^\(?(?:' + '|'.join(re.escape(k) for k in sorted_abbrs) + r')(?:\s*,\s*(?:' + '|'.join(re.escape(k) for k in sorted_abbrs) + r'))*\)?\s*', re.I)

dirty_translations = []

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if abbr_regex.search(tr):
            dirty_translations.append((w, 'meaning', m['id'], tr))
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if abbr_regex.search(tr):
            dirty_translations.append((w, 'phrase', p['id'], tr))

print(f"Total translations with unextracted register abbreviations: {len(dirty_translations)}")
for it in dirty_translations:
    print(f"  Word '{it[0]}' [{it[1]} {it[2]}]: '{it[3]}'")
