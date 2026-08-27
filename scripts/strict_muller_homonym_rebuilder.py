# -*- coding: utf-8 -*-
"""
Strict Muller Homonym Rebuilder with full imports and exact pl/attr rules.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Import definitions from parse_homonyms_authentically
from parse_homonyms_authentically import (
    ENTRY_HOUSE_NOUN, ENTRY_HOUSE_VERB,
    ENTRY_LIVE_VERB, ENTRY_LIVE_ADJ, ENTRY_LIVE_ADV,
    ENTRY_MINUTE_NOUN, ENTRY_MINUTE_ADJ,
    ENTRY_USE_VERB, ENTRY_USE_NOUN,
    ENTRY_WIND1_NOUN, ENTRY_WIND2_VERB,
    ENTRY_MARCH_NOUN, ENTRY_MARCH_VERB_NOUN,
    ENTRY_IT_PRONOUN, ENTRY_IT_NOUN,
    ENTRY_MAY_MODAL
)

# 1. May (A1 noun) - 100% strict adherence to Muller
ENTRY_MAY_NOUN = {
    "word": "May",
    "frequency_rank": 99,
    "cefr": "a1",
    "phon_br": "/meɪ/",
    "phon_n_am": "/meɪ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "май",
            "examples": [],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "(m.) цветок боярышника",
            "examples": [],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "noun",
            "translation": "расцвет жизни",
            "examples": [],
            "register": [
                "поэтическое"
            ]
        },
        {
            "id": 4,
            "partOfSpeech": "noun",
            "translation": "при англ. мн. ч.: майские экзамены (в Кембридже)",
            "examples": [],
            "register": []
        },
        {
            "id": 5,
            "partOfSpeech": "noun",
            "translation": "при англ. мн. ч.: гребные гонки (в Кембридже — после майских экзаменов)",
            "examples": [],
            "register": []
        },
        {
            "id": 6,
            "partOfSpeech": "noun",
            "translation": "в роли определения к другому слову (майский)",
            "examples": [],
            "register": []
        },
        {
            "id": 7,
            "partOfSpeech": "noun",
            "translation": "в роли определения к другому слову (первомайский)",
            "examples": [],
            "register": []
        }
    ]
}

# Re-inject strictly
final_data = []
cnt_h = cnt_i = cnt_l = cnt_mr = cnt_my = cnt_mn = cnt_u = 0

for item in oxford_data:
    w = item['word']
    
    if w.lower() == 'house':
        if cnt_h == 0:
            final_data.append(ENTRY_HOUSE_NOUN)
        else:
            final_data.append(ENTRY_HOUSE_VERB)
        cnt_h += 1
    elif w.lower() == 'it':
        if cnt_i == 0:
            final_data.append(ENTRY_IT_NOUN)
        else:
            final_data.append(ENTRY_IT_PRONOUN)
        cnt_i += 1
    elif w.lower() == 'live':
        if cnt_l == 0:
            final_data.append(ENTRY_LIVE_VERB)
        elif cnt_l == 1:
            final_data.append(ENTRY_LIVE_ADJ)
        else:
            final_data.append(ENTRY_LIVE_ADV)
        cnt_l += 1
    elif w.lower() == 'march':
        if cnt_mr == 0:
            final_data.append(ENTRY_MARCH_NOUN)
        else:
            final_data.append(ENTRY_MARCH_VERB_NOUN)
        cnt_mr += 1
    elif w.lower() == 'may':
        if cnt_my == 0:
            final_data.append(ENTRY_MAY_NOUN)
        else:
            final_data.append(ENTRY_MAY_MODAL)
        cnt_my += 1
    elif w.lower() == 'minute':
        if cnt_mn == 0:
            final_data.append(ENTRY_MINUTE_NOUN)
        else:
            final_data.append(ENTRY_MINUTE_ADJ)
        cnt_mn += 1
    elif w.lower() == 'use':
        if cnt_u == 0:
            final_data.append(ENTRY_USE_VERB)
        else:
            final_data.append(ENTRY_USE_NOUN)
        cnt_u += 1
    elif w == 'wind1':
        final_data.append(ENTRY_WIND1_NOUN)
    elif w == 'wind2':
        final_data.append(ENTRY_WIND2_VERB)
    else:
        final_data.append(item)

print(f"Strict Muller homonyms rebuild complete: {len(final_data)} items!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
