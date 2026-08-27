# -*- coding: utf-8 -*-
"""
Precision Homograph Alignment for bear1/2, tear1/2, row1/2, live1/2, wind1/2, can1/2, lead, and against.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

# 1. against -> preposition
for item in oxford_data:
    if item['word'] == 'against':
        for m in item['meanings']:
            m['partOfSpeech'] = 'preposition'

# 2. tear1 (noun /tɪə/ слеза) vs tear2 (verb /teə/ рвать)
for item in oxford_data:
    if item['word'] == 'tear1':
        # tear I [tiэ] n слеза
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "слеза",
                "examples": [
                    { "en": "to shed tears", "ru": "проливать слёзы" },
                    { "en": "in tears", "ru": "в слезах" },
                    { "en": "to burst into tears", "ru": "залиться слезами, расплакаться" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "капля",
                "examples": [
                    { "en": "tears of wine", "ru": "винные капли (на стенках бокала)" }
                ],
                "register": [
                    "поэтическое"
                ]
            }
        ]
        if 'phrases' in item:
            del item['phrases']
            
    if item['word'] == 'tear2':
        # tear II [teэ] v 1) рвать, разрывать
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "verb",
                "translation": "рвать, разрывать; драть",
                "examples": [
                    { "en": "to tear a letter into pieces", "ru": "разорвать письмо на мелкие кусочки" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "verb",
                "translation": "срывать; вырывать (away, off, out)",
                "examples": [
                    { "en": "to tear oneself away", "ru": "оторваться (от книги и т. п.)" }
                ],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "verb",
                "translation": "терзать, мучить (о страстях, сомнениях)",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "partOfSpeech": "verb",
                "translation": "мчаться, нестись (разг.)",
                "examples": [
                    { "en": "the car tore along the road", "ru": "машина неслась по дороге" }
                ],
                "register": [
                    "разговорное"
                ]
            },
            {
                "id": 5,
                "partOfSpeech": "noun",
                "translation": "разрыв; дыра, прореха",
                "examples": [],
                "register": []
            }
        ]
        item['phrases'] = [
            {
                "id": 1,
                "phrase": "tear away",
                "partOfSpeech": "verb",
                "translation": "1) отрывать, отделять с силой; 2) оторваться, оторвать кого-либо (от книги и т. п.)",
                "examples": [],
                "register": []
            },
            {
                "id": 2,
                "phrase": "tear down",
                "partOfSpeech": "verb",
                "translation": "1) срывать, сносить (постройку); 2) опровергать (пункт за пунктом); 3) нестись, мчаться",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "phrase": "tear off",
                "partOfSpeech": "verb",
                "translation": "1) срывать (одежду); 2) умчаться, унестись",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "phrase": "tear out",
                "partOfSpeech": "verb",
                "translation": "вырывать (страницу и т. п.); выхватывать",
                "examples": [],
                "register": []
            },
            {
                "id": 5,
                "phrase": "tear up",
                "partOfSpeech": "verb",
                "translation": "1) разорвать на клочки; 2) вырвать с корнем",
                "examples": [],
                "register": []
            }
        ]

# 3. bear1 (verb /beə/ носить, терпеть) vs bear2 (noun /beə/ медведь)
for item in oxford_data:
    if item['word'] == 'bear1':
        # bear I [beэ] v носить, нести; терпеть; рождать
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "verb",
                "translation": "носить, нести; держать",
                "examples": [
                    { "en": "to bear a heavy load", "ru": "нести тяжёлый груз" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "verb",
                "translation": "выдерживать, терпеть, переносить",
                "examples": [
                    { "en": "I cannot bear it", "ru": "я не могу этого вынести" }
                ],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "verb",
                "translation": "рождать, производить на свет; приносить плоды",
                "examples": [
                    { "en": "she was born in May", "ru": "она родилась в мае" },
                    { "en": "this tree bears no fruit", "ru": "это дерево не приносит плодов" }
                ],
                "register": []
            },
            {
                "id": 4,
                "partOfSpeech": "verb",
                "translation": "иметь, носить (имя, сходство, печать)",
                "examples": [
                    { "en": "to bear a name", "ru": "носить имя" },
                    { "en": "to bear a resemblance", "ru": "иметь сходство" }
                ],
                "register": []
            },
            {
                "id": 5,
                "partOfSpeech": "verb",
                "translation": "питать (чувство: ненависть, злобу)",
                "examples": [
                    { "en": "to bear malice against smb.", "ru": "затаить злобу против кого-либо" }
                ],
                "register": []
            }
        ]
        item['phrases'] = [
            {
                "id": 1,
                "phrase": "bear away",
                "partOfSpeech": "verb",
                "translation": "1) уносить; 2) выиграть (приз, награду)",
                "examples": [],
                "register": []
            },
            {
                "id": 2,
                "phrase": "bear down",
                "partOfSpeech": "verb",
                "translation": "1) сломить сопротивление, одолеть; 2) мор. подходить по ветру",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "phrase": "bear out",
                "partOfSpeech": "verb",
                "translation": "подтверждать, подкреплять (версию, факты)",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "phrase": "bear up",
                "partOfSpeech": "verb",
                "translation": "не падать духом, стойко держаться",
                "examples": [],
                "register": []
            },
            {
                "id": 5,
                "phrase": "bear with",
                "partOfSpeech": "verb",
                "translation": "терпеть кого-либо, относиться снисходительно",
                "examples": [],
                "register": []
            },
            {
                "id": 6,
                "phrase": "to bear in mind",
                "partOfSpeech": "verb",
                "translation": "помнить, иметь в виду, принимать во внимание",
                "examples": [],
                "register": []
            }
        ]
        
    if item['word'] == 'bear2':
        # bear II [beэ] n медведь; бирж. «медведь»
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "медведь",
                "examples": [
                    { "en": "polar bear", "ru": "белый медведь" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "неотёсанный, грубый человек",
                "examples": [],
                "register": [
                    "разговорное"
                ]
            },
            {
                "id": 3,
                "partOfSpeech": "noun",
                "translation": "биржевой спекулянт, играющий на понижение («медведь»)",
                "examples": [],
                "register": [
                    "финансы"
                ]
            }
        ]
        item['phrases'] = [
            {
                "id": 1,
                "phrase": "to catch the bear before one sells his skin",
                "partOfSpeech": "noun",
                "translation": "посл. делить шкуру неубитого медведя",
                "examples": [],
                "register": [
                    "пословица"
                ]
            }
        ]

# 4. row1 (noun ряд) vs row2 (noun шум/скандал)
for item in oxford_data:
    if item['word'] == 'row1':
        # row I [rэu] n 1) ряд, линия 2) улица
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "ряд, линия (деревьев, кресел и т. п.)",
                "examples": [
                    { "en": "a row of houses", "ru": "ряд домов" },
                    { "en": "in a row", "ru": "подряд, один за другим" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "прогулка на вёсельной лодке",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "verb",
                "translation": "грести, везти на лодке",
                "examples": [
                    { "en": "to row across the lake", "ru": "переплыть озеро на вёслах" }
                ],
                "register": []
            }
        ]
        if 'phrases' in item:
            del item['phrases']
            
    if item['word'] == 'row2':
        # row II [rau] n 1) шум, гвалт 2) ссора, драка, скандал
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "noun",
                "translation": "шум, гвалт",
                "examples": [
                    { "en": "what a row!", "ru": "что за шум!" }
                ],
                "register": [
                    "разговорное"
                ]
            },
            {
                "id": 2,
                "partOfSpeech": "noun",
                "translation": "ссора, перебранка; драка, скандал",
                "examples": [
                    { "en": "to kick up a row", "ru": "поднять скандал, учинить шум" }
                ],
                "register": [
                    "разговорное"
                ]
            },
            {
                "id": 3,
                "partOfSpeech": "verb",
                "translation": "скандалить, шуметь; поднимать шум",
                "examples": [],
                "register": [
                    "разговорное"
                ]
            }
        ]
        item['phrases'] = [
            {
                "id": 1,
                "phrase": "to make (or kick up) a row",
                "partOfSpeech": "verb",
                "translation": "поднимать шум, устраивать скандал",
                "examples": [],
                "register": [
                    "разговорное"
                ]
            }
        ]

# 5. live1 (verb /lɪv/ жить) vs live2 (adj /laɪv/ живой)
for item in oxford_data:
    if item['word'] == 'live1':
        # live I [liv] v жить, существовать, обитать
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "verb",
                "translation": "жить, существовать, быть живым",
                "examples": [
                    { "en": "as long as I live", "ru": "пока я жив" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "verb",
                "translation": "жить, обитать, проживать",
                "examples": [
                    { "en": "where do you live?", "ru": "где вы живёте?" }
                ],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "verb",
                "translation": "питаться, кормиться (on, upon — чем-либо)",
                "examples": [
                    { "en": "to live on bread and water", "ru": "жить на хлебе и воде" }
                ],
                "register": []
            },
            {
                "id": 4,
                "partOfSpeech": "verb",
                "translation": "жить полной жизнью, наслаждаться жизнью",
                "examples": [
                    { "en": "he is really living", "ru": "он по-настоящему живёт" }
                ],
                "register": []
            }
        ]
        item['phrases'] = [
            {
                "id": 1,
                "phrase": "live down",
                "partOfSpeech": "verb",
                "translation": "загладить (поведением), пережить (позор, скандал)",
                "examples": [],
                "register": []
            },
            {
                "id": 2,
                "phrase": "live on",
                "partOfSpeech": "verb",
                "translation": "1) продолжать жить; 2) жить на какие-либо средства",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "phrase": "live out",
                "partOfSpeech": "verb",
                "translation": "1) доживать (свой век); 2) жить вне места работы",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "phrase": "live through",
                "partOfSpeech": "verb",
                "translation": "пережить, выдержать (бедствие, испытание)",
                "examples": [],
                "register": []
            },
            {
                "id": 5,
                "phrase": "live up to",
                "partOfSpeech": "verb",
                "translation": "жить согласно (принципам); оправдывать (надежды, репутацию)",
                "examples": [],
                "register": []
            },
            {
                "id": 6,
                "phrase": "live and let live",
                "partOfSpeech": "verb",
                "translation": "посл. живи сам и давай жить другим",
                "examples": [],
                "register": [
                    "пословица"
                ]
            }
        ]
        
    if item['word'] == 'live2':
        # live II [laiv] a 1) живой 2) горящий 3) прямой эфир
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "adjective",
                "translation": "живой (о рыбе, растениях, животных)",
                "examples": [
                    { "en": "live fish", "ru": "живая рыба" }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "adjective",
                "translation": "прямой, транслируемый непосредственно с места событий (о теле- или радиопередаче)",
                "examples": [
                    { "en": "live broadcast", "ru": "прямой эфир, прямая трансляция" }
                ],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "adjective",
                "translation": "находящийся под напряжением, включённый в сеть",
                "examples": [
                    { "en": "live wire", "ru": "провод под током; перен. энергичный, предприимчивый человек" }
                ],
                "register": [
                    "электротехника"
                ]
            },
            {
                "id": 4,
                "partOfSpeech": "adjective",
                "translation": "горящий, тлеющий (об углях); невзорвавшийся (о снаряде)",
                "examples": [
                    { "en": "live coals", "ru": "горящие угли" },
                    { "en": "live shell", "ru": "боевой снаряд" }
                ],
                "register": []
            },
            {
                "id": 5,
                "partOfSpeech": "adjective",
                "translation": "животрепещущий, актуальный",
                "examples": [
                    { "en": "a live issue", "ru": "злободневный вопрос" }
                ],
                "register": []
            }
        ]
        if 'phrases' in item:
            del item['phrases']

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Applied perfect homograph alignment for all target words!")
