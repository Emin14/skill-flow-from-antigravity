"""
Применение точных и проверенных исправлений для диапазона 3000-3500.
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

# OK
e = get_entry('OK')
if e:
    for m in e['meanings']:
        if m['id'] == 1:
            m['translation'] = 'одобрение'
            m['partOfSpeech'] = 'noun'
    mids = [m['id'] for m in e['meanings']]
    if 2 not in mids:
        e['meanings'].append({
            'id': 2,
            'partOfSpeech': 'adjective',
            'translation': 'всё в порядке; хорошо; правильно',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('OK (separated noun mid 1 and adj mid 2)')

# perfect
e = get_entry('perfect')
if e:
    for m in e['meanings']:
        if m['id'] == 5:
            m['translation'] = 'настоящий, истинный'
    mids = [m['id'] for m in e['meanings']]
    if 6 not in mids:
        e['meanings'].append({
            'id': 6,
            'partOfSpeech': 'noun',
            'translation': 'перфект',
            'examples': [],
            'register': ['грамматика']
        })
    applied.append('perfect (separated adj mid 5 and noun mid 6)')

# port
e = get_entry('port')
if e:
    for m in e['meanings']:
        if m['id'] == 6:
            m['translation'] = 'осанка, манера держаться'
    mids = [m['id'] for m in e['meanings']]
    if 7 not in mids:
        e['meanings'].append({
            'id': 7,
            'partOfSpeech': 'verb',
            'translation': 'держать (оружие) в строевой стойке',
            'examples': [{'en': 'port arms!', 'ru': 'на руку-оружие!'}],
            'register': ['военное']
        })
    applied.append('port (separated noun mid 6 and verb mid 7)')

# practice
e = get_entry('practice')
if e:
    for m in e['meanings']:
        if m['id'] == 11:
            m['translation'] = 'посл. навык мастера ставит'
    mids = [m['id'] for m in e['meanings']]
    if 12 not in mids:
        e['meanings'].append({
            'id': 12,
            'partOfSpeech': 'verb',
            'translation': 'упражняться; практиковать (= practise)',
            'examples': [],
            'register': []
        })
    applied.append('practice (added verb mid 12)')

# pride
e = get_entry('pride')
if e:
    for m in e['meanings']:
        if m['id'] == 12:
            m['translation'] = 'проглотить обиду'
    mids = [m['id'] for m in e['meanings']]
    if 13 not in mids:
        e['meanings'].append({
            'id': 13,
            'partOfSpeech': 'verb',
            'translation': 'гордиться (on, upon — кем-либо, чем-либо)',
            'examples': [{'en': 'he prides himself on his skill', 'ru': 'он гордится своим мастерством'}],
            'register': []
        })
    applied.append('pride (added verb mid 13)')

# profound
e = get_entry('profound')
if e:
    for m in e['meanings']:
        if m['id'] == 4:
            m['translation'] = 'глубокий, низкий (поклон и т. п.)'
    mids = [m['id'] for m in e['meanings']]
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'noun',
            'translation': 'глубина, бездна',
            'examples': [],
            'register': ['поэтическое']
        })
    applied.append('profound (separated adj mid 4 and noun mid 5)')

# 2. Fix POS 'other' for nouns in words 3000-3500
nouns_to_fix = {
    'nut': 'noun',
    'odds': 'noun',
    'office': 'noun',
    'officer': 'noun',
    'orange': 'noun',
    'outline': 'noun',
    'outside': 'noun',
    'overall': 'noun',
    'pain': 'noun',
    'paint': 'noun',
    'pair': 'noun',
    'pants': 'noun',
    'paper': 'noun',
    'part': 'noun',
    'particular': 'noun',
    'passage': 'noun',
    'period': 'noun',
    'phrase': 'noun',
    'physics': 'noun',
    'piano': 'noun',
    'pile': 'noun',
    'pill': 'noun',
    'pipe': 'noun',
    'point': 'noun',
    'politics': 'noun',
    'pop': 'noun',
    'port': 'noun',
    'possession': 'noun',
    'potato': 'noun',
    'preliminary': 'noun',
    'premise': 'noun',
    'pretty': 'noun',
    'printing': 'noun',
    'prize': 'noun',
    'proceeding': 'noun',
    'proceeds': 'noun',
    'proportion': 'noun',
    'province': 'noun',
    'provision': 'noun',
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
for w in ['online']:
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
for w in ['our', 'ours']:
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
for w in ['or']:
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
for w in ['off', 'oh', 'OK']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'interjection'
                applied.append(f"{w} (fixed POS other -> interjection)")

# Verbs
for w in ['plain']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'verb'
                applied.append(f"{w} (fixed POS other -> verb)")

# 3. Clean up OCR hyphenation artifacts with '≅' and '♦' in words 3000-3500
cleanups_3000 = [
    (re.compile(r'время\s+от\s+времени\s*♦\s*the\s+odd\s+man\s+решающий\s+голос'), 'время от времени'),
    (re.compile(r'свет\s+горит,\s+включён\s*♦\s*on\s+and\s+off.*'), 'свет горит, включён'),
    (re.compile(r'при\s+царе\s+Горохе\s*≅?'), 'при царе Горохе'),
    (re.compile(r'посл\.\s+мелочный\s+человек\s+никогда\s+не\s*≅\s*достигнет\s+успеха'), 'посл. мелочный человек никогда не достигнет успеха'),
    (re.compile(r'посл\.\s+назвался\s+груздём\s*—\s*≅\s*полезай\s+в\s+кузов'), 'посл. назвался груздём — полезай в кузов'),
    (re.compile(r'поку-\s*≅\s*пать\s+кота\s+в\s+мешке'), 'покупать кота в мешке'),
    (re.compile(r'бывает,\s+что\s+коровы\s+летают\s*≅?'), 'бывает, что коровы летают'),
    (re.compile(r'слышно\s+было,\s*≅\s*как\s+муха\s+пролетит'), 'слышно было, как муха пролетит'),
    (re.compile(r'намотайте\s*≅\s*э?\s*себе\s+на\s+ус'), 'намотайте себе на ус'),
    (re.compile(r'в\s+гостях\s*≅\s*хорошо,\s+а\s+дома\s+лучше'), 'посл. в гостях хорошо, а дома лучше'),
    (re.compile(r'всё\s+пойдёт\s+как\s+по\s+маслу\s*≅?'), 'всё пойдёт как по маслу'),
    (re.compile(r'преподнести\s+что-либо\s+в\s+готовом\s+виде,\s+на\s+блю-\s*≅\s*дечке'), 'преподнести что-либо в готовом виде, на блюдечке'),
    (re.compile(r'пункт,\s*≅\s*момент,\s+вопрос;\s+дело'), 'пункт, момент, вопрос; дело'),
    (re.compile(r'в\s+беде\s+любой\s+выход\s+хорош\s*≅?'), 'в беде любой выход хорош'),
    (re.compile(r'не\s+смейся,\s+горох,\s*≅\s*не\s+лучше\s+бобов'), 'посл. не смейся, горох, не лучше бобов'),
    (re.compile(r'посл\.\s*≅\s*навык\s+мастера\s+ставит'), 'посл. навык мастера ставит'),
    (re.compile(r'допиться\s+до\s*≅\s*чёртиков'), 'допиться до чёртиков'),
]

clean_cnt = 0
for entry in data[3000:3500]:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for pat, repl in cleanups_3000:
            if pat.search(tr):
                m['translation'] = pat.sub(repl, tr)
                clean_cnt += 1
                tr = m['translation']

applied.append(f"Cleaned {clean_cnt} glued OCR/idiom hyphenation artifacts in meanings")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes for words 3000-3500:")
for a in applied:
    print(f"  + {a}")
