# -*- coding: utf-8 -*-
"""
Rebuild batch 4 with 100% academic precision:
cut, deal, demand, design, desire, die, doubt, draw, dress, drink.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

BATCH4_ENTRIES = {}

# 1. CUT
BATCH4_ENTRIES['cut'] = {
    "word": "cut",
    "frequency_rank": 265,
    "cefr": "a1",
    "phon_br": "/kʌt/",
    "phon_n_am": "/kʌt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "порез, рана; разрез", "examples": [
            { "en": "a deep cut", "ru": "глубокий порез" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "кусок (мяса); порция", "examples": [
            { "en": "a cut of beef", "ru": "кусок говядины" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "покрой, фасон (платья)", "examples": [
            { "en": "the cut of a coat", "ru": "покрой пальто" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "снижение, сокращение (цен, расходов, зарплаты)", "examples": [
            { "en": "a cut in prices", "ru": "снижение цен" },
            { "en": "tax cuts", "ru": "сокращение налогов" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "стрижка (волос)", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "гравюра, клише; иллюстрация", "examples": [], "register": ["полиграфия"] },
        { "id": 7, "partOfSpeech": "noun", "translation": "кратчайший путь, срезка дороги", "examples": [
            { "en": "short cut", "ru": "кратчайший путь, прямая дорога" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "noun", "translation": "доля, пай, процент (от прибыли)", "examples": [], "register": ["разговорное"] },
        { "id": 9, "partOfSpeech": "verb", "translation": "резать, разрезать, срезАть (past: cut, p. p.: cut)", "examples": [
            { "en": "to cut bread", "ru": "резать хлеб" },
            { "en": "to cut flowers", "ru": "срезать цветы" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "порезать(ся)", "examples": [
            { "en": "I cut my finger", "ru": "я порезал палец" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "стричь, подстригать (волосы, ногти, газон)", "examples": [
            { "en": "to cut hair", "ru": "стричь волосы" },
            { "en": "to cut the grass", "ru": "косить траву" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "рубить, срубать (дерево)", "examples": [
            { "en": "to cut wood", "ru": "рубить дрова" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "снижать, уменьшать, сокращать (цены, расходы)", "examples": [
            { "en": "to cut prices", "ru": "снижать цены" },
            { "en": "to cut production", "ru": "сокращать производство" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "кроить (одежду)", "examples": [
            { "en": "to cut a suit", "ru": "кроить костюм" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "прорезать, пересекать (дорогу, реку)", "examples": [], "register": [] },
        { "id": 16, "partOfSpeech": "verb", "translation": "пропускать, прогуливать (лекции, собрание)", "examples": [
            { "en": "to cut a lecture", "ru": "пропустить лекцию" }
        ], "register": ["разговорное"] },
        { "id": 17, "partOfSpeech": "verb", "translation": "делать вид, что не узнаёшь; игнорировать", "examples": [
            { "en": "to cut smb. dead", "ru": "демонстративно не замечать кого-либо" }
        ], "register": [] },
        { "id": 18, "partOfSpeech": "verb", "translation": "резать, прорезываться (о зубах)", "examples": [
            { "en": "the baby is cutting teeth", "ru": "у ребёнка режутся зубки" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to cut both ways", "partOfSpeech": "verb", "translation": "палка о двух концах; действовать в обоих направлениях", "examples": [], "register": [] },
        { "id": 2, "phrase": "to cut a figure", "partOfSpeech": "verb", "translation": "производить впечатление, выделяться", "examples": [], "register": [] },
        { "id": 3, "phrase": "to cut corners", "partOfSpeech": "verb", "translation": "экономить, идти по пути наименьшего сопротивления", "examples": [], "register": [] },
        { "id": 4, "phrase": "to cut a long story short", "partOfSpeech": "adverb", "translation": "короче говоря, одним словом", "examples": [], "register": [] },
        { "id": 5, "phrase": "cut back", "partOfSpeech": "verb", "translation": "сокращать, урезать (расходы, производство)", "examples": [], "register": [] },
        { "id": 6, "phrase": "cut down", "partOfSpeech": "verb", "translation": "1) срубать (дерево); 2) сокращать, урезать (расходы: on)", "examples": [], "register": [] },
        { "id": 7, "phrase": "cut in", "partOfSpeech": "verb", "translation": "1) вмешиваться (в разговор); 2) подрезать (об автомобиле)", "examples": [], "register": [] },
        { "id": 8, "phrase": "cut off", "partOfSpeech": "verb", "translation": "1) отрезать, отсекать; 2) разъединять (о телефонной связи); 3) лишать наследства", "examples": [], "register": [] },
        { "id": 9, "phrase": "cut out", "partOfSpeech": "verb", "translation": "1) вырезать; 2) исключить, прекратить; 3) быть созданным для чего-либо (to be cut out for)", "examples": [], "register": [] },
        { "id": 10, "phrase": "cut up", "partOfSpeech": "verb", "translation": "1) разрезать на куски; 2) огорчать, расстраивать (to be cut up)", "examples": [], "register": [] }
    ]
}

# 2. DEAL
BATCH4_ENTRIES['deal'] = {
    "word": "deal",
    "frequency_rank": 335,
    "cefr": "a2",
    "phon_br": "/diːl/",
    "phon_n_am": "/diːl/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "количество, часть", "examples": [
            { "en": "a great deal, a good deal", "ru": "много, порядочно, значительное количество" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "сделка, соглашение", "examples": [
            { "en": "to make a deal", "ru": "заключить сделку, договориться" },
            { "en": "it's a deal!", "ru": "по рукам!, идёт!" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "обращение, отношение; условия", "examples": [
            { "en": "a fair deal", "ru": "честное отношение, справедливые условия" },
            { "en": "a raw deal", "ru": "несправедливое отношение" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "сдача карт; ход сдачи", "examples": [], "register": ["карточное"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "сосновая или еловая доска, дильс; хвойная древесина", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "иметь дело (with — с кем-либо, чем-либо); заниматься (чем-либо)", "examples": [
            { "en": "to deal with a problem", "ru": "заниматься проблемой, решать вопрос" },
            { "en": "the book deals with history", "ru": "книга посвящена истории" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "вести себя, поступать, обращаться", "examples": [
            { "en": "to deal fairly with smb.", "ru": "поступать с кем-либо честно, по совести" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "торговать (in — чем-либо); вести дела (with — с кем-либо)", "examples": [
            { "en": "to deal in grain", "ru": "торговать зерном" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "быть постоянным покупателем, покупать (at, with)", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "раздавать, распределять (обыкн. deal out)", "examples": [], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "сдавать карты", "examples": [], "register": ["карточное"] },
        { "id": 12, "partOfSpeech": "verb", "translation": "наносить (удар); причинять (обиду)", "examples": [
            { "en": "to deal a blow", "ru": "нанести удар" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "deal with", "partOfSpeech": "verb", "translation": "1) иметь дело с; 2) справляться с; 3) рассматривать (тему)", "examples": [], "register": [] },
        { "id": 2, "phrase": "deal out", "partOfSpeech": "verb", "translation": "раздавать, распределять; отмерять (наказание)", "examples": [], "register": [] }
    ]
}

# 3. DEMAND
BATCH4_ENTRIES['demand'] = {
    "word": "demand",
    "frequency_rank": 612,
    "cefr": "b1",
    "phon_br": "/dɪˈmɑːnd/",
    "phon_n_am": "/dɪˈmænd/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "требование", "examples": [
            { "en": "payable on demand", "ru": "подлежащий оплате по предъявлении" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "спрос; потребность, нужда", "examples": [
            { "en": "demand and supply", "ru": "спрос и предложение", "register": ["экономика"] },
            { "en": "to be in great demand", "ru": "пользоваться большим спросом" },
            { "en": "a demand for labour", "ru": "спрос на рабочую силу" }
        ], "register": ["экономика"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "запрос, претензия (on — к)", "examples": [
            { "en": "demands on one's time", "ru": "требования к чьему-либо времени" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "в роли определения: до востребования, бессрочный", "examples": [
            { "en": "demand deposit", "ru": "бессрочный вклад, вклад до востребования" },
            { "en": "demand loan", "ru": "ссуда до востребования" }
        ], "register": ["банковское дело"] },
        { "id": 5, "partOfSpeech": "verb", "translation": "требовать (of, from — от кого-либо)", "examples": [
            { "en": "to demand an explanation", "ru": "требовать объяснения" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "спрашивать, задавать вопрос", "examples": [
            { "en": "he demanded what I wanted", "ru": "он спросил, что мне нужно" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "требовать, нуждаться (о деле, вопросе)", "examples": [
            { "en": "this problem demands attention", "ru": "этот вопрос требует внимания" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "in demand", "partOfSpeech": "adjective", "translation": "пользующийся спросом, ходовой", "examples": [], "register": [] },
        { "id": 2, "phrase": "on demand", "partOfSpeech": "adverb", "translation": "по требованию, по первому требованию", "examples": [], "register": [] }
    ]
}

# 4. DESIGN
BATCH4_ENTRIES['design'] = {
    "word": "design",
    "frequency_rank": 313,
    "cefr": "a1",
    "phon_br": "/dɪˈzaɪn/",
    "phon_n_am": "/dɪˈzaɪn/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "проект; план; чертёж; конструкция, расчёт", "examples": [
            { "en": "a design for a building", "ru": "проект здания" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "рисунок, эскиз; узор, орнамент", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "дизайн, оформление", "examples": [
            { "en": "industrial design", "ru": "промышленный дизайн" },
            { "en": "interior design", "ru": "дизайн интерьера" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "замысел, намерение, цель", "examples": [
            { "en": "by design", "ru": "намеренно, с умыслом" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "композиция (картины и т. п.)", "examples": [], "register": ["искусство"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "злой умысел, коварные замыслы (обыкн. pl)", "examples": [
            { "en": "to have designs on smb.", "ru": "вынашивать коварные замыслы против кого-либо" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "проектировать; конструировать, разрабатывать", "examples": [
            { "en": "to design an engine", "ru": "проектировать двигатель" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "рисовать, создавать эскизы (одежды, тканей)", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "предназначать (for, as)", "examples": [
            { "en": "this room is designed as a study", "ru": "эта комната предназначается для кабинета" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "задумывать, замышлять, предполагать", "examples": [
            { "en": "we did not design this result", "ru": "мы не ожидали такого результата" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "by design", "partOfSpeech": "adverb", "translation": "нарочно, преднамеренно", "examples": [], "register": [] },
        { "id": 2, "phrase": "to have designs on", "partOfSpeech": "verb", "translation": "иметь виды на, замышлять недоброе против", "examples": [], "register": [] }
    ]
}

# 5. DESIRE
BATCH4_ENTRIES['desire'] = {
    "word": "desire",
    "frequency_rank": 1424,
    "cefr": "b2",
    "phon_br": "/dɪˈzaɪə(r)/",
    "phon_n_am": "/dɪˈzaɪər/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "сильное желание, стремление (for, to)", "examples": [
            { "en": "a desire for knowledge", "ru": "стремление к знаниям" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "просьба, пожелание", "examples": [
            { "en": "at your desire", "ru": "по вашей просьбе" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "страсть, вожделение", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "предмет желания; мечта", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "желать, хотеть", "examples": [
            { "en": "to leave much to be desired", "ru": "оставлять желать лучшего" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "просить, требовать", "examples": [
            { "en": "I desire you to go at once", "ru": "я требую, чтобы вы немедленно ушли" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to leave much to be desired", "partOfSpeech": "verb", "translation": "оставлять желать много лучшего", "examples": [], "register": [] }
    ]
}

# 6. DIE
BATCH4_ENTRIES['die'] = {
    "word": "die",
    "frequency_rank": 269,
    "cefr": "a1",
    "phon_br": "/daɪ/",
    "phon_n_am": "/daɪ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "игральная кость (pl dice)", "examples": [
            { "en": "to play with loaded dice", "ru": "играть краплёными костями; перен. жульничать" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "штамп, пуансон, матрица; чекан", "examples": [], "register": ["техническое"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "винторезная головка, клупп", "examples": [], "register": ["техническое"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "цоколь колонны (pl dice)", "examples": [], "register": ["архитектура"] },
        { "id": 5, "partOfSpeech": "verb", "translation": "умирать, скончаться (of, from — от чего-либо; for — за что-либо)", "examples": [
            { "en": "to die in one's bed", "ru": "умереть естественной смертью" },
            { "en": "to die of cancer", "ru": "умереть от рака" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "исчезать, угасать, прекращаться", "examples": [
            { "en": "the custom died", "ru": "обычай отмер" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "заглохнуть (о моторе; также die out)", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "затихать (о ветре, буре)", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "испаряться (о жидкости)", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "страстно желать, томиться желанием (for, to)", "examples": [
            { "en": "I am dying for a glass of water", "ru": "мне до смерти хочется пить" },
            { "en": "I am dying to see him", "ru": "я ужасно хочу его видеть" }
        ], "register": ["разговорное"] },
        { "id": 11, "partOfSpeech": "verb", "translation": "штамповать, чеканить", "examples": [], "register": ["техническое"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "the die is cast", "partOfSpeech": "noun", "translation": "≈ жребий брошен, выбор сделан", "examples": [], "register": [] },
        { "id": 2, "phrase": "to die hard", "partOfSpeech": "verb", "translation": "1) сопротивляться до конца; 2) медленно отмирать, быть живучим", "examples": [], "register": [] },
        { "id": 3, "phrase": "to die in harness", "partOfSpeech": "verb", "translation": "умереть за работой, умереть на своём посту", "examples": [], "register": [] },
        { "id": 4, "phrase": "to die in one's boots", "partOfSpeech": "verb", "translation": "умереть насильственной или скоропостижной смертью", "examples": [], "register": [] },
        { "id": 5, "phrase": "a man can die but once", "partOfSpeech": "noun", "translation": "≈ двум смертям не бывать, а одной не миновать", "examples": [], "register": [] },
        { "id": 6, "phrase": "never say die!", "partOfSpeech": "interjection", "translation": "не вешай нос!, никогда не отчаивайся!", "examples": [], "register": [] },
        { "id": 7, "phrase": "die away", "partOfSpeech": "verb", "translation": "замирать, утихать (о звуке, ветре)", "examples": [], "register": [] },
        { "id": 8, "phrase": "die down", "partOfSpeech": "verb", "translation": "утихать, успокаиваться (об огне, буре, споре)", "examples": [], "register": [] },
        { "id": 9, "phrase": "die out", "partOfSpeech": "verb", "translation": "вымирать, исчезать, отмирать", "examples": [], "register": [] }
    ]
}

# 7. DOUBT
BATCH4_ENTRIES['doubt'] = {
    "word": "doubt",
    "frequency_rank": 648,
    "cefr": "b1",
    "phon_br": "/daʊt/",
    "phon_n_am": "/daʊt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "сомнение", "examples": [
            { "en": "I have my doubts about him", "ru": "у меня на его счёт есть сомнения" },
            { "en": "the final outcome is still in doubt", "ru": "исход этого дела всё ещё не ясен" },
            { "en": "there is no doubt about it", "ru": "в этом нет сомнений" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "verb", "translation": "сомневаться, быть неуверенным, колебаться", "examples": [
            { "en": "I doubt whether it is true", "ru": "я сомневаюсь, правда ли это" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "verb", "translation": "не доверять, сомневаться в чьей-либо искренности", "examples": [
            { "en": "you surely don't doubt me", "ru": "вы, надеюсь, мне доверяете" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "no doubt, without doubt, beyond doubt", "partOfSpeech": "adverb", "translation": "несомненно, вне всякого сомнения", "examples": [], "register": [] },
        { "id": 2, "phrase": "there is not a shadow of doubt", "partOfSpeech": "noun", "translation": "нет ни малейшей тени сомнения", "examples": [], "register": [] },
        { "id": 3, "phrase": "to give smb. the benefit of the doubt", "partOfSpeech": "verb", "translation": "толковать сомнения в чью-либо пользу", "examples": [], "register": [] }
    ]
}

# 8. DRAW
BATCH4_ENTRIES['draw'] = {
    "word": "draw",
    "frequency_rank": 348,
    "cefr": "a1",
    "phon_br": "/drɔː/",
    "phon_n_am": "/drɔː/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "тяга, натяжение; вытягивание, таскание", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "жеребьёвка, тираж, розыгрыш", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "ничья, ничейный результат", "examples": [
            { "en": "the game ended in a draw", "ru": "игра закончилась вничью" }
        ], "register": ["спортивное"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "приманка, гвоздь программы; то, что привлекает публику", "examples": [
            { "en": "he is a great draw", "ru": "он привлекает массу публики" }
        ], "register": ["театр"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "затяжка (сигаретой)", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "разводной мост", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "тащить, волочить; тянуть, натягивать (past: drew, p. p.: drawn)", "examples": [
            { "en": "to draw wire", "ru": "тянуть проволоку" },
            { "en": "to draw a parachute", "ru": "раскрыть парашют" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "натягивать, надевать (перчатки, шапку: on)", "examples": [], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "двигать(ся), передвигаться, приближаться", "examples": [
            { "en": "the train drew into the station", "ru": "поезд подошёл к станции" },
            { "en": "night was drawing near", "ru": "наступала ночь" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "извлекать, вытаскивать (из кармана, ножен)", "examples": [
            { "en": "to draw a sword", "ru": "обнажить шпагу" },
            { "en": "to draw a tooth", "ru": "удалить зуб" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "черпать (воду), набирать", "examples": [
            { "en": "to draw water", "ru": "черпать воду" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "снимать со счёта (деньги)", "examples": [
            { "en": "to draw money from the bank", "ru": "снять деньги со счёта в банке" }
        ], "register": ["банковское дело"] },
        { "id": 13, "partOfSpeech": "verb", "translation": "привлекать, притягивать (внимание, публику)", "examples": [
            { "en": "to draw attention", "ru": "привлекать внимание" },
            { "en": "the play drew large crowds", "ru": "пьеса привлекла массу зрителей" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "делать вывод, выводить", "examples": [
            { "en": "to draw a conclusion", "ru": "сделать вывод" }
        ], "register": [] },
        { "id": 15, "partOfSpeech": "verb", "translation": "рисовать, чертить", "examples": [
            { "en": "to draw a map", "ru": "начертить карту" },
            { "en": "to draw a line", "ru": "провести линию" }
        ], "register": [] },
        { "id": 16, "partOfSpeech": "verb", "translation": "сыграть вничью, закончить вничью", "examples": [
            { "en": "to draw a match", "ru": "сыграть матч вничью" }
        ], "register": ["спортивное"] },
        { "id": 17, "partOfSpeech": "verb", "translation": "тянуть жребий", "examples": [
            { "en": "they drew for places", "ru": "они бросили жребий, кому где сесть" }
        ], "register": [] },
        { "id": 18, "partOfSpeech": "verb", "translation": "составлять, оформлять (документ); выписывать (чек)", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to draw the line", "partOfSpeech": "verb", "translation": "установить границу, положить предел", "examples": [], "register": [] },
        { "id": 2, "phrase": "to draw the wool over smb.'s eyes", "partOfSpeech": "verb", "translation": "вводить в заблуждение, втирать очки", "examples": [], "register": [] },
        { "id": 3, "phrase": "draw back", "partOfSpeech": "verb", "translation": "отступать, отпрянуть; выходить из игры", "examples": [], "register": [] },
        { "id": 4, "phrase": "draw in", "partOfSpeech": "verb", "translation": "1) сокращаться (о днях); 2) вовлекать; 3) затянуться (сигаретой)", "examples": [], "register": [] },
        { "id": 5, "phrase": "draw on", "partOfSpeech": "verb", "translation": "1) натягивать (перчатки); 2) приближаться (о времени года); 3) опираться на", "examples": [], "register": [] },
        { "id": 6, "phrase": "draw out", "partOfSpeech": "verb", "translation": "1) вытягивать, вытаскивать; 2) затягиваться, длиться; 3) вызывать на откровенность", "examples": [], "register": [] },
        { "id": 7, "phrase": "draw up", "partOfSpeech": "verb", "translation": "1) составлять (документ); 2) останавливаться (о машине, экипаже); 3) выстраивать(ся)", "examples": [], "register": [] }
    ]
}

# 9. DRESS
BATCH4_ENTRIES['dress'] = {
    "word": "dress",
    "frequency_rank": 472,
    "cefr": "a1",
    "phon_br": "/dres/",
    "phon_n_am": "/dres/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "платье; одежда, наряд", "examples": [
            { "en": "evening dress", "ru": "вечернее платье; фрак, смокинг" },
            { "en": "casual dress", "ru": "повседневная одежда" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "одеяние, внешний покров; оперение", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "в роли определения: парадный", "examples": [
            { "en": "dress uniform", "ru": "парадная форма" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "в роли определения: плательный", "examples": [
            { "en": "dress goods", "ru": "плательные ткани" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "одевать(ся), наряжать(ся)", "examples": [
            { "en": "to get dressed", "ru": "одеться" },
            { "en": "to dress for dinner", "ru": "переодеваться к обеду" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "оформлять, украшать (витрину, сцену)", "examples": [
            { "en": "to dress a shop window", "ru": "оформлять витрину" },
            { "en": "to dress a ship", "ru": "расцвечивать корабль флагами", "register": ["морской термин"] }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "перевязывать, делать перевязку (раны)", "examples": [
            { "en": "to dress a wound", "ru": "перевязать рану" }
        ], "register": ["медицинское"] },
        { "id": 8, "partOfSpeech": "verb", "translation": "причёсывать, укладывать волосы", "examples": [
            { "en": "to dress hair", "ru": "делать причёску, укладывать волосы" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "разделывать (тушу); потрошить, чистить (птицу, рыбу)", "examples": [], "register": ["кулинария"] },
        { "id": 10, "partOfSpeech": "verb", "translation": "заправлять, приправлять (салат, кушанье)", "examples": [
            { "en": "to dress a salad", "ru": "заправить салат" }
        ], "register": ["кулинария"] },
        { "id": 11, "partOfSpeech": "verb", "translation": "удобрять (почву)", "examples": [], "register": ["сельскохозяйственное"] },
        { "id": 12, "partOfSpeech": "verb", "translation": "обрабатывать, шлифовать (камень, дерево, кожу)", "examples": [], "register": ["техническое"] },
        { "id": 13, "partOfSpeech": "verb", "translation": "выравниваться, строиться в шеренгу", "examples": [
            { "en": "dress!", "ru": "равняйсь!" }
        ], "register": ["военное"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "dress up", "partOfSpeech": "verb", "translation": "1) наряжаться, изысканно одеваться; 2) надевать маскарадный костюм", "examples": [], "register": [] },
        { "id": 2, "phrase": "dress down", "partOfSpeech": "verb", "translation": "1) одеваться просто, неформально; 2) задать головомойку, отругать", "examples": [], "register": [] }
    ]
}

# 10. DRINK
BATCH4_ENTRIES['drink'] = {
    "word": "drink",
    "frequency_rank": 371,
    "cefr": "a1",
    "phon_br": "/drɪŋk/",
    "phon_n_am": "/drɪŋk/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "напиток, питьё", "examples": [
            { "en": "soft drinks", "ru": "безалкогольные напитки" },
            { "en": "cold drinks", "ru": "прохладительные напитки" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "спиртной напиток, алкоголь (также strong drink)", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "глоток; бокал, стакан", "examples": [
            { "en": "to have a drink", "ru": "выпить, промочить горло" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "пьянство, алкоголизм", "examples": [
            { "en": "in drink", "ru": "в пьяном виде, навеселе" },
            { "en": "to take to drink", "ru": "запить, пристраститься к спиртному" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "море, океан", "examples": [
            { "en": "to fall into the drink", "ru": "упасть за борт, упасть в воду" }
        ], "register": ["разговорное"] },
        { "id": 6, "partOfSpeech": "verb", "translation": "пить, выпить (past: drank, p. p.: drunk)", "examples": [
            { "en": "to drink water", "ru": "пить воду" },
            { "en": "to drink tea", "ru": "пить чай" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "пить спиртное, выпивать, пьянствовать", "examples": [
            { "en": "to drink hard, to drink heavily", "ru": "сильно пить, пьянствовать" },
            { "en": "to drink like a fish", "ru": "пить запоем, пить как сапожник" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "пить за здоровье, провозглашать тост", "examples": [
            { "en": "to drink to smb.'s health", "ru": "пить за чьё-либо здоровье" },
            { "en": "to drink a toast", "ru": "провозгласить тост" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "впитывать (влагу); вдыхать (воздух)", "examples": [
            { "en": "plants drink in moisture", "ru": "растения впитывают влагу" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "drink in", "partOfSpeech": "verb", "translation": "жадно внимать, упиваться (красотой, музыкой)", "examples": [], "register": [] },
        { "id": 2, "phrase": "drink to", "partOfSpeech": "verb", "translation": "пить за кого-либо, что-либо", "examples": [], "register": [] },
        { "id": 3, "phrase": "drink up, drink down", "partOfSpeech": "verb", "translation": "допить, выпить залпом, осушить бокал", "examples": [], "register": [] }
    ]
}

# Update in dataset
for idx, it in enumerate(oxford_data):
    w = it['word']
    if w in BATCH4_ENTRIES:
        oxford_data[idx] = BATCH4_ENTRIES[w]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Successfully rebuilt all {len(BATCH4_ENTRIES)} entries of batch 4!")
