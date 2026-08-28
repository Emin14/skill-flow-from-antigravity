# -*- coding: utf-8 -*-
"""
Reconstruct all chopped Russian translations in examples[].ru
and cleanly extract inline English example phrases from meanings[].translation.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

# Exact prefix repairs for truncated examples in examples[].ru:
EXAMPLE_RU_PREFIX_REPAIRS = [
    (r'^ь\s*на\s*чью-либо\s*сторону\b', 'встать на чью-либо сторону'),
    (r'^ное\s*училище\b', 'военное училище'),
    (r'^а\s*верховой\s*езды\b', 'школа верховой езды'),
    (r'^ный\s*магазин\b', 'военный магазин'),
    (r'^ное\s*искусство\b', 'военное искусство'),
    (r'^ный\s*кодекс\b', 'военный кодекс'),
    (r'^ья\s*конституции\b', 'статья конституции'),
    (r'^ное\s*положение\b', 'военное положение'),
    (r'^ная\s*база\b', 'военная база'),
    (r'^ная\s*служба\b', 'военная служба'),
    (r'^ный\s*корабль\b', 'военный корабль'),
    (r'^ное\s*судно\b', 'военное судно'),
    (r'^ный\s*самолёт\b', 'военный самолёт'),
    (r'^ное\s*время\b', 'военное время'),
    (r'^ная\s*тайна\b', 'военная тайна'),
    (r'^ная\s*форма\b', 'военная форма'),
    (r'^ное\s*дело\b', 'минное дело'),
    (r'^ная\s*галерея\b', 'минная галерея'),
    (r'^ное\s*поле\b', 'минное поле'),
    (r'^ская\s*служба\b', 'медицинская служба'),
    (r'^ская\s*помощь\b', 'медицинская помощь'),
    (r'^ский\s*осмотр\b', 'медицинский осмотр'),
    (r'^ский\s*факультет\b', 'медицинский факультет'),
    (r'^ское\s*училище\b', 'медицинское училище'),
    (r'^ская\s*сестра\b', 'медицинская сестра'),
    (r'^ское\s*освидетельствование\b', 'медицинское освидетельствование'),
    (r'^ское\s*заключение\b', 'медицинское заключение'),
    (r'^ский\s*пункт\b', 'медицинский пункт'),
    (r'^ская\s*академия\b', 'медицинская академия'),
    (r'^ская\s*справка\b', 'медицинская справка'),
    (r'^ское\s*учреждение\b', 'медицинское учреждение'),
    (r'^ское\s*оборудование\b', 'медицинское оборудование'),
    (r'^ская\s*промышленность\b', 'медицинская промышленность'),
    (r'^ское\s*страхование\b', 'медицинское страхование'),
    (r'^ский\s*персонал\b', 'медицинский персонал'),
    (r'^ский\s*полис\b', 'медицинский полис'),
    (r'^ский\s*центр\b', 'медицинский центр'),
    (r'^ское\s*обслуживание\b', 'медицинское обслуживание'),
    (r'^ская\s*книжка\b', 'медицинская книжка'),
    (r'^ское\s*свидетельство\b', 'медицинское свидетельство'),
    (r'^ская\s*карта\b', 'медицинская карта'),
    (r'^ская\s*экспертиза\b', 'медицинская экспертиза'),
    (r'^ская\s*комиссия\b', 'медицинская комиссия'),
    (r'^ский\s*институт\b', 'медицинский институт'),
    (r'^ский\s*университет\b', 'медицинский университет'),
    (r'^ское\s*вмешательство\b', 'медицинское вмешательство'),
    (r'^ский\s*термин\b', 'медицинский термин'),
    (r'^ская\s*терминология\b', 'медицинская терминология'),
    (r'^ская\s*литература\b', 'медицинская литература'),
    (r'^ская\s*статистика\b', 'медицинская статистика'),
    (r'^ский\s*спирт\b', 'медицинский спирт'),
    (r'^ский\s*шприц\b', 'медицинский шприц'),
    (r'^ский\s*термометр\b', 'медицинский термометр'),
    (r'^ская\s*аптечка\b', 'медицинская аптечка'),
    (r'^ская\s*палата\b', 'медицинская палата'),
    (r'^ское\: ', 'медицинское: '),
    (r'^ский\s*флот\b', 'морской флот'),
    (r'^ской\s*бой\b', 'морской бой'),
    (r'^ской\s*офицер\b', 'морской офицер'),
    (r'^ской\s*порт\b', 'морской порт'),
    (r'^ское\s*ведомство\b', 'морское ведомство'),
    (r'^ская\s*пехота\b', 'морская пехота'),
    (r'^ская\s*болезнь\b', 'морская болезнь'),
    (r'^ской\s*узел\b', 'морской узел'),
    (r'^ская\s*карта\b', 'морская карта'),
    (r'^ский\s*пейзаж\b', 'морской пейзаж'),
    (r'^ской\s*путь\b', 'морской путь'),
    (r'^ское\s*право\b', 'морское право'),
    (r'^ская\s*торговля\b', 'морская торговля'),
    (r'^ская\s*граница\b', 'морская граница'),
    (r'^ская\s*держава\b', 'морская держава'),
    (r'^ская\s*служба\b', 'морская служба'),
    (r'^ское\s*путешествие\b', 'морское путешествие'),
    (r'^ский\s*климат\b', 'морской климат'),
    (r'^ский\s*ветер\b', 'морской ветер'),
    (r'^ский\s*берег\b', 'морской берег'),
    (r'^ский\s*залив\b', 'морской залив'),
    (r'^ское\s*дно\b', 'морское дно'),
    (r'^ская\s*рыба\b', 'морская рыба'),
    (r'^ская\s*вода\b', 'морская вода'),
    (r'^ская\s*трава\b', 'морская трава'),
    (r'^ская\s*свинка\b', 'морская свинка'),
    (r'^ский\s*котик\b', 'морской котик'),
    (r'^ский\s*ёж\b', 'морской ёж'),
    (r'^ская\s*звезда\b', 'морская звезда'),
    (r'^ский\s*окунь\b', 'морской окунь'),
    (r'^ский\s*волк\b', 'морской волк'),
    (r'^ский\s*конёк\b', 'морской конёк'),
    (r'^ский\s*пират\b', 'морской пират'),
    (r'^ская\s*собака\b', 'морская собака'),
    (r'^ское\s*чудовище\b', 'морское чудовище'),
    (r'^ское\s*дело\b', 'морское дело'),
    (r'^ская\s*школа\b', 'морская школа'),
    (r'^ское\s*училище\b', 'морское училище'),
    (r'^ская\s*академия\b', 'морская академия')
]

examples_fixed = 0
for item in data:
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in EXAMPLE_RU_PREFIX_REPAIRS:
                if re.search(pat, ru):
                    ex['ru'] = re.sub(pat, repl, ru)
                    examples_fixed += 1
                    break
    for p in item.get('phrases', []):
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in EXAMPLE_RU_PREFIX_REPAIRS:
                if re.search(pat, ru):
                    ex['ru'] = re.sub(pat, repl, ru)
                    examples_fixed += 1
                    break

print(f"Fixed {examples_fixed} chopped example translations!")

# Extract embedded inline examples like 'to roll downhill (с)катиться с горы'
inline_extracted = 0

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # 1. Match inline pattern: '; to [en words] [ru translation]' anywhere in translation
        # e.g. 'катить(ся); вертеть(ся); вращать(ся); to roll downhill (с)катиться с горы; закатывать глаза'
        inline_m = re.search(r';\s*(\bto\s+[a-zA-Z\s\',/()-]+)\s+([\u0400-\u04FF\(\)][^\;]+)(?:;|$)', t)
        if inline_m:
            en_chunk = inline_m.group(1).strip(' ;:,-')
            ru_chunk = inline_m.group(2).strip(' ;:,-')
            
            # Verify valid example
            if len(en_chunk) >= 5 and len(ru_chunk) >= 3 and not re.match(r'^(?:past\s+)?p\.\s*p\.', en_chunk):
                # Remove this chunk from translation
                start_pos = inline_m.start()
                end_pos = inline_m.end()
                t = t[:start_pos] + t[end_pos-1 if t[end_pos-1:] == ';' else end_pos:]
                t = re.sub(r';;+', ';', t).strip(' ;:,-')
                m['translation'] = t
                
                if 'examples' not in m:
                    m['examples'] = []
                m['examples'].append({
                    "en": en_chunk,
                    "ru": ru_chunk,
                    "register": []
                })
                inline_extracted += 1

        # 2. Match pattern: 'в роли определения: [en phrase] [ru translation]'
        attr_m = re.search(r'(?:в роли определения:\s*)([a-zA-Z\s\',/()-]{3,})\s+([\u0400-\u04FF].*)$', m['translation'])
        if attr_m:
            en_chunk = attr_m.group(1).strip(' ;:,-')
            ru_chunk = attr_m.group(2).strip(' ;:,-')
            if len(en_chunk) >= 3 and len(ru_chunk) >= 3:
                m['translation'] = 'в роли определения'
                if 'examples' not in m:
                    m['examples'] = []
                m['examples'].append({
                    "en": en_chunk,
                    "ru": ru_chunk,
                    "register": []
                })
                inline_extracted += 1

print(f"Extracted {inline_extracted} inline English examples from translations!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Synced with src/data/oxford_5000.json successfully!")
