# -*- coding: utf-8 -*-
"""
Rebuild batch 6 with 100% academic precision:
film, finish, fire, fish, fit, fix, fly, fold, force, form.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

BATCH6_ENTRIES = {}

# 1. FILM
BATCH6_ENTRIES['film'] = {
    "word": "film",
    "frequency_rank": 314,
    "cefr": "a1",
    "phon_br": "/fɪlm/",
    "phon_n_am": "/fɪlm/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "фильм, кинофильм; кинокартина", "examples": [
            { "en": "feature film", "ru": "художественный фильм" },
            { "en": "documentary film", "ru": "документальный фильм" }
        ], "register": ["кинематография"] },
        { "id": 2, "partOfSpeech": "noun", "translation": "плёнка (фото-, киноплёнка)", "examples": [
            { "en": "a roll of film", "ru": "рулон фотоплёнки" }
        ], "register": ["фотография"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "плёнка, тонкий слой, налёт", "examples": [
            { "en": "a thin film of oil", "ru": "тонкая масляная плёнка" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "пелена (на глазах)", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "в роли определения: плёночный; кино-", "examples": [
            { "en": "film star", "ru": "кинозвезда" },
            { "en": "film studio", "ru": "киностудия" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "снимать фильм, экранизировать", "examples": [
            { "en": "to film a novel", "ru": "экранизировать роман" },
            { "en": "the movie was filmed in Paris", "ru": "фильм снимался в Париже" }
        ], "register": ["кинематография"] },
        { "id": 7, "partOfSpeech": "verb", "translation": "покрывать(ся) плёнкой, пеленой (часто film over)", "examples": [
            { "en": "her eyes filmed with tears", "ru": "её глаза подёрнулись слезами" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "film over", "partOfSpeech": "verb", "translation": "затягиваться плёнкой, подёргиваться пеленой", "examples": [], "register": [] }
    ]
}

# 2. FINISH
BATCH6_ENTRIES['finish'] = {
    "word": "finish",
    "frequency_rank": 583,
    "cefr": "a1",
    "phon_br": "/ˈfɪnɪʃ/",
    "phon_n_am": "/ˈfɪnɪʃ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "конец, окончание, завершение", "examples": [
            { "en": "fight to the finish", "ru": "борьба до победного конца" },
            { "en": "from start to finish", "ru": "от начала до конца" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "финиш, финишная черта", "examples": [
            { "en": "a close finish", "ru": "упорная борьба на финише" }
        ], "register": ["спортивное"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "отделка, полировка, окончательная обработка", "examples": [], "register": ["техническое"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "лоск, отточенность, изящество", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "кончать, заканчивать, завершать", "examples": [
            { "en": "to finish work", "ru": "закончить работу" },
            { "en": "to finish school", "ru": "окончить школу" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "доедать, допивать (часто finish up)", "examples": [
            { "en": "finish your soup", "ru": "доедай суп" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "добивать, губить, доконать", "examples": [
            { "en": "this illness nearly finished him", "ru": "эта болезнь чуть не свела его в могилу" }
        ], "register": ["разговорное"] },
        { "id": 8, "partOfSpeech": "verb", "translation": "отделывать, полировать, начисто обрабатывать", "examples": [], "register": ["техническое"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "finish off", "partOfSpeech": "verb", "translation": "1) покончить с кем-либо, чем-либо; 2) доделать до конца", "examples": [], "register": [] },
        { "id": 2, "phrase": "finish up", "partOfSpeech": "verb", "translation": "1) доесть, допить; 2) оказаться в итоге (где-либо)", "examples": [], "register": [] }
    ]
}

# 3. FIRE
BATCH6_ENTRIES['fire'] = {
    "word": "fire",
    "frequency_rank": 338,
    "cefr": "a1",
    "phon_br": "/ˈfaɪə(r)/",
    "phon_n_am": "/ˈfaɪər/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "огонь, пламя", "examples": [
            { "en": "to make a fire", "ru": "разжечь огонь, костёр" },
            { "en": "to catch fire", "ru": "загореться, воспламениться" },
            { "en": "on fire", "ru": "в огне, горящий" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "пожар", "examples": [
            { "en": "forest fire", "ru": "лесной пожар" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "стрельба, огонь", "examples": [
            { "en": "open fire", "ru": "открыть огонь" },
            { "en": "under fire", "ru": "под огнём, под обстрелом" },
            { "en": "cross fire", "ru": "перекрёстный огонь" }
        ], "register": ["военное"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "пыл, жар, вдохновение, страсть", "examples": [
            { "en": "eyes full of fire", "ru": "горящие огнём глаза" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "стрелять, производить выстрел (at, into — в)", "examples": [
            { "en": "to fire a gun", "ru": "выстрелить из ружья" },
            { "en": "to fire at the target", "ru": "стрелять по мишени" }
        ], "register": ["военное"] },
        { "id": 6, "partOfSpeech": "verb", "translation": "увольнять, выгонять с работы", "examples": [
            { "en": "he was fired", "ru": "его уволили" }
        ], "register": ["разговорное"] },
        { "id": 7, "partOfSpeech": "verb", "translation": "зажигать, поджигать; загораться", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "зажигать, вдохновлять, воодушевлять", "examples": [
            { "en": "to fire smb.'s imagination", "ru": "разжечь чьё-либо воображение" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "обжигать (кирпич, керамику)", "examples": [], "register": ["техническое"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to play with fire", "partOfSpeech": "verb", "translation": "играть с огнём", "examples": [], "register": [] },
        { "id": 2, "phrase": "out of the frying pan into the fire", "partOfSpeech": "noun", "translation": "≈ из огня да в полымя", "examples": [], "register": [] },
        { "id": 3, "phrase": "to set on fire", "partOfSpeech": "verb", "translation": "поджечь", "examples": [], "register": [] },
        { "id": 4, "phrase": "fire away!", "partOfSpeech": "interjection", "translation": "давай!, выкладывай!, начинай!", "examples": [], "register": ["разговорное"] }
    ]
}

# 4. FISH
BATCH6_ENTRIES['fish'] = {
    "word": "fish",
    "frequency_rank": 547,
    "cefr": "a1",
    "phon_br": "/fɪʃ/",
    "phon_n_am": "/fɪʃ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "рыба (pl без измен. fish, редко fishes)", "examples": [
            { "en": "fresh fish", "ru": "свежая рыба" },
            { "en": "to catch fish", "ru": "ловить рыбу" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "рыбные блюда; рыбное", "examples": [], "register": ["кулинария"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "человек, субъект, тип", "examples": [
            { "en": "an odd fish, a queer fish", "ru": "чудак, странный тип" },
            { "en": "a cool fish", "ru": "нахал, наглец" }
        ], "register": ["разговорное"] },
        { "id": 4, "partOfSpeech": "noun", "translation": "(the Fishes) Рыбы (созвездие и знак зодиака)", "examples": [], "register": ["астрономия"] },
        { "id": 5, "partOfSpeech": "verb", "translation": "ловить рыбу, удить", "examples": [
            { "en": "to go fishing", "ru": "идти на рыбалку" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "выуживать, вытаскивать (из кармана, воды: out)", "examples": [
            { "en": "he fished a coin out of his pocket", "ru": "он выудил монету из кармана" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "выведывать, напрашиваться (for)", "examples": [
            { "en": "to fish for compliments", "ru": "напрашиваться на комплименты" },
            { "en": "to fish for information", "ru": "выведывать сведения" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "a fish out of water", "partOfSpeech": "noun", "translation": "рыба, вынутая из воды; не в своей тарелке", "examples": [], "register": [] },
        { "id": 2, "phrase": "to drink like a fish", "partOfSpeech": "verb", "translation": "пить как сапожник, сильно пьянствовать", "examples": [], "register": [] },
        { "id": 3, "phrase": "other fish to fry", "partOfSpeech": "noun", "translation": "дела поважнее, другие заботы", "examples": [], "register": [] },
        { "id": 4, "phrase": "fish out", "partOfSpeech": "verb", "translation": "выуживать, доставать наружу", "examples": [], "register": [] }
    ]
}

# 5. FIT
BATCH6_ENTRIES['fit'] = {
    "word": "fit",
    "frequency_rank": 586,
    "cefr": "a2",
    "phon_br": "/fɪt/",
    "phon_n_am": "/fɪt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "adjective", "translation": "подходящий, годный, пригодный (for, to)", "examples": [
            { "en": "fit for use", "ru": "пригодный к употреблению" },
            { "en": "fit to drink", "ru": "годный для питья" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "adjective", "translation": "в хорошей физической форме, здоровый, бодрый", "examples": [
            { "en": "to keep fit", "ru": "поддерживать форму" },
            { "en": "to feel fit", "ru": "чувствовать себя бодрым и здоровым" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "припадок, приступ", "examples": [
            { "en": "a fit of coughing", "ru": "приступ кашля" },
            { "en": "a fit of anger", "ru": "вспышка гнева" },
            { "en": "a fit of laughter", "ru": "приступ смеха" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "посадка (одежды), припасовка", "examples": [
            { "en": "a good fit", "ru": "костюм сидит как влитой" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "быть впору, подходить по размеру, сидеть (об одежде)", "examples": [
            { "en": "the coat fits well", "ru": "пальто сидит хорошо" },
            { "en": "the key doesn't fit the lock", "ru": "ключ не подходит к замку" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "прилаживать, подгонять, приспосабливать", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "устанавливать, монтировать; оснащать", "examples": [
            { "en": "to fit a new lock", "ru": "врезать новый замок" }
        ], "register": ["техническое"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "as fit as a fiddle", "partOfSpeech": "adjective", "translation": "в полном здравии, как огурчик", "examples": [], "register": [] },
        { "id": 2, "phrase": "by fits and starts", "partOfSpeech": "adverb", "translation": "урывками, неравномерно, рывками", "examples": [], "register": [] },
        { "id": 3, "phrase": "to fit like a glove", "partOfSpeech": "verb", "translation": "сидеть как влитой", "examples": [], "register": [] },
        { "id": 4, "phrase": "fit in", "partOfSpeech": "verb", "translation": "1) приспосабливаться, вписываться; 2) находить время для кого-либо", "examples": [], "register": [] },
        { "id": 5, "phrase": "fit out, fit up", "partOfSpeech": "verb", "translation": "экипировать, оснащать, оборудовать", "examples": [], "register": [] }
    ]
}

# 6. FIX
BATCH6_ENTRIES['fix'] = {
    "word": "fix",
    "frequency_rank": 673,
    "cefr": "a2",
    "phon_br": "/fɪks/",
    "phon_n_am": "/fɪks/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "затруднительное положение, дилемма", "examples": [
            { "en": "to get into a fix", "ru": "попасть в переплёт, в трудное положение" },
            { "en": "in a terrible fix", "ru": "в безвыходном положении" }
        ], "register": ["разговорное"] },
        { "id": 2, "partOfSpeech": "noun", "translation": "определение местоположения", "examples": [
            { "en": "to take a fix", "ru": "определить координаты" }
        ], "register": ["навигация"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "доза (наркотика)", "examples": [], "register": ["жаргон"] },
        { "id": 4, "partOfSpeech": "verb", "translation": "укреплять, закреплять, устанавливать", "examples": [
            { "en": "to fix a shelf to the wall", "ru": "прикрепить полку к стене" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "чинить, ремонтировать, исправлять", "examples": [
            { "en": "to fix a broken lock", "ru": "починить сломанный замок" },
            { "en": "to fix a car", "ru": "отремонтировать машину" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "назначать, устанавливать (срок, цену, дату)", "examples": [
            { "en": "to fix a date", "ru": "назначить дату" },
            { "en": "to fix a price", "ru": "установить цену" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "устремлять, останавливать (взгляд, внимание; on, upon — на)", "examples": [
            { "en": "to fix one's eyes on smth.", "ru": "уставиться, не сводить глаз с чего-либо" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "готовить (еду, напитки); приводить в порядок (причёску)", "examples": [
            { "en": "to fix breakfast", "ru": "приготовить завтрак" },
            { "en": "to fix one's hair", "ru": "поправить причёску" }
        ], "register": ["американский английский"] },
        { "id": 9, "partOfSpeech": "verb", "translation": "закреплять, фиксировать (изображение)", "examples": [], "register": ["фотография"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "fix up", "partOfSpeech": "verb", "translation": "1) уладить, организовать; 2) устроить, пристроить (smb.); 3) отремонтировать", "examples": [], "register": ["разговорное"] },
        { "id": 2, "phrase": "fix on, fix upon", "partOfSpeech": "verb", "translation": "остановиться на (выборе), выбрать", "examples": [], "register": [] }
    ]
}

# 7. FLY
BATCH6_ENTRIES['fly'] = {
    "word": "fly",
    "frequency_rank": 387,
    "cefr": "a1",
    "phon_br": "/flaɪ/",
    "phon_n_am": "/flaɪ/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "муха", "examples": [], "register": ["зоология"] },
        { "id": 2, "partOfSpeech": "noun", "translation": "ширинка (у брюк)", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "полёт; дистанция полёта", "examples": [
            { "en": "on the fly", "ru": "на лету, на ходу" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "летать, пролетать (past: flew, p. p.: flown)", "examples": [
            { "en": "birds fly", "ru": "птицы летают" },
            { "en": "to fly to London", "ru": "лететь в Лондон" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "пилотировать (самолёт), управлять самолётом", "examples": [
            { "en": "to fly a plane", "ru": "пилотировать самолёт" }
        ], "register": ["авиация"] },
        { "id": 6, "partOfSpeech": "verb", "translation": "развеваться (о флаге); вывешивать (флаг)", "examples": [
            { "en": "flags are flying", "ru": "развеваются флаги" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "мчаться, нестись, лететь стрелой", "examples": [
            { "en": "time flies", "ru": "время летит" },
            { "en": "the children flew to meet mother", "ru": "дети бросились навстречу матери" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "разлетаться на куски, разбиваться", "examples": [
            { "en": "the glass flew into pieces", "ru": "стекло разбилось вдребезги" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "a fly in the ointment", "partOfSpeech": "noun", "translation": "≈ ложка дёгтя в бочке мёда", "examples": [], "register": [] },
        { "id": 2, "phrase": "to fly off the handle", "partOfSpeech": "verb", "translation": "выйти из себя, вспылить, сорваться", "examples": [], "register": ["разговорное"] },
        { "id": 3, "phrase": "to fly in the face of", "partOfSpeech": "verb", "translation": "бросать вызов, открыто противоречить", "examples": [], "register": [] },
        { "id": 4, "phrase": "fly at", "partOfSpeech": "verb", "translation": "набрасываться на кого-либо (с кулаками, бранью)", "examples": [], "register": [] }
    ]
}

# 8. FOLD
BATCH6_ENTRIES['fold'] = {
    "word": "fold",
    "frequency_rank": 1419,
    "cefr": "b1",
    "phon_br": "/fəʊld/",
    "phon_n_am": "/foʊld/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "складка, сгиб", "examples": [
            { "en": "a dress hanging in loose folds", "ru": "платье, спадающее свободными складками" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "загон (для овец), овчарня; кошара", "examples": [], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "паства", "examples": [], "register": ["церковное"] },
        { "id": 4, "partOfSpeech": "verb", "translation": "складывать, сгибать, перегибать (вдвое, вчетверо)", "examples": [
            { "en": "to fold a letter", "ru": "сложить письмо" },
            { "en": "to fold one's arms", "ru": "скрестить руки на груди" },
            { "en": "to fold one's hands", "ru": "сложить руки; перен. сидеть сложа руки" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "заворачивать, укутывать (in)", "examples": [
            { "en": "hills folded in mist", "ru": "горы, окутанные туманом" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "прижимать к груди, обнимать", "examples": [
            { "en": "to fold smb. to one's breast", "ru": "прижать кого-либо к груди" }
        ], "register": ["поэтическое"] },
        { "id": 7, "partOfSpeech": "verb", "translation": "загонять овец в овчарню", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to return to the fold", "partOfSpeech": "verb", "translation": "1) вернуться в отчий дом; 2) вернуться в лоно единомышленников", "examples": [], "register": [] },
        { "id": 2, "phrase": "fold up", "partOfSpeech": "verb", "translation": "1) свернуть, сложить; 2) прогореть, обанкротиться (о компании)", "examples": [], "register": ["разговорное"] }
    ]
}

# 9. FORCE
BATCH6_ENTRIES['force'] = {
    "word": "force",
    "frequency_rank": 331,
    "cefr": "b1",
    "phon_br": "/fɔːs/",
    "phon_n_am": "/fɔːrs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "сила, мощь", "examples": [
            { "en": "by force", "ru": "силой, насильно" },
            { "en": "by force of habit", "ru": "в силу привычки" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "насилие, принуждение", "examples": [
            { "en": "brute force", "ru": "грубая сила, насилие" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "полиция (the force)", "examples": [
            { "en": "to join the police force", "ru": "поступить на службу в полицию" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "при англ. мн. ч.: вооружённые силы, войска", "examples": [
            { "en": "armed forces", "ru": "вооружённые силы" },
            { "en": "air force", "ru": "военно-воздушные силы" }
        ], "register": ["военное"] },
        { "id": 5, "partOfSpeech": "noun", "translation": "юридическая сила, действие (закона)", "examples": [
            { "en": "to come into force", "ru": "вступать в силу" },
            { "en": "in force", "ru": "в силе, действующий" }
        ], "register": ["юридическое"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "сила (тяжести, притяжения)", "examples": [
            { "en": "force of gravity", "ru": "сила тяжести" }
        ], "register": ["физика"] },
        { "id": 7, "partOfSpeech": "verb", "translation": "заставлять, принуждать, вынуждать", "examples": [
            { "en": "to force a confession", "ru": "вынудить признание" },
            { "en": "to force a smile", "ru": "выдавить улыбку" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "брать силой, взламывать, форсировать", "examples": [
            { "en": "to force a lock", "ru": "взломать замок" },
            { "en": "to force a river", "ru": "форсировать реку" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "прокладывать силой (way, path)", "examples": [
            { "en": "to force one's way through", "ru": "пробивать себе путь" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to force smb.'s hand", "partOfSpeech": "verb", "translation": "вынудить кого-либо действовать немедленно", "examples": [], "register": [] },
        { "id": 2, "phrase": "to force down smb.'s throat", "partOfSpeech": "verb", "translation": "навязывать силой", "examples": [], "register": [] }
    ]
}

# 10. FORM
BATCH6_ENTRIES['form'] = {
    "word": "form",
    "frequency_rank": 149,
    "cefr": "a1",
    "phon_br": "/fɔːm/",
    "phon_n_am": "/fɔːrm/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "форма, внешний вид, очертание", "examples": [
            { "en": "in the form of", "ru": "в форме чего-либо" },
            { "en": "to take the form of", "ru": "принять форму" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "бланк, анкета; образец", "examples": [
            { "en": "application form", "ru": "бланк заявления, анкета" },
            { "en": "to fill in a form", "ru": "заполнить бланк" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "вид, разновидность", "examples": [
            { "en": "a form of transport", "ru": "вид транспорта" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "класс (в школе)", "examples": [
            { "en": "sixth form", "ru": "шестой (выпускной) класс" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "спортивная форма, состояние", "examples": [
            { "en": "in good form", "ru": "в хорошей форме, в ударе" },
            { "en": "out of form", "ru": "не в форме" }
        ], "register": ["спортивное"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "правила приличия, этикет", "examples": [
            { "en": "good form", "ru": "хороший тон, приличие" },
            { "en": "bad form", "ru": "дурной тон, неприличие" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "грамматическая форма", "examples": [], "register": ["грамматика"] },
        { "id": 8, "partOfSpeech": "verb", "translation": "образовывать(ся), формировать(ся), строиться", "examples": [
            { "en": "to form a queue", "ru": "встать в очередь" },
            { "en": "to form a government", "ru": "сформировать правительство" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "придавать форму, лепить, создавать", "examples": [
            { "en": "to form a vessel out of clay", "ru": "вылепить сосуд из глины" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "составлять, образовывать собой", "examples": [
            { "en": "parts form a whole", "ru": "части образуют целое" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "вырабатывать, воспитывать (характер, привычку)", "examples": [
            { "en": "to form a habit", "ru": "выработать привычку" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "in due form", "partOfSpeech": "adverb", "translation": "в должной форме, по всей форме", "examples": [], "register": [] }
    ]
}

# Update in dataset
for idx, it in enumerate(oxford_data):
    w = it['word']
    if w in BATCH6_ENTRIES:
        oxford_data[idx] = BATCH6_ENTRIES[w]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Successfully rebuilt all {len(BATCH6_ENTRIES)} entries of batch 6!")
