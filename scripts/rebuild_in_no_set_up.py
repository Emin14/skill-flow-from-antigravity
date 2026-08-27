# -*- coding: utf-8 -*-
"""
Rebuild in, no, set, up with 100% academic precision.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# 1. IN
IN_ENTRY = {
    "word": "in",
    "frequency_rank": 3,
    "cefr": "a1",
    "phon_br": "/ɪn/",
    "phon_n_am": "/ɪn/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "preposition", "translation": "в (указывает на нахождение внутри или в пределах)", "examples": [
            { "en": "in the room", "ru": "в комнате" },
            { "en": "in London", "ru": "в Лондоне" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "preposition", "translation": "в, через, за (во времени)", "examples": [
            { "en": "in May", "ru": "в мае" },
            { "en": "in two hours", "ru": "через два часа" },
            { "en": "in 1990", "ru": "в 1990 году" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "preposition", "translation": "в (указывает на состояние, форму, положение)", "examples": [
            { "en": "in a hurry", "ru": "в спешке" },
            { "en": "in danger", "ru": "в опасности" },
            { "en": "in English", "ru": "по-английски" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "adverb", "translation": "внутрь, дома, на месте", "examples": [
            { "en": "come in!", "ru": "войдите!" },
            { "en": "is Mr Smith in?", "ru": "мистер Смит дома?" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "adjective", "translation": "модный, популярный", "examples": [
            { "en": "it's the in thing", "ru": "это сейчас в моде" }
        ], "register": ["разговорное"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "при англ. мн. ч. the ins: партия, находящаяся у власти", "examples": [], "register": ["политика"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "ins and outs", "partOfSpeech": "noun", "translation": "1) все входы и выходы; 2) детали, подробности", "examples": [], "register": [] },
        { "id": 2, "phrase": "in and out", "partOfSpeech": "adverb", "translation": "туда и сюда, взад и вперёд", "examples": [], "register": [] }
    ]
}

# 2. NO
NO_ENTRY = {
    "word": "no",
    "frequency_rank": 58,
    "cefr": "a1",
    "phon_br": "/nəʊ/",
    "phon_n_am": "/noʊ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "interjection", "translation": "нет (отрицательный ответ)", "examples": [
            { "en": "no, I don't", "ru": "нет" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "adjective", "translation": "никакой, ни один (перед сущ.)", "examples": [
            { "en": "no money", "ru": "нет денег" },
            { "en": "no parking", "ru": "стоянка запрещена" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "adverb", "translation": "ничуть не, отнюдь не (перед сравн. степенью)", "examples": [
            { "en": "no better", "ru": "ничуть не лучше" },
            { "en": "no more", "ru": "больше не" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "отрицание, отказ, ответ «нет» (pl noes)", "examples": [
            { "en": "the noes have it", "ru": "большинство высказалось против" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "by no means", "partOfSpeech": "adverb", "translation": "ни в коем случае, никоим образом", "examples": [], "register": [] },
        { "id": 2, "phrase": "no two ways about it", "partOfSpeech": "adverb", "translation": "1) другого выхода нет; 2) двух мнений быть не может", "examples": [], "register": [] }
    ]
}

# 3. SET
SET_ENTRY = {
    "word": "set",
    "frequency_rank": 155,
    "cefr": "a1",
    "phon_br": "/set/",
    "phon_n_am": "/set/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "набор, комплект, гарнитур; коллекция", "examples": [
            { "en": "a set of tools", "ru": "набор инструментов" },
            { "en": "a tea set", "ru": "чайный сервиз" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "аппарат, приёмник", "examples": [
            { "en": "television set", "ru": "телевизор" },
            { "en": "radio set", "ru": "радиоприёмник" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "съёмочная площадка, декорации", "examples": [
            { "en": "on the set", "ru": "на съёмочной площадке" }
        ], "register": ["кинематография", "театр"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "сет, партия (в теннисе)", "examples": [], "register": ["спортивное"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "круг (людей), компания", "examples": [
            { "en": "the smart set", "ru": "фешенебельное общество" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "множество", "examples": [], "register": ["математика"] },
        { "id": 7, "partOfSpeech": "adjective", "translation": "установленный, назначенный, твёрдый", "examples": [
            { "en": "set rules", "ru": "твёрдые правила" },
            { "en": "at a set time", "ru": "в назначенное время" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "adjective", "translation": "неподвижный, застывший", "examples": [
            { "en": "a set smile", "ru": "застывшая улыбка" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "ставить, класть, помещать (past: set, p. p.: set)", "examples": [
            { "en": "to set a cup on the table", "ru": "поставить чашку на стол" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "устанавливать, назначать (дату, цену, рекорд)", "examples": [
            { "en": "to set a date", "ru": "назначить дату" },
            { "en": "to set a new record", "ru": "установить новый рекорд" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "накрывать (на стол)", "examples": [
            { "en": "to set the table", "ru": "накрыть на стол" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "заходить, садиться (о солнце)", "examples": [
            { "en": "the sun was setting", "ru": "солнце садилось" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "заводить (будильник, часы)", "examples": [
            { "en": "to set an alarm clock", "ru": "завести будильник" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "застывать, твердеть (о бетоне, желе)", "examples": [
            { "en": "the jelly has set", "ru": "желе застыло" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "вправлять (кость), срастаться", "examples": [
            { "en": "to set a broken bone", "ru": "вправить сломанную кость" }
        ], "register": ["медицинское"] },
        { "id": 16, "partOfSpeech": "verb", "translation": "вставлять в оправу (драгоценные камни)", "examples": [
            { "en": "a ruby set in gold", "ru": "рубин в золотой оправе" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to set fire to", "partOfSpeech": "verb", "translation": "поджечь", "examples": [], "register": [] },
        { "id": 2, "phrase": "to set free", "partOfSpeech": "verb", "translation": "освободить, выпустить на свободу", "examples": [], "register": [] },
        { "id": 3, "phrase": "to set an example", "partOfSpeech": "verb", "translation": "подавать пример", "examples": [], "register": [] },
        { "id": 4, "phrase": "set about", "partOfSpeech": "verb", "translation": "приниматься за что-либо, приступать к", "examples": [], "register": [] },
        { "id": 5, "phrase": "set back", "partOfSpeech": "verb", "translation": "1) задерживать, препятствовать; 2) переводить назад стрелки часов", "examples": [], "register": [] },
        { "id": 6, "phrase": "set in", "partOfSpeech": "verb", "translation": "наступать, начинаться, устанавливаться (о погоде, зиме)", "examples": [], "register": [] },
        { "id": 7, "phrase": "set off", "partOfSpeech": "verb", "translation": "1) отправляться в путь; 2) взрывать; 3) выгодно оттенять", "examples": [], "register": [] },
        { "id": 8, "phrase": "set out", "partOfSpeech": "verb", "translation": "1) отправляться в путь; 2) намереваться; 3) излагать", "examples": [], "register": [] },
        { "id": 9, "phrase": "set up", "partOfSpeech": "verb", "translation": "1) основывать, учреждать (бизнес); 2) воздвигать; 3) настраивать (систему)", "examples": [], "register": [] }
    ]
}

# 4. UP
UP_ENTRY = {
    "word": "up",
    "frequency_rank": 47,
    "cefr": "a1",
    "phon_br": "/ʌp/",
    "phon_n_am": "/ʌp/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "adverb", "translation": "наверх, вверху, вверх", "examples": [
            { "en": "look up!", "ru": "посмотри наверх!" },
            { "en": "up and down", "ru": "вверх и вниз, туда и обратно" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "adverb", "translation": "на ногах, вставший (после сна или болезни)", "examples": [
            { "en": "to be up early", "ru": "рано вставать" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "adverb", "translation": "истёкший (о времени)", "examples": [
            { "en": "time is up", "ru": "время истекло" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "preposition", "translation": "вверх по, вдоль по", "examples": [
            { "en": "up the hill", "ru": "вверх по холму" },
            { "en": "up the street", "ru": "вверх по улице" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "adjective", "translation": "направленный вверх, идущий наверх", "examples": [
            { "en": "up train", "ru": "поезд в сторону столицы" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "повышать, увеличивать (цены: разг.)", "examples": [
            { "en": "to up prices", "ru": "взвинчивать цены" }
        ], "register": ["разговорное"] },
        { "id": 7, "partOfSpeech": "noun", "translation": "подъём, повышение", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "ups and downs", "partOfSpeech": "noun", "translation": "1) взлёты и падения; 2) превратности судьбы", "examples": [], "register": [] },
        { "id": 2, "phrase": "what's up?", "partOfSpeech": "verb", "translation": "в чём дело?, что случилось?", "examples": [], "register": ["разговорное"] }
    ]
}

SPECIALS = {
    'in': IN_ENTRY,
    'no': NO_ENTRY,
    'set': SET_ENTRY,
    'up': UP_ENTRY
}

for idx, it in enumerate(oxford_data):
    if it['word'] in SPECIALS:
        oxford_data[idx] = SPECIALS[it['word']]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("in, no, set, up successfully rebuilt!")
