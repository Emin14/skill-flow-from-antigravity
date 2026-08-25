import sys, re, json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

# Common legit hyphen prefixes / suffixes in Russian
LEGIT_HYPHEN_PATTERNS = [
    r'-(?:то|либо|нибудь|таки|ка|де|с|л\.|рука|нога)',
    r'(?:кто|что|где|когда|куда|откуда|почему|зачем|как|чей|какой|каком|какому|каким|каком|какая|какую|какой|какие|каких|каким|какими)-(?:то|либо|нибудь|л\.)',
    r'(?:кое|кой|по|во|из)-(?:[а-яА-Я]+)',
    r'(?:пресс|секс|веб|онлайн|офлайн|бизнес|топ|мини|макси|микро|макро|экс|вице|генерал|премьер|контр|штаб|лейтенант|майор|полковник|капитан|норд|вест|ост|зюйд|киловатт|человеко|жар|дизель|интернет|рок|поп|джаз)-(?:[а-яА-Я]+)',
    r'(?:[а-яА-Я]+)-(?:шоу|клуб|тест|контроль|ресурс|центр|холл|бар|кафе|парк|сервис|авто|тур|сити|банк|арт|матч|тайм|бокс|ринг|корт|трек|драйв|класс|лидер|мастер|спринт|чат|бот|сайт|блог|влог|стрим|пост|код|файл|сервер|драйвер|хост|порт|слот)',
    r'тире-многоточие',
    r'пресс-конференция',
    r'пресс-релиз',
    r'пресс-секретарь',
    r'пресс-служба',
    r'пресс-атташе',
    r'пресс-бюро',
    r'пресс-центр',
    r'секс-шоп',
    r'секс-символ',
    r'секс-бомба',
    r'светло-[а-яА-Я]+',
    r'тёмно-[а-яА-Я]+',
    r'ярко-[а-яА-Я]+',
    r'бледно-[а-яА-Я]+',
    r'кисло-[а-яА-Я]+',
    r'горько-[а-яА-Я]+',
    r'сладко-[а-яА-Я]+',
    r'северо-[а-яА-Я]+',
    r'юго-[а-яА-Я]+',
    r'восточно-[а-яА-Я]+',
    r'западно-[а-яА-Я]+',
    r'научно-[а-яА-Я]+',
    r'торгово-[а-яА-Я]+',
    r'социально-[а-яА-Я]+',
    r'общественно-[а-яА-Я]+',
    r'военно-[а-яА-Я]+',
    r'материально-[а-яА-Я]+',
    r'технико-[а-яА-Я]+',
    r'финансово-[а-яА-Я]+',
    r'экономико-[а-яА-Я]+'
]

def clean_russian_typography(text):
    if not text:
        return ''
    t = text
    # 1. Remove ligature character З inside words (e.g. "теоЗ рии" -> "теории", "древеЗ сине" -> "древесине")
    t = re.sub(r'([а-яА-Я])\s*З\s*([а-яА-Я])', r'\1\2', t)
    # Remove any remaining standalone З inside word contexts
    t = re.sub(r'([а-яА-Я])З\s*', r'\1', t)
    t = re.sub(r'\s*З([а-яА-Я])', r'\1', t)
    
    # 2. Fix space glued words: e.g. "хорошоготовить" -> "хорошо готовить", "вестидело" -> "вести дело", "веститорговые" -> "вести торговые", "себепалец" -> "себе палец", "емусиняк" -> "ему синяк", "перевестидух" -> "перевести дух", "рекастала" -> "река стала", "легковоспламеняется" -> "легко воспламеняется", "доскаопределённого" -> "доска определённого", "размера" -> "размера"
    glued_pairs = [
        ('хорошоготовить', 'хорошо готовить'),
        ('вестидело', 'вести дело'),
        ('веститорговые', 'вести торговые'),
        ('себепалец', 'себе палец'),
        ('емусиняк', 'ему синяк'),
        ('перевестидух', 'перевести дух'),
        ('рекастала', 'река стала'),
        ('доскаопределённого', 'доска определённого'),
        ('раз-мера', 'размера'),
        ('по-асть', 'попасть'),
        ('по-ало', 'попало'),
        ('по-асться', 'попасться'),
        ('легковоспламеняется', 'легко воспламеняется')
    ]
    for g1, g2 in glued_pairs:
        t = t.replace(g1, g2)
        
    # 3. Fix broken internal hyphens in Russian single words:
    # Pattern: [а-яА-Я]{2,}-[а-яА-Я]{2,}
    # If it's NOT a legit hyphen pattern, rejoin the syllables: e.g. "ло-вушка" -> "ловушка", "отвер-стие" -> "отверстие", "обраще-ние" -> "обращение", "бе-гать" -> "бегать", "надавлива-ние" -> "надавливание"
    def fix_hyphen_word(m):
        full_word = m.group(0)
        # Check if matches any legit pattern
        for pat in LEGIT_HYPHEN_PATTERNS:
            if re.search(pat, full_word, re.IGNORECASE):
                return full_word
        # Otherwise it's a broken syllable from PDF line break -> join
        return m.group(1) + m.group(2)
        
    t = re.sub(r'([а-яА-Я]{2,})-([а-яА-Я]{2,})', fix_hyphen_word, t)
    
    # 4. Clean double spaces
    t = re.sub(r'[ \t]+', ' ', t).strip()
    return t

fixed_words = 0
for w in words:
    for m in w.get('meanings', []):
        old_tr = m.get('translation', '')
        new_tr = clean_russian_typography(old_tr)
        if old_tr != new_tr:
            fixed_words += 1
            m['translation'] = new_tr
        for ex in m.get('examples', []):
            if ex.get('ru'):
                ex['ru'] = clean_russian_typography(ex['ru'])

print(f"Fixed {fixed_words} translations with Russian typographic polish.")

# Verify benchmark words
for test_w in ['catch', 'water', 'table', 'press', 'board', 'break', 'deal', 'fall', 'run', 'set']:
    e = next((w for w in words if w['word'].lower() == test_w), None)
    if e:
        print(f"\nWord: {test_w} ({len(e['meanings'])} meanings):")
        for m in e['meanings'][:4]:
            print(f"  #{m['id']} [{m['partOfSpeech']}] {m['translation']}")

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print("Saved clean, validated datasets.")
