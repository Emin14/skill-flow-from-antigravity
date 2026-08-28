"""Верификация применённых исправлений."""
import io
import json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
out = io.open('tmp/verify_fixes.txt', 'w', encoding='utf-8')

def get_entry(word):
    for e in data:
        if e['word'] == word:
            return e
    return None

checks = [
    # (word, meaning_id, field, expected_value)
    ('a', 6, 'example.ru', 'некий мистер Генри Грин'),
    ('a', 7, 'translation', 'апостериори, из опыта, по опыту'),
    ('abandon', 3, 'translation', 'развязность, несдержанность'),
    ('ability', 5, 'translation', 'компетенция'),
    ('access', 4, 'translation', 'выборка (из памяти); доступ (к базе данных)'),
    ('accident', 1, 'example.ru[0]', 'случайно, нечаянно'),
    ('accident', 4, 'translation', 'случайное свойство'),
    ('accident', 5, 'example.ru[0]', 'страхование от несчастных случаев'),
    ('accidentally', 1, 'translation', 'случайно; непредумышленно'),
    ('accountant', 1, 'translation', 'бухгалтер'),
    ('adapt', 4, 'translation', 'приспосабливаться, применяться'),
    ('agriculture', 1, 'example.ru[0]', 'Министерство земледелия (в Англии)'),
    ('assurance', 3, 'translation', 'страхование'),
    ('attend', 5, 'example.ru[0]', 'слушайте!, будьте внимательны!'),
    ('balance', 2, 'example.ru[1]', 'политическое равновесие (между государствами)'),
    ('beyond', 4, 'example.ru[6]', 'слишком трудно'),
    ('blanket', 1, 'partOfSpeech', 'noun'),
    ('blanket', 4, 'partOfSpeech', 'noun'),
    ('blind', 1, 'partOfSpeech', 'adjective'),
    ('blind', 1, 'translation', 'слепой'),
    ('blind', 7, 'partOfSpeech', 'adjective'),
    ('arm', 6, 'example.ru[0]', 'стрелковое оружие'),
]

all_ok = True
for check in checks:
    word, mid, field, expected = check
    entry = get_entry(word)
    if not entry:
        out.write(f"FAIL [{word} mid={mid}] {field}: entry not found\n")
        all_ok = False
        continue
    
    meaning = next((m for m in entry.get('meanings', []) if m['id'] == mid), None)
    if not meaning:
        out.write(f"FAIL [{word} mid={mid}] {field}: meaning not found\n")
        all_ok = False
        continue
    
    if field == 'translation':
        got = meaning.get('translation', '')
        ok = got == expected
        status = 'OK  ' if ok else 'FAIL'
        out.write(f"{status} [{word} mid={mid}] translation: got='{got}' expected='{expected}'\n")
        if not ok:
            all_ok = False
    
    elif field == 'partOfSpeech':
        got = meaning.get('partOfSpeech', '')
        ok = got == expected
        status = 'OK  ' if ok else 'FAIL'
        out.write(f"{status} [{word} mid={mid}] partOfSpeech: got='{got}' expected='{expected}'\n")
        if not ok:
            all_ok = False
    
    elif field.startswith('example.ru'):
        examples = meaning.get('examples', [])
        if '[' in field:
            idx = int(field.split('[')[1].rstrip(']'))
            if idx < len(examples):
                got = examples[idx].get('ru', '')
                ok = got == expected
                status = 'OK  ' if ok else 'FAIL'
                out.write(f"{status} [{word} mid={mid}] example[{idx}].ru: got='{got}'\n")
                if not ok:
                    out.write(f"       expected='{expected}'\n")
                    all_ok = False
            else:
                out.write(f"FAIL [{word} mid={mid}] example[{idx}].ru: only {len(examples)} examples\n")
                all_ok = False
        else:
            # Check first example
            if examples:
                got = examples[0].get('ru', '')
                ok = got == expected
                status = 'OK  ' if ok else 'FAIL'
                out.write(f"{status} [{word} mid={mid}] example[0].ru: got='{got}'\n")
                if not ok:
                    out.write(f"       expected='{expected}'\n")
                    all_ok = False
            else:
                out.write(f"FAIL [{word} mid={mid}] example.ru: no examples\n")
                all_ok = False

out.write(f"\n{'='*50}\n")
out.write(f"All checks passed: {all_ok}\n")
out.close()

print("Verification done. All OK:", all_ok)
print("Details: tmp/verify_fixes.txt")
