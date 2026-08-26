# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} entries.")

# Extract all translations
all_texts = []
for entry in data:
    for m in entry.get('meanings', []):
        all_texts.append(m.get('translation', ''))

print(f"Total texts: {len(all_texts)}")

t0 = time.time()
# Benchmark 1: Grammar form pattern
GRAMMAR_FORM_PATTERN = re.compile(r'^\s*\((?:better;\s*best|worse;\s*worst|more;\s*most|[a-zA-Z\s,;]+)\)\s*')
for t in all_texts:
    GRAMMAR_FORM_PATTERN.sub('', t)
print(f"1. Grammar regex on {len(all_texts)} texts: {time.time() - t0:.3f}s")

# Benchmark 2: Syllable pattern
t0 = time.time()
SYLLABLE_PATTERN = re.compile(r'\b([а-яА-ЯёЁ]{2,})\s+([а-яА-ЯёЁ]{2,})\b')
for t in all_texts:
    SYLLABLE_PATTERN.sub(r'\1 \2', t)
print(f"2. Syllable regex on {len(all_texts)} texts: {time.time() - t0:.3f}s")

# Benchmark 3: Register pattern
t0 = time.time()
REGISTER_MAP = {
    'жив.': 'живопись', 'лог.': 'логика', 'карт.': 'карточный термин', 'мор.': 'морской термин',
    'юр.': 'юриспруденция', 'тех.': 'техника', 'библ.': 'библеизм', 'разг.': 'разговорное',
    'муз.': 'музыка', 'авт.': 'автомобильное', 'ав.': 'авиация', 'горн.': 'горное дело',
    'с.-х.': 'сельское хозяйство', 'с-х.': 'сельское хозяйство', 'анат.': 'анатомия',
    'биол.': 'биология', 'бот.': 'ботаника', 'грам.': 'грамматика', 'зоол.': 'зоология',
    'лингв.': 'лингвистика', 'мат.': 'математика', 'мед.': 'медицина', 'мин.': 'минералогия',
    'полит.': 'политика', 'психол.': 'психология', 'рад.': 'радио', 'спорт.': 'спорт',
    'строит.': 'строительство', 'театр.': 'театр', 'физ.': 'физика', 'филос.': 'философия',
    'фин.': 'финансы', 'фото.': 'фотография', 'хим.': 'химия', 'шахм.': 'шахматы',
    'экон.': 'экономика', 'эл.': 'электротехника', 'воен.': 'военное дело', 'книжн.': 'книжное',
    'шутл.': 'шутливое', 'ирон.': 'ироническое', 'бран.': 'бранное', 'редк.': 'редкое',
    'уст.': 'устаревшее', 'амер.': 'американский английский', 'австрал.': 'австралийский английский',
    'шотл.': 'шотландский английский', 'комм.': 'коммерческое', 'коммерч.': 'коммерческое',
    'архит.': 'архитектура', 'жд.': 'железнодорожное', 'ж.-д.': 'железнодорожное'
}

REGISTER_REGEX_MAP = {
    ab: re.compile(rf'(?:^|[\(\[\s]){re.escape(ab)}(?:[\)\]\s]|$)')
    for ab in REGISTER_MAP
}

for t in all_texts:
    if '.' in t:
        for ab, reg_re in REGISTER_REGEX_MAP.items():
            if reg_re.search(t):
                pass
print(f"3. Register regex search on {len(all_texts)} texts: {time.time() - t0:.3f}s")
