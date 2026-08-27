# -*- coding: utf-8 -*-
"""
Clean prosody (прос.) registers and fix claim & floor entries.
"""
import json, re, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# 1. Clean prosody in measure, foot, long, number, resolution
for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        regs = m.get('register', [])
        
        # prosody
        if tr.startswith('прос.'):
            tr = re.sub(r'^прос\.[\s,;]*', '', tr).strip()
            if 'просодия' not in regs:
                regs.append('просодия')
            m['translation'] = tr
            m['register'] = regs
            
        # (преим. амер.)
        if re.match(r'^\(?преим\.\s*амер\.\)?\s*', tr, re.I):
            tr = re.sub(r'^\(?преим\.\s*амер\.\)?\s*', '', tr).strip()
            if 'американизм' not in regs:
                regs.append('американизм')
            m['translation'] = tr
            m['register'] = regs
            
        # (преим. воен.)
        if re.match(r'^\(?преим\.\s*воен\.\)?\s*', tr, re.I):
            tr = re.sub(r'^\(?преим\.\s*воен\.\)?\s*', '', tr).strip()
            if 'военное' not in regs:
                regs.append('военное')
            m['translation'] = tr
            m['register'] = regs
            
        # (преим. шотл.) юр.
        if re.match(r'^\(?преим\.\s*шотл\.\)?\s*(?:юр\.)?\s*', tr, re.I):
            tr = re.sub(r'^\(?преим\.\s*шотл\.\)?\s*(?:юр\.)?\s*', '', tr).strip()
            if 'шотландский диалект' not in regs: regs.append('шотландский диалект')
            if 'юридическое' not in regs: regs.append('юридическое')
            m['translation'] = tr
            m['register'] = regs

    # 2. Perfect reconstruction for 'claim'
    if w == 'claim':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "требование; претензия; притязание; утверждение, заявление",
                "examples": [
                    { "en": "to raise a claim", "ru": "предъявить претензию" },
                    { "en": "to lay claim to smth., to put in a claim for smth.", "ru": "предъявлять права на что-либо" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "иск; рекламация",
                "examples": [],
                "register": [
                    "юридическое"
                ]
            },
            {
                "id": 3,
                "partOfSpeech": "noun",
                "translation": "отведённый участок земли (золотоносный, для разработки недр)",
                "examples": [
                    { "en": "to jump a claim", "ru": "1) незаконно захватить участок, отведённый другому; 2) перен. незаконно захватить что-либо, принадлежащее другому" },
                    { "en": "to peg (или to stake) out a claim", "ru": "1) отмечать границы отведённого участка; 2) юр. закреплять своё право на что-либо" }
                ],
                "register": [
                    "американизм",
                    "австралийское"
                ]
            },
            {
                "id": 4,
                "partOfSpeech": "verb",
                "translation": "претендовать, предъявлять претензию, заявлять права (на что-либо)",
                "examples": [
                    { "en": "to claim the victory", "ru": "настаивать на своей победе" }
                ],
                "register": []
            },
            {
                "id": 5,
                "partOfSpeech": "verb",
                "translation": "требовать",
                "examples": [
                    { "en": "to claim damages", "ru": "требовать возмещения убытков" },
                    { "en": "to claim attention", "ru": "требовать к себе внимания" },
                    { "en": "to claim one's right", "ru": "требовать своего" }
                ],
                "register": []
            },
            {
                "id": 6,
                "partOfSpeech": "verb",
                "translation": "утверждать, заявлять",
                "examples": [],
                "register": []
            }
        ]

    # 3. Perfect reconstruction for 'floor'
    elif w == 'floor':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "пол; настил, междуэтажное перекрытие",
                "examples": [],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "дно (моря, пещеры)",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "noun",
                "translation": "этаж; ярус",
                "examples": [
                    { "en": "third floor", "ru": "четвёртый этаж" }
                ],
                "register": []
            },
            {
                "id": 4,
                "partOfSpeech": "noun",
                "translation": "места для членов (законодательного) собрания",
                "examples": [
                    { "en": "floor of the House", "ru": "места членов парламента в зале заседания" }
                ],
                "register": []
            },
            {
                "id": 5,
                "partOfSpeech": "noun",
                "translation": "право выступать на собрании",
                "examples": [
                    { "en": "to have (или to take) the floor", "ru": "выступать, брать слово" },
                    { "en": "to get the floor", "ru": "получить слово" },
                    { "en": "a question from the floor", "ru": "вопрос с места" }
                ],
                "register": []
            },
            {
                "id": 6,
                "partOfSpeech": "noun",
                "translation": "минимальный уровень (особ. цен)",
                "examples": [],
                "register": []
            },
            {
                "id": 7,
                "partOfSpeech": "noun",
                "translation": "гумно",
                "examples": [],
                "register": []
            },
            {
                "id": 8,
                "partOfSpeech": "noun",
                "translation": "киностудия; съёмочная площадка",
                "examples": [
                    { "en": "on the floor", "ru": "в производстве (о фильме)" },
                    { "en": "to go on the floor", "ru": "пойти в производство (о фильме)" }
                ],
                "register": [
                    "разговорное"
                ]
            },
            {
                "id": 9,
                "partOfSpeech": "noun",
                "translation": "вольные упражнения",
                "examples": [],
                "register": [
                    "спортивное"
                ]
            },
            {
                "id": 10,
                "partOfSpeech": "noun",
                "translation": "в роли определения к другому слову (размеры помещения, площадь пола)",
                "examples": [
                    { "en": "floor space", "ru": "размеры помещения, площадь пола" }
                ],
                "register": []
            },
            {
                "id": 11,
                "partOfSpeech": "verb",
                "translation": "настилать пол",
                "examples": [],
                "register": []
            },
            {
                "id": 12,
                "partOfSpeech": "verb",
                "translation": "повалить на пол; сбить с ног",
                "examples": [],
                "register": []
            },
            {
                "id": 13,
                "partOfSpeech": "verb",
                "translation": "озадачить, поставить в тупик",
                "examples": [
                    { "en": "he was floored by the question", "ru": "вопрос поставил его в тупик" }
                ],
                "register": []
            },
            {
                "id": 14,
                "partOfSpeech": "verb",
                "translation": "суметь ответить на все вопросы (на экзамене)",
                "examples": [],
                "register": [
                    "разговорное"
                ]
            },
            {
                "id": 15,
                "partOfSpeech": "verb",
                "translation": "выпить залпом",
                "examples": [],
                "register": [
                    "разговорное"
                ]
            }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Cleaned prosody and perfected claim & floor successfully!")
