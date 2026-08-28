# -*- coding: utf-8 -*-
"""
Comprehensive Analyzer of All Truncated Words in oxford_5000_2026-08-27.json
Cross-referencing each word with raw parsed_index.json text.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

# List of known abbreviation prefixes that caused truncation:
# 'мор.' -> 'морской', 'морить'
# 'воен.' -> 'военный', 'военно-'
# 'мин.' -> 'минное', 'минировать', 'минеральный'
# 'уст.' -> 'устав', 'устанавливать', 'устный', 'усталый', 'уставать', 'устье'
# 'прос.' -> 'просить', 'просо', 'простой'
# 'тел.' -> 'телевидение', 'телефон', 'тело'
# 'мат.' -> 'материнский', 'математический', 'матовый'
# 'стр.' / 'строит.' -> 'стремиться', 'стремительно', 'стрелка', 'строитель', 'строгий', 'строить'
# 'иск.' -> 'искать', 'искажать', 'искровой', 'исконный'
# 'рел.' -> 'религиозный'
# 'научн.' -> 'научный', 'научная'
# 'торг.' -> 'торговать', 'торговый'
# 'жарг.' -> 'жаргонный'
# 'топ.' -> 'топить', 'топографический'
# 'муз.' -> 'музыка', 'музыкальный'
# 'театр.' -> 'театральный'
# 'уменьш.' -> 'уменьшать'
# 'жив.' -> 'живой', 'дикий', 'живописный'
# 'стол.' -> 'столовый', 'столовое'
# 'соб.' -> 'собирать', 'собирательный'
# 'ист.' -> 'исток', 'исторический'
# 'мед.' -> 'медицинский', 'медный', 'медленный'
# 'хим.' -> 'химический'
# 'физ.' -> 'физический'
# 'биол.' -> 'биологический'
# 'бот.' -> 'ботанический'
# 'зоол.' -> 'зоологический'

def get_raw_text_for_word(w):
    raw_texts = []
    if w in parsed_index:
        raw_texts.extend([e.get('text', '') for e in parsed_index[w]])
    else:
        for k in parsed_index:
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                raw_texts.extend([e.get('text', '') for e in parsed_index[k]])
    return '\n'.join(raw_texts)

all_issues = []

for item in data:
    w = item['word']
    raw = get_raw_text_for_word(w)
    
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        # Check if t starts with chopped word
        # (starts with 1-4 letters followed by space, or typical ending without stem)
        first_word = t.split()[0] if t.split() else ''
        
        # Conditions for truncated initial:
        is_suspicious = False
        if re.match(r'^(?:ное|ный|ная|ное|ные|ных|ным|ными|ском|ской|скую|ский|ская|ское|ские|ских|ским|скими|овский|овская|овское|тельный|тельная|тельное|тельные|овать|ировать|ство|ствие|зация|фикатор|ать|ить|еть|уть|ся|сь|аль|ыка|еви|ое|ая|ий|ок|ав|ус|па|ед|ес|ел)\b', t):
            is_suspicious = True
        elif len(first_word) <= 3 and re.match(r'^[а-яё]+$', first_word):
            # If not a standard Russian short preposition/word
            if first_word not in ['в', 'на', 'по', 'за', 'из', 'от', 'до', 'с', 'со', 'у', 'к', 'ко', 'о', 'об', 'обо', 'при', 'про', 'под', 'над', 'для', 'без', 'не', 'ни', 'же', 'ли', 'бы', 'то', 'так', 'как', 'что', 'где', 'кто', 'чем', 'кем', 'ком', 'все', 'всё', 'вся', 'мы', 'вы', 'он', 'она', 'оно', 'они', 'мой', 'наш', 'ваш', 'их', 'тот', 'та', 'те', 'то', 'ту', 'тех', 'тем', 'это', 'эта', 'эти', 'тут', 'там', 'вот', 'вон', 'еще', 'ещё', 'уже', 'сам', 'сад', 'рот', 'нос', 'зуб', 'луч', 'ряд', 'вид', 'раз', 'пол', 'род', 'сон', 'тон', 'шаг', 'век', 'год', 'час', 'день', 'дом', 'мир', 'ход', 'лес', 'пар', 'пыл', 'пот', 'лед', 'лёд', 'бык', 'вол', 'пес', 'пёс', 'кот', 'вор', 'бог', 'пан', 'хан', 'тир', 'мат', 'куб', 'шар', 'ром', 'лак', 'мел', 'жир', 'чай', 'суп', 'сыр', 'рис', 'сок', 'мед', 'мёд', 'бок', 'лоб', 'ухо', 'шея', 'чуб', 'мех', 'сак', 'бак', 'люк', 'дот', 'ярд', 'фут', 'пуд', 'тон', 'бар', 'пас', 'мат']:
                is_suspicious = True
                
        if is_suspicious:
            all_issues.append({
                'word': w,
                'type': 'meaning',
                'id': m['id'],
                'trans': t,
                'register': m.get('register', []),
                'raw_sample': raw[:400]
            })

    for p in item.get('phrases', []):
        t = p.get('translation', '')
        first_word = t.split()[0] if t.split() else ''
        is_suspicious = False
        if re.match(r'^(?:ное|ный|ная|ное|ные|ных|ным|ными|ском|ской|скую|ский|ская|ское|ские|ских|ским|скими|овский|овская|овское|тельный|тельная|тельное|тельные|овать|ировать|ство|ствие|зация|фикатор|ать|ить|еть|уть|ся|сь|аль|ыка|еви|ое|ая|ий|ок|ав|ус|па|ед|ес|ел)\b', t):
            is_suspicious = True
        elif len(first_word) <= 3 and re.match(r'^[а-яё]+$', first_word):
            if first_word not in ['в', 'на', 'по', 'за', 'из', 'от', 'до', 'с', 'со', 'у', 'к', 'ко', 'о', 'об', 'обо', 'при', 'про', 'под', 'над', 'для', 'без', 'не', 'ни', 'же', 'ли', 'бы', 'то', 'так', 'как', 'что', 'где', 'кто', 'чем', 'кем', 'ком', 'все', 'всё', 'вся', 'мы', 'вы', 'он', 'она', 'оно', 'они', 'мой', 'наш', 'ваш', 'их', 'тот', 'та', 'те', 'то', 'ту', 'тех', 'тем', 'это', 'эта', 'эти', 'тут', 'там', 'вот', 'вон', 'еще', 'ещё', 'уже', 'сам', 'ряд', 'вид', 'раз', 'пол', 'род', 'сон', 'тон', 'шаг', 'век', 'год', 'час', 'день', 'дом', 'мир', 'ход', 'лес', 'пар', 'пыл', 'пот', 'лед', 'лёд', 'бык', 'вол', 'пес', 'пёс', 'кот', 'вор', 'бог', 'пан', 'хан', 'тир', 'мат', 'куб', 'шар', 'ром', 'лак', 'мел', 'жир', 'чай', 'суп', 'сыр', 'рис', 'сок', 'мед', 'мёд', 'бок', 'лоб', 'ухо', 'шея', 'чуб', 'мех', 'сак', 'бак', 'люк', 'дот', 'ярд', 'фут', 'пуд', 'тон', 'бар', 'пас', 'мат']:
                is_suspicious = True
        if is_suspicious:
            all_issues.append({
                'word': w,
                'type': 'phrase',
                'id': p['id'],
                'trans': t,
                'register': p.get('register', []),
                'raw_sample': raw[:400]
            })

print(f"Total detected truncated entries: {len(all_issues)}")
json.dump(all_issues, open('tmp/detected_truncated_issues.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

for i, issue in enumerate(all_issues[:35]):
    print(f"{i+1:2d}. [{issue['word']}] ({issue['type']} {issue['id']}): '{issue['trans']}' (reg: {issue['register']})")
