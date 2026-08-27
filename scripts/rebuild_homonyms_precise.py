# -*- coding: utf-8 -*-
"""
Perfect Rebuilder for Homonym Entries:
1. IT (B1 noun /ˌaɪ ˈtiː/) vs it (A1 pronoun /ɪt/)
2. March (A1 noun /mɑːtʃ/) vs march (A2 verb/noun /mɑːtʃ/)
3. May (A1 noun /meɪ/) vs may (A2 verb /meɪ/)
4. house (A1 noun /haʊs/) vs house (B2 verb /haʊz/)
5. live (A1 verb /lɪv/) vs live (B1 adj /laɪv/) vs live (B2 adv /laɪv/)
6. minute (A1 noun /ˈmɪnɪt/) vs minute (B2 adj /maɪˈnjuːt/)
7. use (A1 verb /juːz/) vs use (A2 noun /juːs/)
8. wind1 (A1 noun /wɪnd/) vs wind2 (B1 verb /waɪnd/) (removes duplicate copy)
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Build precise objects for each homonym entry
ENTRY_IT_NOUN = {
    "word": "IT",
    "frequency_rank": 12,
    "cefr": "b1",
    "phon_br": "/ˌaɪ ˈtiː/",
    "phon_n_am": "/ˌaɪ ˈtiː/",
    "lists": { "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "информационные технологии (сокр. от Information Technology)",
            "examples": [
                { "en": "IT department", "ru": "отдел информационных технологий" },
                { "en": "IT specialist", "ru": "специалист по информационным технологиям" }
            ],
            "register": []
        }
    ]
}

ENTRY_IT_PRONOUN = {
    "word": "it",
    "frequency_rank": 12,
    "cefr": "a1",
    "phon_br": "/ɪt/",
    "phon_n_am": "/ɪt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "pronoun",
            "translation": "он, она, оно (о неодушевлённых предметах и животных)",
            "examples": [
                { "en": "here is your book, take it", "ru": "вот твоя книга, возьми её" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "pronoun",
            "translation": "это (в роли указательного местоимения)",
            "examples": [
                { "en": "who is it?", "ru": "кто это?" },
                { "en": "it is me", "ru": "это я" }
            ],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "pronoun",
            "translation": "безличное подлежащее (не переводится)",
            "examples": [
                { "en": "it is raining", "ru": "идёт дождь" },
                { "en": "it is cold", "ru": "холодно" },
                { "en": "it is late", "ru": "поздно" }
            ],
            "register": []
        }
    ]
}

ENTRY_MARCH_NOUN = {
    "word": "March",
    "frequency_rank": 457,
    "cefr": "a1",
    "phon_br": "/mɑːtʃ/",
    "phon_n_am": "/mɑːrtʃ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "март",
            "examples": [
                { "en": "in March", "ru": "в марте" },
                { "en": "the beginning of March", "ru": "начало марта" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "в роли определения к другому слову (мартовский)",
            "examples": [
                { "en": "March wind", "ru": "мартовский ветер" }
            ],
            "register": []
        }
    ]
}

ENTRY_MARCH_VERB_NOUN = {
    "word": "march",
    "frequency_rank": 457,
    "cefr": "a2",
    "phon_br": "/mɑːtʃ/",
    "phon_n_am": "/mɑːrtʃ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "маршировать; двигаться походным порядком; шагать",
            "examples": [
                { "en": "soldiers marched through the town", "ru": "солдаты промаршировали через город" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "марш; походное движение; суточный переход",
            "examples": [
                { "en": "day's march", "ru": "суточный переход" }
            ],
            "register": [
                "военное"
            ]
        },
        {
            "id": 3,
            "partOfSpeech": "noun",
            "translation": "марш (музыкальное произведение)",
            "examples": [
                { "en": "funeral march", "ru": "траурный марш" },
                { "en": "wedding march", "ru": "свадебный марш" }
            ],
            "register": [
                "музыка"
            ]
        },
        {
            "id": 4,
            "partOfSpeech": "noun",
            "translation": "ход, развитие, поступь (событий, времени)",
            "examples": [
                { "en": "the march of time", "ru": "поступь времени" },
                { "en": "the march of events", "ru": "ход событий" }
            ],
            "register": []
        }
    ],
    "phrases": [
        {
            "id": 1,
            "phrase": "march on",
            "partOfSpeech": "verb",
            "translation": "1) двигаться вперёд; 2) наступать",
            "examples": [],
            "register": []
        },
        {
            "id": 2,
            "phrase": "march out",
            "partOfSpeech": "verb",
            "translation": "выступать (в поход)",
            "examples": [],
            "register": []
        }
    ]
}

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
            "examples": [
                { "en": "in May", "ru": "в мае" },
                { "en": "the first of May", "ru": "первое мая" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "цветок боярышника",
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
            "translation": "в роли определения к другому слову (майский)",
            "examples": [
                { "en": "May morning", "ru": "майское утро" }
            ],
            "register": []
        }
    ]
}

ENTRY_MAY_MODAL = {
    "word": "may",
    "frequency_rank": 99,
    "cefr": "a2",
    "phon_br": "/meɪ/",
    "phon_n_am": "/meɪ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "мочь, иметь возможность (выражает разрешение или просьбу)",
            "examples": [
                { "en": "may I come in?", "ru": "можно войти?" },
                { "en": "you may go", "ru": "вы можете идти" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "verb",
            "translation": "возможно, быть вероятным (выражает предположение или сомнение)",
            "examples": [
                { "en": "it may be true", "ru": "возможно, это правда" },
                { "en": "he may come tomorrow", "ru": "возможно, он придёт завтра" },
                { "en": "the train may be late", "ru": "поезд может опоздать" }
            ],
            "register": []
        }
    ]
}

ENTRY_HOUSE_NOUN = {
    "word": "house",
    "frequency_rank": 164,
    "cefr": "a1",
    "phon_br": "/haʊs/",
    "phon_n_am": "/haʊs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "дом; жилище; здание",
            "examples": [
                { "en": "a brick house", "ru": "кирпичный дом" },
                { "en": "to build a house", "ru": "строить дом" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "домашние, семья, домашнее хозяйство",
            "examples": [
                { "en": "to keep house", "ru": "вести домашнее хозяйство" }
            ],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "noun",
            "translation": "палата (парламента)",
            "examples": [
                { "en": "the House of Commons", "ru": "палата общин" },
                { "en": "the House of Lords", "ru": "палата лордов" }
            ],
            "register": [
                "парламентский термин"
            ]
        },
        {
            "id": 4,
            "partOfSpeech": "noun",
            "translation": "театр, зрительный зал; публика, зрители",
            "examples": [
                { "en": "full house", "ru": "аншлаг" }
            ],
            "register": [
                "театр"
            ]
        },
        {
            "id": 5,
            "partOfSpeech": "noun",
            "translation": "фирма, коммерческое предприятие, торговый дом",
            "examples": [
                { "en": "publishing house", "ru": "издательство" }
            ],
            "register": [
                "коммерческое"
            ]
        }
    ]
}

ENTRY_HOUSE_VERB = {
    "word": "house",
    "frequency_rank": 164,
    "cefr": "b2",
    "phon_br": "/haʊz/",
    "phon_n_am": "/haʊz/",
    "lists": { "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "предоставлять жилье (или убежище); селить, размещать (жильцов, войска)",
            "examples": [
                { "en": "the refugees were housed in temporary shelters", "ru": "беженцев разместили во временных убежищах" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "verb",
            "translation": "вмещать, содержать в себе; служить хранилищем (для коллекции, библиотеки)",
            "examples": [
                { "en": "the museum houses a valuable collection of paintings", "ru": "в музее хранится ценная коллекция картин" }
            ],
            "register": []
        }
    ]
}

ENTRY_LIVE_VERB = {
    "word": "live",
    "frequency_rank": 234,
    "cefr": "a1",
    "phon_br": "/lɪv/",
    "phon_n_am": "/lɪv/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "жить; существовать; обитать",
            "examples": [
                { "en": "to live in a city", "ru": "жить в городе" },
                { "en": "to live to be eighty", "ru": "дожить до восьмидесяти лет" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "verb",
            "translation": "питаться (чем-либо: on)",
            "examples": [
                { "en": "to live on fruit and vegetables", "ru": "питаться фруктами и овощами" }
            ],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "verb",
            "translation": "жить на какие-либо средства (on/by)",
            "examples": [
                { "en": "to live within one's income", "ru": "жить по средствам" },
                { "en": "to live beyond one's means", "ru": "жить не по средствам" }
            ],
            "register": []
        }
    ],
    "phrases": [
        { "id": 1, "phrase": "live down", "partOfSpeech": "verb", "translation": "загладить, искупить (поведением, жизнью)", "examples": [], "register": [] },
        { "id": 2, "phrase": "live in", "partOfSpeech": "verb", "translation": "жить по месту работы", "examples": [], "register": [] },
        { "id": 3, "phrase": "live off", "partOfSpeech": "verb", "translation": "жить за счёт (кого-либо / чего-либо)", "examples": [], "register": [] },
        { "id": 4, "phrase": "live out", "partOfSpeech": "verb", "translation": "1) жить вне места работы; 2) доживать (свой век)", "examples": [], "register": [] },
        { "id": 5, "phrase": "live through", "partOfSpeech": "verb", "translation": "пережить, выдержать (испытание)", "examples": [], "register": [] }
    ]
}

ENTRY_LIVE_ADJ = {
    "word": "live",
    "frequency_rank": 234,
    "cefr": "b1",
    "phon_br": "/laɪv/",
    "phon_n_am": "/laɪv/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "adjective",
            "translation": "живой, не мёртвый",
            "examples": [
                { "en": "live fish", "ru": "живая рыба" },
                { "en": "live animals", "ru": "живые животные" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "adjective",
            "translation": "в прямом эфире, транслируемый с места событий (без предварительной записи)",
            "examples": [
                { "en": "a live broadcast", "ru": "прямая трансляция" },
                { "en": "live concert", "ru": "живой концерт" }
            ],
            "register": [
                "радио",
                "телевидение"
            ]
        },
        {
            "id": 3,
            "partOfSpeech": "adjective",
            "translation": "под напряжением (о проводе)",
            "examples": [
                { "en": "a live wire", "ru": "провод под напряжением" }
            ],
            "register": [
                "электротехника"
            ]
        },
        {
            "id": 4,
            "partOfSpeech": "adjective",
            "translation": "животрепещущий, актуальный",
            "examples": [
                { "en": "a live issue", "ru": "актуальный вопрос" }
            ],
            "register": []
        }
    ]
}

ENTRY_LIVE_ADV = {
    "word": "live",
    "frequency_rank": 234,
    "cefr": "b2",
    "phon_br": "/laɪv/",
    "phon_n_am": "/laɪv/",
    "lists": { "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "adverb",
            "translation": "в прямом эфире, вживую, непосредственно",
            "examples": [
                { "en": "the match was broadcast live", "ru": "матч транслировался в прямом эфире" },
                { "en": "to perform live", "ru": "выступать вживую" }
            ],
            "register": [
                "радио",
                "телевидение"
            ]
        }
    ]
}

ENTRY_MINUTE_NOUN = {
    "word": "minute",
    "frequency_rank": 873,
    "cefr": "a1",
    "phon_br": "/ˈmɪnɪt/",
    "phon_n_am": "/ˈmɪnɪt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "минута (единица времени, а также 1/60 часть градуса в геометрии и астрономии)",
            "examples": [
                { "en": "wait a minute", "ru": "подождите минуту" },
                { "en": "in ten minutes", "ru": "через десять минут" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "мгновение, момент",
            "examples": [
                { "en": "just a minute!", "ru": "одну минутку!, сию секунду!" },
                { "en": "in a minute", "ru": "сейчас, сию минуту" },
                { "en": "to the minute", "ru": "минута в минуту, пунктуально" }
            ],
            "register": []
        }
    ]
}

ENTRY_MINUTE_ADJ = {
    "word": "minute",
    "frequency_rank": 873,
    "cefr": "b2",
    "phon_br": "/maɪˈnjuːt/",
    "phon_n_am": "/maɪˈnjuːt/",
    "lists": { "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "adjective",
            "translation": "мелкий, мельчайший, крошечный",
            "examples": [
                { "en": "minute particles of dust", "ru": "мельчайшие частицы пыли" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "adjective",
            "translation": "подробный, детальный, тщательный",
            "examples": [
                { "en": "minute examination", "ru": "тщательный осмотр" },
                { "en": "minute description", "ru": "подробное описание" }
            ],
            "register": []
        }
    ]
}

ENTRY_USE_VERB = {
    "word": "use",
    "frequency_rank": 136,
    "cefr": "a1",
    "phon_br": "/juːz/",
    "phon_n_am": "/juːz/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "употреблять, применять; пользоваться, использовать",
            "examples": [
                { "en": "may I use your phone?", "ru": "можно воспользоваться вашим телефоном?" },
                { "en": "to use a dictionary", "ru": "пользоваться словарём" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "verb",
            "translation": "расходовать, тратить",
            "examples": [
                { "en": "to use too much electricity", "ru": "расходовать слишком много электроэнергии" }
            ],
            "register": []
        }
    ],
    "phrases": [
        {
            "id": 1,
            "phrase": "use up",
            "partOfSpeech": "verb",
            "translation": "израсходовать, истощить; использовать полностью",
            "examples": [],
            "register": []
        }
    ]
}

ENTRY_USE_NOUN = {
    "word": "use",
    "frequency_rank": 136,
    "cefr": "a2",
    "phon_br": "/juːs/",
    "phon_n_am": "/juːs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "употребление, применение; использование",
            "examples": [
                { "en": "for external use only", "ru": "только для наружного применения" },
                { "en": "in common use", "ru": "в широком употреблении" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "польза, толк; выгода",
            "examples": [
                { "en": "what is the use of waiting?", "ru": "какой толк ждать?" },
                { "en": "it's no use", "ru": "это бесполезно" }
            ],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "noun",
            "translation": "право пользования",
            "examples": [
                { "en": "to have the use of a car", "ru": "иметь возможность пользоваться машиной" }
            ],
            "register": [
                "юридическое"
            ]
        }
    ]
}

ENTRY_WIND1_NOUN = {
    "word": "wind1",
    "frequency_rank": 1153,
    "cefr": "a1",
    "phon_br": "/wɪnd/",
    "phon_n_am": "/wɪnd/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "ветер",
            "examples": [
                { "en": "strong wind", "ru": "сильный ветер" },
                { "en": "north wind", "ru": "северный ветер" },
                { "en": "before the wind", "ru": "по ветру" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "noun",
            "translation": "дыхание, одышка",
            "examples": [
                { "en": "to get one's wind back", "ru": "перевести дух, отдышаться" }
            ],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "noun",
            "translation": "чутьё, нюх",
            "examples": [],
            "register": [
                "охота"
            ]
        }
    ]
}

ENTRY_WIND2_VERB = {
    "word": "wind2",
    "frequency_rank": 1153,
    "cefr": "b1",
    "phon_br": "/waɪnd/",
    "phon_n_am": "/waɪnd/",
    "lists": { "oxford5000": True },
    "meanings": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "вертеть, крутить; вить, скручивать; наматывать, мотать",
            "examples": [
                { "en": "to wind wool into a ball", "ru": "сматывать шерсть в клубок" }
            ],
            "register": []
        },
        {
            "id": 2,
            "partOfSpeech": "verb",
            "translation": "виться, извиваться (о реке, дороге)",
            "examples": [
                { "en": "the river winds through the valley", "ru": "река извивается по долине" }
            ],
            "register": []
        },
        {
            "id": 3,
            "partOfSpeech": "verb",
            "translation": "заводить (часы или механизм: тж. ~ up)",
            "examples": [
                { "en": "to wind a clock", "ru": "заводить часы" }
            ],
            "register": []
        }
    ],
    "phrases": [
        {
            "id": 1,
            "phrase": "wind up",
            "partOfSpeech": "verb",
            "translation": "1) заводить (механизм); 2) завершать, заканчивать (дела); 3) ликвидировать (предприятие)",
            "examples": [],
            "register": []
        }
    ]
}

# Now reconstruct the final 4,980 items without the accidental double copy of wind1/wind2
new_dataset = []
seen_wind1 = False
seen_wind2 = False

# We iterate through the existing list, replacing homonyms with their dedicated precise objects
for idx, item in enumerate(oxford_data):
    w = item['word']
    rank = item.get('frequency_rank')
    cefr = item.get('cefr')
    
    # 1. it / IT
    if w.lower() == 'it':
        if cefr == 'b1':
            new_dataset.append(ENTRY_IT_NOUN)
        else:
            new_dataset.append(ENTRY_IT_PRONOUN)
    # 2. March / march
    elif w.lower() == 'march':
        if cefr == 'a1':
            new_dataset.append(ENTRY_MARCH_NOUN)
        else:
            new_dataset.append(ENTRY_MARCH_VERB_NOUN)
    # 3. May / may
    elif w.lower() == 'may':
        if cefr == 'a1':
            new_dataset.append(ENTRY_MAY_NOUN)
        else:
            new_dataset.append(ENTRY_MAY_MODAL)
    # 4. house
    elif w == 'house':
        if cefr == 'a1':
            new_dataset.append(ENTRY_HOUSE_NOUN)
        else:
            new_dataset.append(ENTRY_HOUSE_VERB)
    # 5. live
    elif w == 'live':
        if cefr == 'a1':
            new_dataset.append(ENTRY_LIVE_VERB)
        elif cefr == 'b1':
            new_dataset.append(ENTRY_LIVE_ADJ)
        else:
            new_dataset.append(ENTRY_LIVE_ADV)
    # 6. minute
    elif w == 'minute':
        if cefr == 'a1':
            new_dataset.append(ENTRY_MINUTE_NOUN)
        else:
            new_dataset.append(ENTRY_MINUTE_ADJ)
    # 7. use
    elif w == 'use':
        if cefr == 'a1':
            new_dataset.append(ENTRY_USE_VERB)
        else:
            new_dataset.append(ENTRY_USE_NOUN)
    # 8. wind1 / wind2
    elif w == 'wind1':
        if not seen_wind1:
            new_dataset.append(ENTRY_WIND1_NOUN)
            seen_wind1 = True
    elif w == 'wind2':
        if not seen_wind2:
            new_dataset.append(ENTRY_WIND2_VERB)
            seen_wind2 = True
    else:
        new_dataset.append(item)

print(f"Reconstructed dataset: {len(new_dataset)} items (removed exact duplicate pair of wind1/wind2, kept all unique Oxford entries)!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(new_dataset, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
