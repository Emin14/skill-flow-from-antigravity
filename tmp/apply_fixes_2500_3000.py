"""
Применение точных и проверенных исправлений для диапазона 2500-3000.
"""
import io, json, re

JSON_PATH = "oxford_5000_2026-08-27.json"

data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
word_index = {e['word']: i for i, e in enumerate(data)}

def get_entry(w):
    if w in word_index:
        return data[word_index[w]]
    return None

applied = []

# 1. Glued POS Transitions

# leg
e = get_entry('leg')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 21 not in mids:
        e['meanings'].append({
            'id': 21,
            'partOfSpeech': 'verb',
            'translation': 'бежать, топать, идти пешком',
            'examples': [{'en': 'to leg it', 'ru': 'идти пешком, улепётывать'}],
            'register': ['разговорное']
        })
    applied.append('leg (added verb mid 21)')

# like
e = get_entry('like')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 20 not in mids:
        e['meanings'].append({
            'id': 20,
            'partOfSpeech': 'noun',
            'translation': 'склонности, влечения, предпочтения',
            'examples': [{'en': 'likes and dislikes', 'ru': 'симпатии и антипатии'}],
            'register': []
        })
    applied.append('like (added noun mid 20)')

# mental
e = get_entry('mental')
if e:
    for m in e['meanings']:
        if m['id'] == 4:
            m['translation'] = 'помешанный'
    mids = [m['id'] for m in e['meanings']]
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'noun',
            'translation': 'ненормальный, псих',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('mental (separated adj mid 4 and noun mid 5)')

# must
e = get_entry('must')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'noun',
            'translation': 'настоятельная необходимость, абсолютное требование',
            'examples': [{'en': 'this book is a must', 'ru': 'эту книгу обязательно нужно прочесть'}],
            'register': []
        })
    applied.append('must (added noun mid 5)')

# neck
e = get_entry('neck')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 19 not in mids:
        e['meanings'].append({
            'id': 19,
            'partOfSpeech': 'verb',
            'translation': 'обниматься, целоваться',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('neck (added verb mid 19)')

# 2. Fix POS 'other' for nouns in words 2500-3000
nouns_to_fix = {
    'land': 'noun',
    'lead': 'noun',
    'leather': 'noun',
    'letter': 'noun',
    'liberty': 'noun',
    'light': 'noun',
    'line': 'noun',
    'mass': 'noun',
    'material': 'noun',
    'mathematics': 'noun',
    'may': 'noun',
    'means': 'noun',
    'memoir': 'noun',
    'memorial': 'noun',
    'mere': 'noun',
    'merit': 'noun',
    'metal': 'noun',
    'method': 'noun',
    'mineral': 'noun',
    'minute': 'noun',
    'modern': 'noun',
    'modification': 'noun',
    'money': 'noun',
    'moral': 'noun',
    'morality': 'noun',
    'motion': 'noun',
    'movie': 'noun',
    'necessity': 'noun',
    'need': 'noun',
    'news': 'noun',
    'nine': 'noun',
    'no': 'noun',
    'notion': 'noun',
    'novel': 'noun',
    'number': 'noun',
}

for w, proper_pos in nouns_to_fix.items():
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = proper_pos
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> {proper_pos})")

# Adjectives
for w in ['lesser']:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'adjective'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> adjective)")

# Pronouns
for w in ['me', 'mine1', 'mine2', 'my', 'no one']:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'pronoun'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> pronoun)")

# Conjunctions
for w in ['nevertheless', 'nor', 'now']:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'conjunction'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> conjunction)")

# Interjections
for w in ['mate', 'mum', 'nonsense']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'interjection'
                applied.append(f"{w} (fixed POS other -> interjection)")

# Verbs
for w in ['left', 'might']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'verb'
                applied.append(f"{w} (fixed POS other -> verb)")

# Numerals
for w in ['nineteen']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'numeral'
                applied.append(f"{w} (fixed POS other -> numeral)")

# Adverbs
for w in ['most']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'adverb'
                applied.append(f"{w} (fixed POS other -> adverb)")

# 3. Clean up OCR hyphenation artifacts with '≅' and '♦' in words 2500-3000
cleanups_2500 = [
    (re.compile(r'посл\.\s+и\s+несчастьям\s+бывает\s+конец\s*≅?'), 'посл. и несчастьям бывает конец'),
    (re.compile(r'говорить\s+на\s+одном\s*≅\s*языке'), 'говорить на одном языке'),
    (re.compile(r'ужин\s+из\s*≅\s*сандвичей\s+и\s+салатов,\s+сервируемый\s+не\s+за\s+общим\s+столом'), 'ужин из сандвичей и салатов, сервируемый не за общим столом'),
    (re.compile(r'биться\s*≅\s*об\s+заклад'), 'биться об заклад'),
    (re.compile(r'посл\.\s*≅\s*чем\s+меньше\s+разговоров,\s+тем\s+лучше\s+для\s+дела'), 'посл. чем меньше разговоров, тем лучше для дела'),
    (re.compile(r'всяк\s+кулик\s+своё\s+болото\s+хвалит\s*≅?'), 'всяк кулик своё болото хвалит'),
    (re.compile(r'посл\.\s*≅\s*по\s+одёжке\s+протягивай\s+ножки'), 'посл. по одёжке протягивай ножки'),
    (re.compile(r'легко\s+нажито,\s+легко\s+прожито\s*≅?'), 'посл. легко нажито, легко прожито'),
    (re.compile(r'замечательный\s+обед!\s+вот\s+это\s+обед\s+так\s*≅\s*обед!'), 'замечательный обед! вот это обед так обед!'),
    (re.compile(r'ябло-\s*≅\s*ко\s+от\s+яблони\s+недалеко\s+падает'), 'посл. яблоко от яблони недалеко падает'),
    (re.compile(r'золотая\s+середина\s*≅?'), 'золотая середина'),
    (re.compile(r'молочные\s+реки,\s+кисельные\s*≅\s*берега'), 'молочные реки, кисельные берега'),
    (re.compile(r'сколько\s+го-\s*≅\s*лов,\s+столько\s+умов'), 'посл. сколько голов, столько умов'),
    (re.compile(r'держи\s*≅\s*ухо\s+востро!'), 'держи ухо востро!'),
    (re.compile(r'чуть-\s*≅\s*чуть»\s+не\s+считается'), 'посл. «чуть-чуть» не считается'),
    (re.compile(r'после\s*≅\s*дождичка\s+в\s+четверг'), 'после дождичка в четверг'),
    (re.compile(r'делать\s+из\s+мухи\s*≅\s*слона'), 'делать из мухи слона'),
    (re.compile(r'посл\.\s+деньги\s+к\s+деньгам\s*≅?'), 'посл. деньги к деньгам'),
    (re.compile(r'деньги\s+на\s+бочку!\s*≅?\s*N?'), 'деньги на бочку!'),
    (re.compile(r'посл\.\s*≅\s*голь\s+на\s+выдумки\s+хитра'), 'посл. голь на выдумки хитра'),
    (re.compile(r'сама\s+захотела,\s+когда\s+нужда\s+по-\s*≅\s*велела'), 'сама захотела, когда нужда повелела'),
    (re.compile(r'всё\s+или\s*≅\s*ничего'), 'всё или ничего'),
    (re.compile(r'ничто\s+не\s*≅\s*ново\s+под\s+луной'), 'ничто не ново под луной'),
    (re.compile(r'утро\s+вечера\s+мудренее\s*≅?'), 'посл. утро вечера мудренее'),
    (re.compile(r'посл\.\s+худые\s*≅\s*вести\s+не\s+лежат\s+на\s+месте'), 'посл. худые вести не лежат на месте'),
    (re.compile(r'посл\.\s*≅\s*без\s+труда\s+нет\s+плода'), 'посл. без труда нет плода'),
    (re.compile(r'≅\s*не\s+все\s+дома,\s+винтика\s+не\s+хватает'), 'не все дома, винтика не хватает'),
    (re.compile(r'быть\s+у\s+всех\s+на\s+устах\s*≅?'), 'быть у всех на устах'),
    (re.compile(r'\(или\s*≅\s*to\s+tell\)\s+noses\s+подсчитывать'), 'подсчитывать'),
]

clean_cnt = 0
for entry in data[2500:3000]:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for pat, repl in cleanups_2500:
            if pat.search(tr):
                m['translation'] = pat.sub(repl, tr)
                clean_cnt += 1
                tr = m['translation']

applied.append(f"Cleaned {clean_cnt} glued OCR/idiom hyphenation artifacts in meanings")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes for words 2500-3000:")
for a in applied:
    print(f"  + {a}")
