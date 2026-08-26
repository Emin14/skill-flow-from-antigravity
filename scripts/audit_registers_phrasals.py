# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Checking {len(data)} words in oxford_5000_updated.json...")

# Check meanings where example 'en' is a phrasal verb matching translation or starting with the verb
phrasal_in_meanings = []
register_without_dot = []

REGISTERS = [
    'ав', 'авт', 'амер', 'анат', 'археол', 'архит', 'астр', 'банк',
    'библ', 'биол', 'бот', 'бухг', 'воен', 'возвыш', 'вчт', 'геогр',
    'геод', 'геол', 'геом', 'геральд', 'грам', 'детск', 'дип', 'дор',
    'жив', 'зоол', 'ирон', 'иск', 'ист', 'канад', 'канц', 'карт',
    'кино', 'книжн', 'ком', 'косм', 'кул', 'лингв', 'лит', 'лог',
    'мат', 'мед', 'метал', 'метео', 'мех', 'мин', 'миф', 'мор',
    'муз', 'неодобр', 'опт', 'охот', 'парл', 'перен', 'полигр',
    'полит', 'поэт', 'презр', 'пренебр', 'психол', 'радио', 'разг',
    'рел', 'собир', 'спорт', 'стат', 'стр', 'студ', 'с-х', 'театр',
    'текст', 'тех', 'тлв', 'топ', 'унив', 'уст', 'фарм', 'физ',
    'физиол', 'филос', 'фин', 'хим', 'церк', 'шахм', 'эк', 'экол',
    'эл', 'юр'
]

reg_pattern = re.compile(r'(?<![а-яёА-ЯЁa-zA-Z])(' + '|'.join(re.escape(r) for r in REGISTERS) + r')(?!\.)(?=\s+[а-яёА-ЯЁa-zA-Z\(])')

for item in data:
    w = item['word']
    w_base = re.sub(r'\d+$', '', w).lower()
    
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        
        # Check registers without dot
        m_reg = reg_pattern.findall(tr)
        if m_reg:
            register_without_dot.append((w, m['id'], tr, m_reg))
            
        # Check if meaning is actually a phrasal verb entry
        for ex in exs:
            en = ex.get('en', '').lower().strip()
            ru = ex.get('ru', '').strip()
            words_en = en.split()
            if len(words_en) >= 2 and words_en[0] == w_base and words_en[1] in ['about', 'across', 'after', 'against', 'ahead', 'along', 'apart', 'around', 'aside', 'away', 'back', 'before', 'behind', 'below', 'between', 'by', 'down', 'for', 'forth', 'forward', 'from', 'in', 'into', 'off', 'on', 'out', 'over', 'round', 'through', 'to', 'together', 'towards', 'under', 'up', 'upon', 'with', 'without']:
                if en == w_base + ' ' + words_en[1] or ru == tr:
                    phrasal_in_meanings.append((w, m['id'], en, tr, ru))

print(f"Register abbreviations without dot: {len(register_without_dot)}")
print(f"Phrasal verbs misplaced in meanings: {len(phrasal_in_meanings)}")

print("\nSample register without dot:")
for item in register_without_dot[:15]:
    print(f"  [{item[0]}] id={item[1]}: {repr(item[2])} -> found {item[3]}")

print("\nSample phrasal verbs in meanings:")
for item in phrasal_in_meanings[:15]:
    print(f"  [{item[0]}] id={item[1]}: en={repr(item[2])} | tr={repr(item[3])} | ru={repr(item[4])}")
