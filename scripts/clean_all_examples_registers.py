# -*- coding: utf-8 -*-
"""
Clean all example registers and extract them into examples[].register.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

REGISTER_MAP = {
    'ав.': 'авиация',
    'авт.': 'автомобильный термин',
    'амер.': 'американизм',
    'анат.': 'анатомия',
    'археол.': 'археология',
    'архит.': 'архитектура',
    'астр.': 'астрономия',
    'библ.': 'библеизм',
    'биол.': 'биология',
    'бот.': 'ботаника',
    'бран.': 'бранное',
    'бухг.': 'бухгалтерия',
    'вет.': 'ветеринария',
    'воен.': 'военное',
    'геод.': 'геодезия',
    'геогр.': 'география',
    'геол.': 'геология',
    'геом.': 'геометрия',
    'гидр.': 'гидротехника',
    'горн.': 'горное дело',
    'грам.': 'грамматика',
    'груб.': 'грубое',
    'дипл.': 'дипломатия',
    'детск.': 'детская речь',
    'жарг.': 'жаргон',
    'жел.-дор.': 'железнодорожный термин',
    'ж.-д.': 'железнодорожный термин',
    'живоп.': 'живопись',
    'зоол.': 'зоология',
    'ирон.': 'ироническое',
    'иск.': 'искусство',
    'ист.': 'историческое',
    'ихт.': 'ихтиология',
    'карт.': 'карточный термин',
    'кино': 'кинематография',
    'кино.': 'кинематография',
    'книжн.': 'книжное',
    'ком.': 'коммерческое',
    'коммерч.': 'коммерческое',
    'кулин.': 'кулинария',
    'лес.': 'лесоводство',
    'лингв.': 'лингвистика',
    'лит.': 'литературоведение',
    'лог.': 'логика',
    'мат.': 'математика',
    'мед.': 'медицинское',
    'метал.': 'металлургия',
    'метео.': 'метеорология',
    'минер.': 'минералогия',
    'миф.': 'мифология',
    'мор.': 'морской термин',
    'муз.': 'музыка',
    'науч.': 'научное',
    'опт.': 'оптика',
    'охот.': 'охота',
    'парл.': 'парламентский термин',
    'пед.': 'педагогика',
    'полигр.': 'полиграфия',
    'полит.': 'политика',
    'посл.': 'пословица',
    'поэт.': 'поэтическое',
    'презр.': 'презрительное',
    'преим.': 'преимущественно',
    'психол.': 'психология',
    'радио': 'радио',
    'радио.': 'радио',
    'разг.': 'разговорное',
    'редк.': 'редкое',
    'рел.': 'религиозное',
    'рит.': 'риторика',
    'рыб.': 'рыболовство',
    'с.-х.': 'сельскохозяйственное',
    'спорт.': 'спортивное',
    'стат.': 'статистика',
    'стр.': 'строительное',
    'суд.': 'судостроение',
    'схоласт.': 'схоластика',
    'т.-е.': 'то есть',
    'тв': 'телевидение',
    'тлв.': 'телевидение',
    'театр.': 'театр',
    'текст.': 'текстильное',
    'тех.': 'техническое',
    'тип.': 'типографское',
    'топогр.': 'топография',
    'торг.': 'торговля',
    'унив.': 'университетское',
    'уничиж.': 'уничижительное',
    'уст.': 'устаревшее',
    'фарм.': 'фармацевтическое',
    'физ.': 'физика',
    'физиол.': 'физиология',
    'филос.': 'философия',
    'фин.': 'финансовое',
    'фолькл.': 'фольклор',
    'фот.': 'фотография',
    'фото.': 'фотография',
    'хим.': 'химия',
    'церк.': 'церковное',
    'шахм.': 'шахматы',
    'школ.': 'школьное',
    'шутл.': 'шутливое',
    'экон.': 'экономика',
    'экспр.': 'экспрессивное',
    'эл.': 'электротехника',
    'электр.': 'электротехника',
    'этногр.': 'этнография',
    'юр.': 'юридическое',
    'сл.': 'сленг'
}

# Sort keys by length descending to match longest abbreviations first (e.g. 'ж.-д.' before 'ж.')
sorted_keys = sorted(REGISTER_MAP.keys(), key=lambda x: -len(x))
abbr_regex = re.compile(r'^\(?(?:' + '|'.join(re.escape(k) for k in sorted_keys) + r')(?:\s*,\s*(?:' + '|'.join(re.escape(k) for k in sorted_keys) + r'))*\)?\s*', re.I)

def clean_example_entry(ex):
    ru = ex.get('ru', '').strip()
    regs = list(ex.get('register', []))
    
    # Check if ru starts with one or more register abbreviations
    while True:
        m = abbr_regex.match(ru)
        if not m:
            break
        matched_str = m.group(0).strip('(),:; \t\n')
        # Split matched_str by comma/space to get individual abbreviations
        tokens = [t.strip() for t in re.split(r'[,;\s]+', matched_str) if t.strip()]
        for tok in tokens:
            tok_lower = tok.lower()
            if not tok_lower.endswith('.') and tok_lower + '.' in REGISTER_MAP:
                tok_lower += '.'
            if tok_lower in REGISTER_MAP:
                reg_name = REGISTER_MAP[tok_lower]
                if reg_name not in regs:
                    regs.append(reg_name)
        # Strip matched prefix from ru
        ru = ru[m.end():].strip()
        ru = re.sub(r'^[,\-–—;:\s]+', '', ru).strip()
        
    ex['ru'] = ru
    if regs:
        ex['register'] = regs
    elif 'register' in ex and not ex['register']:
        del ex['register']
    return ex

count_cleaned = 0
for item in oxford_data:
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            old_ru = ex.get('ru', '')
            clean_example_entry(ex)
            if ex.get('ru') != old_ru:
                count_cleaned += 1
                
    for p in item.get('phrases', []):
        for ex in p.get('examples', []):
            old_ru = ex.get('ru', '')
            clean_example_entry(ex)
            if ex.get('ru') != old_ru:
                count_cleaned += 1

print(f"Cleaned {count_cleaned} examples and extracted their register tags!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
