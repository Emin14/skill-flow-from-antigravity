# -*- coding: utf-8 -*-
"""
Rebuild the 10 critical multi-POS words with 100% academic precision:
account, advance, anchor, balance, board, book, call, clear, close, fall.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

NEW_ENTRIES = {}

# 1. ACCOUNT
NEW_ENTRIES['account'] = {
    "word": "account",
    "frequency_rank": 268,
    "cefr": "b1",
    "phon_br": "/əˈkaʊnt/",
    "phon_n_am": "/əˈkaʊnt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "доклад; сообщение; отчёт", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "мнение, оценка", "examples": [
            { "en": "by all accounts", "ru": "по общим отзывам" },
            { "en": "to give a good account of oneself", "ru": "хорошо себя зарекомендовать" },
            { "en": "to leave out of account", "ru": "не принимать во внимание" },
            { "en": "not to hold of much account", "ru": "быть невысокого мнения" },
            { "en": "to take into account", "ru": "принимать во внимание, в расчёт" },
            { "en": "to take no account of", "ru": "не обращать внимания" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "счёт, расчёт; подсчёт", "examples": [
            { "en": "current account", "ru": "текущий счёт" },
            { "en": "deposit account", "ru": "вклад в банке, депозит" },
            { "en": "joint account", "ru": "общий счёт" },
            { "en": "to keep accounts", "ru": "вести книги", "register": ["бухгалтерия"] },
            { "en": "to lay (one's) account with smth.", "ru": "1) рассчитывать на что-либо; 2) принимать что-либо в расчёт" },
            { "en": "to settle (или to square) accounts with smb.", "ru": "1) рассчитываться с кем-либо; 2) сводить счёты с кем-либо" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "отчёт", "examples": [
            { "en": "to give an account of smth.", "ru": "давать отчёт в чём-либо" },
            { "en": "to call to account", "ru": "призвать к ответу, потребовать объяснения, отчёта" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "основание, причина", "examples": [
            { "en": "on account of", "ru": "из-за, вследствие" },
            { "en": "on this account", "ru": "по этой причине" },
            { "en": "on no account", "ru": "ни в коем случае" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "значение, важность", "examples": [
            { "en": "of no account, of small account", "ru": "незначительный" },
            { "en": "to make account of", "ru": "придавать значение" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "выгода, польза", "examples": [
            { "en": "to turn to account", "ru": "использовать; извлекать выгоду" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "считать; рассматривать как", "examples": [
            { "en": "I account myself happy", "ru": "я считаю себя счастливым" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "отчитываться (for — в чём-либо); отвечать (for — за что-либо)", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "объяснять (for — что-либо)", "examples": [
            { "en": "this accounts for his behaviour", "ru": "вот чем объясняется его поведение" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "составлять определённую часть (for — чего-либо)", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to be called to one's account, to go to one's account", "partOfSpeech": "verb", "translation": "умереть", "examples": [], "register": [] },
        { "id": 2, "phrase": "the great account", "partOfSpeech": "noun", "translation": "день Страшного суда, судный день", "examples": [], "register": ["религиозное"] },
        { "id": 3, "phrase": "on one's own account", "partOfSpeech": "adverb", "translation": "на свой страх и риск; самостоятельно", "examples": [], "register": [] },
        { "id": 4, "phrase": "on smb.'s account", "partOfSpeech": "adverb", "translation": "ради кого-либо, в чьих-либо интересах", "examples": [], "register": [] }
    ]
}

# 2. ADVANCE
NEW_ENTRIES['advance'] = {
    "word": "advance",
    "frequency_rank": 962,
    "cefr": "b1",
    "phon_br": "/ədˈvɑːns/",
    "phon_n_am": "/ədˈvæns/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "продвижение вперёд", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "успех, прогресс; улучшение", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "ссуда; аванс", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "повышение (цен и т. п.)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "продвижение (по службе)", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "предварение; упреждение", "examples": [
            { "en": "in advance", "ru": "вперёд, заранее" },
            { "en": "in advance of smth.", "ru": "1) впереди чего-либо; 2) раньше чего-либо" },
            { "en": "to be in advance", "ru": "1) опередить, обогнать; 2) идти вперёд, спешить (о часах)" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "наступление", "examples": [], "register": ["военное"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "опережение по фазе", "examples": [], "register": ["электротехника"] },
        { "id": 9, "partOfSpeech": "noun", "translation": "в роли определения: авансовый", "examples": [
            { "en": "advance payment", "ru": "авансовый платёж" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "продвигать(ся) вперёд", "examples": [], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "делать успехи, развиваться", "examples": [], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "платить авансом", "examples": [], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "ссужать деньги", "examples": [], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "продвигать(ся) (по службе)", "examples": [], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "выдвигать (предложение, возражение)", "examples": [], "register": [] },
        { "id": 16, "partOfSpeech": "verb", "translation": "переносить на более ранний срок, ускорять", "examples": [
            { "en": "they advanced the date of their arrival", "ru": "они перенесли дату своего приезда на более ранний срок" }
        ], "register": [] },
        { "id": 17, "partOfSpeech": "verb", "translation": "повышать(ся) (в цене)", "examples": [], "register": [] },
        { "id": 18, "partOfSpeech": "verb", "translation": "наступать", "examples": [], "register": ["военное"] },
        { "id": 19, "partOfSpeech": "adjective", "translation": "предварительный", "examples": [
            { "en": "advance payment", "ru": "предварительная оплата" },
            { "en": "advance notice", "ru": "заблаговременное предупреждение" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to make advances", "partOfSpeech": "verb", "translation": "делать авансы, предложения; идти навстречу (в чём-либо)", "examples": [], "register": [] }
    ]
}

# 3. ANCHOR
NEW_ENTRIES['anchor'] = {
    "word": "anchor",
    "frequency_rank": 3871,
    "cefr": "c1",
    "phon_br": "/ˈæŋkə(r)/",
    "phon_n_am": "/ˈæŋkər/",
    "lists": { "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "якорь", "examples": [
            { "en": "at anchor", "ru": "на якоре" },
            { "en": "to be (или to lie, to ride) at anchor", "ru": "стоять на якоре" },
            { "en": "to cast (или to drop) anchor", "ru": "бросить якорь" },
            { "en": "to come to (an) anchor", "ru": "1) бросить якорь, стать на якорь; 2) остепениться, найти тихую пристань" },
            { "en": "to let go the anchor", "ru": "отдать якорь" },
            { "en": "to weigh anchor", "ru": "1) сниматься с якоря; 2) возобновлять прерванную работу" },
            { "en": "the anchor comes home", "ru": "1) якорь дрейфует; 2) предприятие терпит неудачу" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "якорь спасения, символ надежды", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "железная связь, анкер", "examples": [], "register": ["техническое"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "в роли определения: стояночный", "examples": [
            { "en": "anchor light", "ru": "стояночный огонь", "register": ["морской термин"] }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "ставить на якорь", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "бросить якорь, стать на якорь", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "скреплять, закреплять", "examples": [
            { "en": "to anchor a tent to the ground", "ru": "закрепить палатку" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "осесть, обосноваться", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to lay an anchor to windward", "partOfSpeech": "verb", "translation": "1) бросить наветренный якорь; 2) перен. принять меры предосторожности", "examples": [], "register": ["морской термин"] },
        { "id": 2, "phrase": "to anchor one's hope (in, on)", "partOfSpeech": "verb", "translation": "возлагать надежды (на)", "examples": [], "register": [] }
    ]
}

# 4. BALANCE
NEW_ENTRIES['balance'] = {
    "word": "balance",
    "frequency_rank": 1310,
    "cefr": "b1",
    "phon_br": "/ˈbæləns/",
    "phon_n_am": "/ˈbæləns/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "весы", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "равновесие", "examples": [
            { "en": "balance of forces", "ru": "равновесие сил" },
            { "en": "balance of power", "ru": "политическое равновесие (между государствами)" },
            { "en": "to keep one's balance", "ru": "1) сохранять равновесие; 2) перен. оставаться спокойным" },
            { "en": "to lose one's balance", "ru": "1) упасть, потерять равновесие; 2) перен. выйти из себя" },
            { "en": "to be off one's balance", "ru": "потерять душевное равновесие" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "противовес", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "маятник; балансир, баланс (в часовом механизме)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "баланс; сальдо (также balance in hand)", "examples": [
            { "en": "balance of payments", "ru": "платёжный баланс" },
            { "en": "balance of trade", "ru": "активный баланс (внешней торговли)" },
            { "en": "to strike a balance", "ru": "1) подводить баланс; 2) перен. подводить итоги" }
        ], "register": ["коммерческое"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "остаток", "examples": [], "register": ["разговорное"] },
        { "id": 7, "partOfSpeech": "noun", "translation": "(B.) Весы (созвездие и знак зодиака)", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "балансировать; сохранять равновесие, быть в равновесии; уравновешивать", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "взвешивать, обдумывать; сопоставлять (with, against)", "examples": [
            { "en": "to balance the pros and cons", "ru": "взвешивать все за и против" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "колебаться (between)", "examples": [], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "подводить баланс", "examples": [
            { "en": "to balance one's accounts", "ru": "подытоживать счета" },
            { "en": "the accounts don't balance", "ru": "счета не сходятся" }
        ], "register": ["коммерческое"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to be (или to tremble, to swing, to hang) in the balance", "partOfSpeech": "verb", "translation": "висеть на волоске, быть в критическом положении", "examples": [], "register": [] },
        { "id": 2, "phrase": "the balance of advantage lies with him", "partOfSpeech": "noun", "translation": "на его стороне значительные преимущества", "examples": [], "register": [] },
        { "id": 3, "phrase": "to be weighed in the balance and found wanting", "partOfSpeech": "verb", "translation": "не оправдать надежд", "examples": [], "register": [] },
        { "id": 4, "phrase": "to hold the balance", "partOfSpeech": "verb", "translation": "распоряжаться", "examples": [], "register": [] },
        { "id": 5, "phrase": "upon a fair balance", "partOfSpeech": "adverb", "translation": "по зрелом размышлении", "examples": [], "register": [] },
        { "id": 6, "phrase": "balance out", "partOfSpeech": "verb", "translation": "1) сбалансировать, уравновесить (одно с другим); 2) уравновеситься", "examples": [], "register": [] }
    ]
}

# 5. BOARD
NEW_ENTRIES['board'] = {
    "word": "board",
    "frequency_rank": 331,
    "cefr": "a2",
    "phon_br": "/bɔːd/",
    "phon_n_am": "/bɔːrd/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "доска", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "шахматная или шашечная доска", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "картон; переплётная крышка", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "сцена, подмостки (обыкн. the boards)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "стол (преим. обеденный); трапеза, питание", "examples": [
            { "en": "board and lodging", "ru": "стол и квартира" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "совет, коллегия, правление, департамент, министерство", "examples": [
            { "en": "Board of Trade", "ru": "министерство торговли (в Англии)" },
            { "en": "Board of Directors", "ru": "правление; совет директоров" },
            { "en": "Board of Education", "ru": "министерство просвещения" },
            { "en": "school board", "ru": "школьный совет" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "борт (судна)", "examples": [
            { "en": "on board", "ru": "на борту (корабля, самолёта)" },
            { "en": "to go on board", "ru": "взойти на борт (корабля и т. п.), сесть на поезд" },
            { "en": "by the board", "ru": "за борт, за бортом" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "noun", "translation": "классная доска", "examples": [], "register": ["разговорное"] },
        { "id": 9, "partOfSpeech": "noun", "translation": "при англ. мн. ч.: афиши, расклеенные на щитах", "examples": [], "register": ["театр"] },
        { "id": 10, "partOfSpeech": "verb", "translation": "настилать доски; обшивать досками (часто board up, board in, board over)", "examples": [
            { "en": "the windows were boarded up", "ru": "окна были заколочены досками" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "кормить; столоваться (у кого-либо; at, with); пансионерствовать", "examples": [], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "садиться (на корабль, в поезд, самолёт); производить посадку", "examples": [], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "брать на абордаж", "examples": [], "register": ["морской термин"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to sweep the boards", "partOfSpeech": "verb", "translation": "иметь потрясающий успех", "examples": [], "register": ["театр"] },
        { "id": 2, "phrase": "board out", "partOfSpeech": "verb", "translation": "питаться вне дома; столоваться на стороне", "examples": [], "register": [] }
    ]
}

# 6. BOOK
NEW_ENTRIES['book'] = {
    "word": "book",
    "frequency_rank": 196,
    "cefr": "a1",
    "phon_br": "/bʊk/",
    "phon_n_am": "/bʊk/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "книга, литературное произведение", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "(the B.) Библия", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "том, книга, часть (романа, поэмы и т. п.)", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "бухгалтерская книга", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "книжечка; пачка (билетов, марок и т. п.)", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "блокнот; тетрадь", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "программа (скачек, бегов)", "examples": [], "register": ["спортивное"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "список пари (на бегах)", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "noun", "translation": "либретто (оперы, оперетты)", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "noun", "translation": "текст (роли в пьесе)", "examples": [
            { "en": "to take smb. on the book", "ru": "1) проверять чьё-либо знание роли по тексту; 2) придираться к словам" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "noun", "translation": "взятка", "examples": [], "register": ["карточное"] },
        { "id": 12, "partOfSpeech": "noun", "translation": "в роли определения: книжный", "examples": [
            { "en": "book trade", "ru": "книжная торговля" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "записывать; заносить в книгу, список", "examples": [
            { "en": "to book an order", "ru": "записать заказ" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "регистрировать, отмечать (в журнале и т. п.)", "examples": [], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "брать, покупать билет (на поезд, пароход, в театр и т. п.)", "examples": [
            { "en": "to book a ticket", "ru": "взять билет" },
            { "en": "to book through", "ru": "взять прямой билет" },
            { "en": "to book seats reserved", "ru": "заказывать места заранее" },
            { "en": "to book (smb.) a ticket for a plane", "ru": "купить (кому-либо) билет на самолёт" }
        ], "register": [] },
        { "id": 16, "partOfSpeech": "verb", "translation": "бронировать (место, номер в гостинице)", "examples": [
            { "en": "to book rooms", "ru": "заказывать номера (в гостинице)" }
        ], "register": [] },
        { "id": 17, "partOfSpeech": "verb", "translation": "ангажировать (артиста)", "examples": [
            { "en": "I'm booked", "ru": "я занят" },
            { "en": "I'm booked for three dances", "ru": "меня уже пригласили на три танца" }
        ], "register": ["разговорное"] },
        { "id": 18, "partOfSpeech": "verb", "translation": "бежать, нестись", "examples": [], "register": ["американизм", "жаргон"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "by the book", "partOfSpeech": "adverb", "translation": "1) по правилам; 2) точно, аккуратно", "examples": [], "register": [] },
        { "id": 2, "phrase": "in the bad (good) books of smb.", "partOfSpeech": "adverb", "translation": "на плохом (хорошем) счету у кого-либо", "examples": [], "register": [] },
        { "id": 3, "phrase": "to suit smb.'s book", "partOfSpeech": "verb", "translation": "устраивать кого-либо, подходить кому-либо", "examples": [], "register": [] },
        { "id": 4, "phrase": "to know like a book", "partOfSpeech": "verb", "translation": "знать как свои пять пальцев", "examples": [], "register": [] },
        { "id": 5, "phrase": "to read like a book", "partOfSpeech": "verb", "translation": "видеть насквозь", "examples": [], "register": [] },
        { "id": 6, "phrase": "to speak like a book", "partOfSpeech": "verb", "translation": "говорить как по-писаному", "examples": [], "register": [] },
        { "id": 7, "phrase": "to take a leaf out of smb.'s book", "partOfSpeech": "verb", "translation": "подражать кому-либо, следовать чьему-либо примеру", "examples": [], "register": [] },
        { "id": 8, "phrase": "book in", "partOfSpeech": "verb", "translation": "регистрироваться (в гостинице)", "examples": [], "register": [] },
        { "id": 9, "phrase": "book up", "partOfSpeech": "verb", "translation": "забронировать", "examples": [], "register": [] }
    ]
}

# 7. CALL
NEW_ENTRIES['call'] = {
    "word": "call",
    "frequency_rank": 115,
    "cefr": "a1",
    "phon_br": "/kɔːl/",
    "phon_n_am": "/kɔːl/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "зов, оклик", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "крик (животного, птицы)", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "манок, дудка (птицелова)", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "позывной сигнал; сигнал (горна, трубы и т. п.); позывные (радио)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "телефонный вызов, разговор (по телефону)", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "вызов (к больному)", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "краткое посещение, визит", "examples": [
            { "en": "to make (или to pay) a call", "ru": "делать визит, нанести краткий визит" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "noun", "translation": "заход корабля (в порт)", "examples": [
            { "en": "port of call", "ru": "порт захода" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "noun", "translation": "призыв, обращение", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "noun", "translation": "потребность, нужда; спрос (for, on — на)", "examples": [
            { "en": "there is no call for you to worry", "ru": "вам незачем беспокоиться" },
            { "en": "to have a great call for smth.", "ru": "испытывать сильную потребность в чём-либо" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "noun", "translation": "требование уплаты (по долгу); требование платежа", "examples": [], "register": ["коммерческое"] },
        { "id": 12, "partOfSpeech": "noun", "translation": "сделка с обратной премией, сделка с предварительной премией; опцион покупателя", "examples": [], "register": ["биржевой термин"] },
        { "id": 13, "partOfSpeech": "verb", "translation": "звать, окликать", "examples": [
            { "en": "to call a taxi", "ru": "вызвать такси" },
            { "en": "to call a doctor", "ru": "позвать врача" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "называть, давать имя", "examples": [
            { "en": "what do you call this?", "ru": "как это называется?" },
            { "en": "to call names", "ru": "обзывать(ся), бранить(ся)" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "называть, считать", "examples": [
            { "en": "I call that unfair", "ru": "я считаю это несправедливым" }
        ], "register": [] },
        { "id": 16, "partOfSpeech": "verb", "translation": "звонить (по телефону)", "examples": [
            { "en": "I will call you tonight", "ru": "я позвоню вам вечером" }
        ], "register": [] },
        { "id": 17, "partOfSpeech": "verb", "translation": "будить (часто call up)", "examples": [
            { "en": "to call smb. at seven", "ru": "разбудить кого-либо в семь часов" }
        ], "register": [] },
        { "id": 18, "partOfSpeech": "verb", "translation": "созывать", "examples": [
            { "en": "to call a meeting", "ru": "созвать собрание" }
        ], "register": [] },
        { "id": 19, "partOfSpeech": "verb", "translation": "наносить визит, навещать (at — дом, on — человека)", "examples": [
            { "en": "to call on smb.", "ru": "навестить кого-либо" }
        ], "register": [] },
        { "id": 20, "partOfSpeech": "verb", "translation": "заходить (в порт — о судне; at — в)", "examples": [
            { "en": "the ship calls at Gibraltar", "ru": "пароход заходит в Гибралтар" }
        ], "register": [] },
        { "id": 21, "partOfSpeech": "verb", "translation": "призывать (к чему-либо)", "examples": [
            { "en": "to call to arms", "ru": "призвать к оружию" },
            { "en": "to call to order", "ru": "призывать к порядку" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "call of duty", "partOfSpeech": "noun", "translation": "зов долга", "examples": [], "register": [] },
        { "id": 2, "phrase": "at call", "partOfSpeech": "adverb", "translation": "по первому требованию", "examples": [], "register": [] },
        { "id": 3, "phrase": "on call", "partOfSpeech": "adverb", "translation": "дежурный", "examples": [], "register": [] },
        { "id": 4, "phrase": "within call", "partOfSpeech": "adverb", "translation": "поблизости, рядом", "examples": [], "register": [] },
        { "id": 5, "phrase": "call away", "partOfSpeech": "verb", "translation": "отзывать", "examples": [], "register": [] },
        { "id": 6, "phrase": "call back", "partOfSpeech": "verb", "translation": "1) звать назад, отзывать; 2) перезванивать (по телефону)", "examples": [], "register": [] },
        { "id": 7, "phrase": "call for", "partOfSpeech": "verb", "translation": "1) заходить, заезжать за кем-либо, чем-либо; 2) требовать", "examples": [
            { "en": "the situation calls for prompt action", "ru": "ситуация требует немедленных действий" }
        ], "register": [] },
        { "id": 8, "phrase": "call in", "partOfSpeech": "verb", "translation": "1) вызывать (врача, полицию); 2) собирать, изымать из обращения (деньги)", "examples": [], "register": [] },
        { "id": 9, "phrase": "call off", "partOfSpeech": "verb", "translation": "1) отзывать; 2) отменять, откладывать", "examples": [], "register": [] },
        { "id": 10, "phrase": "call on (или upon)", "partOfSpeech": "verb", "translation": "1) призывать (к чему-либо); 2) навещать", "examples": [], "register": [] },
        { "id": 11, "phrase": "call out", "partOfSpeech": "verb", "translation": "1) вызывать (на дуэль, забастовку); 2) кричать, выкрикивать", "examples": [], "register": [] },
        { "id": 12, "phrase": "call up", "partOfSpeech": "verb", "translation": "1) звонить по телефону; 2) призывать на военную службу; 3) вызывать в памяти, воскрешать", "examples": [], "register": [] },
        { "id": 13, "phrase": "to call it a day", "partOfSpeech": "verb", "translation": "закончить работу, счесть работу завершённой", "examples": [], "register": [] },
        { "id": 14, "phrase": "to call a spade a spade", "partOfSpeech": "verb", "translation": "называть вещи своими именами", "examples": [], "register": [] }
    ]
}

# 8. CLEAR
NEW_ENTRIES['clear'] = {
    "word": "clear",
    "frequency_rank": 369,
    "cefr": "a2",
    "phon_br": "/klɪə(r)/",
    "phon_n_am": "/klɪr/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "adjective", "translation": "чистый", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "adjective", "translation": "ясный, светлый", "examples": [
            { "en": "clear sky", "ru": "безоблачное небо" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "adjective", "translation": "прозрачный", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "adjective", "translation": "ясно слышный, отчётливый", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "adjective", "translation": "понятный, ясный, недвусмысленный", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "adjective", "translation": "ясный (об уме)", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "adjective", "translation": "чистый (о весе, доходе; совести)", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "adjective", "translation": "свободный", "examples": [
            { "en": "clear passage", "ru": "свободный проход" },
            { "en": "all clear", "ru": "1) путь свободен; 2) противник не обнаружен (военное); 3) отбой после тревоги" },
            { "en": "clear from suspicion", "ru": "вне подозрений" },
            { "en": "clear of debts", "ru": "свободный от долгов" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "adjective", "translation": "целый, полный", "examples": [
            { "en": "a clear month", "ru": "целый месяц" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "adverb", "translation": "ясно", "examples": [
            { "en": "to see one's way clear", "ru": "не иметь затруднений" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "adverb", "translation": "совсем, целиком", "examples": [
            { "en": "three feet clear", "ru": "целых три фута" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "очищать(ся); расчищать", "examples": [
            { "en": "to clear the air", "ru": "разрядить атмосферу; положить конец недоразумениям" },
            { "en": "to clear the table", "ru": "убирать со стола" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "освобождать, очищать (of, from — от)", "examples": [], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "эвакуировать", "examples": [], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "оправдывать; рассеивать (сомнения)", "examples": [], "register": [] },
        { "id": 16, "partOfSpeech": "verb", "translation": "очищать от пошлины", "examples": [], "register": [] },
        { "id": 17, "partOfSpeech": "verb", "translation": "получать чистый доход, наживать", "examples": [], "register": [] },
        { "id": 18, "partOfSpeech": "verb", "translation": "проходить, не задевая, перепрыгивать", "examples": [
            { "en": "to clear a hurdle", "ru": "перепрыгнуть через препятствие" }
        ], "register": [] },
        { "id": 19, "partOfSpeech": "verb", "translation": "становиться ясным (о небе, погоде; также clear up)", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to get away clear", "partOfSpeech": "verb", "translation": "отделаться", "examples": [], "register": [] },
        { "id": 2, "phrase": "in clear", "partOfSpeech": "adverb", "translation": "1) открытым текстом, в незашифрованном виде; 2) тех. в свету", "examples": [], "register": [] },
        { "id": 3, "phrase": "to keep clear of smb.", "partOfSpeech": "verb", "translation": "остерегаться, избегать кого-либо", "examples": [], "register": [] },
        { "id": 4, "phrase": "clear away", "partOfSpeech": "verb", "translation": "1) убирать, растаскивать; 2) рассеиваться (о тучах, тумане)", "examples": [], "register": [] },
        { "id": 5, "phrase": "clear off", "partOfSpeech": "verb", "translation": "1) убираться вон; 2) расквитаться (с долгами)", "examples": [], "register": [] },
        { "id": 6, "phrase": "clear out", "partOfSpeech": "verb", "translation": "1) очищать, опоражнивать; 2) разг. убираться вон, удирать", "examples": [], "register": [] },
        { "id": 7, "phrase": "clear up", "partOfSpeech": "verb", "translation": "1) выяснять; распутывать (дело); 2) убирать, приводить в порядок; 3) проясняться (о погоде)", "examples": [], "register": [] }
    ]
}

# 9. CLOSE
NEW_ENTRIES['close'] = {
    "word": "close",
    "frequency_rank": 218,
    "cefr": "a1",
    "phon_br": "/kləʊz/",
    "phon_n_am": "/kloʊz/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "adjective", "translation": "близкий", "examples": [
            { "en": "close friend", "ru": "близкий друг" },
            { "en": "close translation", "ru": "точный перевод" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "adjective", "translation": "пристальный, тщательный", "examples": [
            { "en": "close examination", "ru": "тщательный осмотр" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "adjective", "translation": "тесный, плотный", "examples": [
            { "en": "close ranks", "ru": "сомкнутые ряды" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "adjective", "translation": "душный, спёртый (о воздухе)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "adjective", "translation": "скрытный, сдержанный", "examples": [
            { "en": "to keep close", "ru": "молчать" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "adjective", "translation": "скупой", "examples": [
            { "en": "close with money", "ru": "прижимистый" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "adjective", "translation": "закрытый (о голосовании)", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "adjective", "translation": "закрытый (о звуке, слоге)", "examples": [], "register": ["фонетика"] },
        { "id": 9, "partOfSpeech": "adverb", "translation": "близко, рядом, вплотную", "examples": [
            { "en": "close by", "ru": "рядом, поблизости" },
            { "en": "to stand close", "ru": "стоять вплотную" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "закрывать(ся); запирать(ся)", "examples": [
            { "en": "to close a book", "ru": "закрыть книгу" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "смыкать(ся), сжимать(ся)", "examples": [
            { "en": "to close one's eyes", "ru": "закрыть глаза" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "оканчивать(ся), завершать(ся)", "examples": [
            { "en": "to close a discussion", "ru": "прекратить обсуждение" },
            { "en": "the meeting closed", "ru": "собрание закрылось" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "сближать(ся)", "examples": [
            { "en": "the fog closed around us", "ru": "туман окутал нас" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "noun", "translation": "конец, заключение", "examples": [
            { "en": "at the close of the year", "ru": "в конце года" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "noun", "translation": "огороженное место (особ. при соборе); переулок (тупик)", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "close thing", "partOfSpeech": "noun", "translation": "опасное положение", "examples": [], "register": [] },
        { "id": 2, "phrase": "close at hand", "partOfSpeech": "adverb", "translation": "под рукой, близко", "examples": [], "register": [] },
        { "id": 3, "phrase": "to keep a close eye on", "partOfSpeech": "verb", "translation": "следить за", "examples": [], "register": [] },
        { "id": 4, "phrase": "close down", "partOfSpeech": "verb", "translation": "закрыть (предприятие); прекратить работу", "examples": [], "register": [] },
        { "id": 5, "phrase": "close in", "partOfSpeech": "verb", "translation": "1) окружать; 2) смыкаться; 3) наступать (о сумерках, зиме)", "examples": [], "register": [] },
        { "id": 6, "phrase": "close out", "partOfSpeech": "verb", "translation": "ликвидировать (дело)", "examples": [], "register": [] },
        { "id": 7, "phrase": "close up", "partOfSpeech": "verb", "translation": "1) закрывать (наглухо); 2) смыкать (ряды); 3) сближаться; срастаться (о ране)", "examples": [], "register": [] }
    ]
}

# 10. FALL
NEW_ENTRIES['fall'] = {
    "word": "fall",
    "frequency_rank": 314,
    "cefr": "a1",
    "phon_br": "/fɔːl/",
    "phon_n_am": "/fɔːl/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "падение; снижение", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "спад; падение цен, обесценение", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "выпадение осадков", "examples": [
            { "en": "a heavy fall of rain", "ru": "ливень" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "уклон, обрыв, склон (холма); скат, понижение профиля местности", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "упадок, закат, потеря могущества", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "моральное падение; потеря чести", "examples": [
            { "en": "the Fall of man", "ru": "грехопадение", "register": ["религиозное"] }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "выпадение (волос и т. п.)", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "noun", "translation": "количество сваленного леса", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "noun", "translation": "осень", "examples": [], "register": ["американский английский"] },
        { "id": 10, "partOfSpeech": "noun", "translation": "при англ. мн. ч.: водопад", "examples": [
            { "en": "Niagara Falls", "ru": "Ниагарский водопад" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "noun", "translation": "впадение (реки)", "examples": [], "register": [] },
        { "id": 12, "partOfSpeech": "noun", "translation": "схватка (в борьбе)", "examples": [
            { "en": "to try a fall with smb.", "ru": "бороться с кем-либо" }
        ], "register": ["спортивное"] },
        { "id": 13, "partOfSpeech": "noun", "translation": "каданс", "examples": [], "register": ["музыка"] },
        { "id": 14, "partOfSpeech": "noun", "translation": "окот; выводок, помёт", "examples": [], "register": [] },
        { "id": 15, "partOfSpeech": "noun", "translation": "напор, высота напора", "examples": [], "register": ["техническое"] },
        { "id": 16, "partOfSpeech": "noun", "translation": "канат или цепь подъёмного блока (обыкн. block and fall)", "examples": [], "register": ["техническое"] },
        { "id": 17, "partOfSpeech": "noun", "translation": "фал", "examples": [], "register": ["морской термин"] },
        { "id": 18, "partOfSpeech": "verb", "translation": "падать, спадать, понижаться", "examples": [
            { "en": "the Neva has fallen", "ru": "вода в Неве спала" },
            { "en": "prices are falling", "ru": "цены понижаются" }
        ], "register": [] },
        { "id": 19, "partOfSpeech": "verb", "translation": "опускаться, падать", "examples": [
            { "en": "the curtain falls", "ru": "занавес опускается" },
            { "en": "the temperature has fallen", "ru": "температура упала; похолодало" },
            { "en": "my spirits fell", "ru": "моё настроение упало" }
        ], "register": [] },
        { "id": 20, "partOfSpeech": "verb", "translation": "ниспадать; (свободно) падать (об одежде, волосах и т. п.)", "examples": [], "register": [] },
        { "id": 21, "partOfSpeech": "verb", "translation": "оседать, обваливаться", "examples": [], "register": [] },
        { "id": 22, "partOfSpeech": "verb", "translation": "впадать (о реке; into — в)", "examples": [], "register": [] },
        { "id": 23, "partOfSpeech": "verb", "translation": "спускаться, сходить", "examples": [
            { "en": "night fell", "ru": "спустилась ночь" }
        ], "register": [] },
        { "id": 24, "partOfSpeech": "verb", "translation": "потерпеть крах; разориться", "examples": [], "register": [] },
        { "id": 25, "partOfSpeech": "verb", "translation": "сникнуть", "examples": [
            { "en": "her face fell", "ru": "её лицо вытянулось" }
        ], "register": [] },
        { "id": 26, "partOfSpeech": "verb", "translation": "утратить власть", "examples": [], "register": [] },
        { "id": 27, "partOfSpeech": "verb", "translation": "пасть морально", "examples": [], "register": [] },
        { "id": 28, "partOfSpeech": "verb", "translation": "приходиться, падать; доставаться", "examples": [
            { "en": "his birthday falls on Monday", "ru": "день его рождения приходится на понедельник" },
            { "en": "the expense falls on me", "ru": "расход падает на меня" }
        ], "register": [] },
        { "id": 29, "partOfSpeech": "verb", "translation": "гибнуть", "examples": [
            { "en": "to fall in battle", "ru": "пасть в бою; быть убитым" },
            { "en": "the fortress fell", "ru": "крепость пала" }
        ], "register": [] },
        { "id": 30, "partOfSpeech": "verb", "translation": "стихать (о ветре и т. п.)", "examples": [], "register": [] },
        { "id": 31, "partOfSpeech": "verb", "translation": "рождаться (о ягнятах и т. п.)", "examples": [], "register": [] },
        { "id": 32, "partOfSpeech": "verb", "translation": "рубить (лес); валить (дерево); валиться (о дереве)", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "pride goes before (или will have) a fall", "partOfSpeech": "noun", "translation": "≈ гордый покичился да во прах скатился; спесь в добро не вводит, гордыня до добра не доведёт", "examples": [], "register": [] },
        { "id": 2, "phrase": "fall about", "partOfSpeech": "verb", "translation": "падать от хохота", "examples": [], "register": ["разговорное"] },
        { "id": 3, "phrase": "fall apart", "partOfSpeech": "verb", "translation": "1) разбиваться (о посуде); 2) кончаться неудачей; 3) распадаться (о дружбе)", "examples": [], "register": [] },
        { "id": 4, "phrase": "fall away", "partOfSpeech": "verb", "translation": "1) чахнуть, сохнуть; 2) спадать; уменьшаться; 3) покидать, изменять", "examples": [], "register": [] },
        { "id": 5, "phrase": "fall back", "partOfSpeech": "verb", "translation": "отступать", "examples": [], "register": [] },
        { "id": 6, "phrase": "fall back (up)on", "partOfSpeech": "verb", "translation": "1) прибегать к чему-либо; 2) обращаться к кому-либо в нужде", "examples": [], "register": [] },
        { "id": 7, "phrase": "fall behind", "partOfSpeech": "verb", "translation": "1) отставать, оставаться позади; 2) опаздывать с уплатой", "examples": [], "register": [] },
        { "id": 8, "phrase": "fall down", "partOfSpeech": "verb", "translation": "потерпеть неудачу", "examples": [
            { "en": "to fall down on one's work", "ru": "не справиться со своей работой" }
        ], "register": ["разговорное"] },
        { "id": 9, "phrase": "fall for", "partOfSpeech": "verb", "translation": "1) попадаться на удочку; 2) влюбляться; чувствовать влечение; поддаваться (чему-либо)", "examples": [], "register": ["разговорное"] },
        { "id": 10, "phrase": "fall in", "partOfSpeech": "verb", "translation": "1) воен. становиться в строй, строиться; 2) проваливаться, обрушиваться; 3) истекать (о сроке аренды, долга, векселя)", "examples": [], "register": [] },
        { "id": 11, "phrase": "fall in (with)", "partOfSpeech": "verb", "translation": "1) случайно встретиться, столкнуться; 2) уступать; соглашаться, быть в согласии (с кем-либо)", "examples": [], "register": [] },
        { "id": 12, "phrase": "fall off", "partOfSpeech": "verb", "translation": "1) уменьшаться; ослабевать; 2) отпадать; отваливаться; 3) мор. не слушаться руля (о корабле)", "examples": [], "register": [] },
        { "id": 13, "phrase": "fall out", "partOfSpeech": "verb", "translation": "1) ссориться; 2) выпадать; 3) воен. выходить из строя; 4) случаться", "examples": [
            { "en": "it so fell out that", "ru": "случилось так, что" }
        ], "register": [] },
        { "id": 14, "phrase": "fall over", "partOfSpeech": "verb", "translation": "1) споткнуться обо что-либо; 2) увлекаться", "examples": [], "register": [] },
        { "id": 15, "phrase": "fall through", "partOfSpeech": "verb", "translation": "провалиться; потерпеть неудачу", "examples": [], "register": [] },
        { "id": 16, "phrase": "fall to", "partOfSpeech": "verb", "translation": "1) начинать, приниматься за что-либо; 2) приниматься за еду", "examples": [], "register": [] },
        { "id": 17, "phrase": "to fall in love", "partOfSpeech": "verb", "translation": "влюбляться", "examples": [
            { "en": "he falls in and out of love too often", "ru": "он непостоянен в любви" }
        ], "register": [] },
        { "id": 18, "phrase": "to fall on one's face", "partOfSpeech": "verb", "translation": "провалиться с треском, оскандалиться", "examples": [], "register": [] },
        { "id": 19, "phrase": "to fall to pieces", "partOfSpeech": "verb", "translation": "развалиться", "examples": [], "register": [] },
        { "id": 20, "phrase": "to fall flat", "partOfSpeech": "verb", "translation": "не произвести ожидаемого впечатления", "examples": [
            { "en": "his joke fell flat", "ru": "его шутка не имела успеха" }
        ], "register": [] },
        { "id": 21, "phrase": "to fall from grace", "partOfSpeech": "verb", "translation": "1) согрешить; 2) впасть в ересь", "examples": [], "register": [] },
        { "id": 22, "phrase": "to fall into line", "partOfSpeech": "verb", "translation": "построиться, стать в строй", "examples": [], "register": ["военное"] },
        { "id": 23, "phrase": "to fall into line with", "partOfSpeech": "verb", "translation": "подчиняться, соглашаться с", "examples": [], "register": [] },
        { "id": 24, "phrase": "to fall foul of", "partOfSpeech": "verb", "translation": "1) сталкиваться (морской термин); 2) ссориться; нападать", "examples": [], "register": [] },
        { "id": 25, "phrase": "to fall over oneself", "partOfSpeech": "verb", "translation": "лезть из кожи вон", "examples": [], "register": [] },
        { "id": 26, "phrase": "to fall over one another, to fall over each other", "partOfSpeech": "verb", "translation": "драться, бороться, ожесточённо соперничать друг с другом", "examples": [], "register": [] },
        { "id": 27, "phrase": "let fall!", "partOfSpeech": "verb", "translation": "отпускай!", "examples": [], "register": ["морской термин"] }
    ]
}

# Update in dataset
for idx, it in enumerate(oxford_data):
    w = it['word']
    if w in NEW_ENTRIES:
        oxford_data[idx] = NEW_ENTRIES[w]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Successfully rebuilt all {len(NEW_ENTRIES)} critical multi-POS entries!")
