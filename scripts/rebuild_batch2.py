# -*- coding: utf-8 -*-
"""
Rebuild batch 2 with 100% academic precision:
act, air, arm, back, bear, beat, box, care, case, cast.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

BATCH2_ENTRIES = {}

# 1. ACT
BATCH2_ENTRIES['act'] = {
    "word": "act",
    "frequency_rank": 381,
    "cefr": "a2",
    "phon_br": "/ækt/",
    "phon_n_am": "/ækt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "деяние, поступок, действие", "examples": [
            { "en": "act of God", "ru": "стихийное бедствие, форс-мажор", "register": ["юридическое"] },
            { "en": "act of bravery", "ru": "смелый поступок" },
            { "en": "act of mercy", "ru": "проявление милосердия" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "акт, закон, постановление", "examples": [
            { "en": "Act of Parliament", "ru": "парламентский акт, закон" }
        ], "register": ["юридическое"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "действие, акт (пьесы)", "examples": [], "register": ["театр"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "номер (в цирке, на эстраде)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "притворство, игра", "examples": [
            { "en": "to put on an act", "ru": "притворяться, разыгрывать спектакль" }
        ], "register": ["разговорное"] },
        { "id": 6, "partOfSpeech": "verb", "translation": "действовать, поступать", "examples": [
            { "en": "to act promptly", "ru": "действовать незамедлительно" },
            { "en": "to act as smb.", "ru": "выполнять чьи-либо обязанности, выступать в качестве кого-либо" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "влиять, действовать (on, upon — на что-либо)", "examples": [
            { "en": "the medicine acted on the fever", "ru": "лекарство подействовало на температуру" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "играть (роль), исполнять", "examples": [
            { "en": "to act Hamlet", "ru": "играть Гамлета" },
            { "en": "to act on the stage", "ru": "играть на сцене" }
        ], "register": ["театр"] },
        { "id": 9, "partOfSpeech": "verb", "translation": "притворяться, разыгрывать из себя", "examples": [
            { "en": "to act the fool", "ru": "валять дурака, разыгрывать шута" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "работать, функционировать (о механизме)", "examples": [
            { "en": "the brakes did not act", "ru": "тормоза не сработали" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "in the act (of)", "partOfSpeech": "adverb", "translation": "на месте преступления, с поличным", "examples": [
            { "en": "to catch in the very act", "ru": "поймать с поличным" }
        ], "register": [] },
        { "id": 2, "phrase": "to get into the act", "partOfSpeech": "verb", "translation": "примазаться к делу, принять участие ради выгоды", "examples": [], "register": ["разговорное"] },
        { "id": 3, "phrase": "to clean up one's act", "partOfSpeech": "verb", "translation": "исправиться, взяться за ум", "examples": [], "register": ["разговорное"] },
        { "id": 4, "phrase": "act up", "partOfSpeech": "verb", "translation": "1) баловаться, капризничать (о детях); 2) барахлить, плохо работать (о механизме)", "examples": [], "register": ["разговорное"] },
        { "id": 5, "phrase": "act out", "partOfSpeech": "verb", "translation": "разыгрывать (сцену), выражать в действии", "examples": [], "register": [] }
    ]
}

# 2. AIR
BATCH2_ENTRIES['air'] = {
    "word": "air",
    "frequency_rank": 302,
    "cefr": "a1",
    "phon_br": "/eə(r)/",
    "phon_n_am": "/er/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "воздух", "examples": [
            { "en": "fresh air", "ru": "свежий воздух" },
            { "en": "open air", "ru": "открытый воздух" },
            { "en": "in the open air", "ru": "на свежем воздухе" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "атмосфера; эфир (радио, телевидение)", "examples": [
            { "en": "on the air", "ru": "в эфире, по радио, по телевидению" },
            { "en": "off the air", "ru": "вне эфира, передача окончена" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "ветерок, лёгкое дуновение", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "вид, внешность, манера", "examples": [
            { "en": "an air of mystery", "ru": "таинственный вид" },
            { "en": "with a triumphant air", "ru": "с торжествующим видом" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "при англ. мн. ч.: напыщенность, важничанье, замашки", "examples": [
            { "en": "to put on airs, to give oneself airs", "ru": "важничать, задирать нос" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "мелодия, мотив, ария", "examples": [], "register": ["музыка"] },
        { "id": 7, "partOfSpeech": "noun", "translation": "в роли определения: воздушный, авиационный", "examples": [
            { "en": "air travel", "ru": "путешествие по воздуху" },
            { "en": "air force", "ru": "военно-воздушные силы" },
            { "en": "air route", "ru": "авиалиния" }
        ], "register": ["авиация"] },
        { "id": 8, "partOfSpeech": "verb", "translation": "проветривать, сушить на воздухе", "examples": [
            { "en": "to air a room", "ru": "проветрить комнату" },
            { "en": "to air linen", "ru": "проветривать, сушить бельё" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "выставлять напоказ; предавать гласности, высказывать", "examples": [
            { "en": "to air one's views", "ru": "публично высказывать свои взгляды" },
            { "en": "to air one's grievances", "ru": "делиться своими обидами" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "транслировать по радио, телевидению", "examples": [], "register": ["радио", "телевидение"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "castles in the air", "partOfSpeech": "noun", "translation": "воздушные замки", "examples": [], "register": [] },
        { "id": 2, "phrase": "to clear the air", "partOfSpeech": "verb", "translation": "разрядить обстановку, устранить недоразумения", "examples": [], "register": [] },
        { "id": 3, "phrase": "to vanish into thin air", "partOfSpeech": "verb", "translation": "раствориться в воздухе, бесследно исчезнуть", "examples": [], "register": [] },
        { "id": 4, "phrase": "by air", "partOfSpeech": "adverb", "translation": "самолётом, по воздуху", "examples": [], "register": [] }
    ]
}

# 3. ARM
BATCH2_ENTRIES['arm'] = {
    "word": "arm",
    "frequency_rank": 395,
    "cefr": "a1",
    "phon_br": "/ɑːm/",
    "phon_n_am": "/ɑːrm/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "рука (от кисти до плеча)", "examples": [
            { "en": "arm in arm", "ru": "рука об руку, под руку" },
            { "en": "with open arms", "ru": "с распростёртыми объятиями" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "рукав (одежды)", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "подлокотник, ручка (кресла)", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "рукав (реки); стрела (крана); рычаг", "examples": [], "register": ["техническое"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "сила, власть", "examples": [
            { "en": "the arm of the law", "ru": "рука закона" },
            { "en": "the secular arm", "ru": "светская власть" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "оружие (обыкн. pl)", "examples": [
            { "en": "small arms", "ru": "стрелковое оружие" },
            { "en": "firearms", "ru": "огнестрельное оружие" },
            { "en": "under arms", "ru": "под ружьём" },
            { "en": "to lay down one's arms", "ru": "сложить оружие" }
        ], "register": ["военное"] },
        { "id": 7, "partOfSpeech": "noun", "translation": "род войск", "examples": [
            { "en": "arm of the service", "ru": "род войск" }
        ], "register": ["военное"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "при англ. мн. ч.: герб", "examples": [
            { "en": "coat of arms", "ru": "герб" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "вооружать(ся)", "examples": [
            { "en": "to arm oneself with patience", "ru": "вооружиться терпением" },
            { "en": "to arm against danger", "ru": "приготовиться к встрече с опасностью" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "взводить (мину, взрыватель), приводить в боевую готовность", "examples": [], "register": ["военное"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "at arm's length", "partOfSpeech": "adverb", "translation": "на расстоянии вытянутой руки; перен. держаться на расстоянии", "examples": [], "register": [] },
        { "id": 2, "phrase": "to bear arms", "partOfSpeech": "verb", "translation": "1) носить оружие; служить в армии; 2) иметь или носить герб", "examples": [], "register": [] },
        { "id": 3, "phrase": "to take up arms", "partOfSpeech": "verb", "translation": "взяться за оружие, восстать", "examples": [], "register": [] },
        { "id": 4, "phrase": "arm and leg", "partOfSpeech": "noun", "translation": "бешеные деньги, целое состояние", "examples": [
            { "en": "it costs an arm and a leg", "ru": "это стоит баснословных денег" }
        ], "register": ["разговорное"] }
    ]
}

# 4. BACK
BATCH2_ENTRIES['back'] = {
    "word": "back",
    "frequency_rank": 78,
    "cefr": "a1",
    "phon_br": "/bæk/",
    "phon_n_am": "/bæk/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "adverb", "translation": "назад, обратно", "examples": [
            { "en": "to come back", "ru": "вернуться" },
            { "en": "back and forth", "ru": "туда и обратно, взад и вперёд" },
            { "en": "give it back", "ru": "отдай это обратно" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "adverb", "translation": "тому назад (во времени)", "examples": [
            { "en": "a few days back", "ru": "несколько дней тому назад" },
            { "en": "way back in 1990", "ru": "ещё в 1990 году" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "спина; хребет", "examples": [
            { "en": "behind smb.'s back", "ru": "за чьей-либо спиной, тайком" },
            { "en": "on one's back", "ru": "на спине, навзничь" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "задняя сторона, задняя часть, задник; корешок (книги)", "examples": [
            { "en": "the back of a house", "ru": "задняя сторона дома" },
            { "en": "at the back of", "ru": "позади, сзади" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "спинка (стула)", "examples": [], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "защитник, бек", "examples": [], "register": ["спортивное"] },
        { "id": 7, "partOfSpeech": "adjective", "translation": "задний, находящийся сзади", "examples": [
            { "en": "back door", "ru": "задняя дверь, чёрный ход" },
            { "en": "back seat", "ru": "заднее сиденье" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "adjective", "translation": "прошлый, старый (о номерах газет, журналах)", "examples": [
            { "en": "back numbers", "ru": "старые номера" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "adjective", "translation": "задержанный, просроченный (о долге, зарплате)", "examples": [
            { "en": "back pay", "ru": "задолженность по зарплате" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "двигать(ся) назад, пятиться (часто back up, back out)", "examples": [
            { "en": "to back a car into the garage", "ru": "подать машину задним ходом в гараж" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "поддерживать, финансировать; делать ставку (на скачках)", "examples": [
            { "en": "to back a candidate", "ru": "поддержать кандидата" },
            { "en": "to back a horse", "ru": "ставить на лошадь" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "подкреплять (доказательствами: up)", "examples": [
            { "en": "to back up one's argument", "ru": "подкрепить свой довод" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "индоссировать, делать передаточную надпись (на векселе, чеке)", "examples": [], "register": ["финансы"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to turn one's back on", "partOfSpeech": "verb", "translation": "повернуться спиной к, бросить на произвол судьбы", "examples": [], "register": [] },
        { "id": 2, "phrase": "to put one's back into smth.", "partOfSpeech": "verb", "translation": "налечь на работу, приложить все силы", "examples": [], "register": [] },
        { "id": 3, "phrase": "back down", "partOfSpeech": "verb", "translation": "отступать, отказываться от своих претензий", "examples": [], "register": [] },
        { "id": 4, "phrase": "back out", "partOfSpeech": "verb", "translation": "идти на попятный, уклоняться от соглашения", "examples": [], "register": [] },
        { "id": 5, "phrase": "back up", "partOfSpeech": "verb", "translation": "1) поддерживать; 2) давать задний ход; 3) делать резервную копию (информатика)", "examples": [], "register": [] }
    ]
}

# 5. BEAR
BATCH2_ENTRIES['bear'] = {
    "word": "bear",
    "frequency_rank": 709,
    "cefr": "a2",
    "phon_br": "/beə(r)/",
    "phon_n_am": "/ber/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "медведь", "examples": [
            { "en": "polar bear", "ru": "белый медведь" },
            { "en": "grizzly bear", "ru": "гризли, серый медведь" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "грубый, невоспитанный человек; увалень", "examples": [], "register": ["разговорное"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "«медведь» (биржевой спекулянт, играющий на понижение)", "examples": [], "register": ["биржевой термин"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "(the B.) Большая Медведица или Малая Медведица (созвездия)", "examples": [], "register": ["астрономия"] },
        { "id": 5, "partOfSpeech": "verb", "translation": "носить, переносить, нести (тяжесть, бремя, расходы)", "examples": [
            { "en": "to bear the expenses", "ru": "нести расходы" },
            { "en": "to bear a burden", "ru": "нести бремя" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "терпеть, выносить, переносить", "examples": [
            { "en": "I can't bear him", "ru": "я терпеть его не могу" },
            { "en": "to bear pain", "ru": "терпеть боль" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "рождать, производить на свет (past: bore, p. p.: born / borne)", "examples": [
            { "en": "she bore him three sons", "ru": "она родила ему троих сыновей" },
            { "en": "to be born", "ru": "родиться" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "плодоносить, давать урожай", "examples": [
            { "en": "the tree bears well", "ru": "дерево хорошо плодоносит" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "иметь, носить (следы, отпечаток, имя, подпись)", "examples": [
            { "en": "to bear the signature", "ru": "иметь подпись, быть подписанным" },
            { "en": "to bear traces", "ru": "носить следы" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "питать, иметь (чувство, злобу)", "examples": [
            { "en": "to bear a grudge", "ru": "питать злобу, иметь зуб на кого-либо" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "поворачивать, направляться", "examples": [
            { "en": "to bear left", "ru": "принять влево" },
            { "en": "to bear west", "ru": "направляться на запад" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "держаться, вести себя (refl.)", "examples": [
            { "en": "he bore himself with dignity", "ru": "он держался с достоинством" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to bear in mind", "partOfSpeech": "verb", "translation": "помнить; иметь в виду", "examples": [], "register": [] },
        { "id": 2, "phrase": "to bear witness, to bear testimony", "partOfSpeech": "verb", "translation": "свидетельствовать, давать показания", "examples": [], "register": [] },
        { "id": 3, "phrase": "to bear a hand", "partOfSpeech": "verb", "translation": "участвовать; помогать", "examples": [], "register": [] },
        { "id": 4, "phrase": "bear down", "partOfSpeech": "verb", "translation": "1) преодолевать; 2) набрасываться, нападать (upon); 3) мор. подходить по ветру", "examples": [], "register": [] },
        { "id": 5, "phrase": "bear out", "partOfSpeech": "verb", "translation": "подтверждать, подкреплять", "examples": [], "register": [] },
        { "id": 6, "phrase": "bear up", "partOfSpeech": "verb", "translation": "1) поддерживать; 2) держаться стойко", "examples": [], "register": [] },
        { "id": 7, "phrase": "bear with", "partOfSpeech": "verb", "translation": "относиться терпеливо к чему-либо, мириться с чем-либо", "examples": [], "register": [] }
    ]
}

# 6. BEAT
BATCH2_ENTRIES['beat'] = {
    "word": "beat",
    "frequency_rank": 641,
    "cefr": "a2",
    "phon_br": "/biːt/",
    "phon_n_am": "/biːt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "такт; отбивание такта", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "ритм, размер", "examples": [
            { "en": "the measured beat of the waves", "ru": "размеренный плеск волн" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "удар; бой (барабана); биение (сердца)", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "дозор, обход; район (обхода полицейского)", "examples": [
            { "en": "to be on the beat", "ru": "совершать обход, патрулировать" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "биение, пульсация (волн)", "examples": [], "register": ["физика"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "газетная сенсация", "examples": [], "register": ["американизм", "жаргон"] },
        { "id": 7, "partOfSpeech": "verb", "translation": "бить, ударять, колотить", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "взбивать (яйца, тесто); отбивать (мясо); выколачивать (ковёр)", "examples": [
            { "en": "to beat eggs", "ru": "взбивать яйца" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "биться (о сердце); разбиваться (о волнах); хлестать (о дожде)", "examples": [
            { "en": "his heart was beating fast", "ru": "его сердце сильно билось" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "побивать, побеждать, наносить поражение", "examples": [
            { "en": "to beat the enemy", "ru": "разбить противника" },
            { "en": "we beat them 3-0", "ru": "мы выиграли у них со счётом 3:0" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "превосходить, затмевать", "examples": [
            { "en": "it beats everything I ever heard", "ru": "это превосходит всё, что я слышал" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "обманывать, обходить (закон, правила)", "examples": [], "register": ["американизм", "разговорное"] },
        { "id": 13, "partOfSpeech": "verb", "translation": "лавировать (против ветра)", "examples": [], "register": ["морской термин"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to beat about the bush", "partOfSpeech": "verb", "translation": "ходить вокруг да около, подходить к делу издалека", "examples": [], "register": [] },
        { "id": 2, "phrase": "to beat smb. hollow", "partOfSpeech": "verb", "translation": "разбить кого-либо наголову", "examples": [], "register": [] },
        { "id": 3, "phrase": "beat it!", "partOfSpeech": "interjection", "translation": "убирайся!, прочь!, вон!", "examples": [], "register": ["разговорное"] },
        { "id": 4, "phrase": "to beat the air (или the wind)", "partOfSpeech": "verb", "translation": "толочь воду в ступе, заниматься бесполезным делом", "examples": [], "register": [] },
        { "id": 5, "phrase": "that beats me", "partOfSpeech": "verb", "translation": "это выше моего понимания, не могу этого постичь", "examples": [], "register": [] },
        { "id": 6, "phrase": "can you beat it?", "partOfSpeech": "verb", "translation": "можете ли вы себе представить что-либо подобное?", "examples": [], "register": [] },
        { "id": 7, "phrase": "beat down", "partOfSpeech": "verb", "translation": "1) сбивать (цену); 2) сломить (сопротивление)", "examples": [], "register": [] },
        { "id": 8, "phrase": "beat up", "partOfSpeech": "verb", "translation": "1) избивать, зверски избить; 2) взбивать (яйца)", "examples": [], "register": [] }
    ]
}

# 7. BOX
BATCH2_ENTRIES['box'] = {
    "word": "box",
    "frequency_rank": 389,
    "cefr": "a1",
    "phon_br": "/bɒks/",
    "phon_n_am": "/bɑːks/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "ящик; коробка; шкатулка", "examples": [
            { "en": "money box", "ru": "копилка" },
            { "en": "post office box", "ru": "абонентский почтовый ящик" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "ложа (в театре)", "examples": [], "register": ["театр"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "будка (телефонная, сторожа)", "examples": [
            { "en": "telephone box", "ru": "телефонная будка" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "стойло (для лошади)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "место для свидетелей или подсудимого (в суде)", "examples": [
            { "en": "witness box", "ru": "место для дачи свидетельских показаний" }
        ], "register": ["юридическое"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "штрафная площадка", "examples": [], "register": ["спортивное"] },
        { "id": 7, "partOfSpeech": "noun", "translation": "тупик, затруднительное положение", "examples": [
            { "en": "in a tight box", "ru": "в трудном, безвыходном положении" }
        ], "register": ["разговорное"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "удар (пощёчина, затрещина)", "examples": [
            { "en": "a box on the ear", "ru": "пощёчина, затрещина" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "noun", "translation": "бокс", "examples": [], "register": ["спортивное"] },
        { "id": 10, "partOfSpeech": "noun", "translation": "самшит вечнозелёный", "examples": [], "register": ["ботаника"] },
        { "id": 11, "partOfSpeech": "verb", "translation": "укладывать в ящик или коробку (часто box up)", "examples": [], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "боксировать, драться на ринге", "examples": [], "register": ["спортивное"] },
        { "id": 13, "partOfSpeech": "verb", "translation": "бить кулаком, давать пощёчину", "examples": [
            { "en": "I boxed his ears", "ru": "я дал ему затрещину" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "box office", "partOfSpeech": "noun", "translation": "1) театральная касса, билетная касса; 2) кассовый сбор", "examples": [], "register": [] },
        { "id": 2, "phrase": "box in, box up", "partOfSpeech": "verb", "translation": "запереть, окружить, зажать со всех сторон", "examples": [], "register": [] }
    ]
}

# 8. CARE
BATCH2_ENTRIES['care'] = {
    "word": "care",
    "frequency_rank": 339,
    "cefr": "a2",
    "phon_br": "/keə(r)/",
    "phon_n_am": "/ker/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "забота; попечение, уход", "examples": [
            { "en": "under the care of", "ru": "под попечением, под присмотром" },
            { "en": "medical care", "ru": "медицинское обслуживание" },
            { "en": "take care of", "ru": "заботиться о, присматривать за" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "внимание, осторожность", "examples": [
            { "en": "handle with care", "ru": "обращаться осторожно, не кантовать!" },
            { "en": "have a care!, take care!", "ru": "берегись!, осторожно!" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "тревога, беспокойство (также pl: заботы, тяготы)", "examples": [
            { "en": "free from care", "ru": "беззаботный" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "заботиться (for, of, about — о)", "examples": [
            { "en": "the children are well cared for", "ru": "за детьми прекрасный уход" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "питать интерес, любить (for)", "examples": [
            { "en": "she really cares for him", "ru": "она действительно любит его" },
            { "en": "to care for music", "ru": "интересоваться музыкой" },
            { "en": "not to care for meat", "ru": "не любить мяса" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "беспокоиться, тревожиться", "examples": [
            { "en": "who cares?", "ru": "кого это волнует?, кому какое дело?" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "иметь желание (to)", "examples": [
            { "en": "I don't care to go", "ru": "мне не хочется идти" },
            { "en": "I don't care", "ru": "мне всё равно" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "c/o (читается care of)", "partOfSpeech": "preposition", "translation": "через; по адресу (для передачи)", "examples": [
            { "en": "Mr White c/o Mr Jones", "ru": "господину Джонсу для передачи господину Уайту" }
        ], "register": [] },
        { "id": 2, "phrase": "care killed the cat", "partOfSpeech": "noun", "translation": "≈ не работа старит, а забота; кручина иссушит лучину", "examples": [], "register": [] },
        { "id": 3, "phrase": "I don't care a straw (или a damn, a fig, a button)", "partOfSpeech": "verb", "translation": "мне совершенно безразлично, начхать, наплевать", "examples": [], "register": ["разговорное"] },
        { "id": 4, "phrase": "I don't care if I do", "partOfSpeech": "verb", "translation": "я не прочь; ничего не имею против", "examples": [], "register": ["разговорное"] }
    ]
}

# 9. CASE
BATCH2_ENTRIES['case'] = {
    "word": "case",
    "frequency_rank": 169,
    "cefr": "a2",
    "phon_br": "/keɪs/",
    "phon_n_am": "/keɪs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "случай; обстоятельство; положение; дело", "examples": [
            { "en": "as the case stands", "ru": "при данном положении дел" },
            { "en": "in case", "ru": "в случае, если" },
            { "en": "just in case", "ru": "на всякий случай" },
            { "en": "in any case", "ru": "во всяком случае" },
            { "en": "in that case", "ru": "в таком случае" },
            { "en": "it is not the case", "ru": "это не так" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "заболевание, случай заболевания; история болезни", "examples": [], "register": ["медицинское"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "больной, пациент", "examples": [], "register": ["медицинское"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "судебное дело; прецедент (pl: судебная практика)", "examples": [
            { "en": "the case for the defendant", "ru": "факты в пользу ответчика, подсудимого" }
        ], "register": ["юридическое"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "факты, доказательства, доводы", "examples": [
            { "en": "to state one's case", "ru": "изложить свои доводы" },
            { "en": "to make out one's case", "ru": "доказать свою правоту" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "падеж", "examples": [
            { "en": "the accusative case", "ru": "винительный падеж" }
        ], "register": ["грамматика"] },
        { "id": 7, "partOfSpeech": "noun", "translation": "чудак, странный тип", "examples": [], "register": ["разговорное"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "коробка, ящик; контейнер", "examples": [
            { "en": "cigarette case", "ru": "портсигар" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "noun", "translation": "сумка, чемодан, дипломат", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "noun", "translation": "футляр, чехол, корпус (часов)", "examples": [], "register": [] },
        { "id": 11, "partOfSpeech": "noun", "translation": "наборная касса", "examples": [
            { "en": "lower case", "ru": "строчные буквы, нижний регистр" },
            { "en": "upper case", "ru": "прописные буквы, верхний регистр" }
        ], "register": ["полиграфия"] },
        { "id": 12, "partOfSpeech": "verb", "translation": "упаковывать в ящик или коробку", "examples": [], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "вставлять в оправу, обшивать, покрывать", "examples": [
            { "en": "cased in armour", "ru": "одетый в броню" }
        ], "register": [] },
        { "id": 14, "partOfSpeech": "verb", "translation": "осматривать место будущего преступления, выслеживать", "examples": [
            { "en": "to case a joint", "ru": "произвести разведку (перед ограблением)" }
        ], "register": ["жаргон"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "in case of", "partOfSpeech": "preposition", "translation": "в случае чего-либо", "examples": [
            { "en": "in case of fire", "ru": "в случае пожара" }
        ], "register": [] },
        { "id": 2, "phrase": "to put the case that", "partOfSpeech": "verb", "translation": "предположим, что", "examples": [], "register": [] }
    ]
}

# 10. CAST
BATCH2_ENTRIES['cast'] = {
    "word": "cast",
    "frequency_rank": 1403,
    "cefr": "b2",
    "phon_br": "/kɑːst/",
    "phon_n_am": "/kæst/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "бросок; метание, забрасывание (сети, удочки)", "examples": [], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "форма для отливки", "examples": [], "register": ["техническое"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "гипсовый слепок, гипсовая повязка (также plaster cast)", "examples": [], "register": ["медицинское"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "распределение ролей; состав исполнителей (в спектакле, фильме)", "examples": [], "register": ["театр"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "склад (ума, характера), тип", "examples": [
            { "en": "a mind of philosophic cast", "ru": "философский склад ума" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "оттенок; выражение (лица)", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "косоглазие", "examples": [
            { "en": "cast in the eye", "ru": "лёгкое косоглазие" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "noun", "translation": "шанс, риск", "examples": [
            { "en": "the last cast", "ru": "последний шанс" },
            { "en": "to set on a cast", "ru": "поставить на карту, рискнуть" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "бросать, кидать, швырять; метать; отбрасывать", "examples": [
            { "en": "to cast anchor", "ru": "бросать якорь" },
            { "en": "to cast ashore", "ru": "выбрасывать на берег" },
            { "en": "to cast a glance", "ru": "бросить взгляд" },
            { "en": "to cast light (upon)", "ru": "проливать свет (на); вносить ясность (в)" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "сбрасывать (кожу); менять (рога); ронять (листья); линять (о животных)", "examples": [
            { "en": "to cast the coat", "ru": "линять (о животных)" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "отливать, лить (металлы)", "examples": [], "register": ["техническое"] },
        { "id": 12, "partOfSpeech": "verb", "translation": "распределять (роли)", "examples": [
            { "en": "to cast actors for parts", "ru": "назначать актёров на определённые роли" },
            { "en": "to cast parts to actors", "ru": "распределять роли между актёрами" }
        ], "register": ["театр"] },
        { "id": 13, "partOfSpeech": "verb", "translation": "вычислять, составлять", "examples": [
            { "en": "to cast a horoscope", "ru": "составлять гороскоп" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to cast a vote", "partOfSpeech": "verb", "translation": "подавать голос (на выборах)", "examples": [], "register": [] },
        { "id": 2, "phrase": "to cast the blame on smb.", "partOfSpeech": "verb", "translation": "взваливать вину на кого-либо", "examples": [], "register": [] },
        { "id": 3, "phrase": "to cast lots", "partOfSpeech": "verb", "translation": "бросить жребий", "examples": [], "register": [] },
        { "id": 4, "phrase": "to cast in one's lot with smb.", "partOfSpeech": "verb", "translation": "связать свою судьбу с кем-либо", "examples": [], "register": [] },
        { "id": 5, "phrase": "to cast a spell upon smb.", "partOfSpeech": "verb", "translation": "очаровать, околдовать кого-либо", "examples": [], "register": [] },
        { "id": 6, "phrase": "cast away", "partOfSpeech": "verb", "translation": "1) отбрасывать, отвергать; 2) терпеть крушение (to be cast away)", "examples": [], "register": [] },
        { "id": 7, "phrase": "cast down", "partOfSpeech": "verb", "translation": "1) повергать в уныние, угнетать; 2) опускать (глаза); 3) свергать", "examples": [], "register": [] },
        { "id": 8, "phrase": "cast off", "partOfSpeech": "verb", "translation": "1) бросать, покидать; 2) мор. отдавать швартовы, отваливать; 3) спускать (собаку)", "examples": [], "register": [] },
        { "id": 9, "phrase": "cast out", "partOfSpeech": "verb", "translation": "выгонять, изгонять", "examples": [], "register": [] }
    ]
}

# Update in dataset
for idx, it in enumerate(oxford_data):
    w = it['word']
    if w in BATCH2_ENTRIES:
        oxford_data[idx] = BATCH2_ENTRIES[w]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Successfully rebuilt all {len(BATCH2_ENTRIES)} entries of batch 2!")
