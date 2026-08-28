"""
Применение точных и проверенных исправлений для диапазона 4000-4982,
а также глобальная очистка остаточных знаков ≅ и ♦ во всех 4982 статьях.
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

# 1. Glued POS Transitions in 4000-end

# silly
e = get_entry('silly')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'затишье в прессе (особ. в конце лета)'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'noun',
            'translation': 'глупыш, несмышлёныш',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('silly (separated adj mid 3 and noun mid 4)')

# simple
e = get_entry('simple')
if e:
    for m in e['meanings']:
        if m['id'] == 7:
            m['translation'] = 'простой, незнатный'
    mids = [m['id'] for m in e['meanings']]
    if 8 not in mids:
        e['meanings'].append({
            'id': 8,
            'partOfSpeech': 'noun',
            'translation': 'лекарственная трава',
            'examples': [],
            'register': []
        })
    applied.append('simple (separated adj mid 7 and noun mid 8)')

# squad
e = get_entry('squad')
if e:
    for m in e['meanings']:
        if m['id'] == 5:
            m['translation'] = 'спортивная команда'
    mids = [m['id'] for m in e['meanings']]
    if 6 not in mids:
        e['meanings'].append({
            'id': 6,
            'partOfSpeech': 'verb',
            'translation': 'сводить в команды, группы, отделения',
            'examples': [],
            'register': []
        })
    applied.append('squad (separated noun mid 5 and verb mid 6)')

# steal
e = get_entry('steal')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 13 not in mids:
        e['meanings'].append({
            'id': 13,
            'partOfSpeech': 'noun',
            'translation': 'воровство; украденный предмет; выгодная покупка',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('steal (added noun mid 13)')

# steer
e = get_entry('steer')
if e:
    for m in e['meanings']:
        if m['id'] == 4:
            m['translation'] = 'направлять, руководить'
    mids = [m['id'] for m in e['meanings']]
    if 5 not in mids:
        e['meanings'].append({
            'id': 5,
            'partOfSpeech': 'noun',
            'translation': 'намёк, подсказка',
            'examples': [],
            'register': ['разговорное']
        })
    applied.append('steer (separated verb mid 4 and noun mid 5)')

# stiff
e = get_entry('stiff')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 20 not in mids:
        e['meanings'].append({
            'id': 20,
            'partOfSpeech': 'noun',
            'translation': 'труп; простофиля, оболтус',
            'examples': [],
            'register': ['сленг']
        })
    applied.append('stiff (added noun mid 20)')

# suspect
e = get_entry('suspect')
if e:
    for m in e['meanings']:
        if m['id'] == 1:
            m['translation'] = 'подозреваемый или подозрительный человек'
            m['partOfSpeech'] = 'noun'
    mids = [m['id'] for m in e['meanings']]
    if 2 not in mids:
        e['meanings'].append({
            'id': 2,
            'partOfSpeech': 'adjective',
            'translation': 'подозрительный; подозреваемый',
            'examples': [],
            'register': []
        })
    applied.append('suspect (separated noun mid 1 and adj mid 2)')

# technical
e = get_entry('technical')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'формально-юридический'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'noun',
            'translation': 'технические подробности; акции технологических компаний',
            'examples': [],
            'register': []
        })
    applied.append('technical (separated adj mid 3 and noun mid 4)')

# true
e = get_entry('true')
if e:
    for m in e['meanings']:
        if m['id'] == 8:
            m['translation'] = 'сущая правда'
    mids = [m['id'] for m in e['meanings']]
    if 9 not in mids:
        e['meanings'].append({
            'id': 9,
            'partOfSpeech': 'verb',
            'translation': 'править, пригонять, выверять, регулировать (or true up)',
            'examples': [],
            'register': []
        })
    applied.append('true (separated noun mid 8 and verb mid 9)')

# under
e = get_entry('under')
if e:
    for m in e['meanings']:
        if m['id'] == 16:
            m['translation'] = 'меньший, ниже установленной нормы'
            m['partOfSpeech'] = 'adjective'
    mids = [m['id'] for m in e['meanings']]
    if 17 not in mids:
        e['meanings'].append({
            'id': 17,
            'partOfSpeech': 'noun',
            'translation': 'недолёт',
            'examples': [],
            'register': ['военное']
        })
    applied.append('under (separated adj mid 16 and noun mid 17)')

# up
e = get_entry('up')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 33 not in mids:
        e['meanings'].append({
            'id': 33,
            'partOfSpeech': 'verb',
            'translation': 'поднимать',
            'examples': [],
            'register': []
        })
    applied.append('up (added verb mid 33)')

# vacuum
e = get_entry('vacuum')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'вакуумный'
            m['partOfSpeech'] = 'adjective'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'verb',
            'translation': 'чистить пылесосом',
            'examples': [],
            'register': []
        })
    applied.append('vacuum (separated adj mid 3 and verb mid 4)')

# various
e = get_entry('various')
if e:
    for m in e['meanings']:
        if m['id'] == 3:
            m['translation'] = 'разнообразный; разносторонний'
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'noun',
            'translation': 'некоторые (лица)',
            'examples': [],
            'register': []
        })
    applied.append('various (separated adj mid 3 and noun mid 4)')

# vast
e = get_entry('vast')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'noun',
            'translation': 'простор, безбрежное пространство',
            'examples': [],
            'register': ['поэтическое']
        })
    applied.append('vast (added noun mid 4)')

# weather
e = get_entry('weather')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 12 not in mids:
        e['meanings'].append({
            'id': 12,
            'partOfSpeech': 'adjective',
            'translation': 'наветренный',
            'examples': [],
            'register': ['морское']
        })
    applied.append('weather (added adj mid 12)')

# worth
e = get_entry('worth')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 4 not in mids:
        e['meanings'].append({
            'id': 4,
            'partOfSpeech': 'adjective',
            'translation': 'стоящий, заслуживающий',
            'examples': [],
            'register': []
        })
    applied.append('worth (added adj mid 4)')

# 2. Fix POS 'other' in words 4000-end
nouns_to_fix = [
    'short', 'sight', 'six', 'skip', 'slip', 'software', 'solid',
    'specification', 'spectacle', 'spelling', 'spiritual', 'spoil',
    'sport', 'spot', 'spouse', 'stake', 'step', 'store', 'string',
    'suburb', 'supply', 'surgery', 'swimming', 'table', 'tail', 'ten',
    'term', 'theory', 'thousand', 'three', 'time', 'today', 'tomorrow',
    'tonight', 'tooth', 'top', 'total', 'track', 'trial', 'trick',
    'trouble', 'use', 'wedding', 'wheel', 'woman', 'word', 'work',
    'world', 'writing', 'yesterday'
]

for w in nouns_to_fix:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'noun'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> noun)")

# Pronouns
pronouns_to_fix = [
    'someone', 'their', 'theirs', 'them', 'themselves', 'these', 'they',
    'this', 'those', 'us', 'we', 'what', 'whatever', 'which', 'whichever',
    'who', 'whoever', 'whom', 'whose', 'you', 'your', 'yours', 'yourself'
]
for w in pronouns_to_fix:
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
conjs_to_fix = [
    'since', 'then', 'though', 'unless', 'until', 'when', 'whenever',
    'where', 'whereas', 'wherever', 'whether', 'while', 'yet'
]
for w in conjs_to_fix:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'conjunction'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> conjunction)")

# Prepositions
preps_to_fix = [
    'through', 'throughout', 'to', 'towards', 'under', 'underneath',
    'unlike', 'upon', 'with', 'within', 'without'
]
for w in preps_to_fix:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'preposition'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> preposition)")

# Verbs
verbs_to_fix = ['should', 'stay', 'will', 'would']
for w in verbs_to_fix:
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
nums_to_fix = ['sixteen', 'thirteen', 'thirty', 'twelve', 'twenty', 'two']
for w in nums_to_fix:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'numeral'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> numeral)")

# Adverbs
advs_to_fix = ['too', 'why']
for w in advs_to_fix:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'adverb'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> adverb)")

# Interjections
interjs_to_fix = ['steady', 'yes']
for w in interjs_to_fix:
    e = get_entry(w)
    if e:
        cnt = 0
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'interjection'
                cnt += 1
        if cnt > 0:
            applied.append(f"{w} (fixed {cnt} meanings POS other -> interjection)")

# Articles
for w in ['the']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'article'
                applied.append(f"{w} (fixed POS other -> article)")

# Adjectives
for w in ['striking']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'adjective'
                applied.append(f"{w} (fixed POS other -> adjective)")

# 3. Global clean up of all remaining ≅ and ♦ symbols across all 4982 entries
total_cleaned_symbols = 0
for entry in data:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        if '≅' in tr or '♦' in tr:
            # clean broken hyphenations and ≅
            tr_clean = re.sub(r'([а-яА-ЯёЁ]+)-\s*≅\s*([а-яА-ЯёЁ]+)', r'\1\2', tr)
            tr_clean = re.sub(r'\s*≅\s*', ' ', tr_clean)
            tr_clean = re.sub(r'\s*♦\s*', '; ', tr_clean)
            tr_clean = re.sub(r'\s{2,}', ' ', tr_clean).strip()
            if tr_clean != tr:
                m['translation'] = tr_clean
                total_cleaned_symbols += 1
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if '≅' in ru or '♦' in ru:
                ru_clean = re.sub(r'([а-яА-ЯёЁ]+)-\s*≅\s*([а-яА-ЯёЁ]+)', r'\1\2', ru)
                ru_clean = re.sub(r'\s*≅\s*', ' ', ru_clean)
                ru_clean = re.sub(r'\s*♦\s*', '; ', ru_clean)
                ru_clean = re.sub(r'\s{2,}', ' ', ru_clean).strip()
                if ru_clean != ru:
                    ex['ru'] = ru_clean
                    total_cleaned_symbols += 1

applied.append(f"Global sweep cleaned {total_cleaned_symbols} remaining ≅ and ♦ artifacts across all 4982 words")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes:")
for a in applied[:30]:
    print(f"  + {a}")
print(f"  ... and {len(applied)-30} more fixes.")
