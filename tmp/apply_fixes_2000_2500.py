"""
Применение точных и проверенных исправлений для диапазона 2000-2500.
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

# habit
e = get_entry('habit')
if e:
    for m in e['meanings']:
        if m['id'] == 6:
            m['translation'] = 'костюм для верховой езды'
    mids = [m['id'] for m in e['meanings']]
    if 7 not in mids:
        e['meanings'].append({
            'id': 7,
            'partOfSpeech': 'verb',
            'translation': 'одевать, облачать',
            'examples': [],
            'register': []
        })
    applied.append('habit (separated noun mid 6 and verb mid 7)')

# how
e = get_entry('how')
if e:
    mids = [m['id'] for m in e['meanings']]
    if 14 not in mids:
        e['meanings'].append({
            'id': 14,
            'partOfSpeech': 'noun',
            'translation': 'способ, метод',
            'examples': [],
            'register': []
        })
    applied.append('how (added noun mid 14 способ, метод)')

# internal
e = get_entry('internal')
if e:
    for m in e['meanings']:
        if m['id'] == 2:
            m['translation'] = 'душевный, сокровенный'
    mids = [m['id'] for m in e['meanings']]
    if 3 not in mids:
        e['meanings'].append({
            'id': 3,
            'partOfSpeech': 'noun',
            'translation': 'внутренности; свойства',
            'examples': [],
            'register': []
        })
    applied.append('internal (separated adj mid 2 and noun mid 3)')

# 2. Fix POS 'other' for nouns in words 2000-2500
nouns_to_fix = {
    'grace': 'noun',
    'green': 'noun',
    'grocery': 'noun',
    'ground': 'noun',
    'group': 'noun',
    'guard': 'noun',
    'gut': 'noun',
    'hand': 'noun',
    'headline': 'noun',
    'headquarters': 'noun',
    'hearing': 'noun',
    'holiday': 'noun',
    'honour': 'noun',
    'horn': 'noun',
    'hostility': 'noun',
    'household': 'noun',
    'humanity': 'noun',
    'hydrogen': 'noun',
    'ill': 'noun',
    'implement': 'noun',
    'import': 'noun',
    'inch': 'noun',
    'industrial': 'noun',
    'initial': 'noun',
    'input': 'noun',
    'installation': 'noun',
    'instruction': 'noun',
    'intellectual': 'noun',
    'intended': 'noun',
    'interest': 'noun',
    'iron': 'noun',
    'jeans': 'noun',
    'key': 'noun',
    'kid': 'noun',
    'knock': 'noun',
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
for w in ['hidden', 'hip', 'indigenous', 'instinct']:
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
for w in ['her', 'hers', 'him', 'himself', 'his', 'I', 'its']:
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
for w in ['however', 'if', 'immediately']:
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
for w in ['hail', 'halt', 'hey']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'interjection'
                applied.append(f"{w} (fixed POS other -> interjection)")

# Verbs
for w in ['impress']:
    e = get_entry(w)
    if e:
        for m in e.get('meanings', []):
            if m.get('partOfSpeech') == 'other':
                m['partOfSpeech'] = 'verb'
                applied.append(f"{w} (fixed POS other -> verb)")

# 3. Clean up OCR hyphenation artifacts with '≅' and '♦' in words 2000-2500
cleanups_2000 = [
    (re.compile(r'вред;\s+ущерб;\s+от\s+греха\s+по-\s*≅\s*дальше'), 'вред; ущерб; от греха подальше'),
    (re.compile(r'душа\s+в\s*≅\s*пятки\s+ушла'), 'душа в пятки ушла'),
    (re.compile(r'что\s+бы\s*≅\s*то\s+ни\s+было'), 'что бы то ни было'),
    (re.compile(r'посл\.\s+промедление\s+смерти\s+по-\s*≅\s*добно'), 'посл. промедление смерти подобно'),
    (re.compile(r'жив\s+курилка\s*≅?'), 'жив курилка'),
    (re.compile(r'легче\s*≅\s*на\s+поворотах'), 'легче на поворотах'),
    (re.compile(r'«прикрыть\s+грех»\s+законным\s+бра-\s*≅\s*ком'), '«прикрыть грех» законным браком'),
    (re.compile(r'между\s*≅\s*двух\s+огней'), 'между двух огней'),
    (re.compile(r'из\s+пер-\s*≅\s*вых\s+рук,\s+из\s+первоисточника'), 'из первых рук, из первоисточника'),
    (re.compile(r'если\s+бы\s+да\s+кабы\s*≅?'), 'если бы да кабы'),
    (re.compile(r'мягко\s*≅\s*стелет,\s+да\s+жёстко\s+спать'), 'мягко стелет, да жёстко спать'),
    (re.compile(r'кормить\s+завтраками»\s*≅?'), 'кормить завтраками'),
    (re.compile(r'удо-\s*≅\s*вольствие,\s+наслаждение'), 'удовольствие, наслаждение'),
    (re.compile(r'и\s+младенцу\s+ясно\s*≅?'), 'и младенцу ясно'),
    (re.compile(r'одно-\s*≅\s*го\s+поля\s+ягода'), 'одного поля ягода'),
    (re.compile(r'одному\s+богу\s*≅\s*известно'), 'одному богу известно'),
    (re.compile(r'впитать\s+с\s+молоком\s+матери\s*≅?'), 'впитать с молоком матери'),
    (re.compile(r'и\s+ах-\s*≅\s*нуть\s+не\s+успел'), 'и ахнуть не успел'),
    (re.compile(r'уписывать\s+за\s+обе\s+щеки,\s+есть\s+с\s+ап-\s*≅\s*петитом'), 'уписывать за обе щеки, есть с аппетитом'),
    (re.compile(r'всыпать\s+кому-либо\s+по\s*≅\s*первое\s+число'), 'всыпать кому-либо по первое число'),
]

clean_cnt = 0
for entry in data[2000:2500]:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        for pat, repl in cleanups_2000:
            if pat.search(tr):
                m['translation'] = pat.sub(repl, tr)
                clean_cnt += 1
                tr = m['translation']

applied.append(f"Cleaned {clean_cnt} glued OCR/idiom hyphenation artifacts in meanings")

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(applied)} fixes for words 2000-2500:")
for a in applied:
    print(f"  + {a}")
