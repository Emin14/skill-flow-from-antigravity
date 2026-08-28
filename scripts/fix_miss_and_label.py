# -*- coding: utf-8 -*-
"""
Fix label and miss entries cleanly.
"""
import json, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    if w == 'label':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                m['translation'] = 'слезник'
                m['register'] = ['архитектура']
    elif w == 'miss':
        item['meanings'] = [
            { "id": 1, "partOfSpeech": "noun", "translation": "промах, осечка", "examples": [], "register": [] },
            { "id": 2, "partOfSpeech": "noun", "translation": "отсутствие, потеря (чего-либо)", "examples": [], "register": [] },
            { "id": 3, "partOfSpeech": "noun", "translation": "выкидыш", "examples": [], "register": ["разговорное"] },
            { "id": 4, "partOfSpeech": "verb", "translation": "промахнуться, не достичь цели (тж. перен.); потерпеть неудачу", "examples": [
                { "en": "to miss fire", "ru": "дать осечку" }
            ], "register": [] },
            { "id": 5, "partOfSpeech": "verb", "translation": "упустить; пропустить; не заметить; не услышать", "examples": [
                { "en": "to miss the bus", "ru": "опоздать на автобус; прозевать удобный случай" },
                { "en": "to miss a promotion", "ru": "не получить повышения" },
                { "en": "to miss an opportunity", "ru": "упустить возможность" },
                { "en": "to miss smb.'s words", "ru": "прослушать, не расслышать чьи-либо слова" },
                { "en": "to miss the train", "ru": "опоздать на поезд" },
                { "en": "I missed him at the hotel", "ru": "я не застал его в гостинице" },
                { "en": "to miss smb. in the crowd", "ru": "потерять кого-либо в толпе" }
            ], "register": [] },
            { "id": 6, "partOfSpeech": "verb", "translation": "пропустить, не посетить (занятия, лекцию и т. п.)", "examples": [], "register": [] },
            { "id": 7, "partOfSpeech": "verb", "translation": "чувствовать отсутствие (кого-либо, чего-либо); скучать (по кому-либо)", "examples": [
                { "en": "we missed you badly", "ru": "нам страшно не хватало вас" }
            ], "register": [] },
            { "id": 8, "partOfSpeech": "verb", "translation": "обнаружить отсутствие или пропажу", "examples": [
                { "en": "he won't be missed", "ru": "его отсутствия не заметят" },
                { "en": "when did you miss your purse?", "ru": "когда вы обнаружили, что у вас нет кошелька?" }
            ], "register": [] },
            { "id": 9, "partOfSpeech": "verb", "translation": "избежать", "examples": [
                { "en": "he just missed being killed", "ru": "он едва не был убит" }
            ], "register": [] },
            { "id": 10, "partOfSpeech": "verb", "translation": "пропустить (имя в списке), выпустить (слово, букву при письме)", "examples": [], "register": [] },
            { "id": 11, "partOfSpeech": "noun", "translation": "мисс, барышня (обращение к девушке или незамужней женщине)", "examples": [], "register": [] },
            { "id": 12, "partOfSpeech": "noun", "translation": "девочка, девица", "examples": [], "register": ["шутливое", "пренебрежительное"] }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Fixed label and miss, synced files successfully!")
