"""
Применение точных и проверенных исправлений для диапазона 1500-2000.
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

# essay
e = get_entry('essay')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'проба, опыт'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'verb',
            'translation': 'пытаться; подвергать испытанию',
            'examples': [{'en': 'to essay a hard task', 'ru': 'брать на себя неблагодарный труд'}],
            'register': ['книжное']
        })
    applied.append('essay (separated noun mid 3 and verb mid 4)')

# exit
e = get_entry('exit')
if e:
    for m in e['meanings']:
        if m['id'] == 4:
            m['translation'] = 'в роли определения к другому слову'
            m['examples'] = [{'en': 'exit visa', 'ru': 'выездная виза'}]
    mids = [m['id'] for m in e['meanings']]
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'verb',
            'translation': '«уходит» (ремарка в театре)',
            'examples': [],
            'register': ['театр']
        })
    applied.append('exit (separated noun mid 4 and verb mid 5)')

# external
e = get_entry('external')
if e:
    for m in e['meanings']:
        if m['id'] == 5:
            m['translation'] = 'сдающий экзамены экстерном (о студенте)'
    mids = [m['id'] for m in e['meanings']]
    if 6 not in mids:
        e['meanings'].append({
            'id': 6,
            'partOfSpeech': 'noun',
            'translation': 'внешние проявления, внешность; наружность',
            'examples': [],
            'register': []
        })
    applied.append('external (separated adj mid 5 and noun mid 6)')

# fare
e = get_entry('fare')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'пища, стол, провизия, съестные припасы'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'verb',
            'translation': 'быть, поживать; случаться',
            'examples': [{'en': 'how fares it?', 'ru': 'как дела?'}],
            'register': ['книжное']
        })
    applied.append('fare (separated noun mid 3 and verb mid 4)')

# feat
e = get_entry('feat')
if e:
    for m in e['meanings']:
        if m['id'] == 2:
            m['translation'] = 'проявление большой ловкости, искусства'
    mids = [m['id'] for m in e['meanings']]
    if 3 not in mids:
        e['meanings'].append({
            'id': 3,
            'partOfSpeech': 'adjective',
            'translation': 'ловкий, искусный',
            'examples': [],
            'register': ['устаревшее']
        })
    applied.append('feat (separated noun mid 2 and adj mid 3)')

# fifteen
e = get_entry('fifteen')
if e:
    for m in e['meanings']:
        if m['id'] == 1:
            m['partOfSpeech'] = 'numeral'
            m['translation'] = 'пятнадцать'
    mids = [m['id'] for m in e['meanings']]
    if 2 not in mids:
        e['meanings'].append({
            'id': 2,
            'partOfSpeech': 'noun',
            'translation': 'команда игроков в регби (из 15 человек)',
            'examples': [],
            'register': ['спорт']
        })
    applied.append('fifteen (separated numeral mid 1 and noun mid 2)')

# friend
e = get_entry('friend')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 6 not in mids:
        e['meanings'].append({
            'id': 6,
            'partOfSpeech': 'verb',
            'translation': 'помогать, быть другом',
            'examples': [],
            'register': []
        })
    applied.append('friend (added verb mid 6)')

# friendly
e = get_entry('friendly')
if e:
    for m in e['meanings']:
        if m['id'] == 6:
            m['partOfSpeech'] = 'adverb'
            m['translation'] = 'дружественно; дружелюбно'
    mids = [m['id'] for m in e['meanings']]
    if 7 not in mids:
        e['meanings'].append({
            'id': 7,
            'partOfSpeech': 'noun',
            'translation': 'товарищеская встреча',
            'examples': [{'en': 'friendly match', 'ru': 'товарищеский матч'}],
            'register': ['спорт']
        })
    applied.append('friendly (separated adv mid 6 and noun mid 7)')

# fun
e = get_entry('fun')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'verb',
            'translation': 'шутить',
            'examples': [{'en': 'to be funning', 'ru': 'шутить'}],
            'register': ['разговорное']
        })
    applied.append('fun (added verb mid 5)')

# god
e = get_entry('god')
if e:
    for m in e['meanings']:
        if m['id'] == 6:
            m['translation'] = 'публика галёрки'
    mids = [m['id'] for m in e['meanings']]
    if 7 not in mids:
        e['meanings'].append({
            'id': 7,
            'partOfSpeech': 'verb',
            'translation': 'обожествлять; боготворить',
            'examples': [],
            'register': []
        })
    applied.append('god (separated noun mid 6 and verb mid 7)')

# 2. Fix POS 'other' for nouns in words 1500-2000
nouns_to_fix = {
    'energy': 'noun',
    'essential': 'noun',
    'exercise': 'noun',
    'expectation': 'noun',
    'experience': 'noun',
    'facility': 'noun',
    'fact': 'noun',
    'father': 'noun',
    'fee': 'noun',
    'feed': 'noun',
    'figure': 'noun',
    'film': 'noun',
    'finance': 'noun',
    'finding': 'noun',
    'firework': 'noun',
    'first': 'noun',
    'fit': 'noun',
    'five': 'noun',
    'flag': 'noun',
    'flat': 'noun',
    'folding': 'noun',
    'foundation': 'noun',
    'four': 'noun',
    'frame': 'noun',
    'fund': 'noun',
    'gain': 'noun',
    'game': 'noun',
    'garden': 'noun',
    'gentleman': 'noun',
    'glass': 'noun',
    'goods': 'noun',
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
for w in ['environmental']:
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
for w in ['everybody', 'everything']:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'pronoun'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> pronoun)")

# Numerals
for w in ['fourteen']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'numeral'
                applied.append(f"{w} (fixed POS other -> numeral)")

# Conjunctions
for w in ['for']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'conjunction'
                applied.append(f"{w} (fixed POS other -> conjunction)")

# Interjections
for w in ['forward', 'goodbye']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'interjection'
                applied.append(f"{w} (fixed POS other -> interjection)")

# Prepositions
for w in ['from']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'preposition'
                applied.append(f"{w} (fixed POS other -> preposition)")

# 3. Clean up OCR hyphenation artifacts with '≅' and '♦' in words 1500-2000
cleanups_1500 = [
    (re.compile(r'по\s+уши\s*≅\s*в\s+работе'), 'по уши в работе'),
    (re.compile(r'посл\.\s+ум\s+хорошо,\s+а\s*≅\s*два\s+лучше'), 'посл. ум хорошо, а два лучше'),
    (re.compile(r'это\s+у\s+него\s+на\s+лбу\s+написано\s*≅?'), 'это у него на лбу написано'),
    (re.compile(r'посл\.\s+гордый\s+поки-\s*≅\s*чился\s+да\s+во\s+прах\s+скатился'), 'посл. гордый покичился да во прах скатился'),
    (re.compile(r'посл\.\s*≅\s*от\s+добра\s+добра\s+не\s+ищут'), 'посл. от добра добра не ищут'),
    (re.compile(r'дело\s+сделано,\s+быть\s+беде\s*≅?'), 'дело сделано, быть беде'),
    (re.compile(r'вам\s+на\s+это\s+наплевать\s*≅?'), 'вам на это наплевать'),
    (re.compile(r'люди\s*≅\s*склонны\s+верить\s+тому,\s+чему\s+хотят\s+верить'), 'люди склонны верить тому, чему хотят верить'),
    (re.compile(r'матушка-Тем-\s*≅\s*за'), 'матушка-Темза'),
    (re.compile(r'посл\.\s+повинную\s+голову\s+меч\s+не\s+сечёт\s*≅?'), 'посл. повинную голову меч не сечёт'),
    (re.compile(r'посл\.\s+одежда\s+красит\s+чело-\s*≅\s*века'), 'посл. одежда красит человека'),
    (re.compile(r'правильно\s+по-\s*≅\s*нять,\s+установить\s+что-либо'), 'правильно понять, установить что-либо'),
    (re.compile(r'палец\s+о\s+палец\s+не\s+уда-\s*≅\s*рить'), 'палец о палец не ударить'),
    (re.compile(r'он\s*≅\s*замешан\s+в\s+этом\s+деле'), 'он замешан в этом деле'),
    (re.compile(r'клин\s+клином\s+вышибать\s*≅?'), 'клин клином вышибать'),
    (re.compile(r'хоро-\s*≅\s*шенькое\s+дело!'), 'хорошенькое дело!'),
    (re.compile(r'охотничий\s*≅\s*рассказ»'), 'охотничий рассказ'),
    (re.compile(r'припадок,\s*≅\s*пароксизм'), 'припадок, пароксизм'),
    (re.compile(r'неопытный;\s+прямо\s+со\s*≅\s*школьной\s+скамьи'), 'неопытный; прямо со школьной скамьи'),
    (re.compile(r'посл\.\s+чужое\s+добро\s*≅\s*впрок\s+нейдёт'), 'посл. чужое добро впрок нейдёт'),
]

clean_cnt = 0
for entry in data[1500:2000]:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for pat, repl in cleanups_1500:
            if pat.search(tr):
                m['translation'] = pat.sub(repl, tr)
                clean_cnt += 1
                tr = m['translation']

applied.append(f"Cleaned {clean_cnt} glued OCR/idiom hyphenation artifacts in meanings")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes for words 1500-2000:")
for a in applied:
    print(f"  + {a}")
