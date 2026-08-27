# -*- coding: utf-8 -*-
"""
Rebuild batch 3 with 100% academic precision:
catch, cause, charge, check, cook, cost, cover, cross, cry, cure.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

BATCH3_ENTRIES = {}

# 1. CATCH
BATCH3_ENTRIES['catch'] = {
    "word": "catch",
    "frequency_rank": 397,
    "cefr": "a2",
    "phon_br": "/kætʃ/",
    "phon_n_am": "/kætʃ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "поимка; захват", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "улов; добыча", "examples": [
            { "en": "a good catch of fish", "ru": "хороший улов рыбы" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "выгодное приобретение, хорошая партия (о женихе, невесте)", "examples": [
            { "en": "he is a good catch", "ru": "он завидный жених" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "ловушка, подвох, скрытое затруднение", "examples": [
            { "en": "that's the catch", "ru": "в этом-то и загвоздка, в этом подвох" }
        ], "register": ["разговорное"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "задвижка, защёлка, крючок, замок", "examples": [
            { "en": "safety catch", "ru": "предохранитель" }
        ], "register": ["техническое"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "перехват дыхания, спазм", "examples": [
            { "en": "a catch in the voice", "ru": "прерывающийся голос" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "ловить, поймать, схватить", "examples": [
            { "en": "to catch a ball", "ru": "поймать мяч" },
            { "en": "to catch fish", "ru": "ловить рыбу" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "поспеть, сесть (на поезд, автобус)", "examples": [
            { "en": "to catch a bus", "ru": "успеть на автобус" },
            { "en": "to catch a train", "ru": "поспеть на поезд" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "застать, поймать (на месте преступления)", "examples": [
            { "en": "to catch smb. red-handed", "ru": "поймать кого-либо с поличным" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "заразиться, подхватить (болезнь)", "examples": [
            { "en": "to catch a cold", "ru": "простудиться, схватить насморк" },
            { "en": "to catch measles", "ru": "заразиться корью" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "зацепить(ся), застрять", "examples": [
            { "en": "the dress caught on a nail", "ru": "платье зацепилось за гвоздь" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "уловить, расслышать, понять", "examples": [
            { "en": "I didn't catch your name", "ru": "я не расслышал вашего имени" },
            { "en": "to catch smb.'s meaning", "ru": "понять чью-либо мысль" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "привлекать внимание", "examples": [
            { "en": "to catch smb.'s eye", "ru": "1) поймать чей-либо взгляд; 2) попасться на глаза" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "загораться, воспламеняться", "examples": [
            { "en": "paper catches fire easily", "ru": "бумага легко воспламеняется" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "замерзать, покрываться льдом (также catch over)", "examples": [
            { "en": "the river catches", "ru": "река стала" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to catch one's breath", "partOfSpeech": "verb", "translation": "1) затаить дыхание; 2) перевести дух", "examples": [], "register": [] },
        { "id": 2, "phrase": "to catch it", "partOfSpeech": "verb", "translation": "получить нагоняй, влететь (кому-либо)", "examples": [
            { "en": "I caught it", "ru": "мне досталось, попало" }
        ], "register": ["разговорное"] },
        { "id": 3, "phrase": "to catch one's foot", "partOfSpeech": "verb", "translation": "споткнуться", "examples": [], "register": [] },
        { "id": 4, "phrase": "catch on", "partOfSpeech": "verb", "translation": "1) становиться популярным, модным; 2) понимать, схватывать", "examples": [], "register": ["разговорное"] },
        { "id": 5, "phrase": "catch up", "partOfSpeech": "verb", "translation": "1) догнать, настичь (with); 2) подхватить; 3) наверстать (on)", "examples": [], "register": [] },
        { "id": 6, "phrase": "catch out", "partOfSpeech": "verb", "translation": "поймать на слове, уличить, обнаружить промах", "examples": [], "register": [] }
    ]
}

# 2. CAUSE
BATCH3_ENTRIES['cause'] = {
    "word": "cause",
    "frequency_rank": 476,
    "cefr": "a2",
    "phon_br": "/kɔːz/",
    "phon_n_am": "/kɔːz/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "причина", "examples": [
            { "en": "cause and effect", "ru": "причина и следствие" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "основание; мотив, повод (for)", "examples": [
            { "en": "good cause", "ru": "веское основание" },
            { "en": "cause for complaint", "ru": "повод для жалобы" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "дело, общее дело", "examples": [
            { "en": "the cause of peace", "ru": "дело мира" },
            { "en": "in the cause of science", "ru": "ради (во имя) науки" },
            { "en": "in a good cause", "ru": "на благое дело" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "судебное дело, процесс", "examples": [
            { "en": "to plead a cause", "ru": "защищать дело в суде" }
        ], "register": ["юридическое"] },
        { "id": 5, "partOfSpeech": "verb", "translation": "быть причиной, причинять, вызывать", "examples": [
            { "en": "to cause trouble", "ru": "причинять беспокойство" },
            { "en": "to cause smb. to be informed", "ru": "поставить кого-либо в известность" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "заставлять, распорядиться", "examples": [
            { "en": "to cause a thing to be done", "ru": "велеть что-либо выполнить" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to make common cause with", "partOfSpeech": "verb", "translation": "объединяться с кем-либо ради общего дела, действовать заодно", "examples": [], "register": [] }
    ]
}

# 3. CHARGE
BATCH3_ENTRIES['charge'] = {
    "word": "charge",
    "frequency_rank": 401,
    "cefr": "b1",
    "phon_br": "/tʃɑːdʒ/",
    "phon_n_am": "/tʃɑːrdʒ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "цена, плата; при англ. мн. ч.: расходы, издержки", "examples": [
            { "en": "free of charge", "ru": "бесплатно, безвозмездно" },
            { "en": "is there a charge?", "ru": "за это надо платить?" },
            { "en": "at his own charge", "ru": "за его собственный счёт" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "обвинение", "examples": [
            { "en": "on a charge of murder", "ru": "по обвинению в убийстве" },
            { "en": "to lay to smb.'s charge", "ru": "обвинять кого-либо" }
        ], "register": ["юридическое"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "напутственная речь судьи к присяжным", "examples": [], "register": ["юридическое"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "обязанности, ответственность; руководство", "examples": [
            { "en": "I am in charge of this department", "ru": "я руковожу этим отделом" },
            { "en": "who is in charge here?", "ru": "кто здесь главный?" },
            { "en": "to be in charge", "ru": "быть за старшего, командовать", "register": ["военное"] }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "забота, попечение; хранение, надзор", "examples": [
            { "en": "children in charge of a nurse", "ru": "дети, порученные няне" },
            { "en": "to give smb. in charge", "ru": "передать кого-либо в руки полиции" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "подопечный, воспитанник", "examples": [
            { "en": "her little charges", "ru": "её маленькие питомцы" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "атака, нападение; сигнал к атаке", "examples": [
            { "en": "to return to the charge", "ru": "возобновить атаку" }
        ], "register": ["военное"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "заряд (электрический, пороховой)", "examples": [
            { "en": "positive charge", "ru": "положительный заряд", "register": ["электротехника"] }
        ], "register": ["электротехника", "военное"] },
        { "id": 9, "partOfSpeech": "noun", "translation": "нагрузка, загрузка; бремя", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "noun", "translation": "шихта, колоша", "examples": [], "register": ["металлургия"] },
        { "id": 11, "partOfSpeech": "verb", "translation": "назначать цену, просить, взимать (for — за что-либо)", "examples": [
            { "en": "how much do you charge for it?", "ru": "сколько вы за это просите?, сколько это стоит?" },
            { "en": "they charged us ten dollars", "ru": "они взяли с нас десять долларов" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "записывать в долг, на счёт", "examples": [], "register": ["коммерческое"] },
        { "id": 13, "partOfSpeech": "verb", "translation": "обвинять (with — в чём-либо)", "examples": [
            { "en": "to charge with murder", "ru": "обвинять в убийстве" }
        ], "register": ["юридическое"] },
        { "id": 14, "partOfSpeech": "verb", "translation": "поручать, вверять; возлагать ответственность (with — на кого-либо)", "examples": [
            { "en": "to charge with an important mission", "ru": "давать важное поручение" },
            { "en": "to charge oneself with smth.", "ru": "взять на себя заботу о чём-либо, ответственность за что-либо" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "атаковать, бросаться в атаку", "examples": [], "register": ["военное"] },
        { "id": 16, "partOfSpeech": "verb", "translation": "заряжать (аккумулятор, оружие)", "examples": [
            { "en": "to charge a battery", "ru": "зарядить батарею, аккумулятор" }
        ], "register": ["электротехника", "военное"] },
        { "id": 17, "partOfSpeech": "verb", "translation": "нагружать; обременять (память); наполнять (бокал вином)", "examples": [], "register": [] },
        { "id": 18, "partOfSpeech": "verb", "translation": "напутствовать присяжных (о судье)", "examples": [], "register": ["юридическое"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "in charge (of)", "partOfSpeech": "preposition", "translation": "во главе, заведующий, ответственный за", "examples": [], "register": [] },
        { "id": 2, "phrase": "take charge (of)", "partOfSpeech": "verb", "translation": "взять на себя руководство, заботу о", "examples": [], "register": [] },
        { "id": 3, "phrase": "charge up", "partOfSpeech": "verb", "translation": "1) записывать на чей-либо счёт; 2) брать на себя ответственность", "examples": [], "register": [] }
    ]
}

# 4. CHECK
BATCH3_ENTRIES['check'] = {
    "word": "check",
    "frequency_rank": 312,
    "cefr": "a1",
    "phon_br": "/tʃek/",
    "phon_n_am": "/tʃek/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "контроль, проверка", "examples": [
            { "en": "security check", "ru": "проверка безопасности" },
            { "en": "loyalty check", "ru": "проверка лояльности" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "препятствие; задержка, остановка; отпор", "examples": [
            { "en": "without check", "ru": "без задержки, безостановочно" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "шах (в шахматах)", "examples": [
            { "en": "the king is in check", "ru": "королю объявлен шах" }
        ], "register": ["шахматное"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "счёт (в ресторане)", "examples": [], "register": ["американский английский"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "ярлык; багажная квитанция; номерок (в гардеробе)", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "галочка (знак проверки)", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "клетка (на ткани); клетчатая ткань", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "noun", "translation": "банковский чек", "examples": [], "register": ["американский английский"] },
        { "id": 9, "partOfSpeech": "noun", "translation": "в роли определения: контрольный, проверочный", "examples": [
            { "en": "check experiment", "ru": "контрольный опыт" },
            { "en": "check ballot", "ru": "проверочное голосование" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "noun", "translation": "в роли определения: клетчатый", "examples": [
            { "en": "check shirt", "ru": "клетчатая рубашка" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "проверять, контролировать, сверять", "examples": [
            { "en": "to check the figures", "ru": "проверить цифры" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "останавливать(ся); сдерживать; препятствовать", "examples": [
            { "en": "to check the spread of disease", "ru": "остановить распространение болезни" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "делать выговор, давать нагоняй", "examples": [], "register": ["разговорное"] },
        { "id": 14, "partOfSpeech": "verb", "translation": "объявлять шах", "examples": [], "register": ["шахматное"] },
        { "id": 15, "partOfSpeech": "verb", "translation": "отмечать галочкой", "examples": [], "register": ["американский английский"] },
        { "id": 16, "partOfSpeech": "verb", "translation": "сдавать (в гардероб, в камеру хранения, в багаж)", "examples": [
            { "en": "to check one's coat", "ru": "сдать пальто в гардероб" }
        ], "register": ["американский английский"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to keep (или to hold) in check", "partOfSpeech": "verb", "translation": "сдерживать, держать под контролем", "examples": [], "register": [] },
        { "id": 2, "phrase": "to cash in one's checks, to hand in one's checks", "partOfSpeech": "verb", "translation": "умереть, сыграть в ящик", "examples": [], "register": ["разговорное"] },
        { "id": 3, "phrase": "check in", "partOfSpeech": "verb", "translation": "регистрироваться (в гостинице, аэропорту); сдать под расписку", "examples": [], "register": [] },
        { "id": 4, "phrase": "check out", "partOfSpeech": "verb", "translation": "1) выписаться из гостиницы; 2) проверить, выяснить; 3) подтвердиться", "examples": [], "register": [] },
        { "id": 5, "phrase": "check off", "partOfSpeech": "verb", "translation": "отмечать по списку", "examples": [], "register": [] },
        { "id": 6, "phrase": "check up", "partOfSpeech": "verb", "translation": "проверять, расследовать; наводить справки (on)", "examples": [], "register": [] }
    ]
}

# 5. COOK
BATCH3_ENTRIES['cook'] = {
    "word": "cook",
    "frequency_rank": 822,
    "cefr": "a1",
    "phon_br": "/kʊk/",
    "phon_n_am": "/kʊk/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "повар, кухарка", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "кок", "examples": [], "register": ["морской термин"] },
        { "id": 3, "partOfSpeech": "verb", "translation": "стряпать, готовить пищу; варить(ся), жарить(ся)", "examples": [
            { "en": "to cook dinner", "ru": "готовить обед" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "жариться на солнце", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "подделывать, фальсифицировать (документы, счета); состряпать (историю)", "examples": [
            { "en": "to cook the books", "ru": "подделывать бухгалтерские книги, фальсифицировать отчётность" }
        ], "register": ["разговорное"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "too many cooks spoil the broth", "partOfSpeech": "noun", "translation": "≈ у семи нянек дитя без глазу", "examples": [], "register": [] },
        { "id": 2, "phrase": "to cook smb.'s goose", "partOfSpeech": "verb", "translation": "расправиться с кем-либо, погубить кого-либо", "examples": [], "register": [] },
        { "id": 3, "phrase": "to cook one's own goose", "partOfSpeech": "verb", "translation": "погубить себя самого, вырыть себе яму", "examples": [], "register": [] }
    ]
}

# 6. COST
BATCH3_ENTRIES['cost'] = {
    "word": "cost",
    "frequency_rank": 384,
    "cefr": "a1",
    "phon_br": "/kɒst/",
    "phon_n_am": "/kɔːst/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "цена, стоимость (также перен.)", "examples": [
            { "en": "below cost", "ru": "ниже себестоимости" },
            { "en": "free of cost", "ru": "бесплатно" },
            { "en": "prime cost", "ru": "себестоимость" },
            { "en": "cost of living", "ru": "стоимость жизни, прожиточный минимум" },
            { "en": "costs of production", "ru": "издержки производства" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "при англ. мн. ч.: расходы, издержки, затраты", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "при англ. мн. ч.: судебные издержки", "examples": [], "register": ["юридическое"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "в роли определения: стоимостный", "examples": [
            { "en": "cost price", "ru": "себестоимость" },
            { "en": "cost accounting", "ru": "учёт издержек производства" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "стоить, обходиться (past: cost, p. p.: cost)", "examples": [
            { "en": "how much does it cost?", "ru": "сколько это стоит?" },
            { "en": "it cost him infinite labour", "ru": "это стоило ему огромного труда" },
            { "en": "it may cost you your life", "ru": "это может стоить вам жизни" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "назначать цену, расценивать (товар)", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "дорого стоить", "examples": [], "register": ["разговорное"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "at all costs, at any cost", "partOfSpeech": "adverb", "translation": "во что бы то ни стало, любой ценой", "examples": [], "register": [] },
        { "id": 2, "phrase": "at the cost of", "partOfSpeech": "preposition", "translation": "ценою чего-либо", "examples": [], "register": [] },
        { "id": 3, "phrase": "to count the cost", "partOfSpeech": "verb", "translation": "взвесить все последствия, учесть трудности", "examples": [], "register": [] },
        { "id": 4, "phrase": "to know to one's cost", "partOfSpeech": "verb", "translation": "знать по собственному горькому опыту", "examples": [], "register": [] }
    ]
}

# 7. COVER
BATCH3_ENTRIES['cover'] = {
    "word": "cover",
    "frequency_rank": 337,
    "cefr": "a2",
    "phon_br": "/ˈkʌvə(r)/",
    "phon_n_am": "/ˈkʌvər/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "крышка; колпак; чехол; конверт", "examples": [
            { "en": "under cover", "ru": "1) в конверте; 2) под покровом; 3) в укрытии" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "обложка, переплёт (книги)", "examples": [
            { "en": "from cover to cover", "ru": "от корки до корки, от начала до конца" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "покрывало, одеяло", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "убежище, укрытие, защита; прикрытие", "examples": [
            { "en": "to take cover", "ru": "укрыться, спрятаться" }
        ], "register": ["военное"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "покров (растительный, снежный и т. п.)", "examples": [
            { "en": "under cover of darkness", "ru": "под покровом темноты" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "маска, личина; предлог, отговорка", "examples": [
            { "en": "under cover of friendship", "ru": "под личиной дружбы" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "страховой полис, страховая защита; гарантийный фонд", "examples": [], "register": ["финансы"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "куверт, обеденный прибор", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "закрывать; покрывать; накрывать; прикрывать", "examples": [
            { "en": "to cover a wall with paper", "ru": "оклеивать стену обоями" },
            { "en": "to cover one's face with hands", "ru": "закрыть лицо руками" },
            { "en": "to cover the retreat", "ru": "прикрывать отступление" },
            { "en": "to cover one's tracks", "ru": "заметать свои следы" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "укрывать, ограждать, защищать", "examples": [
            { "en": "he covered his friend from the blow", "ru": "он своим телом защитил друга от удара" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "скрывать, прятать", "examples": [
            { "en": "to cover one's confusion", "ru": "скрыть своё смущение" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "охватывать; относиться к чему-либо", "examples": [
            { "en": "the book covers the whole subject", "ru": "книга даёт исчерпывающие сведения по всему предмету" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "преодолевать, проходить (расстояние, дистанцию)", "examples": [
            { "en": "we covered 30 miles", "ru": "мы покрыли расстояние в 30 миль" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "расстилаться; занимать площадь", "examples": [
            { "en": "the city covers ten square miles", "ru": "город занимает десять квадратных миль" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "освещать в печати, делать репортаж", "examples": [
            { "en": "to cover the election", "ru": "освещать ход выборов" }
        ], "register": [] },
        { "id": 16, "partOfSpeech": "verb", "translation": "держать под прицелом, держать под обстрелом", "examples": [
            { "en": "cover him!", "ru": "держи его на мушке!" }
        ], "register": ["военное"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "cover up", "partOfSpeech": "verb", "translation": "1) прятать, тщательно прикрывать; 2) заминать, скрывать (улики, преступление)", "examples": [], "register": [] },
        { "id": 2, "phrase": "cover in", "partOfSpeech": "verb", "translation": "закрыть, забросать землёй (могилу)", "examples": [], "register": [] }
    ]
}

# 8. CROSS
BATCH3_ENTRIES['cross'] = {
    "word": "cross",
    "frequency_rank": 820,
    "cefr": "a2",
    "phon_br": "/krɒs/",
    "phon_n_am": "/krɔːs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "крест", "examples": [
            { "en": "Red Cross", "ru": "Красный Крест" },
            { "en": "the Cross", "ru": "христианство" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "крестик, знак плюса (+) или умножения (x)", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "орден в виде креста, знак отличия", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "страдания, испытания, жизненное бремя", "examples": [
            { "en": "to bear one's cross", "ru": "нести свой крест" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "помесь, гибрид; скрещивание", "examples": [], "register": ["биологическое"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "крестовина, крест", "examples": [], "register": ["техническое"] },
        { "id": 7, "partOfSpeech": "adjective", "translation": "раздражённый, сердитый, злой", "examples": [
            { "en": "he is cross with you", "ru": "он сердит на вас" }
        ], "register": ["разговорное"] },
        { "id": 8, "partOfSpeech": "adjective", "translation": "поперечный; перекрёстный, пересекающийся", "examples": [
            { "en": "cross wind", "ru": "боковой ветер" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "пересекать, переходить, переправляться", "examples": [
            { "en": "to cross the street", "ru": "переходить улицу" },
            { "en": "to cross the Channel", "ru": "пересечь Ла-Манш" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "скрещивать(ся); пересекаться", "examples": [
            { "en": "to cross swords", "ru": "скрестить шпаги" },
            { "en": "our letters crossed", "ru": "наши письма разминулись" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "перечёркивать; кроссировать (чек)", "examples": [
            { "en": "to cross a cheque", "ru": "кроссировать чек", "register": ["коммерческое"] }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "креститься, осенять крестным знамением (refl.)", "examples": [
            { "en": "to cross oneself", "ru": "перекреститься" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "противоречить, препятствовать, становиться поперёк дороги", "examples": [
            { "en": "to cross smb.'s path", "ru": "1) встретиться с кем-либо; 2) стать кому-либо поперёк дороги" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "скрещивать(ся)", "examples": [], "register": ["биологическое", "сельскохозяйственное"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "as cross as two sticks", "partOfSpeech": "adjective", "translation": "зол как чёрт, не в духе", "examples": [], "register": [] },
        { "id": 2, "phrase": "to cross one's mind", "partOfSpeech": "verb", "translation": "прийти в голову, мелькнуть в мыслях", "examples": [], "register": [] },
        { "id": 3, "phrase": "to cross one's t's and dot one's i's", "partOfSpeech": "verb", "translation": "≈ ставить точки над «i»", "examples": [], "register": [] },
        { "id": 4, "phrase": "to cross the Rubicon", "partOfSpeech": "verb", "translation": "перейти Рубикон, принять бесповоротное решение", "examples": [], "register": [] },
        { "id": 5, "phrase": "cross off, cross out", "partOfSpeech": "verb", "translation": "вычёркивать", "examples": [], "register": [] },
        { "id": 6, "phrase": "cross over", "partOfSpeech": "verb", "translation": "переходить, пересекать, переправляться", "examples": [], "register": [] }
    ]
}

# 9. CRY
BATCH3_ENTRIES['cry'] = {
    "word": "cry",
    "frequency_rank": 707,
    "cefr": "a1",
    "phon_br": "/kraɪ/",
    "phon_n_am": "/kraɪ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "крик; возглас", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "вопль; мольба", "examples": [
            { "en": "a cry for help", "ru": "крик о помощи" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "плач", "examples": [
            { "en": "she had a good cry", "ru": "она выплакалась" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "лозунг; боевой клич", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "молва, общее мнение", "examples": [
            { "en": "the popular cry", "ru": "глас народа, общее мнение" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "крик, вой (животного, птицы); собачий лай", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "кричать; вопить; восклицать", "examples": [
            { "en": "to cry for help", "ru": "звать на помощь" },
            { "en": "to cry poverty", "ru": "прибедняться" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "плакать, рыдать", "examples": [
            { "en": "to cry bitter tears", "ru": "плакать горькими слезами" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "выкрикивать, предлагать товар для продажи (об уличном разносчике)", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "much cry and little wool", "partOfSpeech": "noun", "translation": "≈ много шума из ничего; шума много, толку мало", "examples": [], "register": [] },
        { "id": 2, "phrase": "a far cry (from)", "partOfSpeech": "noun", "translation": "1) далёкое расстояние; 2) большая разница", "examples": [], "register": [] },
        { "id": 3, "phrase": "there's no use crying over spilt milk", "partOfSpeech": "noun", "translation": "≈ сделанного не воротишь; слезами горю не поможешь", "examples": [], "register": [] },
        { "id": 4, "phrase": "to cry one's eyes out, to cry one's heart out", "partOfSpeech": "verb", "translation": "горько рыдать, выплакать все глаза", "examples": [], "register": [] },
        { "id": 5, "phrase": "cry out", "partOfSpeech": "verb", "translation": "вскрикивать, кричать от боли", "examples": [], "register": [] },
        { "id": 6, "phrase": "cry down", "partOfSpeech": "verb", "translation": "умалять, принижать; сбивать цену", "examples": [], "register": [] },
        { "id": 7, "phrase": "cry up", "partOfSpeech": "verb", "translation": "превозносить, прославлять", "examples": [], "register": [] }
    ]
}

# 10. CURE
BATCH3_ENTRIES['cure'] = {
    "word": "cure",
    "frequency_rank": 1588,
    "cefr": "b1",
    "phon_br": "/kjʊə(r)/",
    "phon_n_am": "/kjʊr/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "лечение; курс лечения", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "излечение, выздоровление", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "лекарство, целебное средство", "examples": [
            { "en": "a cure for cold", "ru": "средство от простуды" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "попечение о пастве; приход", "examples": [], "register": ["церковное"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "вулканизация (резины)", "examples": [], "register": ["техническое"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "чудак", "examples": [], "register": ["жаргон"] },
        { "id": 7, "partOfSpeech": "verb", "translation": "вылечивать, исцелять", "examples": [
            { "en": "to cure a disease", "ru": "вылечить болезнь" },
            { "en": "to cure of a habit", "ru": "избавить от привычки" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "исправлять (вред, зло)", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "заготовлять впрок, консервировать, солить, коптить (мясо, рыбу)", "examples": [
            { "en": "cured meat", "ru": "копчёное или вяленое мясо" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "вулканизировать (резину)", "examples": [], "register": ["техническое"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "what cannot be cured must be endured", "partOfSpeech": "noun", "translation": "≈ что нельзя исправить, то следует терпеть", "examples": [], "register": [] }
    ]
}

# Update in dataset
for idx, it in enumerate(oxford_data):
    w = it['word']
    if w in BATCH3_ENTRIES:
        oxford_data[idx] = BATCH3_ENTRIES[w]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Successfully rebuilt all {len(BATCH3_ENTRIES)} entries of batch 3!")
