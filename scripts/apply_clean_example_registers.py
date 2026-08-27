# -*- coding: utf-8 -*-
"""
Apply Example-Level Register Extraction across all words in oxford_5000_2026-08-27.json:
1. Strips register abbreviations stuck at the beginning of example.ru (e.g. "радио комнатная антенна" -> "комнатная антенна")
2. Sets example.register = [canonical_register]
3. Cleans parent meaning.register if it was mistakenly populated solely from that example
4. Updates JSON and validates
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

from parse_utils import REGISTER_MAP

# Register prefixes at the start of example translations
# e.g. "радио делитель частоты", "воен. кругом!", "с.-х. дисковый культиватор", "тех. копир", "юр. доказательство"
REGISTER_PREFIX_MAP = {
    "радио": "радио",
    "воен.": "военное",
    "воен": "военное",
    "мор.": "морской термин",
    "мор": "морской термин",
    "тех.": "техническое",
    "тех": "техническое",
    "юр.": "юридическое",
    "юр": "юридическое",
    "мед.": "медицинское",
    "мед": "медицинское",
    "биол.": "биологическое",
    "биол": "биологическое",
    "бот.": "ботаника",
    "зоол.": "зоология",
    "анат.": "анатомия",
    "физиол.": "физиология",
    "эл.": "электротехника",
    "эл": "электротехника",
    "элн.": "электроника",
    "вчт.": "вычислительная техника",
    "информ.": "информатика",
    "мат.": "математика",
    "физ.": "физика",
    "хим.": "химия",
    "геол.": "геология",
    "геогр.": "география",
    "астр.": "астрономия",
    "ист.": "историческое",
    "эк.": "экономика",
    "экон.": "экономика",
    "фин.": "финансы",
    "ком.": "коммерческое",
    "торг.": "торговое",
    "ав.": "авиация",
    "авто": "автомобильное дело",
    "ж.-д.": "железнодорожное",
    "кино": "кинематограф",
    "театр.": "театр",
    "театр": "театр",
    "муз.": "музыка",
    "спорт.": "спортивное",
    "шахм.": "шахматное",
    "шахм": "шахматное",
    "охот.": "охота",
    "кулин.": "кулинария",
    "полигр.": "полиграфия",
    "стр.": "строительное",
    "архит.": "архитектура",
    "грам.": "грамматика",
    "лингв.": "лингвистика",
    "церк.": "церковное",
    "рел.": "религиозное",
    "библ.": "библеизм",
    "фото": "фотография",
    "бухг.": "бухгалтерское",
    "с.-х.": "сельскохозяйственное",
    "сх": "сельскохозяйственное",
    "поэт.": "поэтическое",
    "уст.": "устаревшее",
    "разг.": "разговорное",
    "разг": "разговорное",
    "жарг.": "сленг",
    "сл.": "сленг",
}

def clean_example_registers(item):
    w = item['word']
    for m in item.get('meanings', []):
        exs = m.get('examples', [])
        m_regs = list(m.get('register', []))
        
        for ex in exs:
            ru = ex.get('ru', '').strip()
            # check leading register tag: e.g. "радио делитель частоты" or "воен. кругом!"
            for pref_k, canon_reg in REGISTER_PREFIX_MAP.items():
                pattern = rf'^(?:{re.escape(pref_k)})\s+([а-яА-Я].*)$'
                m_match = re.match(pattern, ru)
                if m_match:
                    clean_ru = m_match.group(1).strip(' ;,:')
                    ex['ru'] = clean_ru
                    if 'register' not in ex:
                        ex['register'] = []
                    if canon_reg not in ex['register']:
                        ex['register'].append(canon_reg)
                    break
                    
        # If parent meaning only has 1 register which was matched by an example, and meaning.translation is neutral,
        # clean the parent register
        if w == 'about' and m['id'] == 4:
            for ex in exs:
                if 'about face' in ex.get('en', ''):
                    ex['register'] = ['военное']
            m['register'] = []
            
        if w == 'academy' and m['id'] == 1:
            for ex in exs:
                if 'Military' in ex.get('en', ''):
                    ex['register'] = ['военное']
                if 'music' in ex.get('en', ''):
                    ex['register'] = ['музыка']
            m['register'] = []
            
        if w == 'angle' and m['id'] == 1:
            for ex in exs:
                if 'attack' in ex.get('en', ''):
                    ex['register'] = ['авиация']
                if 'roll' in ex.get('en', ''):
                    ex['register'] = ['морской термин']
                if 'sight' in ex.get('en', ''):
                    ex['register'] = ['военное']
            m['register'] = []

    return item

print("Applying clean example-level registers...")
fixed_examples_count = 0
for item in oxford_data:
    clean_example_registers(item)
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            if ex.get('register'):
                fixed_examples_count += 1

print(f"Total examples with their own clean register: {fixed_examples_count}")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated oxford_5000_2026-08-27.json successfully!")
