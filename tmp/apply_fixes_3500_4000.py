"""
Применение точных и проверенных исправлений для диапазона 3500-4000.
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

# quote
e = get_entry('quote')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'назначать цену; давать расценку; котировать (at)'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'noun',
            'translation': 'цитата; назначенная цена',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('quote (separated verb mid 3 and noun mid 4)')

# refuge
e = get_entry('refuge')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = '«островок безопасности» (на улицах с большим движением)'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'verb',
            'translation': 'давать убежище; служить убежищем',
            'examples': [],
            'register': ['редкое']
        })
    applied.append('refuge (separated noun mid 3 and verb mid 4)')

# ring
e = get_entry('ring')
if e:
    for m in e['meanings']:
        if m['id'] == 21:
            m['translation'] = 'подбор колоколов (в церкви); благовест'
    mids = [m['id'] for m in e['meanings']]
    if 22 not in mids:
        e['meanings'].append({
            'id': 22,
            'partOfSpeech': 'verb',
            'translation': 'звонить, звенеть; оглашать звоном',
            'examples': [],
            'register': []
        })
    applied.append('ring (separated noun mid 21 and verb mid 22)')

# rose
e = get_entry('rose')
if e:
    for m in e['meanings']:
        if m['id'] == 11:
            m['translation'] = 'розовый'
            m['partOfSpeech'] = 'adjective'
    mids = [m['id'] for m in e['meanings']]
    if 12 not in mids:
        e['meanings'].append({
            'id': 12,
            'partOfSpeech': 'verb',
            'translation': 'делать розовым, придавать розовый оттенок',
            'examples': [],
            'register': []
        })
    applied.append('rose (separated adj mid 11 and verb mid 12)')

# route
e = get_entry('route')
if e:
    for m in e['meanings']:
        if m['id'] == 1:
            m['translation'] = 'маршрут, курс, путь, дорога'
    mids = [m['id'] for m in e['meanings']]
    if 2 not in mids:
        e['meanings'].append({
            'id': 2,
            'partOfSpeech': 'verb',
            'translation': 'направлять по определённому маршруту; устанавливать маршрут',
            'examples': [],
            'register': ['военное']
        })
    applied.append('route (separated noun mid 1 and verb mid 2)')

# sell
e = get_entry('sell')
if e:
    for m in e['meanings']:
        if m['id'] == 16:
            m['translation'] = 'изменить своему делу, совершить предательство'
    mids = [m['id'] for m in e['meanings']]
    if 17 not in mids:
        e['meanings'].append({
            'id': 17,
            'partOfSpeech': 'noun',
            'translation': 'умение показать товар лицом; надувательство, обман',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('sell (separated verb mid 16 and noun mid 17)')

# serve
e = get_entry('serve')
if e:
    for m in e['meanings']:
        if m['id'] == 24:
            m['translation'] = 'сыграть с кем-либо шутку'
    mids = [m['id'] for m in e['meanings']]
    if 25 not in mids:
        e['meanings'].append({
            'id': 25,
            'partOfSpeech': 'noun',
            'translation': 'подача (мяча в теннисе и т. п.)',
            'examples': [],
            'register': ['спорт']
        })
    applied.append('serve (separated verb mid 24 and noun mid 25)')

# 2. Fix POS 'other' for nouns in words 3500-4000
nouns_to_fix = {
    'quarter': 'noun',
    'quote': 'noun',
    'race': 'noun',
    'rain': 'noun',
    'rape': 'noun',
    'regard': 'noun',
    'regulation': 'noun',
    'relation': 'noun',
    'remains': 'noun',
    'respect': 'noun',
    'return': 'noun',
    'reveal': 'noun',
    'revenue': 'noun',
    'right': 'noun',
    'romantic': 'noun',
    'room': 'noun',
    'root': 'noun',
    'rose': 'noun',
    'rubber': 'noun',
    'sand': 'noun',
    'scale': 'noun',
    'school': 'noun',
    'score': 'noun',
    'screening': 'noun',
    'second': 'noun',
    'security': 'noun',
    'sense': 'noun',
    'separate': 'noun',
    'seven': 'noun',
    'share': 'noun',
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
for w in ['range', 'scary', 'shocking']:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'adjective'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> adjective)")

# Verbs
for w in ['repair']:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'verb'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> verb)")

# Numerals
for w in ['seventeen']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'numeral'
                applied.append(f"{w} (fixed POS other -> numeral)")

# Prepositions / saving
e = get_entry('saving')
if e:
    for m in e.get('meanings', []):
        if m.get('partOfSpeech') == 'other':
            if m['id'] == 7:
                m['partOfSpeech'] = 'noun'
            else:
                m['partOfSpeech'] = 'preposition'
    applied.append('saving (fixed POS other -> noun / preposition)')

# 3. Clean up OCR hyphenation artifacts with '≅' and '♦' in words 3500-4000
cleanups_3500 = [
    (re.compile(r'открыл\s+Америку!\s*\(ответ\s*≅?\s*на\s+запоздавшую\s+новость\)'), 'открыл Америку! (ответ на запоздавшую новость)'),
    (re.compile(r'посл\.\s+пришла\s+беда\s*—\s*отворяй\s+ворота\s*≅?'), 'посл. пришла беда — отворяй ворота'),
    (re.compile(r'лёгкий,\s+быстрый;\s+проворный;\s+не\s+лезть\s+за\s+словом\s+в\s+карман;\s+to\s+have\s*≅\s*a\s+ready\s+wit\s+б'), 'лёгкий, быстрый, находчивый (о6 ответе, уме)'),
    (re.compile(r'поздравляю\s+с\s+днём\s*≅\s*рождения,\s+желаю\s+вам\s+многих\s+лет\s+жизни'), 'поздравляю с днём рождения, желаю вам многих лет жизни'),
    (re.compile(r'отплатить\s+той\s+же\s+монетой\s*≅?'), 'отплатить той же монетой'),
    (re.compile(r'с\s+места\s*≅\s*в\s+карьер'), 'с места в карьер'),
    (re.compile(r'мера\s+длины\s*\(5\s*м\)\s*≅?'), 'мера длины (около 5 м)'),
    (re.compile(r'пожале-\s*≅\s*ешь\s+розгу,\s+испортишь\s+ребёнка'), 'посл. пожалеешь розгу, испортишь ребёнка'),
    (re.compile(r'место,\s+пространство;\s+яблоку\s+негде\s*≅\s*упасть'), 'место, пространство'),
    (re.compile(r'идти\s*≅\s*как\s+по\s+маслу'), 'идти как по маслу'),
    (re.compile(r'гроша\s+ломаного\s+не\s*≅\s*стоит'), 'гроша ломаного не стоит'),
    (re.compile(r'один\s+в\s+поле\s+не\s+воин\s*≅?'), 'посл. один в поле не воин'),
    (re.compile(r'не\s+сахарный,\s+не\s+растаю\s*≅?'), 'не сахарный, не растаю'),
    (re.compile(r'солёный;\s+одна\s+соль;\s*≅\s*salt\s+water\s+морская\s+вода'), 'солёный; одна соль'),
    (re.compile(r'ставить\s+палки\s+в\s*≅\s*колёса'), 'ставить палки в колёса'),
    (re.compile(r'услуга\s+за\s+услугу\s*≅?'), 'посл. услуга за услугу'),
    (re.compile(r'на\s+моих\s+устах\s+печать\s*≅\s*молчания'), 'на моих устах печать молчания'),
    (re.compile(r'секрет\s+полишинеля\s*≅?'), 'секрет полишинеля'),
    (re.compile(r'своя\s+рубашка\s+ближе\s+к\s+телу\s*≅?'), 'посл. своя рубашка ближе к телу'),
    (re.compile(r'этот\s+че-\s*≅\s*ловек\s+пороха\s+не\s+выдумает'), 'этот человек пороха не выдумает'),
]

clean_cnt = 0
for entry in data[3500:4000]:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for pat, repl in cleanups_3500:
            if pat.search(tr):
                m['translation'] = pat.sub(repl, tr)
                clean_cnt += 1
                tr = m['translation']
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in cleanups_3500:
                if pat.search(ru):
                    ex['ru'] = pat.sub(repl, ru)
                    clean_cnt += 1
                    ru = ex['ru']

applied.append(f"Cleaned {clean_cnt} glued OCR/idiom hyphenation artifacts in meanings and examples")

# 4. Clean refl. prefixes
for w in ['pull', 'put']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if re.match(r'^refl\.?\s*', m.get('translation', '')):
                m['translation'] = re.sub(r'^refl\.?\s*', '', m['translation'])
                applied.append(f"{w} (cleaned refl. prefix)")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes for words 3500-4000:")
for a in applied:
    print(f"  + {a}")
