# -*- coding: utf-8 -*-
"""
Extended Grammar, Reference and POS overrides for:
born, boom, more, most, best, could, further, last, latter, least, less, lower, might, should, worse, worst, would,
backwards, dual, look, remain, the, a, OK, I, programme, abstract, nature, behalf, cabin, random, sake, camp,
genius, money, mouse, penny, photo, referendum, staff,
abandon, abortion, access, about, above, abroad, absent, absolute, absolutely, absorb, attraction, able, flee,
lawsuit, sister, AIDS, aim, resistance, series, special, punk, solicitor, nor.
"""

GRAMMAR_REFERENCE_FIXES = {
    'nest': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'гнездо',
                'examples': [
                    {'en': 'a bird’s nest', 'ru': 'птичье гнездо'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'выводок',
                'examples': [
                    {'en': 'a nest of mice', 'ru': 'выводок мышей'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'свой дом; уютный уголок, кров',
                'examples': [
                    {'en': 'grown children who have left the nest', 'ru': 'взрослые дети, покинувшие родное гнездо'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'группа, набор (подобных предметов, входящих один в другой; обыкн. of)',
                'examples': [
                    {'en': 'a nest of tables', 'ru': 'набор столиков, задвигающихся один под другой'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'притон, шайка, осиное гнездо (обыкн. of)',
                'examples': [
                    {'en': 'a nest of thieves', 'ru': 'воровской притон; шайка воров'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'вить гнездо, гнездиться',
                'examples': [
                    {'en': 'birds nesting in the trees', 'ru': 'птицы, гнездящиеся на деревьях'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'вставлять один предмет в другой (о коробках, столах и т.п.)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'разорять гнёзда',
                'examples': [
                    {'en': 'to go nesting', 'ru': 'охотиться за птичьими гнёздами'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'nest egg',
                'ru': 'заначка, сбережения на чёрный день'
            },
            {
                'en': 'to feather one’s nest',
                'ru': 'набивать себе карман, греть руки'
            }
        ]
    },
    'sleep': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'сон',
                'examples': [
                    {'en': 'light / deep / sound sleep', 'ru': 'чуткий / глубокий / крепкий сон'},
                    {'en': 'to go to sleep', 'ru': 'засыпать'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'спячка',
                'examples': [
                    {'en': 'winter sleep', 'ru': 'зимняя спячка'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'спать',
                'examples': [
                    {'en': 'to sleep well', 'ru': 'хорошо спать'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'ночевать (обыкн. at, in)',
                'examples': [
                    {'en': 'he slept at a hotel', 'ru': 'он переночевал в гостинице'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'покоиться в могиле, спать вечным сном',
                'examples': [],
                'register': ['поэтическое']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'предоставлять ночлег, иметь спальные места (о гостинице, каюте)',
                'examples': [
                    {'en': 'the tent sleeps four', 'ru': 'палатка рассчитана на четверых'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'спать с кем-либо, иметь интимную связь (with)',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'to sleep on it',
                'ru': 'отложить решение до утра (утро вечера мудренее)'
            },
            {
                'en': 'to sleep like a log / top',
                'ru': 'спать как убитый, спать как сурок'
            },
            {
                'en': 'sleep around',
                'ru': 'вести беспорядочную половую жизнь, спать с кем попало'
            },
            {
                'en': 'sleep in',
                'ru': 'спать допоздна, отсыпаться'
            },
            {
                'en': 'sleep off',
                'ru': 'проспаться, выспавшись избавиться от чего-либо'
            },
            {
                'en': 'sleep out',
                'ru': 'ночевать вне дома; не жить по месту работы (о прислуге)'
            },
            {
                'en': 'sleep through',
                'ru': 'проспать, спать не просыпаясь (несмотря на шум и т.п.)'
            },
            {
                'en': 'sleep over',
                'ru': 'переночевать в гостях, остаться на ночь'
            }
        ]
    },
    'wire': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'проволока',
                'examples': [
                    {'en': 'barbed wire', 'ru': 'колючая проволока'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'электрический провод, проводка',
                'examples': [
                    {'en': 'live wire', 'ru': 'провод под напряжением'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'телеграфная связь; телеграмма',
                'examples': [
                    {'en': 'send a wire', 'ru': 'послать телеграмму'}
                ],
                'register': ['разговорное']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'связывать, скреплять проволокой',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'проводить проводку, электрифицировать; подключать',
                'examples': [
                    {'en': 'to wire a house', 'ru': 'провести проводку в доме'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'телеграфировать, отправлять телеграмму (тж. wire off)',
                'examples': [
                    {'en': 'wire me when you arrive', 'ru': 'телеграфируй мне, когда приедешь'}
                ],
                'register': ['разговорное']
            }
        ],
        'phrases': [
            {
                'en': 'down to the wire',
                'ru': 'до самого последнего момента, до победного конца'
            },
            {
                'en': 'live wire',
                'ru': 'энергичный, деятельный человек; живчик'
            }
        ]
    },
    'slip': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'скольжение; спотыкание, падение',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'промах, ошибка (обыкн. мелкая)',
                'examples': [
                    {'en': 'a slip of the tongue', 'ru': 'оговорка'},
                    {'en': 'a slip of the pen', 'ru': 'описка'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'комбинация, нижняя юбка',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'листок, полоска (бумаги); бланк, талон',
                'examples': [
                    {'en': 'a slip of paper', 'ru': 'полоска / листок бумаги'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'побег, отросток, черенок',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'во мн.ч. кулисы',
                'examples': [],
                'register': ['театр']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'скользить; поскользнуться, оступиться',
                'examples': [
                    {'en': 'he slipped on the ice', 'ru': 'он поскользнулся на льду'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'ускользать, незаметно уходить или прокрадываться',
                'examples': [
                    {'en': 'time slips away', 'ru': 'время незаметно летит'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'быстро и незаметно сунуть, вложить',
                'examples': [
                    {'en': 'he slipped the letter into his pocket', 'ru': 'он незаметно сунул письмо в карман'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'быстро надеть или сбросить одежду (slip on / slip off)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'ухудшаться, снижаться (о показателях, стандартах)',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'to give someone the slip',
                'ru': 'ускользнуть от кого-либо, скрыться'
            },
            {
                'en': 'slip away',
                'ru': 'ускользнуть, незаметно уйти'
            },
            {
                'en': 'slip down',
                'ru': 'легко питься, легко глотаться (о напитке и т.п.)'
            },
            {
                'en': 'slip in / into',
                'ru': 'незаметно проскользнуть внутрь; быстро одеться'
            },
            {
                'en': 'slip off',
                'ru': 'соскользнуть; быстро сбросить одежду или обувь'
            },
            {
                'en': 'slip on',
                'ru': 'быстро накинуть, надеть одежду'
            },
            {
                'en': 'slip out',
                'ru': 'ускользнуть, незаметно выйти; вырваться (о слове)'
            },
            {
                'en': 'slip up',
                'ru': 'ошибиться, оплошать'
            }
        ]
    },
    'race': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'состязание в беге, гонка; заезд, забег',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(the races; во мн.ч., разг.) скачки, бега (с тотализатором)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'гонка, соперничество, погоня',
                'examples': [
                    {'en': 'electoral race', 'ru': 'предвыборная гонка'},
                    {'en': 'arms race', 'ru': 'гонка вооружений'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'раса; род, племя, человечество',
                'examples': [
                    {'en': 'the human race', 'ru': 'человечество'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'мчаться, нестись (часто race along / up)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'состязаться в скорости, участвовать в гонках (с кем-либо — with, against)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'гнать (автомашину), заставлять работать на повышенных оборотах (о двигателе)',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'the rat race',
                'ru': 'бешеная погоня за успехом, крысиные бега'
            },
            {
                'en': 'race against time',
                'ru': 'гонка со временем, спешка'
            }
        ]
    },
    'step': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'шаг, поступь',
                'examples': [
                    {'en': 'a step forward', 'ru': 'шаг вперёд'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'ступень, ступенька; подножка',
                'examples': [
                    {'en': 'doorstep', 'ru': 'порог, ступенька у двери'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'мера, поступок, шаг (предпринятое действие)',
                'examples': [
                    {'en': 'to take steps', 'ru': 'принимать меры'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'па (в танце)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'ступать, шагать',
                'examples': [
                    {'en': 'he stepped carefully', 'ru': 'он осторожно ступал'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'наступать (на что-либо — step on)',
                'examples': [
                    {'en': 'to step on smb’s foot', 'ru': 'наступить кому-либо на ногу'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'step aside',
                'ru': 'отойти в сторону; уступить место'
            },
            {
                'en': 'step back',
                'ru': 'отступить назад; взглянуть со стороны'
            },
            {
                'en': 'step down',
                'ru': 'уйти в отставку; понизить уровень или напряжение'
            },
            {
                'en': 'step in',
                'ru': 'вмешаться в ситуацию; заглянуть в гости'
            },
            {
                'en': 'step on it',
                'ru': 'прибавить газу, поторопиться'
            },
            {
                'en': 'step out',
                'ru': 'выйти ненадолго; вышагивать'
            },
            {
                'en': 'step up',
                'ru': 'выйти вперёд; увеличить, активизировать (темп, производство)'
            },
            {
                'en': 'step by step',
                'ru': 'шаг за шагом, постепенно'
            },
            {
                'en': 'out of step',
                'ru': 'не в ногу, вразрез с другими'
            }
        ]
    },
    'pace': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'шаг; длина шага',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'скорость, темп',
                'examples': [
                    {'en': 'at a slow pace', 'ru': 'в медленном темпе'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'походка, поступь; аллюр (лошади)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'пейс (мера длины = 75 см)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'шагать, вышагивать; расхаживать взад и вперёд',
                'examples': [
                    {'en': 'he paced up and down the room', 'ru': 'он ходил взад и вперёд по комнате'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'измерять шагами (тж. pace out, pace off)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'задавать темп, лидировать',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'to keep pace with',
                'ru': 'идти в ногу с кем-либо, не отставать'
            },
            {
                'en': 'to set the pace',
                'ru': 'задавать темп; задавать тон'
            },
            {
                'en': 'to put someone through their paces',
                'ru': 'проверить кого-либо в деле, испытать на что способен'
            }
        ]
    },
    'hi': {
        'meanings': [
            {
                'partOfSpeech': 'interjection',
                'translation': 'привет!, алло!',
                'examples': [
                    {'en': 'hi, John!', 'ru': 'здорово, Джон!'},
                    {'en': 'hi there!', 'ru': 'привет!'}
                ],
                'register': ['разговорное']
            }
        ],
        'phrases': []
    },
    'grace': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'грация, изящество, привлекательность',
                'examples': [
                    {'en': 'with grace', 'ru': 'с грацией, изящно'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'приличие, такт',
                'examples': [
                    {'en': 'to have the grace to do smth', 'ru': 'иметь такт / приличие сделать что-либо'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'милость, благоволение; пощада; прощение',
                'examples': [
                    {'en': 'by the grace of God', 'ru': 'божьей милостью'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(Grace) милость, светлость (форма обращения к герцогу, герцогине, архиепископу и т.п.: Your Grace — Ваша светлость / Ваша милость)',
                'examples': [
                    {'en': 'Your Grace', 'ru': 'Ваша светлость / Ваша милость'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'благодать',
                'examples': [],
                'register': ['религия']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'молитва (перед едой или после еды)',
                'examples': [
                    {'en': 'to say grace', 'ru': 'читать благодарственную молитву перед едой'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'отсрочка, отсрочка платежа (days of grace — льготные дни)',
                'examples': [],
                'register': ['коммерция']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'украшать; удостаивать своим присутствием',
                'examples': [
                    {'en': 'to grace the occasion', 'ru': 'украсить событие своим присутствием'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'fall from grace',
                'ru': 'впасть в немилость; оступиться, потерять доверие'
            },
            {
                'en': 'saving grace',
                'ru': 'спасительное свойство, единственный плюс'
            },
            {
                'en': 'with bad grace',
                'ru': 'неохотно, нелюбезно'
            },
            {
                'en': 'with good grace',
                'ru': 'охотно, любезно'
            }
        ]
    },
    'hang': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'вешать, развешивать; висеть',
                'examples': [
                    {'en': 'to hang a picture', 'ru': 'повесить картину'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'вешать, казнить через повешение; быть повешенным',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'склонять, опускать (голову)',
                'examples': [
                    {'en': 'to hang one’s head', 'ru': 'повесить голову'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'обклеивать обоями (стены)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'зависать (о компьютере, программе)',
                'examples': [],
                'register': ['информатика']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'манера висеть; покрой, посадка (платья)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'смысл, суть',
                'examples': [
                    {'en': 'to get the hang of smth', 'ru': 'понять суть чего-либо; освоиться с чем-либо'}
                ],
                'register': ['разговорное']
            }
        ],
        'phrases': [
            {
                'en': 'hang up',
                'ru': 'повесить трубку, прекратить телефонный разговор'
            },
            {
                'en': 'hang on',
                'ru': 'подождать у телефона; держаться, цепляться'
            },
            {
                'en': 'hang out',
                'ru': 'проводить время, тусоваться, зависать'
            },
            {
                'en': 'hang about / around',
                'ru': 'слоняться без дела, околачиваться'
            },
            {
                'en': 'hang back',
                'ru': 'колебаться, не решаться, держаться позади'
            },
            {
                'en': 'hang on to',
                'ru': 'держаться за что-либо; беречь, не отдавать'
            },
            {
                'en': 'to get the hang of',
                'ru': 'уловить суть, научиться, освоиться'
            }
        ]
    },
    'bear2': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'терпеть, выносить, переносить',
                'examples': [
                    {'en': 'I cannot bear it', 'ru': 'я не могу этого выносить'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'нести, носить; держать',
                'examples': [
                    {'en': 'to bear a burden', 'ru': 'нести бремя'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': '(преим. в страд. залоге: be born) рождать, производить на свет',
                'examples': [
                    {'en': 'he was born in May', 'ru': 'он родился в мае'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'плодоносить, приносить плоды',
                'examples': [
                    {'en': 'to bear fruit', 'ru': 'приносить плоды'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'иметь, носить (имя, следы, признаки)',
                'examples': [
                    {'en': 'to bear a resemblance', 'ru': 'иметь сходство'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'питать, испытывать (чувство)',
                'examples': [
                    {'en': 'to bear a grudge', 'ru': 'таить злобу / обиду'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'to bear in mind',
                'ru': 'иметь в виду, помнить'
            },
            {
                'en': 'to bear fruit',
                'ru': 'приносить плоды, давать результаты'
            },
            {
                'en': 'bear with',
                'ru': 'потерпеть, отнестись снисходительно'
            },
            {
                'en': 'bear out',
                'ru': 'подтверждать, подкреплять'
            }
        ]
    },
    'lady': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'леди, дама; госпожа',
                'examples': [
                    {'en': 'young lady', 'ru': 'барышня, девушка'},
                    {'en': 'ladies and gentlemen!', 'ru': 'дамы и господа!'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(Lady) леди (титул знатной дамы)',
                'examples': [
                    {'en': 'Lady Macbeth', 'ru': 'леди Макбет'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'хозяйка (дома)',
                'examples': [
                    {'en': 'the lady of the house', 'ru': 'хозяйка дома'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'дама сердца; возлюбленная',
                'examples': [],
                'register': ['история']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'владычица, повелительница',
                'examples': [
                    {'en': 'Our Lady', 'ru': 'Богоматерь, Пресвятая Дева'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'женский, женского пола',
                'examples': [
                    {'en': 'lady doctor', 'ru': 'женщина-врач'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'lady’s man / ladies’ man',
                'ru': 'дамский угодник, ловелас'
            }
        ]
    },
    'lion': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'лев',
                'examples': [
                    {'en': 'mountain lion', 'ru': 'пума, кугуар'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'знаменитость, предмет всеобщего внимания',
                'examples': [
                    {'en': 'a literary lion', 'ru': 'литературная знаменитость'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(Leo) Лев (созвездие и знак зодиака)',
                'examples': [],
                'register': ['астрономия']
            }
        ],
        'phrases': [
            {
                'en': 'the lion’s share',
                'ru': 'львиная доля'
            }
        ]
    },
    'labour': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'труд (особенно физический)',
                'examples': [
                    {'en': 'manual labour', 'ru': 'физический труд'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'рабочая сила; рабочий класс',
                'examples': [
                    {'en': 'skilled labour', 'ru': 'квалифицированная рабочая сила'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'родовые муки, роды',
                'examples': [
                    {'en': 'to be in labour', 'ru': 'рожать, быть в родах'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': '(Labour) лейбористский',
                'examples': [
                    {'en': 'Labour Party', 'ru': 'Лейбористская партия'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'трудовой, рабочий',
                'examples': [
                    {'en': 'labour market', 'ru': 'рынок труда'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'родовой; имеющий отношение к родам',
                'examples': [
                    {'en': 'labour pains', 'ru': 'родовые схватки'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'трудиться, работать',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'прилагать усилия, добиваться',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'labour of love',
                'ru': 'любимое дело, бескорыстный труд'
            }
        ]
    },
    'liberal': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'либерал, человек либеральных убеждений',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(Liberal) член партии либералов, либерал',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'либеральный; свободомыслящий',
                'examples': [
                    {'en': 'liberal views', 'ru': 'либеральные взгляды'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'щедрый, великодушный',
                'examples': [
                    {'en': 'liberal giver', 'ru': 'щедрый даритель'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'обильный, щедрый, богатый',
                'examples': [
                    {'en': 'a liberal supply of food', 'ru': 'обильный запас продовольствия'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'свободный, вольный, небуквальный',
                'examples': [
                    {'en': 'a liberal translation', 'ru': 'вольный перевод'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'гуманитарный',
                'examples': [
                    {'en': 'liberal arts', 'ru': 'гуманитарные науки'}
                ]
            }
        ],
        'phrases': []
    },
    'let': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'аренда, сдача внаём',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'разрешать, позволять',
                'examples': [
                    {'en': 'let me see', 'ru': 'дайте подумать; посмотрим'},
                    {'en': 'to let know', 'ru': 'ставить в известность, давать знать'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'сдавать внаём, в аренду',
                'examples': [
                    {'en': 'to let', 'ru': 'сдаётся внаём (надпись на объявлении)'},
                    {'en': 'house to let', 'ru': 'дом сдаётся внаём'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'пускать, впускать, выпускать; давать доступ',
                'examples': [
                    {'en': 'let him in', 'ru': 'впустите его'},
                    {'en': 'let the dog out', 'ru': 'выпустите собаку'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'в повелительном наклонении служит для выражения предложения, приказания или побуждения к действию',
                'examples': [
                    {'en': 'let’s go!', 'ru': 'пойдёмте!'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'незасчитанная подача; переигровка (в теннисе)',
                'examples': [
                    {'en': 'let!', 'ru': '«не считается!» (о подаче в теннисе)'}
                ],
                'register': ['спорт']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'помеха, препятствие',
                'examples': [],
                'register': ['устаревшее']
            }
        ],
        'phrases': [
            {
                'en': 'without let or hindrance',
                'ru': 'без каких-либо помех и препятствий'
            },
            {
                'en': 'to let alone',
                'ru': 'оставить в покое; не говоря уже о'
            },
            {
                'en': 'to let down',
                'ru': 'разочаровывать, подводить'
            },
            {
                'en': 'to let off',
                'ru': 'отпускать без наказания, прощать'
            }
        ]
    },
    'brother': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'брат',
                'examples': [
                    {'en': 'elder brother', 'ru': 'старший брат'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'приятель, братишка (в обращении)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'собрат, коллега; товарищ',
                'examples': [
                    {'en': 'brothers in arms', 'ru': 'братья по оружию'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'собрат (во мн.ч. brethren — о членах общины, религиозного братства)',
                'examples': []
            }
        ],
        'phrases': []
    },
    'return': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'возвращение',
                'examples': [
                    {'en': 'on his return', 'ru': 'по его возвращении'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'отдача, возврат; возмещение',
                'examples': [
                    {'en': 'in return', 'ru': 'в ответ, взамен'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'возврат (болезни); рецидив',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'оборот (средств); доход, прибыль',
                'examples': [
                    {'en': 'quick returns', 'ru': 'быстрый оборот капитала'}
                ],
                'register': ['коммерция']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'официальный отчёт; декларация',
                'examples': [
                    {'en': 'tax return', 'ru': 'налоговая декларация'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'ведомость, список; во мн.ч. сведения',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'билет туда и обратно (= return ticket)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'во мн.ч. результаты выборов',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'ответ; реплика',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'возвращаться; идти обратно',
                'examples': [
                    {'en': 'to return home', 'ru': 'возвращаться домой'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'возвращать, отдавать обратно',
                'examples': [
                    {'en': 'to return a book to the library', 'ru': 'вернуть книгу в библиотеку'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'отвечать, отплачивать (взаимностью)',
                'examples': [
                    {'en': 'to return a visit', 'ru': 'нанести ответный визит'},
                    {'en': 'to return thanks', 'ru': 'выразить благодарность'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'отвечать, возражать',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'докладывать, официально заявлять',
                'examples': [
                    {'en': 'the jury returned a verdict', 'ru': 'присяжные вынесли вердикт'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'избирать (в парламент)',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'many happy returns of the day!',
                'ru': 'поздравляю с днём рождения!'
            },
            {
                'en': 'in return for',
                'ru': 'в обмен на, взамен чего-либо'
            }
        ]
    },
    'agenda': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'повестка дня (собрания, заседания); программа, план работы',
                'examples': [
                    {'en': 'on the agenda', 'ru': 'на повестке дня'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'hidden agenda',
                'ru': 'тайный умысел, скрытые намерения'
            }
        ]
    },
    'beef': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'говядина',
                'examples': [
                    {'en': 'roast beef', 'ru': 'ростбиф'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'мясной скот; туша',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'мускулы, физическая сила',
                'examples': [],
                'register': ['разговорное']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'жалоба, претензия',
                'examples': [
                    {'en': 'what’s your beef?', 'ru': 'на что ты жалуешься?, в чём твоя претензия?'}
                ],
                'register': ['сленг']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'жаловаться, ныть',
                'examples': [],
                'register': ['сленг']
            }
        ],
        'phrases': [
            {
                'en': 'to beef up',
                'ru': 'усиливать, укреплять, наращивать'
            }
        ]
    },
    'businessman': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'бизнесмен, коммерсант, предприниматель, делец',
                'examples': []
            }
        ],
        'phrases': []
    },
    'cargo': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'груз (корабля, самолёта); карго',
                'examples': [
                    {'en': 'cargo ship', 'ru': 'грузовое судно'}
                ]
            }
        ],
        'phrases': []
    },
    'criterion': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'критерий, мерило',
                'examples': [
                    {'en': 'success criterion', 'ru': 'критерий успеха'}
                ]
            }
        ],
        'phrases': []
    },
    'hypothesis': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'гипотеза, догадка, предположение',
                'examples': [
                    {'en': 'working hypothesis', 'ru': 'рабочая гипотеза'}
                ]
            }
        ],
        'phrases': []
    },
    'maximum': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'максимальный, предельный',
                'examples': []
            }
        ],
        'phrases': []
    },
    'medium': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'середина; промежуточная ступень (во мн.ч. mediums, media)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'растворитель, разбавитель (краски)',
                'examples': [],
                'register': ['живопись']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'средство; способ, путь',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(окружающая) среда, обстановка, условия (жизни)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'медиум, спирит',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'средний; промежуточный',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'умеренный',
                'examples': []
            }
        ],
        'phrases': []
    },
    'momentum': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'движущая сила, толчок, импульс; количество движения, инерция (во мн.ч. momenta, momentums)',
                'examples': []
            }
        ],
        'phrases': []
    },
    'piano': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'пианино, фортепиано, рояль (во мн.ч. pianos)',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'фортепианный',
                'examples': []
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'тихо, пиано',
                'examples': [],
                'register': ['музыка']
            }
        ],
        'phrases': []
    },
    'policeman': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'полицейский',
                'examples': []
            }
        ],
        'phrases': []
    },
    'potato': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'картофель, картофелина',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'hot potato',
                'ru': 'щекотливая тема, неприятный вопрос'
            },
            {
                'en': 'couch potato',
                'ru': 'домосед, лежебока, любитель телевизора'
            }
        ]
    },
    'ratio': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'отношение, пропорция, коэффициент, соотношение',
                'examples': []
            }
        ],
        'phrases': []
    },
    'solo': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'соло',
                'examples': [],
                'register': ['музыка']
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'сольный; одиночный',
                'examples': []
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'в одиночку; соло',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'солировать, исполнять соло',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'выполнять самостоятельный полёт',
                'examples': [],
                'register': ['авиация']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'делать, действовать в одиночку',
                'examples': []
            }
        ],
        'phrases': []
    },
    'stadium': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'стадион',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'беговая дорожка (в античную эпоху)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'стадий (древнегреческая мера длины = 185 м)',
                'examples': []
            }
        ],
        'phrases': []
    },
    'synthesis': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'синтез',
                'examples': []
            }
        ],
        'phrases': []
    },
    'that': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'тот, та, то; этот',
                'examples': [
                    {'en': 'that book', 'ru': 'та книга'}
                ]
            },
            {
                'partOfSpeech': 'pronoun',
                'translation': 'тот, та, то; это; вот что',
                'examples': [
                    {'en': 'what is that?', 'ru': 'что это?'}
                ]
            },
            {
                'partOfSpeech': 'pronoun',
                'translation': 'тот, кто; то, что; который, которая, которое, которые',
                'examples': [
                    {'en': 'the girl that I saw', 'ru': 'девушка, которую я видел'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'так; до такой степени; столь',
                'examples': [
                    {'en': 'it’s not that bad', 'ru': 'всё не настолько плохо'}
                ]
            },
            {
                'partOfSpeech': 'conjunction',
                'translation': 'что; чтобы (служит для введения придаточных предложений)',
                'examples': [
                    {'en': 'he said that he would come', 'ru': 'он сказал, что придёт'}
                ]
            }
        ],
        'phrases': []
    },
    'thief': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'вор, воровка, похититель',
                'examples': []
            }
        ],
        'phrases': []
    },
    'this': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'этот, эта, это',
                'examples': [
                    {'en': 'this morning', 'ru': 'этим утром'}
                ]
            },
            {
                'partOfSpeech': 'pronoun',
                'translation': 'это, вот это',
                'examples': [
                    {'en': 'this is my friend', 'ru': 'это мой друг'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'так, до такой степени',
                'examples': [
                    {'en': 'it was this big', 'ru': 'он был вот такой величины'}
                ]
            }
        ],
        'phrases': []
    },
    'tobacco': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'табак; табачные изделия',
                'examples': []
            }
        ],
        'phrases': []
    },
    'wife': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'жена, супруга',
                'examples': []
            }
        ],
        'phrases': []
    },
    'buddy': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'дружище, приятель',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'доброволец, оказывающий помощь и поддержку больным СПИДом',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'малыш (в обращении)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'солдат-однополчанин',
                'examples': []
            }
        ],
        'phrases': []
    },
    'certain': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'нечто верное, несомненное; факт',
                'examples': [
                    {'en': 'for certain', 'ru': 'наверняка'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'уверенный, убеждённый',
                'examples': [
                    {'en': 'I am certain he will come', 'ru': 'я уверен, что он придёт'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'определённый',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'некоторый, некий',
                'examples': [
                    {'en': 'a certain amount', 'ru': 'определённое количество'},
                    {'en': 'a certain Mr. Jones', 'ru': 'некий г-н Джоунс'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'верный; несомненный',
                'examples': []
            }
        ],
        'phrases': []
    },
    'clever': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'умный, сообразительный',
                'examples': [
                    {'en': 'clever idea', 'ru': 'удачная мысль'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'способный (к чему-либо — at)',
                'examples': [
                    {'en': 'he is clever at arithmetic', 'ru': 'у него способности к арифметике'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'ловкий, умелый, искусный',
                'examples': [
                    {'en': 'clever workman', 'ru': 'искусный/умелый работник'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'ловкий, хитрый, коварный',
                'examples': []
            }
        ],
        'phrases': []
    },
    'aware': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'сознающий, осведомлённый, знающий',
                'examples': [
                    {'en': 'to be aware of danger', 'ru': 'сознавать опасность'},
                    {'en': 'as far as I am aware', 'ru': 'насколько мне известно'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'сознательный, общественно активный',
                'examples': [
                    {'en': 'politically aware', 'ru': 'политически сознательный'}
                ]
            }
        ],
        'phrases': []
    },
    'fond': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'любящий, испытывающий нежные чувства (кого-либо, что-либо — of)',
                'examples': [
                    {'en': 'to be fond of music', 'ru': 'любить музыку'},
                    {'en': 'she is fond of children', 'ru': 'она очень любит детей'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'нежный, любящий, тёплый',
                'examples': [
                    {'en': 'fond memories', 'ru': 'тёплые воспоминания'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'излишне доверчивый, наивный; несбыточный (о надеждах)',
                'examples': [
                    {'en': 'fond hopes', 'ru': 'несбыточные надежды'}
                ]
            }
        ],
        'phrases': []
    },
    'solicitor': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'солиситор; адвокат',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'юрисконсульт',
                'examples': [
                    {'en': 'patent solicitor', 'ru': 'юрисконсульт-патентовед'}
                ],
                'register': ['американизм']
            }
        ],
        'phrases': []
    },
    'cat': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'кот, кошка',
                'examples': [
                    {'en': 'tom cat', 'ru': 'кот'},
                    {'en': 'pussy cat', 'ru': 'кошка, кошечка'},
                    {'en': 'wild cat', 'ru': 'дикая кошка'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'кошачий мех',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'кошка, плеть-девятихвостка (= cat-o’-nine-tails)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'сварливая, злая женщина',
                'examples': [],
                'register': ['разговорное']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'бить кошкой, плетью-девятихвосткой',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'брать якорь на кат, подтягивать якорь к крамболу',
                'examples': [],
                'register': ['морской термин']
            }
        ],
        'phrases': [
            {
                'en': 'to let the cat out of the bag',
                'ru': 'выдать секрет, проболтаться'
            },
            {
                'en': 'like a cat on hot bricks',
                'ru': 'в большом возбуждении; не находить себе места'
            },
            {
                'en': 'to put/to set the cat among the pigeons',
                'ru': 'сеять рознь, вызвать переполох'
            }
        ]
    },
    'nor': {
        'meanings': [
            {
                'partOfSpeech': 'conjunction',
                'translation': '(да) и ... не; также ... не (в начале самостоятельного предложения, следующего за отрицательным)',
                'examples': [
                    {'en': 'you don’t seem to be well. Nor am I', 'ru': 'вы, по-видимому, нездоровы, и я тоже'}
                ]
            },
            {
                'partOfSpeech': 'conjunction',
                'translation': '(да) и не; также не (вводит вторую часть сложносочинённого предложения при наличии отрицания в первой части)',
                'examples': [
                    {'en': 'I will not apologize, nor do I admit that I am wrong', 'ru': 'я не буду извиняться, я совсем не считаю себя виноватым'}
                ]
            },
            {
                'partOfSpeech': 'conjunction',
                'translation': 'также ... не; тоже ... не (вводит вторую часть сложносочинённого предложения при отсутствии отрицания в первой части)',
                'examples': [
                    {'en': 'he has left the place, nor shall we stay', 'ru': 'он уехал, и мы тоже не останемся'}
                ]
            }
        ],
        'phrases': []
    },
    'AIDS': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'синдром приобретённого иммунодефицита, СПИД',
                'examples': []
            }
        ],
        'phrases': []
    },
    'aids': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'синдром приобретённого иммунодефицита, СПИД',
                'examples': []
            }
        ],
        'phrases': []
    },
    'aim': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'цель, мишень; прицеливание',
                'examples': [
                    {'en': 'to take accurate aim', 'ru': 'хорошо прицеливаться'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'цель, намерение; стремление',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'целиться',
                'examples': [
                    {'en': 'to aim at smb', 'ru': 'прицелиться в кого-либо'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'нацеливать, направлять',
                'examples': [
                    {'en': 'he aimed for the south', 'ru': 'он взял направление на юг'},
                    {'en': 'to aim one’s efforts at smth', 'ru': 'направлять усилия на что-либо'},
                    {'en': 'to aim remarks at smb', 'ru': 'направлять замечания против кого-либо'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'швырять, бросать, запускать',
                'examples': [
                    {'en': 'he aimed a stone at me', 'ru': 'он запустил в меня камнем'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'стремиться, добиваться',
                'examples': [
                    {'en': 'to aim at high results', 'ru': 'стремиться к высоким результатам'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'планировать, намереваться',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'what are you aiming at?',
                'ru': 'к чему вы клоните?'
            }
        ]
    },
    'resistance': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'сопротивление, противодействие',
                'examples': [
                    {'en': 'line of least resistance', 'ru': 'линия наименьшего сопротивления'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'оборона, отпор',
                'examples': [],
                'register': ['военный термин']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'сопротивляемость, стойкость (организма)',
                'examples': [
                    {'en': 'resistance to disease', 'ru': 'сопротивляемость болезням'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'сопротивление; сопротивление проводника, резистор',
                'examples': [],
                'register': ['электротехника']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'движение Сопротивления (the Resistance)',
                'examples': []
            }
        ],
        'phrases': []
    },
    'series': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'ряд; серия, цепь',
                'examples': [
                    {'en': 'in series', 'ru': 'по порядку; последовательно'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'серия, цикл, выпуск',
                'examples': [
                    {'en': 'a series of lectures', 'ru': 'цикл лекций'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'серия программ; многосерийный фильм, сериал',
                'examples': [],
                'register': ['телевидение']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'ряд',
                'examples': [],
                'register': ['математика']
            }
        ],
        'phrases': []
    },
    'special': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'специальный, особый; индивидуальный, частный',
                'examples': [
                    {'en': 'special case', 'ru': 'особый случай'},
                    {'en': 'special train', 'ru': 'специальный поезд'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'экстренный выпуск (газеты); специальный поезд',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'товар, продаваемый по резко сниженной цене; фирменное блюдо',
                'examples': []
            }
        ],
        'phrases': []
    },
    'punk': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'гнилушка, труха',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'сопляк, молокосос; никчёмный человек; хулиган',
                'examples': [],
                'register': ['разговорное']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'панк-рок (= punk rock)',
                'examples': [],
                'register': ['музыка']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'панк, панк-рокер (= punk rocker)',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'дрянной, никуда не годный; относящийся к культуре панков',
                'examples': []
            }
        ],
        'phrases': []
    },
    'lawsuit': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'судебный процесс, судебный иск; судебное дело',
                'examples': [
                    {'en': 'to file/to lodge a lawsuit', 'ru': 'подать иск, возбудить судебное дело'}
                ]
            }
        ],
        'phrases': []
    },
    'sister': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'сестра',
                'examples': [
                    {'en': 'elder sister', 'ru': 'старшая сестра'},
                    {'en': 'sister city', 'ru': 'город-побратим'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'медицинская сестра; монахиня',
                'examples': [
                    {'en': 'nursing sister', 'ru': 'медицинская сестра'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'невестка, золовка, свояченица (= sister-in-law)',
                'examples': []
            }
        ],
        'phrases': []
    },
    'about': {
        'meanings': [
            {
                'partOfSpeech': 'adverb',
                'translation': 'приблизительно, около, почти',
                'examples': [
                    {'en': 'about fifty', 'ru': 'около пятидесяти'},
                    {'en': 'it’s about one kilometre from here', 'ru': 'это около километра отсюда'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'неподалёку, недалеко, рядом',
                'examples': [
                    {'en': 'he is somewhere about', 'ru': 'он где-то здесь'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'кругом, вокруг; повсюду, везде; туда и сюда',
                'examples': [
                    {'en': 'to walk about', 'ru': 'прогуливаться'},
                    {'en': 'he looked about', 'ru': 'он огляделся'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'в обратном направлении',
                'examples': [
                    {'en': 'about turn!', 'ru': 'кругом!'}
                ]
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'о, об, относительно, по поводу, касательно',
                'examples': [
                    {'en': 'what are you talking about?', 'ru': 'о чём вы говорите?'},
                    {'en': 'what is it all about?', 'ru': 'в чём дело?'}
                ]
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'вокруг, кругом; по',
                'examples': [
                    {'en': 'about the town', 'ru': 'по городу'},
                    {'en': 'he looked about him', 'ru': 'он огляделся вокруг'}
                ]
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'около, приблизительно, близ (по времени, месту, количеству)',
                'examples': [
                    {'en': 'about six o’clock', 'ru': 'около шести часов'}
                ]
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'при, с собой',
                'examples': [
                    {'en': 'I have no money about me', 'ru': 'у меня нет при себе денег'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'поворачивать оверштаг',
                'examples': [],
                'register': ['морской термин']
            }
        ],
        'phrases': [
            {
                'en': 'to be about to do smth',
                'ru': 'собираться, намереваться сделать что-либо'
            },
            {
                'en': 'to be up and about',
                'ru': 'быть на ногах; подняться после болезни'
            }
        ]
    },
    'above': {
        'meanings': [
            {
                'partOfSpeech': 'adverb',
                'translation': 'наверху; выше',
                'examples': [
                    {'en': 'the clouds above', 'ru': 'облака в вышине'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'наверх',
                'examples': []
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'выше, раньше (в тексте)',
                'examples': [
                    {'en': 'as stated above', 'ru': 'как указано выше'}
                ]
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'над, выше',
                'examples': [
                    {'en': 'above my head', 'ru': 'над моей головой'}
                ]
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'более, свыше',
                'examples': [
                    {'en': 'above fifty', 'ru': 'свыше пятидесяти'}
                ]
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'выше (по рангу, положению)',
                'examples': []
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'выше (чего-либо, вне досягаемости; не поддающийся чему-либо)',
                'examples': [
                    {'en': 'above suspicion', 'ru': 'вне подозрений'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'вышеупомянутый, вышесказанный',
                'examples': [
                    {'en': 'the above facts', 'ru': 'вышеприведённые факты'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(the) вышесказанное, вышеизложенное',
                'examples': [
                    {'en': 'none of the above', 'ru': 'ничего из вышеперечисленного'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'above all',
                'ru': 'главным образом, прежде всего'
            }
        ]
    },
    'abroad': {
        'meanings': [
            {
                'partOfSpeech': 'adverb',
                'translation': 'за границей; за границу',
                'examples': [
                    {'en': 'to go abroad', 'ru': 'поехать за границу'},
                    {'en': 'from abroad', 'ru': 'из-за границы'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'широко; повсюду',
                'examples': [
                    {'en': 'the news spread abroad', 'ru': 'весть широко разнеслась'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'вне дома, на открытом воздухе, на улице',
                'examples': [
                    {'en': 'to be abroad early', 'ru': 'выйти из дому рано'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'в заблуждении',
                'examples': [],
                'register': ['устаревшее']
            }
        ],
        'phrases': [
            {
                'en': 'from abroad',
                'ru': 'из-за границы, из-за рубежа'
            }
        ]
    },
    'absent': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'отсутствующий',
                'examples': [
                    {'en': 'absent from school', 'ru': 'отсутствующий на уроках'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'рассеянный, невнимательный',
                'examples': [
                    {'en': 'an absent look', 'ru': 'рассеянный взгляд'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'отлучаться; отсутствовать',
                'examples': [
                    {'en': 'to absent oneself from work', 'ru': 'отсутствовать на работе'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'уклоняться (от обязанностей и т.п.)',
                'examples': []
            }
        ],
        'phrases': []
    },
    'absolute': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'полный; безусловный, совершенный, абсолютный',
                'examples': [
                    {'en': 'absolute silence', 'ru': 'абсолютная тишина'},
                    {'en': 'absolute trust', 'ru': 'полное доверие'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'самовластный, неограниченный, деспотический',
                'examples': [
                    {'en': 'absolute power', 'ru': 'неограниченная власть'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'чистый, беспримесный, безводный',
                'examples': [
                    {'en': 'absolute alcohol', 'ru': 'чистый спирт'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'абсолютный, самостоятельный',
                'examples': [
                    {'en': 'absolute construction', 'ru': 'абсолютный оборот'}
                ],
                'register': ['грамматика']
            }
        ],
        'phrases': []
    },
    'absolutely': {
        'meanings': [
            {
                'partOfSpeech': 'adverb',
                'translation': 'совершенно, абсолютно, вполне',
                'examples': [
                    {'en': 'absolutely right', 'ru': 'совершенно правый'},
                    {'en': 'absolutely necessary', 'ru': 'совершенно необходимый'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'безусловно, несомненно; да, конечно',
                'examples': [
                    {'en': '“Can you come?” — “Absolutely!”', 'ru': '«Ты сможешь прийти?» — «Безусловно!»'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'самостоятельно, независимо',
                'examples': []
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'абсолютно',
                'examples': [],
                'register': ['грамматика']
            }
        ],
        'phrases': []
    },
    'absorb': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'всасывать, впитывать; абсорбировать; поглощать',
                'examples': [
                    {'en': 'plants absorb water', 'ru': 'растения впитывают воду'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'поглощать (внимание), захватывать; впитывать (знания)',
                'examples': [
                    {'en': 'to be absorbed in thoughts', 'ru': 'быть погружённым в мысли'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'амортизировать (толчки, удары)',
                'examples': [
                    {'en': 'to absorb shock', 'ru': 'амортизировать удар'}
                ],
                'register': ['техника']
            }
        ],
        'phrases': []
    },
    'abandon': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'покидать, оставлять',
                'examples': [
                    {'en': 'abandon ship', 'ru': 'покидать судно'},
                    {'en': 'to abandon a child', 'ru': 'бросить ребёнка'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'отказываться (от плана, намерения, прав и т.п.)',
                'examples': [
                    {'en': 'to abandon all hope', 'ru': 'отказаться от всяких надежд'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'предаваться (страсти, привычке — to)',
                'examples': [
                    {'en': 'to abandon oneself to grief', 'ru': 'предаваться горю'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'развязность, несдержанность, безудержность',
                'examples': [
                    {'en': 'with abandon', 'ru': 'не сдерживаясь, безудержно'}
                ]
            }
        ],
        'phrases': []
    },
    'abortion': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'преждевременное прекращение беременности, аборт, выкидыш',
                'examples': [
                    {'en': 'to have an abortion', 'ru': 'сделать аборт'}
                ],
                'register': ['медицина']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'уродец, недоросток',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'недоразвитие (органа)',
                'examples': [],
                'register': ['биология']
            }
        ],
        'phrases': []
    },
    'access': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'проход; подход',
                'examples': [
                    {'en': 'access to the sea', 'ru': 'выход к морю'},
                    {'en': 'this gate allows access to the garden', 'ru': 'через эту калитку можно пройти в сад'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'доступ',
                'examples': [
                    {'en': 'easy of access', 'ru': 'доступный, легкодоступный'},
                    {'en': 'to gain access to smth', 'ru': 'получить доступ к чему-либо'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'приступ (болезни, гнева и т.п.)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'выборка, обращение (к памяти); доступ',
                'examples': [
                    {'en': 'random access', 'ru': 'произвольный доступ'}
                ],
                'register': ['информатика']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'обращаться (к данным, файлу); считывать',
                'examples': [
                    {'en': 'to access a database', 'ru': 'обращаться к базе данных'}
                ],
                'register': ['информатика']
            }
        ],
        'phrases': []
    },
    'attraction': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'притяжение (тж. физ.); тяготение',
                'examples': [
                    {'en': 'gravitational attraction', 'ru': 'гравитационное притяжение'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'привлекательность; прелесть, обаяние',
                'examples': [
                    {'en': 'she had a strange attraction for him', 'ru': 'в ней было для него странное обаяние'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': '(обыкн. во мн.ч.) приманка',
                'examples': [
                    {'en': 'attractions of a big city', 'ru': 'соблазны большого города'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'аттракцион; номер программы',
                'examples': []
            }
        ],
        'phrases': []
    },
    'able': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'умелый, умеющий; знающий; в состоянии (сделать что-либо — to)',
                'examples': [
                    {'en': 'to be able to', 'ru': 'быть в состоянии, мочь'},
                    {'en': 'able to work', 'ru': 'трудоспособный'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'способный, талантливый',
                'examples': [
                    {'en': 'an able student', 'ru': 'способный студент'}
                ]
            }
        ],
        'phrases': []
    },
    'flee': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'бежать, убегать, спасаться бегством',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'избегать, сторониться',
                'examples': [
                    {'en': 'to flee from temptation', 'ru': 'бежать от искушения'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': '(тк. past и p. p.) исчезнуть, пролететь; улетучиться',
                'examples': [
                    {'en': 'all hope had fled', 'ru': 'все надежды улетучились'}
                ]
            }
        ],
        'phrases': []
    },
    'worse': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'сравн. ст. от bad 1 и ill 1: худший; более плохой',
                'examples': [
                    {'en': 'he is worse today', 'ru': 'ему сегодня хуже'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'сравн. ст. от badly и ill 2: хуже',
                'examples': [
                    {'en': 'they are worse off than we', 'ru': 'они в худшем положении, чем мы'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'худшее',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'from bad to worse',
                'ru': 'из огня да в полымя, всё хуже и хуже'
            },
            {
                'en': 'none the worse',
                'ru': 'ничуть не хуже'
            }
        ]
    },
    'genius': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'гений, гениальный человек (во мн.ч. geniuses)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'гениальность (только в ед.ч.)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'талант; способность (к чему-либо — for; только в ед.ч.)',
                'examples': [
                    {'en': 'he has a genius for languages', 'ru': 'у него замечательный талант к языкам'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'дух, покровитель; злой или добрый гений (во мн.ч. genii)',
                'examples': [
                    {'en': 'he was her evil genius', 'ru': 'он был её злым гением'}
                ]
            }
        ],
        'phrases': []
    },
    'money': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'деньги',
                'examples': [
                    {'en': 'money in circulation', 'ru': 'деньги в обращении'},
                    {'en': 'to save money', 'ru': 'копить деньги'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'монетные системы, валюты (во мн.ч. moneys, monies)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'богатство, состояние',
                'examples': [
                    {'en': 'a person of money', 'ru': 'богатый человек'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'for one’s money',
                'ru': 'по чьему-либо мнению; на чей-либо взгляд'
            }
        ]
    },
    'mouse': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'мышь (во мн.ч. mice)',
                'examples': [
                    {'en': 'a mouse trap', 'ru': 'мышеловка'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'мышь, манипулятор «мышь» (во мн.ч. mice, mouses)',
                'examples': [
                    {'en': 'wireless mouse', 'ru': 'беспроводная мышь'}
                ],
                'register': ['информатика']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'робкий, боязливый человек',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'синяк под глазом (во мн.ч. mice, mouses)',
                'examples': [],
                'register': ['разговорное']
            }
        ],
        'phrases': []
    },
    'penny': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'пенни, пенс (во мн.ч. pence — о денежной сумме, pennies — об отдельных монетах)',
                'examples': [
                    {'en': 'ten pence', 'ru': 'десять пенсов'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'I don’t have a penny',
                'ru': 'у меня нет ни копейки'
            },
            {
                'en': 'a pretty penny',
                'ru': 'кругленькая сумма'
            },
            {
                'en': 'the penny drops',
                'ru': 'всё теперь понятно, дошло'
            },
            {
                'en': 'a penny for your thoughts',
                'ru': 'о чём задумались?'
            }
        ]
    },
    'photo': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'фотография, снимок (во мн.ч. photos)',
                'examples': [
                    {'en': 'to take a photo', 'ru': 'сделать фотографию'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'фотографировать, делать снимки',
                'examples': []
            }
        ],
        'phrases': []
    },
    'referendum': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'референдум, всенародный опрос (во мн.ч. referendums, referenda)',
                'examples': [
                    {'en': 'to hold a referendum', 'ru': 'провести референдум'}
                ]
            }
        ],
        'phrases': []
    },
    'staff': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'персонал, штат сотрудников, личный состав',
                'examples': [
                    {'en': 'teaching staff', 'ru': 'преподавательский состав'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'посох, палка; жезл (символ власти)',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'флагшток; древко',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'нотный стан, нотоносец (во мн.ч. staves)',
                'examples': [],
                'register': ['музыка']
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'штатный (о сотруднике); предназначенный для сотрудников',
                'examples': [
                    {'en': 'staff member', 'ru': 'штатный сотрудник'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'штабной',
                'examples': [
                    {'en': 'staff officer', 'ru': 'штабной офицер'}
                ],
                'register': ['военный термин']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'укомплектовывать штаты; обеспечивать персоналом',
                'examples': []
            }
        ],
        'phrases': []
    },
    'abstract': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'отвлечённый, абстрактный',
                'examples': [
                    {'en': 'abstract idea', 'ru': 'абстрактная идея'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'абстрактный (в искусстве)',
                'examples': [
                    {'en': 'abstract art', 'ru': 'абстрактное искусство'}
                ],
                'register': ['искусство']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'абстракция, отвлечённое понятие',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'резюме, конспект, краткий обзор',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'отнимать',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'резюмировать; суммировать',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'красть, прикарманивать',
                'examples': [],
                'register': ['разговорное']
            }
        ],
        'phrases': []
    },
    'behalf': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'в интересах (кого-либо); от имени (кого-либо)',
                'examples': [
                    {'en': 'in my/his/her behalf', 'ru': 'в моих/его/её интересах; от моего/его/её имени'},
                    {'en': 'to sign on behalf of someone', 'ru': 'подписывать от чьего-либо имени'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'on (in) behalf of',
                'ru': 'в интересах кого-либо; от имени кого-либо'
            }
        ]
    },
    'cabin': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'хижина',
                'examples': [
                    {'en': 'a log cabin', 'ru': 'бревенчатая хижина'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'небольшой домик, коттедж',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'кабина водителя',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'кабина самолёта (закрытая); каюта',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'содержать в тесном помещении',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'жить в хижине',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'ютиться',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'разделить перегородкой',
                'examples': [
                    {'en': 'cabin off', 'ru': 'разделить перегородкой'}
                ]
            }
        ],
        'phrases': []
    },
    'random': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'случайность; состояние наугад, наудачу',
                'examples': [
                    {'en': 'at random', 'ru': 'наобум, наугад, наудачу'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'сделанный или сказанный наугад, наобум; случайный',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'at random',
                'ru': 'наугад, наудачу; вслепую'
            }
        ]
    },
    'sake': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'польза, благо; ради, во имя',
                'examples': [
                    {'en': 'for the sake of smb, for smb’s sake', 'ru': 'для/ради кого-либо'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'сакэ, рисовая водка',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'for the sake of',
                'ru': 'ради, во имя; для'
            }
        ]
    },
    'camp': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'лагерь (спортивный и т.п.); база отдыха',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'стоянка, место привала; ночёвка на открытом воздухе',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'лагерь (место заключения)',
                'examples': [
                    {'en': 'detention camp', 'ru': 'лагерь для интернированных'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'лагерь, стан',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'располагаться лагерем',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'жить временно, без удобств',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'временно поселиться',
                'examples': [
                    {'en': 'camp out', 'ru': 'временно поселиться'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'манерный; женоподобный',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'рассчитанный на эффект',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'относящийся к гомосексуалистам',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'привносить манерность',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'ломаться; вести себя вызывающе',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'выставлять напоказ свои гомосексуальные наклонности',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'переигрывать; ломать комедию',
                'examples': [
                    {'en': 'to camp it up', 'ru': 'переигрывать'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'to break up / strike camp',
                'ru': 'сниматься с лагеря'
            }
        ]
    },
    'backwards': {
        'meanings': [
            {
                'partOfSpeech': 'adverb',
                'translation': 'назад; задом',
                'examples': [
                    {'en': 'to walk backwards', 'ru': 'идти задом/пятясь'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'наоборот; задом наперёд',
                'examples': [
                    {'en': 'you’ve put your sweater on backwards', 'ru': 'ты надел свитер задом наперёд'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'в обратном направлении, обратно',
                'examples': [
                    {'en': 'count backwards from 10', 'ru': 'считать в обратном порядке от 10'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'to bend/fall/lean over backwards',
                'ru': 'изо всех сил стараться помочь; делать всё возможное'
            }
        ]
    },
    'dual': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'двойственный; двойной; состоящий из двух частей',
                'examples': [
                    {'en': 'dual nationality', 'ru': 'двойное гражданство'},
                    {'en': 'dual purpose', 'ru': 'двоякая цель'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'двойственное число; слово в двойственном числе',
                'examples': [],
                'register': ['грамматика']
            }
        ],
        'phrases': []
    },
    'remain': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'сохраняться; оставаться в прежнем состоянии',
                'examples': [
                    {'en': 'prices remained unchanged', 'ru': 'цены остались без изменений'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'оставаться (на месте или после других)',
                'examples': [
                    {'en': 'to remain at home', 'ru': 'оставаться дома'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'держаться, пребывать',
                'examples': [
                    {'en': 'remain calm', 'ru': 'сохранять спокойствие'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'оставаться несделанным (о задаче, вопросе)',
                'examples': [
                    {'en': 'much remains to be done', 'ru': 'многое ещё предстоит сделать'}
                ]
            }
        ],
        'phrases': []
    },
    'the': {
        'meanings': [
            {
                'partOfSpeech': 'article',
                'translation': 'определённый артикль: указывает на то, что данный предмет или лицо известны говорящему',
                'examples': []
            },
            {
                'partOfSpeech': 'article',
                'translation': 'употр. перед сущ., обозначающими предметы или понятия, единственные в своём роде',
                'examples': [
                    {'en': 'the sun', 'ru': 'солнце'},
                    {'en': 'the earth', 'ru': 'земля'}
                ]
            },
            {
                'partOfSpeech': 'article',
                'translation': 'употр. перед прил. или сущ. — частью титула или географического названия',
                'examples': [
                    {'en': 'the Pacific', 'ru': 'Тихий океан'}
                ]
            },
            {
                'partOfSpeech': 'article',
                'translation': 'употр. перед субстантивированными прилагательными во множественном числе',
                'examples': [
                    {'en': 'the rich and the poor', 'ru': 'богатые и бедные'}
                ]
            }
        ],
        'phrases': []
    },
    'a': {
        'meanings': [
            {
                'partOfSpeech': 'article',
                'translation': 'неопределённый артикль: употр. перед исчисляемыми существительными в единственном числе',
                'examples': [
                    {'en': 'a book', 'ru': 'книга'}
                ]
            },
            {
                'partOfSpeech': 'article',
                'translation': 'один, некий; каждый, любой',
                'examples': [
                    {'en': 'twice a week', 'ru': 'дважды в неделю'}
                ]
            }
        ],
        'phrases': []
    },
    'OK': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'правильный, подходящий; находящийся в порядке, нормальный',
                'examples': [
                    {'en': 'is everything OK?', 'ru': 'всё в порядке?'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'хорошо, ладно, нормально',
                'examples': [
                    {'en': 'she did OK on the test', 'ru': 'она нормально сдала тест'}
                ]
            },
            {
                'partOfSpeech': 'interjection',
                'translation': 'хорошо!, ладно!, договорились!',
                'examples': [
                    {'en': 'OK, let’s go', 'ru': 'ладно, пойдём'}
                ]
            }
        ],
        'phrases': []
    },
    'I': {
        'meanings': [
            {
                'partOfSpeech': 'pronoun',
                'translation': 'я; косв. п. me меня, мне',
                'examples': [
                    {'en': 'I live here', 'ru': 'я живу здесь'}
                ]
            }
        ],
        'phrases': []
    },
    'programme': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'программа, план работы (обыкн. амер. program)',
                'examples': [
                    {'en': 'training programme', 'ru': 'программа обучения'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'составлять программу, программировать (обыкн. амер. program)',
                'examples': []
            }
        ],
        'phrases': []
    },
    'nature': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'природа',
                'examples': [
                    {'en': 'laws of nature', 'ru': 'законы природы'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'натура, характер, нрав',
                'examples': [
                    {'en': 'it is not in his nature', 'ru': 'это не в его характере'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'сущность, суть, основной признак',
                'examples': [
                    {'en': 'the nature of the problem', 'ru': 'суть проблемы'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'род, сорт, класс',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'естественное состояние',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'жизненные силы, организм',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'натура (в искусстве)',
                'examples': [
                    {'en': 'to paint from nature', 'ru': 'писать с натуры'}
                ],
                'register': ['искусство']
            }
        ],
        'phrases': [
            {
                'en': 'in the nature of things',
                'ru': 'в порядке вещей'
            }
        ]
    },
    'born': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'прирождённый',
                'examples': [
                    {'en': 'a born poet', 'ru': 'прирождённый поэт'},
                    {'en': 'a born leader', 'ru': 'прирождённый лидер'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'родившийся, рождённый',
                'examples': [
                    {'en': 'he was born in Moscow', 'ru': 'он родился в Москве'},
                    {'en': 'in all my born days', 'ru': 'за всю мою жизнь'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'past participle от bear2',
                'examples': []
            }
        ],
        'phrases': []
    },
    'boom': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'гул, гудение; рокот (волн); глухой шум; грохот (орудий)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'гудеть; рокотать; грохотать',
                'examples': [
                    {'en': 'his voice boomed out', 'ru': 'его голос прогремел'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'быстрый экономический подъём, бум; ажиотаж',
                'examples': [
                    {'en': 'economic boom', 'ru': 'экономический бум'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'шумиха, сенсация; искусственная реклама',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'быстро расти (о ценах, спросе)',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'быстро развиваться, процветать (о бизнесе, торговле)',
                'examples': [
                    {'en': 'business is booming', 'ru': 'дела процветают'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'рекламировать; создавать шумиху',
                'examples': []
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'бон, боновое заграждение',
                'examples': [],
                'register': ['морской термин']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'загораживать бонами',
                'examples': [],
                'register': ['морской термин']
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'гик; тех. стрела (крана); кино, тлв. операторский кран, журавль',
                'examples': [],
                'register': ['морской термин', 'техника', 'кинематограф', 'телевидение']
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'быстро плыть (о судах); идти на всех парусах',
                'examples': [],
                'register': ['морской термин']
            }
        ],
        'phrases': [
            {
                'en': 'boom out',
                'ru': '1) мор. выносить; 2) см. boom1 II 1, 2'
            }
        ]
    },
    'more': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'дополнительное количество, большее число',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'compar от much II и many II (больший, более многочисленный)',
                'examples': [
                    {'en': 'a little more', 'ru': 'побольше'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'добавочный, дополнительный; ещё',
                'examples': [
                    {'en': 'two more', 'ru': 'ещё два'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'compar от much III и many III (больше, более)',
                'examples': [
                    {'en': 'you need to sleep more', 'ru': 'вам надо больше спать'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'ещё; опять, снова; вдобавок',
                'examples': [
                    {'en': 'no more', 'ru': 'ничего больше; больше нет'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'служит для образования сравнительной степени многосложных прилагательных и наречий',
                'examples': [
                    {'en': 'much more difficult', 'ru': 'гораздо более трудный'}
                ]
            }
        ],
        'phrases': [
            {
                'en': 'more or less',
                'ru': 'более или менее'
            }
        ]
    },
    'most': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'большинство; наибольшее количество; большая часть',
                'examples': []
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'superl от much II и many II (наибольший, самый большой; максимальный)',
                'examples': [
                    {'en': 'most people don’t share your views', 'ru': 'большинство людей не разделяют ваши взгляды'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'superl от much III и many III (больше всего)',
                'examples': [
                    {'en': 'at most', 'ru': 'самое большее'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'служит для образования превосходной степени многосложных прилагательных и наречий',
                'examples': [
                    {'en': 'the most talented', 'ru': 'самый талантливый'},
                    {'en': 'the most comfortable', 'ru': 'самый комфортабельный'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'очень, весьма; в высшей степени',
                'examples': []
            }
        ],
        'phrases': []
    },
    'best': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'лучшее; самое лучшее; лучшее проявление',
                'examples': [
                    {'en': 'to the best of my knowledge', 'ru': 'насколько мне известно'}
                ]
            },
            {
                'partOfSpeech': 'adjective',
                'translation': 'наилучший, самый лучший (превосх. ст. от good)',
                'examples': [
                    {'en': 'the best way', 'ru': 'наилучший способ'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'наилучшим образом, лучше всего (превосх. ст. от well)',
                'examples': [
                    {'en': 'do as you think best', 'ru': 'делайте, как вам кажется лучше'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'взять верх над (кем-либо), победить; перехитрить',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'all the best!',
                'ru': 'всего хорошего!'
            },
            {
                'en': 'at best',
                'ru': 'в лучшем случае'
            }
        ]
    },
    'could': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'мог, мог бы, умел (прош. вр. от can1)',
                'examples': [
                    {'en': 'I could swim when I was five', 'ru': 'я умел плавать, когда мне было пять лет'},
                    {'en': 'could you help me?', 'ru': 'не могли бы вы мне помочь?'}
                ]
            }
        ],
        'phrases': []
    },
    'further': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'более дальний, дальнейший; дополнительный (сравн. ст. от far)',
                'examples': [
                    {'en': 'further details', 'ru': 'дальнейшие подробности'},
                    {'en': 'without further delay', 'ru': 'без дальнейших проволочек'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'дальше, далее; кроме того, к тому же (сравн. ст. от far)',
                'examples': [
                    {'en': 'go further', 'ru': 'идти дальше'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'продвигать, содействовать, способствовать',
                'examples': [
                    {'en': 'to further smb’s interests', 'ru': 'способствовать чьим-либо интересам'}
                ]
            }
        ],
        'phrases': []
    },
    'last': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'последний, крайний; прошлый (превосх. ст. от late)',
                'examples': [
                    {'en': 'last week', 'ru': 'на прошлой неделе'},
                    {'en': 'the last time', 'ru': 'в последний раз'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'в последний раз; в конце, напоследок',
                'examples': [
                    {'en': 'when did you see him last?', 'ru': 'когда вы видели его в последний раз?'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'конец, заключение; последний',
                'examples': [
                    {'en': 'at last', 'ru': 'наконец'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'продолжаться, длиться; сохраняться, хватать',
                'examples': [
                    {'en': 'the meeting lasted two hours', 'ru': 'собрание длилось два часа'}
                ]
            }
        ],
        'phrases': []
    },
    'latter': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'последний из двух названных; более поздний (сравн. ст. от late)',
                'examples': [
                    {'en': 'the latter half of the century', 'ru': 'вторая половина века'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'последний (из двух названных)',
                'examples': [
                    {'en': 'the latter is more likely', 'ru': 'последнее более вероятно'}
                ]
            }
        ],
        'phrases': []
    },
    'least': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'наименьший, минимальный; малейший (превосх. ст. от little)',
                'examples': [
                    {'en': 'not the least doubt', 'ru': 'ни малейшего сомнения'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'менее всего, меньше всего (превосх. ст. от little)',
                'examples': [
                    {'en': 'at least', 'ru': 'по крайней мере, как минимум'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'наименьшее количество; малость',
                'examples': [
                    {'en': 'to say the least', 'ru': 'мягко выражаясь'}
                ]
            }
        ],
        'phrases': []
    },
    'less': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'меньший, в меньшем количестве (сравн. ст. от little)',
                'examples': [
                    {'en': 'less time', 'ru': 'меньше времени'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'меньше, менее (сравн. ст. от little)',
                'examples': [
                    {'en': 'less expensive', 'ru': 'менее дорогой'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'меньшее количество',
                'examples': []
            },
            {
                'partOfSpeech': 'preposition',
                'translation': 'без, минус',
                'examples': [
                    {'en': 'a salary of $2000 less tax', 'ru': 'зарплата 2000 долларов за вычетом налога'}
                ]
            }
        ],
        'phrases': []
    },
    'lower': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'нижний, более низкий; младший, подчинённый (сравн. ст. от low)',
                'examples': [
                    {'en': 'lower jaw', 'ru': 'нижняя челюсть'},
                    {'en': 'lower class', 'ru': 'низший класс'}
                ]
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'опускать, снижать; уменьшать',
                'examples': [
                    {'en': 'to lower prices', 'ru': 'снижать цены'}
                ]
            }
        ],
        'phrases': []
    },
    'might': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'мог бы, возможно, может быть (прош. вр. от may1)',
                'examples': [
                    {'en': 'he said he might come at six', 'ru': 'он сказал, что может прийти в шесть'},
                    {'en': 'it might rain later', 'ru': 'позже может пойти дождь'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'мощь, сила, могущество',
                'examples': [
                    {'en': 'with all one’s might', 'ru': 'изо всех сил'}
                ]
            }
        ],
        'phrases': []
    },
    'should': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'следует, должен (выражает совет, обязанность или вероятность; прош. вр. от shall)',
                'examples': [
                    {'en': 'you should see a doctor', 'ru': 'вам следует обратиться к врачу'},
                    {'en': 'I said I should be glad to see him', 'ru': 'я сказал, что буду рад его видеть'}
                ]
            }
        ],
        'phrases': []
    },
    'worst': {
        'meanings': [
            {
                'partOfSpeech': 'adjective',
                'translation': 'наихудший, самый плохой (превосх. ст. от bad)',
                'examples': [
                    {'en': 'the worst mistake', 'ru': 'самая серьёзная ошибка'}
                ]
            },
            {
                'partOfSpeech': 'adverb',
                'translation': 'хуже всего (превосх. ст. от badly)',
                'examples': [
                    {'en': 'what I feared worst', 'ru': 'то, чего я боялся больше всего'}
                ]
            },
            {
                'partOfSpeech': 'noun',
                'translation': 'самое худшее, наихудшее',
                'examples': []
            },
            {
                'partOfSpeech': 'verb',
                'translation': 'победить, нанести поражение, одолеть',
                'examples': []
            }
        ],
        'phrases': [
            {
                'en': 'at the worst',
                'ru': 'в худшем случае'
            }
        ]
    },
    'would': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'бы (выражает будущее в прошедшем, сослагательное наклонение или вежливую просьбу; прош. вр. от will1)',
                'examples': [
                    {'en': 'she told me she would come at 5 o’clock', 'ru': 'она сказала мне, что придёт в 5 часов'},
                    {'en': 'would you like some tea?', 'ru': 'хотите чаю?'}
                ]
            }
        ],
        'phrases': []
    }
}
