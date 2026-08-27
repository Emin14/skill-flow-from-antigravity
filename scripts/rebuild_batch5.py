# -*- coding: utf-8 -*-
"""
Rebuild batch 5 with 100% academic precision:
drop, end, escape, excuse, face, fear, feel, fight, figure, fill.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

BATCH5_ENTRIES = {}

# 1. DROP
BATCH5_ENTRIES['drop'] = {
    "word": "drop",
    "frequency_rank": 386,
    "cefr": "a1",
    "phon_br": "/drɒp/",
    "phon_n_am": "/drɑːp/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "капля", "examples": [
            { "en": "a drop in the ocean, a drop in the bucket", "ru": "капля в море" },
            { "en": "drop by drop", "ru": "капля за каплей" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "глоток (спиртного)", "examples": [
            { "en": "to have a drop too much", "ru": "хлебнуть лишнего" }
        ], "register": ["разговорное"] },
        { "id": 3, "partOfSpeech": "noun", "translation": "падение, понижение, спад (температуры, цен)", "examples": [
            { "en": "a drop in prices", "ru": "падение цен" },
            { "en": "a sudden drop in temperature", "ru": "резкое понижение температуры" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "крутой спуск, обрыв, уступ", "examples": [], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "леденец, карамелька (обыкн. pl)", "examples": [
            { "en": "lemon drops", "ru": "лимонные леденцы" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "щель (для писем, монет)", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "капать, падать каплями", "examples": [
            { "en": "rain was dropping from the trees", "ru": "с деревьев капал дождь" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "ронять, выпускать из рук", "examples": [
            { "en": "I dropped my keys", "ru": "я уронил ключи" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "падать, опускаться; валиться с ног", "examples": [
            { "en": "he dropped to his knees", "ru": "он упал на колени" },
            { "en": "to drop asleep", "ru": "заснуть" },
            { "en": "ready to drop", "ru": "валиться с ног от усталости" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "понижаться, спадать (о ценах, температуре, ветре)", "examples": [
            { "en": "the wind has dropped", "ru": "ветер стих" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "бросать, прекращать, отказываться от (темы, спора)", "examples": [
            { "en": "let's drop the subject", "ru": "давайте оставим эту тему" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "высаживать (пассажира), подвозить", "examples": [
            { "en": "can you drop me at the station?", "ru": "можете высадить меня у вокзала?" }
        ], "register": [] },
        { "id": 13, "partOfSpeech": "verb", "translation": "написать пару строк, черкнуть (строчку)", "examples": [
            { "en": "drop me a line", "ru": "черкни мне пару строк" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "at the drop of a hat", "partOfSpeech": "adverb", "translation": "без колебаний, по первому знаку, немедленно", "examples": [], "register": [] },
        { "id": 2, "phrase": "to drop a hint", "partOfSpeech": "verb", "translation": "намекнуть, сделать тонкий намёк", "examples": [], "register": [] },
        { "id": 3, "phrase": "drop in, drop by", "partOfSpeech": "verb", "translation": "заглянуть, зайти без предупреждения", "examples": [], "register": [] },
        { "id": 4, "phrase": "drop off", "partOfSpeech": "verb", "translation": "1) задремать, заснуть; 2) высадить пассажира; 3) снижаться, уменьшаться", "examples": [], "register": [] },
        { "id": 5, "phrase": "drop out", "partOfSpeech": "verb", "translation": "выбывать, бросать учёбу или участие в чём-либо", "examples": [], "register": [] }
    ]
}

# 2. END
BATCH5_ENTRIES['end'] = {
    "word": "end",
    "frequency_rank": 164,
    "cefr": "a1",
    "phon_br": "/end/",
    "phon_n_am": "/end/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "конец, окончание, завершение", "examples": [
            { "en": "at the end of the year", "ru": "в конце года" },
            { "en": "in the end", "ru": "в конце концов, в итоге" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "конец, край, кончик (предмета)", "examples": [
            { "en": "at the end of the street", "ru": "в конце улицы" },
            { "en": "both ends of the rope", "ru": "оба конца верёвки" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "цель, намерение", "examples": [
            { "en": "to achieve one's ends", "ru": "добиться своих целей" },
            { "en": "to this end", "ru": "с этой целью" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "смерть, гибель, кончина", "examples": [
            { "en": "to meet one's end", "ru": "встретить свою смерть" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "остаток, обрезок, окурок", "examples": [
            { "en": "cigarette end", "ru": "окурок" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "сторона (в соглашении, деле)", "examples": [
            { "en": "on our end", "ru": "с нашей стороны" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "кончать(ся), заканчивать(ся), завершать(ся)", "examples": [
            { "en": "to end a meeting", "ru": "завершить собрание" },
            { "en": "the story ends happily", "ru": "история заканчивается счастливо" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "положить конец (war, life)", "examples": [
            { "en": "to end one's life", "ru": "покончить с собой" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to make ends meet", "partOfSpeech": "verb", "translation": "сводить концы с концами", "examples": [], "register": [] },
        { "id": 2, "phrase": "the end justifies the means", "partOfSpeech": "noun", "translation": "цель оправдывает средства", "examples": [], "register": [] },
        { "id": 3, "phrase": "to no end", "partOfSpeech": "adverb", "translation": "безрезультатно, напрасно", "examples": [], "register": [] },
        { "id": 4, "phrase": "on end", "partOfSpeech": "adverb", "translation": "1) непрерывно, подряд; 2) дыбом (о волосах)", "examples": [
            { "en": "for hours on end", "ru": "часами напролёт" }
        ], "register": [] },
        { "id": 5, "phrase": "end up", "partOfSpeech": "verb", "translation": "оказаться в итоге, закончить (кем-либо, где-либо)", "examples": [], "register": [] }
    ]
}

# 3. ESCAPE
BATCH5_ENTRIES['escape'] = {
    "word": "escape",
    "frequency_rank": 827,
    "cefr": "b1",
    "phon_br": "/ɪˈskeɪp/",
    "phon_n_am": "/ɪˈskeɪp/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "побег, бегство; избавление", "examples": [
            { "en": "an escape from prison", "ru": "побег из тюрьмы" },
            { "en": "a narrow escape", "ru": "чудесное спасение, быть на волосок от гибели" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "утечка (газа, воды)", "examples": [
            { "en": "an escape of gas", "ru": "утечка газа" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "уход от действительности, разрядка", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "в роли определения: спасательный, аварийный", "examples": [
            { "en": "fire escape", "ru": "пожарная лестница" },
            { "en": "escape hatch", "ru": "аварийный люк" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "бежать, совершать побег (из тюрьмы, плена)", "examples": [
            { "en": "to escape from prison", "ru": "бежать из тюрьмы" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "избежать (опасности, наказания), спастись", "examples": [
            { "en": "to escape punishment", "ru": "избежать наказания" },
            { "en": "to escape unhurt", "ru": "отделаться без травм, выйти невредимым" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "ускользать (из памяти, от внимания)", "examples": [
            { "en": "his name escaped me", "ru": "его имя вылетело у меня из головы" },
            { "en": "nothing escapes you", "ru": "ничто не ускользает от вашего внимания" }
        ], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "вырываться (о стоне, вздохе)", "examples": [], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to have a narrow escape", "partOfSpeech": "verb", "translation": "едва избежать опасности, быть на волосок от гибели", "examples": [], "register": [] }
    ]
}

# 4. EXCUSE
BATCH5_ENTRIES['excuse'] = {
    "word": "excuse",
    "frequency_rank": 1056,
    "cefr": "b1",
    "phon_br": "/ɪkˈskjuːs/",
    "phon_n_am": "/ɪkˈskjuːs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "извинение; оправдание", "examples": [
            { "en": "to make an excuse", "ru": "извиняться, приносить извинения" },
            { "en": "in excuse of", "ru": "в оправдание" },
            { "en": "a lame excuse", "ru": "неубедительное извинение, слабая отговорка" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "предлог, отговорка", "examples": [
            { "en": "it was only an excuse", "ru": "это был только предлог" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "освобождение (от работы, занятий; записка об освобождении)", "examples": [], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "извинять, прощать", "examples": [
            { "en": "excuse me!", "ru": "извините (меня)!" },
            { "en": "please excuse my delay", "ru": "пожалуйста, извините моё опоздание" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "служить оправданием", "examples": [
            { "en": "nothing can excuse his conduct", "ru": "ничто не может служить оправданием его поведению" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "освобождать (от обязанности, присутствия; from — от)", "examples": [
            { "en": "to excuse smb. from attendance", "ru": "освободить кого-либо от присутствия" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "excuse me", "partOfSpeech": "interjection", "translation": "простите, извините (при обращении, возражении)", "examples": [], "register": [] }
    ]
}

# 5. FACE
BATCH5_ENTRIES['face'] = {
    "word": "face",
    "frequency_rank": 141,
    "cefr": "a1",
    "phon_br": "/feɪs/",
    "phon_n_am": "/feɪs/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "лицо", "examples": [
            { "en": "face to face", "ru": "лицом к лицу, с глазу на глаз" },
            { "en": "to one's face", "ru": "прямо в лицо, в глаза" },
            { "en": "a straight face", "ru": "невозмутимый, бесстрастный вид" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "выражение лица", "examples": [
            { "en": "a sad face", "ru": "печальный вид" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "гримаса", "examples": [
            { "en": "to make faces, to pull faces", "ru": "корчить рожи, гримасничать" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "наглость, дерзость", "examples": [
            { "en": "to have the face to say smth.", "ru": "иметь наглость сказать что-либо" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "внешний вид; видимость", "examples": [
            { "en": "on the face of it", "ru": "судя по внешнему виду, на первый взгляд" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "noun", "translation": "лицевая сторона (монеты, ткани); циферблат (часов)", "examples": [], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "грань (геометрия); фасад (архитектура); торец (техника)", "examples": [], "register": ["геометрия", "архитектура", "техническое"] },
        { "id": 8, "partOfSpeech": "noun", "translation": "забой, плоскость забоя", "examples": [], "register": ["горное дело"] },
        { "id": 9, "partOfSpeech": "verb", "translation": "стоять лицом к, быть обращённым (к чему-либо)", "examples": [
            { "en": "the windows face the sea", "ru": "окна выходят на море" }
        ], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "смотреть в лицо без страха, встречать смело", "examples": [
            { "en": "to face danger", "ru": "смело встретить опасность" },
            { "en": "to face the facts", "ru": "смотреть правде в глаза" }
        ], "register": [] },
        { "id": 11, "partOfSpeech": "verb", "translation": "сталкиваться (с трудностями, необходимостью)", "examples": [
            { "en": "to face a difficult task", "ru": "стоять перед сложной задачей" }
        ], "register": [] },
        { "id": 12, "partOfSpeech": "verb", "translation": "облицовывать (камнем), покрывать поверхность", "examples": [], "register": ["строительное"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to save face", "partOfSpeech": "verb", "translation": "спасти репутацию, избежать позора", "examples": [], "register": [] },
        { "id": 2, "phrase": "to lose face", "partOfSpeech": "verb", "translation": "потерять авторитет, ударить в грязь лицом", "examples": [], "register": [] },
        { "id": 3, "phrase": "to face the music", "partOfSpeech": "verb", "translation": "мужественно встречать критику, держать ответ", "examples": [], "register": [] },
        { "id": 4, "phrase": "face up to", "partOfSpeech": "verb", "translation": "быть готовым встретить (трудности), признавать реальность", "examples": [], "register": [] }
    ]
}

# 6. FEAR
BATCH5_ENTRIES['fear'] = {
    "word": "fear",
    "frequency_rank": 643,
    "cefr": "a2",
    "phon_br": "/fɪə(r)/",
    "phon_n_am": "/fɪr/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "страх, боязнь", "examples": [
            { "en": "for fear of", "ru": "из боязни чего-либо" },
            { "en": "in fear of one's life", "ru": "в страхе за свою жизнь" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "опасение; вероятность неприятности", "examples": [
            { "en": "no fear!", "ru": "как бы не так!, ни в коем случае!" }
        ], "register": ["разговорное"] },
        { "id": 3, "partOfSpeech": "verb", "translation": "бояться, страшиться, испытывать страх", "examples": [
            { "en": "never fear!", "ru": "не бойся!, будь спокоен!" },
            { "en": "to fear God", "ru": "бояться Бога" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "опасаться, предполагать с тревогой", "examples": [
            { "en": "I fear that it is true", "ru": "боюсь, что это правда" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "without fear or favour", "partOfSpeech": "adverb", "translation": "беспристрастно, невзирая на лица", "examples": [], "register": [] }
    ]
}

# 7. FEEL
BATCH5_ENTRIES['feel'] = {
    "word": "feel",
    "frequency_rank": 104,
    "cefr": "a1",
    "phon_br": "/fiːl/",
    "phon_n_am": "/fiːl/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "ощущение, осязание", "examples": [
            { "en": "cold to the feel", "ru": "холодный на ощупь" },
            { "en": "by feel", "ru": "на ощупь" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "чутьё, интуиция, вкус к чему-либо", "examples": [
            { "en": "a feel for language", "ru": "языковое чутьё" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "verb", "translation": "чувствовать, ощущать (past: felt, p. p.: felt)", "examples": [
            { "en": "to feel cold", "ru": "чувствовать холод" },
            { "en": "to feel pain", "ru": "испытывать боль" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "чувствовать себя (о здоровье, настроении)", "examples": [
            { "en": "how do you feel?", "ru": "как вы себя чувствуете?" },
            { "en": "I feel good", "ru": "я чувствую себя отлично" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "ощупывать, трогать, прикасаться", "examples": [
            { "en": "to feel the pulse", "ru": "щупать пульс" }
        ], "register": [] },
        { "id": 6, "partOfSpeech": "verb", "translation": "считать, полагать, быть убеждённым", "examples": [
            { "en": "I feel that you are right", "ru": "я считаю, что вы правы" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "быть на ощупь (каким-либо)", "examples": [
            { "en": "the cloth feels soft", "ru": "ткань мягкая на ощупь" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to feel like (doing smth.)", "partOfSpeech": "verb", "translation": "хотеть, иметь желание сделать что-либо", "examples": [
            { "en": "I feel like a cup of tea", "ru": "я бы с удовольствием выпил чаю" }
        ], "register": [] },
        { "id": 2, "phrase": "to feel one's feet, to feel one's legs", "partOfSpeech": "verb", "translation": "почувствовать почву под ногами, обрести уверенность в себе", "examples": [], "register": [] },
        { "id": 3, "phrase": "to feel in one's bones", "partOfSpeech": "verb", "translation": "чувствовать всеми фибрами души, нутром чуять", "examples": [], "register": [] },
        { "id": 4, "phrase": "feel out", "partOfSpeech": "verb", "translation": "зондировать почву, разведывать, выведывать", "examples": [], "register": [] },
        { "id": 5, "phrase": "feel up to", "partOfSpeech": "verb", "translation": "чувствовать себя в силах, быть способным (сделать что-либо)", "examples": [], "register": [] }
    ]
}

# 8. FIGHT
BATCH5_ENTRIES['fight'] = {
    "word": "fight",
    "frequency_rank": 523,
    "cefr": "a2",
    "phon_br": "/faɪt/",
    "phon_n_am": "/faɪt/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "бой, сражение", "examples": [
            { "en": "a fierce fight", "ru": "ожесточённый бой" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "драка", "examples": [
            { "en": "a street fight", "ru": "уличная драка" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "борьба, спор; боевой задор", "examples": [
            { "en": "the fight for freedom", "ru": "борьба за свободу" },
            { "en": "to have plenty of fight in one", "ru": "быть полным боевого задора, не сдаваться" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "драться, сражаться, воевать (against — против, for — за, with — с; past: fought, p. p.: fought)", "examples": [
            { "en": "to fight for peace", "ru": "бороться за мир" },
            { "en": "to fight a battle", "ru": "дать сражение" },
            { "en": "to fight a duel", "ru": "драться на дуэли" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "отстаивать, защищать (в суде, споре)", "examples": [
            { "en": "to fight a case", "ru": "отстаивать дело в суде" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "to fight for one's life", "partOfSpeech": "verb", "translation": "сражаться не на жизнь, а на смерть", "examples": [], "register": [] },
        { "id": 2, "phrase": "to fight a losing battle", "partOfSpeech": "verb", "translation": "вести заведомо проигранную борьбу", "examples": [], "register": [] },
        { "id": 3, "phrase": "to fight shy of", "partOfSpeech": "verb", "translation": "избегать, сторониться кого-либо, чего-либо", "examples": [], "register": [] },
        { "id": 4, "phrase": "fight back", "partOfSpeech": "verb", "translation": "1) давать отпор, сопротивляться; 2) сдерживать (слёзы, гнев)", "examples": [], "register": [] },
        { "id": 5, "phrase": "fight off", "partOfSpeech": "verb", "translation": "отбивать (нападение); справляться (с болезнью)", "examples": [], "register": [] }
    ]
}

# 9. FIGURE
BATCH5_ENTRIES['figure'] = {
    "word": "figure",
    "frequency_rank": 353,
    "cefr": "a2",
    "phon_br": "/ˈfɪɡə(r)/",
    "phon_n_am": "/ˈfɪɡjər/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "цифра; число; при англ. мн. ч.: цифровые данные", "examples": [
            { "en": "in round figures", "ru": "круглым счётом" },
            { "en": "sales figures", "ru": "данные по продажам" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "фигура, телосложение", "examples": [
            { "en": "to keep one's figure", "ru": "следить за фигурой" }
        ], "register": [] },
        { "id": 3, "partOfSpeech": "noun", "translation": "личность, деятель, фигура", "examples": [
            { "en": "public figure", "ru": "общественный деятель" },
            { "en": "a leading figure", "ru": "ведущая фигура" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "noun", "translation": "рисунок, чертёж, диаграмма, иллюстрация", "examples": [
            { "en": "see Figure 1", "ru": "см. рис. 1" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "noun", "translation": "геометрическая фигура", "examples": [], "register": ["геометрия"] },
        { "id": 6, "partOfSpeech": "noun", "translation": "цена, сумма", "examples": [
            { "en": "at a high figure", "ru": "по высокой цене" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "noun", "translation": "фигура (в танце, фигурном катании, пилотаже)", "examples": [], "register": [] },
        { "id": 8, "partOfSpeech": "verb", "translation": "фигурировать, играть видную роль", "examples": [
            { "en": "his name figures on the list", "ru": "его имя фигурирует в списке" }
        ], "register": [] },
        { "id": 9, "partOfSpeech": "verb", "translation": "подсчитывать, вычислять", "examples": [], "register": [] },
        { "id": 10, "partOfSpeech": "verb", "translation": "считать, полагать", "examples": [
            { "en": "I figured you would come", "ru": "я полагал, что ты придёшь" }
        ], "register": ["американский английский"] }
    ],
    "phrases": [
        { "id": 1, "phrase": "figure of speech", "partOfSpeech": "noun", "translation": "образное выражение, фигура речи", "examples": [], "register": [] },
        { "id": 2, "phrase": "to cut a figure", "partOfSpeech": "verb", "translation": "производить впечатление, выделяться", "examples": [], "register": [] },
        { "id": 3, "phrase": "figure out", "partOfSpeech": "verb", "translation": "1) понимать, постигать; 2) вычислять, решать", "examples": [], "register": [] },
        { "id": 4, "phrase": "figure on", "partOfSpeech": "verb", "translation": "рассчитывать на что-либо", "examples": [], "register": ["американский английский"] }
    ]
}

# 10. FILL
BATCH5_ENTRIES['fill'] = {
    "word": "fill",
    "frequency_rank": 526,
    "cefr": "a1",
    "phon_br": "/fɪl/",
    "phon_n_am": "/fɪl/",
    "lists": { "oxford3000": True, "oxford5000": True },
    "meanings": [
        { "id": 1, "partOfSpeech": "noun", "translation": "полная мера, достаточное количество; сытость", "examples": [
            { "en": "to eat one's fill", "ru": "наесться досыта" },
            { "en": "I have had my fill of it", "ru": "с меня довольно, с меня хватит" }
        ], "register": [] },
        { "id": 2, "partOfSpeech": "noun", "translation": "насыпь", "examples": [], "register": ["американский английский", "железнодорожное"] },
        { "id": 3, "partOfSpeech": "verb", "translation": "наполнять(ся), заполнять(ся)", "examples": [
            { "en": "to fill a glass with water", "ru": "наполнить стакан водой" },
            { "en": "the room filled with smoke", "ru": "комната наполнилась дымом" }
        ], "register": [] },
        { "id": 4, "partOfSpeech": "verb", "translation": "занимать (должность, пост); замещать (вакансию)", "examples": [
            { "en": "to fill a vacancy", "ru": "заполнить вакансию" },
            { "en": "to fill the post", "ru": "занимать должность" }
        ], "register": [] },
        { "id": 5, "partOfSpeech": "verb", "translation": "пломбировать (зуб)", "examples": [
            { "en": "to fill a tooth", "ru": "запломбировать зуб" }
        ], "register": ["медицинское"] },
        { "id": 6, "partOfSpeech": "verb", "translation": "выполнять, исполнять (заказ)", "examples": [
            { "en": "to fill an order", "ru": "выполнить заказ" }
        ], "register": [] },
        { "id": 7, "partOfSpeech": "verb", "translation": "насыщать, давать чувство сытости", "examples": [
            { "en": "food that fills", "ru": "сытная пища" }
        ], "register": [] }
    ],
    "phrases": [
        { "id": 1, "phrase": "fill in", "partOfSpeech": "verb", "translation": "1) заполнять (бланк, форму); 2) замещать (коллегу); 3) вводить в курс дела (smb.)", "examples": [], "register": [] },
        { "id": 2, "phrase": "fill out", "partOfSpeech": "verb", "translation": "1) заполнять (анкету); 2) полнеть, округляться (о лице, фигуре)", "examples": [], "register": [] },
        { "id": 3, "phrase": "fill up", "partOfSpeech": "verb", "translation": "1) заполнять доверху; 2) заправлять бак бензином", "examples": [], "register": [] }
    ]
}

# Update in dataset
for idx, it in enumerate(oxford_data):
    w = it['word']
    if w in BATCH5_ENTRIES:
        oxford_data[idx] = BATCH5_ENTRIES[w]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Successfully rebuilt all {len(BATCH5_ENTRIES)} entries of batch 5!")
