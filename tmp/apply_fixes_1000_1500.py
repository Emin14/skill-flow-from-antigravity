"""
Применение точных и проверенных исправлений для диапазона 1000-1500.
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

# correspondent
e = get_entry('correspondent')
if e:
    for m in e['meanings']:
        if m['id'] == 1:
            m['translation'] = 'корреспондент'
    mids = [m['id'] for m in e['meanings']]
    if 2 not in mids:
        e['meanings'].append({
            'id': 2,
            'partOfSpeech': 'adjective',
            'translation': 'согласный, в согласии, соответственный (to, with)',
            'examples': [],
            'register': ['книжное']
        })
    applied.append('correspondent (separated noun mid 1 and adj mid 2)')

# crack
e = get_entry('crack')
if e:
    for m in e['meanings']:
        if m['id'] == 7:
            m['translation'] = 'крэк (форма кокаина)'
    mids = [m['id'] for m in e['meanings']]
    if 8 not in mids:
        e['meanings'].append({
            'id': 8,
            'partOfSpeech': 'adjective',
            'translation': 'великолепный, первоклассный; знаменитый',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('crack (separated noun mid 7 and adj mid 8)')

# crime
e = get_entry('crime')
if e:
    for m in e['meanings']:
        if m['id'] == 2:
            m['translation'] = 'преступность'
    mids = [m['id'] for m in e['meanings']]
    if 3 not in mids:
        e['meanings'].append({
            'id': 3,
            'partOfSpeech': 'verb',
            'translation': 'карать за нарушение устава',
            'examples': [],
            'register': ['военное']
        })
    applied.append('crime (separated noun mid 2 and verb mid 3)')

# culture
e = get_entry('culture')
if e:
    for m in e['meanings']:
        if m['id'] == 5:
            m['translation'] = 'пометки и названия на топографических картах'
    mids = [m['id'] for m in e['meanings']]
    if 6 not in mids:
        e['meanings'].append({
            'id': 6,
            'partOfSpeech': 'verb',
            'translation': 'выращивать (микроорганизмы в питательной среде)',
            'examples': [],
            'register': ['биология']
        })
    applied.append('culture (separated noun mid 5 and verb mid 6)')

# daily
e = get_entry('daily')
if e:
    for m in e['meanings']:
        if m['id'] == 2:
            m['translation'] = 'ежедневная газета'
            m['partOfSpeech'] = 'noun'
            m['register'] = ['разговорное']
    mids = [m['id'] for m in e['meanings']]
    if 3 not in mids:
        e['meanings'].append({
            'id': 3,
            'partOfSpeech': 'noun',
            'translation': 'приходящая работница',
            'examples': [{'en': 'daily help', 'ru': 'приходящая работница'}],
            'register': ['разговорное']
        })
    applied.append('daily (separated noun mid 2 ежедневная газета and mid 3 приходящая работница)')

# deed
e = get_entry('deed')
if e:
    for m in e['meanings']:
        if m['id'] == 4:
            m['translation'] = 'документ, акт'
            m['register'] = ['юриспруденция']
            m['examples'] = [{'en': 'to draw up a deed', 'ru': 'составлять документ'}]
    mids = [m['id'] for m in e['meanings']]
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'verb',
            'translation': 'передавать по акту',
            'examples': [],
            'register': ['американский английский']
        })
    applied.append('deed (separated noun mid 4 and verb mid 5)')

# doctor
e = get_entry('doctor')
if e:
    for m in e['meanings']:
        if m['id'] == 5:
            m['translation'] = 'искусственная муха (употр. для ужения)'
    mids = [m['id'] for m in e['meanings']]
    if 6 not in mids:
        e['meanings'].append({
            'id': 6,
            'partOfSpeech': 'verb',
            'translation': 'заниматься врачебной практикой; лечить',
            'examples': [{'en': 'to doctor oneself', 'ru': 'лечиться самостоятельно'}],
            'register': ['разговорное']
        })
    applied.append('doctor (separated noun mid 5 and verb mid 6)')

# drunk
e = get_entry('drunk')
if e:
    for m in e['meanings']:
        if m['id'] == 1:
            m['partOfSpeech'] = 'adjective'
            m['translation'] = 'пьяный'
            m['examples'] = [{'en': 'to get drunk', 'ru': 'напиться пьяным'}]
    applied.append('drunk (fixed mid 1 to adj: пьяный)')

# elegant
e = get_entry('elegant')
if e:
    for m in e['meanings']:
        if m['id'] == 2:
            m['translation'] = 'прекрасный; лучший; первоклассный'
            m['register'] = ['американский английский', 'разговорное']
    mids = [m['id'] for m in e['meanings']]
    if 3 not in mids:
        e['meanings'].append({
            'id': 3,
            'partOfSpeech': 'noun',
            'translation': 'модник, пижон, щёголь',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('elegant (separated adj mid 2 and noun mid 3)')

# 2. Fix POS 'other' for nouns in words 1000-1500
nouns_to_fix = {
    'cost': 'noun',
    'cotton': 'noun',
    'creativity': 'noun',
    'crew': 'noun',
    'cutting': 'noun',
    'data': 'noun',
    'debate': 'noun',
    'decoration': 'noun',
    'detail': 'noun',
    'difficulty': 'noun',
    'dimension': 'noun',
    'direction': 'noun',
    'dish': 'noun',
    'domestic': 'noun',
    'due': 'noun',
    'dump': 'noun',
    'earnings': 'noun',
    'economics': 'noun',
    'effect': 'noun',
    'effective': 'noun',
    'eight': 'noun',
    'electronics': 'noun',
    'element': 'noun',
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
for w in ['cute', 'drunk']:
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
for w in ['could', 'download']:
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
e = get_entry('eighteen')
if e:
    for m in e.get('meanings', []):
        if m.get('partOfSpeech') == 'other':
            m['partOfSpeech'] = 'numeral'
            applied.append('eighteen (fixed POS other -> numeral)')

# Conjunctions
e = get_entry('either')
if e:
    for m in e.get('meanings', []):
        if m.get('partOfSpeech') == 'other':
            m['partOfSpeech'] = 'conjunction'
            applied.append('either (fixed POS other -> conjunction)')

# 3. Clean up OCR hyphenation artifacts with '≅' and '♦' in words 1000-1500
cleanups_1000 = [
    (re.compile(r'после\s+дождичка\s+в\s+чет-\s*≅\s*верг'), 'после дождичка в четверг'),
    (re.compile(r'ставить\s+точки\s*≅\s*над\s+i'), 'ставить точки над i'),
    (re.compile(r'посл\.\s+сделан-\s*≅\s*ного,\s+потерянного\s+не\s+воротишь'), 'посл. сделанного, потерянного не воротишь'),
    (re.compile(r'посл\.\s+что\s+нельзя\s+испра-\s*≅\s*вить,\s+то\s+следует\s+терпеть'), 'посл. что нельзя исправить, то следует терпеть'),
    (re.compile(r'поставить\s*≅\s*на\s+одну\s+доску\s+с'), 'поставить на одну доску с'),
    (re.compile(r'посл\.\s+в\s+тихом\s+омуте\s+черти\s+водятся\s*≅?'), 'посл. в тихом омуте черти водятся'),
    (re.compile(r'меж-\s*≅\s*ду\s+двух\s+огней'), 'между двух огней'),
    (re.compile(r'чер-\s*≅\s*товски\s+везёт'), 'чертовски везёт'),
    (re.compile(r'горе\s+не-\s*≅\s*удачникам'), 'горе неудачникам'),
    (re.compile(r'посл\.\s+двум\s+смертям\s+не\s+бывать,\s+а\s+одной\s*≅\s*не\s+миновать'), 'посл. двум смертям не бывать, а одной не миновать'),
    (re.compile(r'посл\.\s+ни-\s*≅\s*когда\s+не\s+следует\s+отчаиваться'), 'посл. никогда не следует отчаиваться'),
    (re.compile(r'брачные\s+отношения\s+до\s*≅\s*брака'), 'брачные отношения до брака'),
    (re.compile(r'посл\.\s+любишь\s+кататься,\s+люби\s+и\s+са-\s*≅\s*ночки\s+возить'), 'посл. любишь кататься, люби и саночки возить'),
    (re.compile(r'следует\s+избегать\s+ненужного\s+риска\s*≅?'), 'следует избегать ненужного риска'),
    (re.compile(r'будет\s+и\s+на\s+нашей\s+улице\s*≅\s*праздник'), 'будет и на нашей улице праздник'),
    (re.compile(r'притянуть\s+за\s+уши\s+\(довод\s*≅\s*и\s+т\.\s*п\.\)'), 'притянуть за уши (довод и т. п.)'),
    (re.compile(r'обез-\s*≅\s*вредить'), 'обезвредить'),
    (re.compile(r'у\s+него\s+ещё\s+молоко\s+на\s*≅\s*губах\s+не\s+обсохло'), 'у него ещё молоко на губах не обсохло'),
    (re.compile(r'втирать\s+очки\s*≅\s*кому-либо'), 'втирать очки кому-либо'),
    (re.compile(r'посл\.\s+в\s+гостях\s*≅\s*хорошо,\s+а\s+дома\s+лучше'), 'посл. в гостях хорошо, а дома лучше'),
    (re.compile(r'посл\.\s+тише\s+едешь,\s*≅\s*дальше\s+будешь'), 'посл. тише едешь, дальше будешь'),
    (re.compile(r'как\s*≅\s*нажито,\s+так\s+и\s+прожито'), 'как нажито, так и прожито'),
    (re.compile(r'яйца\s*≅\s*курицу\s+не\s+учат'), 'посл. яйца курицу не учат'),
]

clean_cnt = 0
for entry in data[1000:1500]:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for pat, repl in cleanups_1000:
            if pat.search(tr):
                m['translation'] = pat.sub(repl, tr)
                clean_cnt += 1
                tr = m['translation']

applied.append(f"Cleaned {clean_cnt} glued OCR/idiom hyphenation artifacts in meanings")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes for words 1000-1500:")
for a in applied:
    print(f"  + {a}")
