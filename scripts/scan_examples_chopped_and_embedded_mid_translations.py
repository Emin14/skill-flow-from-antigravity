# -*- coding: utf-8 -*-
"""
Deep scan for:
1. Chopped words in examples[].ru and phrases[].translation
2. Embedded English phrases anywhere inside translation fields
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Chopped words in examples[].ru and phrases[].translation
chopped_examples = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        for ex_idx, ex in enumerate(m.get('examples', [])):
            ru = ex.get('ru', '')
            if re.match(r'^(?:ь|ть|ать|ить|еть|уть|ное|ный|ная|ное|ные|ных|ным|ными|ском|ской|скую|ский|ская|ское|ские|ских|ским|скими|ство|ствие|зация|ежка|ефон|еграф|евидение)\b', ru):
                chopped_examples.append((w, 'meaning_ex', m['id'], ex_idx, ex.get('en'), ru))
            elif re.match(r'^[а-яё]{1,2}\s', ru) and not re.match(r'^(?:в|на|по|за|из|от|до|с|со|у|к|ко|о|об|обо|при|про|под|над|для|без|не|ни|же|ли|бы|то|так|как|что|где|кто|чем|кем|ком|мы|вы|он|она|оно|они|мой|наш|ваш|их|тот|та|те|то|ту|тех|тем|это|эта|эти|тут|там|вот|вон|еще|ещё|уже|сам|ряд|вид|раз|пол|род|сон|тон|шаг|век|год|час|день|дом|мир|ход|лес|пар|пыл|пот|лед|лёд|бык|вол|пес|пёс|кот|вор|бог|пан|хан|тир|мат|куб|шар|ром|лак|мел|жир|чай|суп|сыр|рис|сок|мед|мёд|бок|лоб|ухо|шея|чуб|мех|сак|бак|люк|дот|ярд|фут|пуд|тон|бар|пас|мат)\b', ru):
                chopped_examples.append((w, 'meaning_ex', m['id'], ex_idx, ex.get('en'), ru))

        for p in item.get('phrases', []):
            for ex_idx, ex in enumerate(p.get('examples', [])):
                ru = ex.get('ru', '')
                if re.match(r'^(?:ь|ть|ать|ить|еть|уть|ное|ный|ная|ное|ные|ных|ным|ными|ском|ской|скую|ский|ская|ское|ские|ских|ским|скими|ство|ствие|зация|ежка|ефон|еграф|евидение)\b', ru):
                    chopped_examples.append((w, 'phrase_ex', p['id'], ex_idx, ex.get('en'), ru))
                elif re.match(r'^[а-яё]{1,2}\s', ru) and not re.match(r'^(?:в|на|по|за|из|от|до|с|со|у|к|ко|о|об|обо|при|про|под|над|для|без|не|ни|же|ли|бы|то|так|как|что|где|кто|чем|кем|ком|мы|вы|он|она|оно|они|мой|наш|ваш|их|тот|та|те|то|ту|тех|тем|это|эта|эти|тут|там|вот|вон|еще|ещё|уже|сам|ряд|вид|раз|пол|род|сон|тон|шаг|век|год|час|день|дом|мир|ход|лес|пар|пыл|пот|лед|лёд|бык|вол|пес|пёс|кот|вор|бог|пан|хан|тир|мат|куб|шар|ром|лак|мел|жир|чай|суп|сыр|рис|сок|мед|мёд|бок|лоб|ухо|шея|чуб|мех|сак|бак|люк|дот|ярд|фут|пуд|тон|бар|пас|мат)\b', ru):
                    chopped_examples.append((w, 'phrase_ex', p['id'], ex_idx, ex.get('en'), ru))

# 2. Embedded English phrases inside translation fields
embedded_in_trans = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # Check if t contains any English words/phrases like 'to roll downhill' or 'to [verb]' or multi-word English
        # Excluding valid grammatical notes like '(past и p. p. от...)' or '(of — чего-л.)'
        en_matches = re.finditer(r'\b(?:to\s+[a-zA-Z\s\',/()-]+|[a-zA-Z]{3,}\s+[a-zA-Z]{3,})\b', t)
        for match in en_matches:
            matched_str = match.group(0)
            if not re.match(r'^(?:past|pres|etc|smb|smth|that|which|when|where|what|who|how|why)$', matched_str, re.I):
                if not re.search(r'\b(?:past\s+и\s+p\.\s*p\.|p\.\s*p\.\s+от|pres\.\s*p\.\s+от)\b', t):
                    embedded_in_trans.append((w, 'meaning', m['id'], t, matched_str))
                    break

print(f"Class 1 (Chopped words in examples.ru): {len(chopped_examples)} candidates")
print(f"Class 2 (Embedded English in translations): {len(embedded_in_trans)} candidates")

print("\n--- SAMPLE CLASS 1 (Chopped Examples RU) ---")
for c in chopped_examples[:25]:
    print(f"[{c[0]}] ({c[1]} id {c[2]} ex {c[3]}): en='{c[4]}' -> ru='{c[5]}'")

print("\n--- SAMPLE CLASS 2 (Embedded English in Translations) ---")
for c in embedded_in_trans[:25]:
    print(f"[{c[0]}] (id {c[2]}): match='{c[4]}' in trans='{c[3]}'")
