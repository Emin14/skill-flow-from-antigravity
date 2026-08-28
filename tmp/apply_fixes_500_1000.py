"""
Применение точных и проверенных исправлений для диапазона 500-1000.
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

# 1. Glued POS and Idiom Fixes

# buy
e = get_entry('buy')
if e:
    for m in e['meanings']:
        if m['id'] == 13:
            m['partOfSpeech'] = 'noun'
            m['translation'] = 'покупка'
            m['examples'] = []
            applied.append('buy (mid 13 -> noun: покупка)')

# can1 / can2
for cw in ['can1', 'can2']:
    e = get_entry(cw)
    if e:
        for m in e['meanings']:
            if m['id'] == 12:
                m['partOfSpeech'] = 'verb'
                m['translation'] = 'консервировать (мясо, овощи, фрукты)'
                applied.append(f'{cw} (mid 12 -> verb: консервировать)')

# castle
e = get_entry('castle')
if e:
    # Meaning 3 in castle: was "строить воздушные замки 2. v рокировать(ся)"
    for m in e['meanings']:
        if m['id'] == 3:
            m['partOfSpeech'] = 'noun'
            m['translation'] = 'ладья'
            m['register'] = ['шахматы']
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'verb',
            'translation': 'рокировать(ся)',
            'examples': [],
            'register': ['шахматы']
        })
    applied.append('castle (mid 3 -> noun: ладья, mid 4 -> verb: рокировать(ся))')

# champion
e = get_entry('champion')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'поборник, защитник, борец'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'adjective',
            'translation': 'первоклассный',
            'examples': [{'en': 'champion chess player', 'ru': 'первоклассный шахматист'}],
            'register': ['разговорное']
        })
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'verb',
            'translation': 'защищать; бороться за что-либо',
            'examples': [{'en': 'to champion a cause', 'ru': 'бороться за какое-либо дело'}],
            'register': []
        })
    applied.append('champion (separated noun mid 3, adj mid 4, verb mid 5)')

# clerk
e = get_entry('clerk')
if e:
    for m in e['meanings']:
        if m['id'] == 5:
            m['translation'] = 'начальник метеорологического отдела управления связи'
    mids = [m['id'] for m in e['meanings']]
    if 6 not in mids:
        e['meanings'].append({
            'id': 6,
            'partOfSpeech': 'verb',
            'translation': 'служить, быть чиновником',
            'examples': [],
            'register': []
        })
    applied.append('clerk (separated noun mid 5 and verb mid 6)')

# cheek
e = get_entry('cheek')
if e:
    for m in e['meanings']:
        if m['id'] == 8:
            m['partOfSpeech'] = 'verb'
            m['translation'] = 'нахальничать, говорить дерзости'
            m['examples'] = []
            applied.append('cheek (mid 8 -> verb: нахальничать, говорить дерзости)')

# compare
e = get_entry('compare')
if e:
    for m in e['meanings']:
        if m['id'] == 5:
            m['partOfSpeech'] = 'noun'
            m['translation'] = 'сравнение'
            m['examples'] = [{'en': 'beyond compare', 'ru': 'вне всякого сравнения'}]
            applied.append('compare (mid 5 -> noun: сравнение)')

# compute
e = get_entry('compute')
if e:
    for m in e['meanings']:
        if m['id'] == 1:
            m['translation'] = 'считать, подсчитывать; вычислять, делать выкладки'
    mids = [m['id'] for m in e['meanings']]
    if 2 not in mids:
        e['meanings'].append({
            'id': 2,
            'partOfSpeech': 'noun',
            'translation': 'вычисление',
            'examples': [{'en': 'beyond compute', 'ru': 'неисчислимый'}],
            'register': ['редкое']
        })
    applied.append('compute (separated verb mid 1 and noun mid 2)')

# coat
e = get_entry('coat')
if e:
    for m in e['meanings']:
        if m['id'] == 10:
            m['translation'] = 'грунт'
    if 'phrases' not in e:
        e['phrases'] = []
    e['phrases'].append({
        'id': len(e['phrases']) + 1,
        'phrase': 'coat of arms',
        'partOfSpeech': 'noun',
        'translation': 'гербовый щит, герб',
        'examples': [],
        'register': []
    })
    applied.append('coat (fixed mid 10 to "грунт" and moved coat of arms to phrases)')

# 2. Fix POS 'other' for nouns/adjectives/conjunctions in words 500-1000
words_to_pos = {
    'bond': 'noun',
    'bone': 'noun',
    'boring': 'noun',
    'bottle': 'noun',
    'bowl': 'noun',
    'brain': 'noun',
    'brief': 'noun',
    'browser': 'noun',
    'buddy': 'noun',
    'building': 'noun',
    'capability': 'noun',
    'card': 'noun',
    'case': 'noun',
    'casualty': 'noun',
    'chamber': 'noun',
    'charge': 'noun',
    'charity': 'noun',
    'chart': 'noun',
    'cheek': 'noun',
    'cheer': 'noun',
    'chip': 'noun',
    'chocolate': 'noun',
    'chop': 'noun',
    'circumstance': 'noun',
    'civilian': 'noun',
    'classic': 'noun',
    'cloth': 'noun',
    'clothes': 'noun',
    'club': 'noun',
    'collection': 'noun',
    'colour': 'noun',
    'combination': 'noun',
    'comfort': 'noun',
    'communication': 'noun',
    'component': 'noun',
    'condition': 'noun',
    'contact': 'noun',
    'convenience': 'noun',
    'conversation': 'noun',
    'coordinate': 'noun',
}

for w, proper_pos in words_to_pos.items():
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = proper_pos
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> {proper_pos})")

# Conjunctions
for w in ['both', 'but']:
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
e = get_entry('cave')
if e:
    for m in e.get('meanings', []):
        if m.get('partOfSpeech') == 'other':
            m['partOfSpeech'] = 'interjection'
            applied.append('cave (fixed POS other -> interjection)')

# 3. Clean up OCR hyphenation artifacts with '≅' and '♦'
cleanups = [
    (re.compile(r'посл\.\s+смелость\s+горо-\s*≅\s*да\s+берёт'), 'посл. смелость города берёт'),
    (re.compile(r'знать\s+что-либо\s+как\s+свои\s+пять\s*≅\s*пальцев'), 'знать что-либо как свои пять пальцев'),
    (re.compile(r'быть\s+себе\s+на\s*≅\s*уме'), 'быть себе на уме'),
    (re.compile(r'как\s+на\s+горячих\s*≅\s*угольях'), 'как на горячих угольях'),
    (re.compile(r'посл\.\s+от\s+судьбы\s+не\s+уй-\s*≅\s*дёшь'), 'посл. от судьбы не уйдёшь'),
    (re.compile(r'у\s+неё\s+денег\s+куры\s+не\s*≅\s*клюют'), 'у неё денег куры не клюют'),
    (re.compile(r'словно\s+и\s+во-\s*≅\s*ды\s+не\s+замутит'), 'словно и воды не замутит'),
    (re.compile(r'посл\.\s+соловья\s+баснями\s+не\s+кормят\s*≅?'), 'посл. соловья баснями не кормят'),
    (re.compile(r'посл\.\s+один\s+пирог\s+два\s+раза\s+не\s*≅\s*съешь'), 'посл. один пирог два раза не съешь'),
    (re.compile(r'ни\s+ко-\s*≅\s*ла\s+ни\s+двора'), 'ни кола ни двора'),
    (re.compile(r'в\s+подмётки\s+не\s+годиться\s+\(ко-\s*≅\s*му\s*-\s*л\.\)'), 'в подмётки не годиться (кому-л.)'),
    (re.compile(r'не\s+в\s*≅\s*бровь,\s+а\s+в\s+глаз'), 'не в бровь, а в глаз'),
    (re.compile(r'если\s+это\s+замечание\s+вы\s+принимаете\s*≅\s*на\s+свой\s+счёт,\s+что\s+ж,\s+на\s+здоровье'), 'если это замечание вы принимаете на свой счёт, что ж, на здоровье'),
    (re.compile(r'посл\.\s+не\s+работа\s+старит,\s+а\s+забота\s*≅?'), 'посл. не работа старит, а забота'),
    (re.compile(r'деньги\s+на\s+бочку!\s*≅?'), 'деньги на бочку!'),
    (re.compile(r'и\s*≅\s*мёртвого\s+может\s+рассмешить'), 'и мёртвого может рассмешить'),
    (re.compile(r'выбол-\s*≅\s*тать\s+секрет'), 'выболтать секрет'),
    (re.compile(r'этот\s+номер\s+не\s*≅\s*пройдёт'), 'этот номер не пройдёт'),
    (re.compile(r'однотипные\s+мага-\s*≅\s*зины'), 'однотипные магазины'),
    (re.compile(r'менять\s+коней\s+на\s+пе-\s*≅\s*реправе'), 'менять коней на переправе'),
    (re.compile(r'посл\.\s+пуганая\s+ворона\s+куста\s*≅\s*боится'), 'посл. пуганая ворона куста боится'),
    (re.compile(r'видны\s+мастера\s+по\s+работе\s*≅?|видно\s+мастера\s+по\s+работе\s*≅?'), 'посл. видно мастера по работе'),
    (re.compile(r'посл\.\s+смелость\s+города\s+берёт\s*≅?'), 'посл. смелость города берёт'),
    (re.compile(r'≅\s*«хозяин\s+погоды»,\s+метеоролог'), '«хозяин погоды», метеоролог'),
    (re.compile(r'\(пытаться\)\s*≅\s*повернуть\s+назад\s+колесо\s+истории'), '(пытаться) повернуть назад колесо истории'),
    (re.compile(r'посл\.\s+нет\s+худа\s+без\s+добра\s*≅?'), 'посл. нет худа без добра'),
    (re.compile(r'пристыдить\s+кого-\s*≅\s*л\.,\s+воздав\s+добром\s+за\s+зло'), 'пристыдить кого-л., воздав добром за зло'),
    (re.compile(r'посл\.\s+скажи\s+мне,\s+кто\s+твой\s+друг,\s+и\s+я\s+ска-\s*≅\s*жу,\s+кто\s+ты'), 'посл. скажи мне, кто твой друг, и я скажу, кто ты'),
    (re.compile(r'посл\.\s+у\s+семи\s+нянек\s+дитя\s+без\s+глазу\s*≅?'), 'посл. у семи нянек дитя без глазу'),
]

clean_cnt = 0
for entry in data[500:1000]:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for pat, repl in cleanups:
            if pat.search(tr):
                m['translation'] = pat.sub(repl, tr)
                clean_cnt += 1
                tr = m['translation']

applied.append(f"Cleaned {clean_cnt} glued OCR/idiom hyphenation artifacts in meanings")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes for words 500-1000:")
for a in applied:
    print(f"  + {a}")
