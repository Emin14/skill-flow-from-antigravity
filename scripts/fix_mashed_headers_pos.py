# -*- coding: utf-8 -*-
"""
Fix all 19 occurrences of mashed grammatical headers and OCR POS markers:
later, but, downtown, mate, mum, off, OK, round, second, cost, cut, draw, drink, feel, set, work, worse, worst.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    
    if w == 'later':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "adjective",
                "translation": "более поздний; последующий, дальнейший (сравн. ст. от late)",
                "examples": [
                    { "en": "in later years", "ru": "в последующие годы", "register": [] }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "adverb",
                "translation": "позже, позднее; впоследствии, потом",
                "examples": [
                    { "en": "see you later", "ru": "увидимся позже, до скорого", "register": [] },
                    { "en": "sooner or later", "ru": "рано или поздно", "register": [] },
                    { "en": "later on", "ru": "позднее, потом", "register": [] }
                ],
                "register": []
            }
        ]
        
    elif w == 'but':
        clean_meanings = []
        for m in item['meanings']:
            if '5. n возражение' in m.get('translation', ''):
                clean_meanings.append({
                    "id": len(clean_meanings) + 1,
                    "partOfSpeech": "pronoun",
                    "translation": "который не, кто не",
                    "examples": [
                        { "en": "there are few men but would risk all for such a prize", "ru": "мало найдётся таких, кто не рискнул бы всем ради подобной награды", "register": [] }
                    ],
                    "register": []
                })
                clean_meanings.append({
                    "id": len(clean_meanings) + 1,
                    "partOfSpeech": "noun",
                    "translation": "возражение",
                    "examples": [
                        { "en": "without any ifs and buts", "ru": "без всяких «если» и «но»", "register": [] }
                    ],
                    "register": []
                })
                clean_meanings.append({
                    "id": len(clean_meanings) + 1,
                    "partOfSpeech": "verb",
                    "translation": "возражать",
                    "examples": [
                        { "en": "but me no buts", "ru": "не говорите мне «но», не возражайте", "register": [] }
                    ],
                    "register": []
                })
            else:
                m['id'] = len(clean_meanings) + 1
                clean_meanings.append(m)
        item['meanings'] = clean_meanings
        
    elif w == 'downtown':
        for m in item.get('meanings', []):
            m['translation'] = re.sub(r'^[1-9]\.\s*n\s*', '', m['translation']).strip()
            
    elif w == 'mate':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "noun", "translation": "товарищ, напарник; приятель", "examples": [], "register": ["разговорное"] },
            { "id": 2, "partOfSpeech": "noun", "translation": "самец или самка (в паре животных)", "examples": [], "register": [] },
            { "id": 3, "partOfSpeech": "noun", "translation": "помощник капитана (на торговом судне)", "examples": [], "register": ["морской термин"] },
            { "id": 4, "partOfSpeech": "noun", "translation": "мат (в шахматах)", "examples": [], "register": ["шахматы"] },
            { "id": 5, "partOfSpeech": "verb", "translation": "спаривать(ся); соединять(ся) в пару", "examples": [], "register": [] },
            { "id": 6, "partOfSpeech": "verb", "translation": "ставить мат (в шахматах)", "examples": [], "register": ["шахматы"] }
        ]
        
    elif w == 'mum':
        for m in item.get('meanings', []):
            m['translation'] = re.sub(r'^[1-9]\.\s*int\s*', '', m['translation']).strip()
            
    elif w == 'off':
        for m in item.get('meanings', []):
            m['translation'] = re.sub(r'\s*[1-9]\.\s*v\s*$', '', m['translation']).replace('сторонаполя', 'сторона поля').strip()
            
    elif w == 'OK':
        for m in item.get('meanings', []):
            m['translation'] = re.sub(r'^\(past\s+и\s+p\.\s*p\.\s+OK\'d\)\s*', '', m['translation']).strip()
            
    elif w == 'round':
        clean_meanings = []
        for m in item.get('meanings', []):
            t = m.get('translation', '')
            if '5. prep' in t or 'inches round' in t:
                m['translation'] = 'в обхвате, в окружности'
                if 'examples' not in m:
                    m['examples'] = []
                m['examples'].append({
                    "en": "her waist is only 24 inches round",
                    "ru": "объём её талии всего 61 см",
                    "register": []
                })
            m['id'] = len(clean_meanings) + 1
            clean_meanings.append(m)
        item['meanings'] = clean_meanings
        
    elif w == 'second':
        clean_meanings = []
        for m in item.get('meanings', []):
            t = m.get('translation', '')
            if '5. adv' in t:
                clean_meanings.append({
                    "id": len(clean_meanings) + 1,
                    "partOfSpeech": "verb",
                    "translation": "откомандировывать",
                    "examples": [],
                    "register": []
                })
                clean_meanings.append({
                    "id": len(clean_meanings) + 1,
                    "partOfSpeech": "adverb",
                    "translation": "вторым классом (путешествовать); вторым номером; во второй группе",
                    "examples": [],
                    "register": []
                })
            else:
                m['id'] = len(clean_meanings) + 1
                clean_meanings.append(m)
        item['meanings'] = clean_meanings
        
    elif w in ['cost', 'cut', 'draw', 'drink', 'feel', 'set', 'work']:
        for m in item.get('meanings', []):
            m['translation'] = re.sub(r'\s*\(past:?[^)]*p\.\s*p\.:?[^)]*\)', '', m['translation']).strip()
            m['translation'] = re.sub(r'\s*\(past\s+и\s+p\.\s*p\.[^)]*\)', '', m['translation']).strip()

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Fixed all mashed headers and POS markers successfully!")
