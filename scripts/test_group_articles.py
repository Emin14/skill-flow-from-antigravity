# -*- coding: utf-8 -*-
"""
Test precise parser for Muller dictionary article body.
"""
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

POS_TAG_MAP = {
    'v': 'verb',
    'n': 'noun',
    'a': 'adjective',
    'adj': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'conj': 'conjunction',
    'pron': 'pronoun',
    'num': 'numeral',
    'interj': 'interjection',
    'part': 'participle',
    'predic': 'predicative',
    'art': 'article',
}

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
    'архит.': 'архитектура', 'жд.': 'железнодорожное', 'ж.-д.': 'железнодорожное',
    'кино': 'кинематограф', 'театр., кино': 'театр, кино', 'сл.': 'сленг', 'церк.': 'церковное',
    'ист.': 'историческое', 'прос.': 'фонетика', 'просод.': 'фонетика', 'полигр.': 'полиграфия'
}

def expand_tilde(text: str, headword: str) -> str:
    # Expand ~ into headword
    # Handle ~ed, ~s, ~ing, ~d
    clean_hw = re.sub(r'\s+[I|V|X]+$', '', headword).strip()
    res = text.replace('~ed', clean_hw + 'ed')
    res = res.replace('~ing', clean_hw + 'ing')
    res = res.replace('~s', clean_hw + 's')
    res = res.replace('~d', clean_hw + 'd')
    res = res.replace('~', clean_hw)
    return res

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_data = json.load(f)

# Group articles by base headword
muller_dict = {}
for art in muller_data:
    hw = art['headword']
    base = re.sub(r'\s+[I|V|X]+$', '', hw).strip().lower()
    if base not in muller_dict:
        muller_dict[base] = []
    muller_dict[base].append(art)

print(f"Loaded {len(muller_dict)} unique base headwords.")
test_words = ['push', 'lady', 'reckon', 'long', 'lend', 'lie', 'joke', 'latter']
for tw in test_words:
    arts = muller_dict.get(tw, [])
    print(f"\nWord: '{tw}' has {len(arts)} article(s)")
    for a in arts:
        print(f"  [{a['headword']}] {a['body'][:100]}...")
