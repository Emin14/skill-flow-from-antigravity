"""
Применение подтверждённых OCR-исправлений из полного аудита.
"""
import io, json

JSON_PATH = "oxford_5000_2026-08-27.json"

data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
word_index = {e['word']: i for i, e in enumerate(data)}

def get_entry(w):
    if w in word_index:
        return data[word_index[w]]
    return None

fixes_log = []

# 1. accidentally
e = get_entry('accidentally')
if e and e['meanings']:
    if 'учайно' in e['meanings'][0]['translation']:
        e['meanings'][0]['translation'] = 'случайно; непредумышленно'
        fixes_log.append('accidentally (fixed translation случайно)')

# 2. accountant
e = get_entry('accountant')
if e and e['meanings']:
    if e['meanings'][0]['translation'] == 'алтер':
        e['meanings'][0]['translation'] = 'бухгалтер'
        fixes_log.append('accountant (fixed translation бухгалтер)')

# 3. agriculture
e = get_entry('agriculture')
if e and e['meanings']:
    for ex in e['meanings'][0].get('examples', []):
        if ex.get('en') == 'Ministry of A':
            ex['en'] = 'Ministry of A.'
        if 'ерство' in ex.get('ru', ''):
            ex['ru'] = ex['ru'].replace('ерство', 'Министерство')
            fixes_log.append('agriculture (fixed Ministry of A. / Министерство)')

# 4. arm
e = get_entry('arm')
if e:
    for m in e['meanings']:
        for ex in m.get('examples', []):
            if 'руказакона' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('руказакона', 'рука закона')
                fixes_log.append('arm (fixed рука закона)')
            if 'елковое оружие' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('елковое оружие', 'стрелковое оружие')
                fixes_log.append('arm (fixed стрелковое оружие)')
            if 'ожить оружие' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('ожить оружие', 'сложить оружие')
                fixes_log.append('arm (fixed сложить оружие)')

# 5. assurance
e = get_entry('assurance')
if e:
    for m in e['meanings']:
        if m.get('translation') == 'ахование':
            m['translation'] = 'страхование'
            fixes_log.append('assurance (fixed страхование in translation)')
        for ex in m.get('examples', []):
            if 'ахование' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('ахование', 'страхование')
                fixes_log.append('assurance (fixed страхование in example)')

# 6. attend
e = get_entry('attend')
if e:
    for m in e['meanings']:
        for ex in m.get('examples', []):
            if 'ушайте' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('ушайте', 'слушайте')
                fixes_log.append('attend (fixed слушайте)')
            if 'едить за воспитанием' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('едить за воспитанием', 'следить за воспитанием')
                fixes_log.append('attend (fixed следить за воспитанием)')
            if 'attendance 42' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace(' attendance 42', '')
                fixes_log.append('attend (removed trailing attendance 42)')

# 7. balance
e = get_entry('balance')
if e:
    for m in e['meanings']:
        for ex in m.get('examples', []):
            if 'ическое равновесие' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('ическое равновесие', 'политическое равновесие')
                fixes_log.append('balance (fixed политическое равновесие)')

# 8. beyond
e = get_entry('beyond')
if e:
    for m in e['meanings']:
        for ex in m.get('examples', []):
            if 'ишком трудно' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('ишком трудно', 'слишком трудно')
                fixes_log.append('beyond (fixed слишком трудно)')

# 9. bomb
e = get_entry('bomb')
if e:
    for m in e['meanings']:
        if 'bombardier' in m.get('translation', ''):
            m['translation'] = 'бомбардировать, облучать частицами'
            fixes_log.append('bomb (cleaned trailing bombardier header)')

# 10. born
e = get_entry('born')
if e:
    for m in e['meanings']:
        for ex in m.get('examples', []):
            if 'епой от рождения' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('епой от рождения', 'слепой от рождения')
                fixes_log.append('born (fixed слепой от рождения)')

# 11. capacity
e = get_entry('capacity')
if e:
    for m in e['meanings']:
        if m.get('translation') == 'петенция':
            m['translation'] = 'компетенция'
            fixes_log.append('capacity (fixed компетенция)')

# 12. casual
e = get_entry('casual')
if e:
    for m in e['meanings']:
        if m.get('translation') == 'учайный':
            m['translation'] = 'случайный'
            fixes_log.append('casual (fixed случайный mid 1)')
        elif 'учайный, нерегулярный' in m.get('translation', ''):
            m['translation'] = m['translation'].replace('учайный, нерегулярный', 'случайный, нерегулярный')
            fixes_log.append('casual (fixed случайный mid 3)')

# 13. chance
e = get_entry('chance')
if e:
    for m in e['meanings']:
        if m.get('translation') == 'учайный':
            m['translation'] = 'случайный'
            fixes_log.append('chance (fixed случайный translation)')
        for ex in m.get('examples', []):
            if ex.get('ru') == 'учайно':
                ex['ru'] = 'случайно'
                fixes_log.append('chance (fixed случайно example)')

# 14. coincidence
e = get_entry('coincidence')
if e:
    for m in e['meanings']:
        if 'учайное стечение' in m.get('translation', ''):
            m['translation'] = m['translation'].replace('учайное стечение', 'случайное стечение')
            fixes_log.append('coincidence (fixed случайное стечение)')

# 15. colonial
e = get_entry('colonial')
if e:
    for m in e['meanings']:
        for ex in m.get('examples', []):
            if 'ерство колоний' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('ерство колоний', 'Министерство колоний')
                fixes_log.append('colonial (fixed Министерство колоний)')

# 16. come
e = get_entry('come')
if e:
    for m in e['meanings']:
        for ex in m.get('examples', []):
            if 'учайно обнаружить' in ex.get('ru', ''):
                ex['ru'] = ex['ru'].replace('учайно обнаружить', 'случайно обнаружить')
                fixes_log.append('come (fixed случайно обнаружить)')

# 17. compensate
e = get_entry('compensate')
if e:
    for m in e['meanings']:
        if 'compensation' in m.get('translation', ''):
            m['translation'] = 'поддерживать устойчивость валюты'
            fixes_log.append('compensate (cleaned trailing compensation header)')

# 18. competence
e = get_entry('competence')
if e:
    for m in e['meanings']:
        if 'петенция' in m.get('translation', ''):
            m['translation'] = m['translation'].replace('петенция', 'компетенция')
            fixes_log.append('competence (fixed компетенция)')

# 19. conversation
e = get_entry('conversation')
if e:
    for m in e['meanings']:
        if 'conversational' in m.get('translation', ''):
            m['translation'] = 'жанровая картина (тж. conversation piece)'
            fixes_log.append('conversation (cleaned trailing conversational header)')

# Save
with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Applied {len(fixes_log)} confirmed OCR fixes:")
for fl in fixes_log:
    print(f"  + {fl}")
