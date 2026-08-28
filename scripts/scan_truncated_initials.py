# -*- coding: utf-8 -*-
"""
Scan for truncated initial letters/words in translation fields across oxford_5000_2026-08-27.json
and cross-reference with parsed_index.json to find the full original Russian word.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

candidates = []

for idx, item in enumerate(data):
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        # Check suspicious initial patterns:
        # 1. Starts with adjective/participle endings: ное, ный, ная, ные, ных, ский, ская, ское, ские, ских, овский, овская, тельный, тельная, тельное, тельные
        # 2. Starts with lowercase prefix that looks truncated
        # 3. Specific truncated words
        if re.match(r'^(?:ное|ный|ная|ное|ные|ных|ным|ными|ском|ской|скую|ский|ская|ское|ские|ских|ским|скими|овский|овская|овское|тельный|тельная|тельное|тельные|овать|ировать|ство|ствие|зация|фикатор)\b', t):
            candidates.append((w, 'meaning', m['id'], t, m.get('register', [])))
        elif re.match(r'^[а-я]{1,3}\s', t) and not re.match(r'^(?:в|на|по|за|из|от|до|с|у|к|о|об|обо|при|про|через|под|над|для|без|не|ни|же|ли|бы|то|так|как|что|где|кто|чем|кем|ком|все|всё|вся|вси|мы|вы|он|она|оно|они|мой|твой|свой|наш|ваш|их|тот|та|те|то|ту|тех|тем|это|эта|эти|этот|эту|этих|этим|ещё|уже|тут|там|так|вот|вон)\b', t):
            candidates.append((w, 'meaning', m['id'], t, m.get('register', [])))
            
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if re.match(r'^(?:ное|ный|ная|ное|ные|ных|ным|ными|ском|ской|скую|ский|ская|ское|ские|ских|ским|скими|овский|овская|овское|тельный|тельная|тельное|тельные|овать|ировать|ство|ствие|зация|фикатор)\b', t):
            candidates.append((w, 'phrase', p['id'], t, p.get('register', [])))

print(f"Found {len(candidates)} candidates with suspicious truncated beginnings:\n")
for w, kind, id_, t, reg in candidates:
    print(f"[{w}] ({kind} {id_}) reg={reg} -> '{t}'")
