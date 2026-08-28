"""
Скрипт точечных подтверждённых исправлений для первых 500 словарных статей
oxford_5000_2026-08-27.json на основе словаря Мюллера (2021).
"""
import io, json

JSON_PATH = "oxford_5000_2026-08-27.json"

data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
word_index = {e['word']: i for i, e in enumerate(data)}

applied = []

def get_entry(word):
    if word in word_index:
        return data[word_index[word]]
    return None

# 1. a
entry_a = get_entry('a')
if entry_a:
    # Set POS to 'article'
    for m in entry_a['meanings']:
        m['partOfSpeech'] = 'article'
    # Meaning 1
    entry_a['meanings'][0]['translation'] = 'неопределённый артикль'
    entry_a['meanings'][0]['examples'] = [
        {'en': 'a horse', 'ru': 'но an hour'},
        {'en': 'a European, a union', 'ru': 'но an umbrella; тж. a one'}
    ]
    # Meaning 2
    if len(entry_a['meanings']) > 1:
        entry_a['meanings'][1]['translation'] = 'вместо числ. один'
        entry_a['meanings'][1]['examples'] = [{'en': 'it costs a pound', 'ru': 'это стоит один фунт'}]
    # Meaning 3
    if len(entry_a['meanings']) > 2:
        entry_a['meanings'][2]['translation'] = 'употр. перед little, few; good (или great) many и перед счётными существительными'
        entry_a['meanings'][2]['examples'] = [
            {'en': 'a little water (time, happiness)', 'ru': 'немного воды (времени, счастья)'},
            {'en': 'a few days (books)', 'ru': 'несколько дней (книг)'},
            {'en': 'a good (or great) many days (books)', 'ru': 'очень много дней (книг)'}
        ]
    # Meaning 4
    if len(entry_a['meanings']) > 3:
        entry_a['meanings'][3]['translation'] = '(обыкн. после all of, many of) такой же, одинаковый'
        entry_a['meanings'][3]['examples'] = [{'en': 'all of a size', 'ru': 'все одной и той же величины'}]
    applied.append('a (fixed meanings 1-4 and POS article)')

# 2. abandon
entry_abandon = get_entry('abandon')
if entry_abandon:
    for m in entry_abandon['meanings']:
        if m['id'] == 4:
            m['translation'] = 'развязность, несдержанность'
            m['examples'] = [{'en': 'with abandon', 'ru': 'не сдерживаясь; самозабвенно'}]
            applied.append('abandon (mid 4: removed stuck самозабвенно into example)')

# 3. ability
entry_ability = get_entry('ability')
if entry_ability:
    # Check if meaning 5 exists
    mids = [m['id'] for m in entry_ability['meanings']]
    if 5 not in mids:
        entry_ability['meanings'].append({
            'id': 5,
            'partOfSpeech': 'noun',
            'translation': 'компетенция',
            'examples': [],
            'register': ['юриспруденция']
        })
        applied.append('ability (added missing mid 5: юр. компетенция)')

# 4. abortion
entry_abortion = get_entry('abortion')
if entry_abortion:
    mids = [m['id'] for m in entry_abortion['meanings']]
    if 3 not in mids:
        entry_abortion['meanings'].append({
            'id': 3,
            'partOfSpeech': 'noun',
            'translation': 'недоразвитие органа',
            'examples': [],
            'register': ['биология']
        })
        applied.append('abortion (added missing mid 3: биол. недоразвитие органа)')

# 5. absent
entry_absent = get_entry('absent')
if entry_absent:
    # meaning 2 is currently: "рассеянный 2. v refl. отлучиться; отсутствовать"
    for m in entry_absent['meanings']:
        if m['id'] == 2 and '2. v' in m.get('translation', ''):
            m['translation'] = 'рассеянный'
            m['examples'] = []
    mids = [m['id'] for m in entry_absent['meanings']]
    if 3 not in mids:
        entry_absent['meanings'].append({
            'id': 3,
            'partOfSpeech': 'verb',
            'translation': 'отлучиться; отсутствовать (refl.)',
            'examples': [{'en': 'to absent oneself from smth.', 'ru': 'уклоняться от чего-либо'}],
            'register': []
        })
        applied.append('absent (split glued verb meaning into mid 3)')

# 6. absolute
entry_abs = get_entry('absolute')
if entry_abs:
    for m in entry_abs['meanings']:
        if m['id'] == 1:
            m['translation'] = 'полный; безусловный, неограниченный'
            m['examples'] = [
                {'en': 'absolute discharge', 'ru': 'полное освобождение (от должности; подсудимого, заключённого)'},
                {'en': 'absolute majority', 'ru': 'абсолютное большинство'},
                {'en': 'absolute zero', 'ru': 'абсолютный ноль', 'register': ['физика']}
            ]
            m['register'] = []
            applied.append('absolute (fixed mid 1 translation and examples)')
        elif m['id'] == 4:
            m['translation'] = 'абсолютный'
            m['examples'] = [{'en': 'absolute construction', 'ru': 'абсолютная конструкция'}]
            m['register'] = ['грамматика']
            applied.append('absolute (fixed mid 4 translation)')

# 7. abstract
entry_abstr = get_entry('abstract')
if entry_abstr:
    for m in entry_abstr['meanings']:
        if m['id'] == 3:
            m['translation'] = 'абстракция, отвлечённое понятие'
            m['examples'] = [{'en': 'in the abstract', 'ru': 'отвлечённо, абстрактно; теоретически'}]
            applied.append('abstract (fixed mid 3 translation and example)')

# 8. abundance
entry_abund = get_entry('abundance')
if entry_abund:
    for m in entry_abund['meanings']:
        if m['id'] == 3:
            m['translation'] = 'распространённость'
            m['examples'] = [{'en': 'isotope abundance', 'ru': 'распространённость изотопа'}]
            m['register'] = ['физика']
            applied.append('abundance (fixed mid 3 translation and example)')

# 9. academic
entry_acad = get_entry('academic')
if entry_acad:
    for m in entry_acad['meanings']:
        if m['id'] == 4:
            m['partOfSpeech'] = 'noun'
            m['translation'] = 'чисто теоретические, академические аргументы и т. п.'
            applied.append('academic (fixed mid 4 POS other -> noun)')

# 10. academy
entry_academy = get_entry('academy')
if entry_academy:
    for m in entry_academy['meanings']:
        if m['id'] == 1:
            m['translation'] = 'специальное учебное заведение, школа'
            m['register'] = []
            applied.append('academy (fixed mid 1 removed fake register специальное)')

# 11. accent
entry_accent = get_entry('accent')
if entry_accent:
    for m in entry_accent['meanings']:
        if m['id'] == 5:
            m['examples'] = []
            m['register'] = ['поэтическое']
            applied.append('accent (fixed mid 5 removed fake example pl)')

# 12. accept
entry_accept = get_entry('accept')
if entry_accept:
    for m in entry_accept['meanings']:
        if m['id'] == 4:
            m['translation'] = 'акцептовать (вексель)'
            m['register'] = ['коммерческое']
            m['examples'] = []
    # Add phrase "to accept the fact"
    if 'phrases' not in entry_accept:
        entry_accept['phrases'] = []
    entry_accept['phrases'].append({
        'id': 1,
        'phrase': 'to accept the fact',
        'partOfSpeech': 'verb',
        'translation': 'примириться с фактом',
        'examples': [],
        'register': []
    })
    applied.append('accept (fixed mid 4 to "акцептовать (вексель)" and moved "to accept the fact" to phrases)')

# 13. acceptance
entry_accpt = get_entry('acceptance')
if entry_accpt:
    for m in entry_accpt['meanings']:
        if m['id'] == 4:
            m['translation'] = 'акцепт'
            m['register'] = ['коммерческое']
            m['examples'] = [
                {'en': 'general acceptance', 'ru': 'акцептование векселя без каких-либо оговорок'},
                {'en': 'qualified (or special) acceptance', 'ru': 'акцептование векселя с оговорками в отношении условий'}
            ]
        elif m['id'] == 5:
            m['translation'] = 'в роли определения к другому слову'
            m['register'] = []
            m['examples'] = [{'en': 'acceptance flight', 'ru': 'лётное приёмное испытание', 'register': ['авиация']}]
    applied.append('acceptance (fixed mid 4 and 5 translations and examples)')

# 14. access
entry_access = get_entry('access')
if entry_access:
    for m in entry_access['meanings']:
        if m['id'] == 4:
            m['translation'] = 'выборка (из памяти); доступ (к базе данных)'
            m['register'] = ['информатика']
    mids = [m['id'] for m in entry_access['meanings']]
    if 5 not in mids:
        entry_access['meanings'].append({
            'id': 5,
            'partOfSpeech': 'verb',
            'translation': 'обращаться (к базе данных)',
            'examples': [],
            'register': ['информатика']
        })
        applied.append('access (split mid 4 into noun and verb mid 5)')

# 15. accident
entry_accident = get_entry('accident')
if entry_accident:
    entry_accident['meanings'] = [
        {
            'id': 1,
            'partOfSpeech': 'noun',
            'translation': 'случай; случайность',
            'examples': [
                {'en': 'by accident', 'ru': 'случайно, нечаянно'},
                {'en': 'by a lucky accident', 'ru': 'по счастливой случайности'}
            ],
            'register': []
        },
        {
            'id': 2,
            'partOfSpeech': 'noun',
            'translation': 'несчастный случай; катастрофа; авария',
            'examples': [
                {'en': 'to meet with an accident', 'ru': 'потерпеть аварию, крушение'},
                {'en': 'fatal accident', 'ru': 'несчастный случай со смертельным исходом'},
                {'en': 'industrial accident', 'ru': 'несчастный случай на производстве'}
            ],
            'register': []
        },
        {
            'id': 3,
            'partOfSpeech': 'noun',
            'translation': 'неровность поверхности, складка',
            'examples': [],
            'register': ['астрономия', 'геология']
        },
        {
            'id': 4,
            'partOfSpeech': 'noun',
            'translation': 'случайное свойство',
            'examples': [],
            'register': ['логика']
        },
        {
            'id': 5,
            'partOfSpeech': 'noun',
            'translation': 'в роли определения к другому слову',
            'examples': [
                {'en': 'accident insurance', 'ru': 'страхование от несчастных случаев'},
                {'en': 'accident prevention', 'ru': 'предупреждение несчастных случаев; техника безопасности'},
                {'en': 'accident rate', 'ru': 'коэффициент промышленного травматизма', 'register': ['американский английский']}
            ],
            'register': []
        }
    ]
    if 'phrases' not in entry_accident:
        entry_accident['phrases'] = []
    entry_accident['phrases'].append({
        'id': 1,
        'phrase': 'accidents will happen (in the best regulated families)',
        'partOfSpeech': 'other',
        'translation': 'в семье не без урода; скандал в благородном семействе',
        'examples': [],
        'register': ['пословица']
    })
    applied.append('accident (completely restored meanings 1-5 and moved proverb to phrases)')

# 16. Fix POS 'other' for single-POS words in first 500
pos_other_fixes = {
    'ah': 'interjection',
    'albeit': 'conjunction',
    'alive': 'adjective',
    'afraid': 'adjective',
    'against': 'preposition',
    'agenda': 'noun',
    'agent': 'noun',
    'aid': 'noun',
    'air': 'noun',
    'accomplishment': 'noun',
    'acre': 'noun',
    'affair': 'noun',
    'blanket': 'noun',
}

for w, proper_pos in pos_other_fixes.items():
    e = get_entry(w)
    if e:
        count = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = proper_pos
                count += 1
        if count > 0:
            applied.append(f"{w} (fixed {count} meanings POS 'other' -> '{proper_pos}')")

# Blanket specific POS fixes (1-4 noun, 5-6 adjective)
entry_blanket = get_entry('blanket')
if entry_blanket:
    for m in entry_blanket.get('meanings', []):
        if m['id'] in [1, 2, 3, 4]:
            m['partOfSpeech'] = 'noun'
        elif m['id'] in [5, 6]:
            m['partOfSpeech'] = 'adjective'
    applied.append('blanket (fixed POS 1-4 noun, 5-6 adjective)')

# Blind specific POS fixes (1-8 adjective)
entry_blind = get_entry('blind')
if entry_blind:
    for m in entry_blind.get('meanings', []):
        if m['id'] in range(1, 9):
            m['partOfSpeech'] = 'adjective'
        if m['id'] == 1:
            if m.get('translation') == 'епой':
                m['translation'] = 'слепой'
            for ex in m.get('examples', []):
                if ex.get('ru', '').startswith('епой'):
                    ex['ru'] = ex['ru'].replace('епой', 'слепой')
    applied.append('blind (fixed POS 1-8 adjective, fixed OCR епой -> слепой)')

# Save updated JSON
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} high-precision fixes:")
for a in applied:
    print(f"  - {a}")
