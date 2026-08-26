# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

art_map = {}
for a in muller_articles:
    hw = a.get('headword', '').split()[0].lower().rstrip(',;.')
    if hw not in art_map:
        art_map[hw] = []
    art_map[hw].append(a)

ABBREVIATIONS = {
    'тех', 'уст', 'мор', 'юр', 'разг', 'амер', 'воен', 'рел', 'муз', 'авт', 'ав',
    'горн', 'сл', 'карт', 'с-х', 'с.-х', 'книжн', 'шутл', 'ирон', 'бран', 'библ',
    'анат', 'биол', 'бот', 'грам', 'зоол', 'лингв', 'мат', 'мед', 'мин', 'полит',
    'психол', 'рад', 'спорт', 'строит', 'театр', 'физ', 'филос', 'фин', 'фото',
    'хим', 'шахм', 'экон', 'эл'
}

all_50 = []
for entry in oxford:
    w = entry['word']
    base = re.sub(r'\d+$', '', w).lower()
    for m in entry.get('meanings', []):
        tr = m.get('translation', '').strip()
        tr_low = tr.lower().rstrip('.')
        if tr_low in ABBREVIATIONS or tr_low in ('б', 'г', 'и', 'тж', 'вид', 'уте', 'a', 'to', 'a hard', 'в значении прилагательного -', '= inkwell'):
            all_50.append((w, m.get('id'), tr, m.get('partOfSpeech'), m.get('examples')))

print(f"Total: {len(all_50)}")
for w, mid, tr, pos, exs in all_50:
    base = re.sub(r'\d+$', '', w).lower()
    muller_body = art_map.get(base, [{}])[0].get('body', '')[:200]
    print(f"\n['{w}'] id={mid}, pos={pos}, tr={repr(tr)}, exs={exs}")
    print(f"  Muller: {muller_body}")
