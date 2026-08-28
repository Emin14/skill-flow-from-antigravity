"""
apply_fixes_batch2.py — надёжная версия через regex-поиск.
Каждое исправление описано паттерном (regex) для поиска и заменой.
Это позволяет не зависеть от точной строки.
"""
import io, json, re

JSON_PATH = "oxford_5000_2026-08-27.json"

# Формат: (word, meaning_id, field, search_pattern_regex, replacement_func_or_str)
# replacement: строка (точная замена) или callable(old) -> new
REGEX_FIXES = [
    # bomb [14] translation — trailing article header after частицами
    ('bomb', 14, 'translation',
     r'(\S.*?частицами)\s+bombardier\s+\S+\s*\]?\s*n\s*$',
     lambda m: m.group(1)),

    # born [1] example.ru: "епой от рождения" -> "слепой от рождения"
    ('born', 1, 'example.ru',
     r'^епой',
     lambda m: 'слепой'),

    # capacity [4] translation: "петенция" -> "компетенция"
    ('capacity', 4, 'translation',
     r'^петенци',
     lambda m: 'компетенци'),

    # casual [1] translation: "учайный" -> "случайный"
    ('casual', 1, 'translation',
     r'^учайны',
     lambda m: 'случайны'),

    # casual [3] translation: "учайный, нерег..." -> "случайный, нерег..."
    ('casual', 3, 'translation',
     r'^учайны',
     lambda m: 'случайны'),

    # chance [1] example.ru: "учайно" -> "случайно"
    ('chance', 1, 'example.ru',
     r'^учайно$',
     lambda m: 'случайно'),

    # chance [5] translation: "учайный" -> "случайный"
    ('chance', 5, 'translation',
     r'^учайны',
     lambda m: 'случайны'),

    # coincidence [2] translation: "учайное стечение" -> "случайное стечение"
    ('coincidence', 2, 'translation',
     r'^учайное',
     lambda m: 'случайное'),

    # colonial [1] example.ru: "ерство колоний" -> "Министерство колоний"
    ('colonial', 1, 'example.ru',
     r'^ерство',
     lambda m: 'Министерство'),

    # come [10] example.ru: "учайно обнаружить" -> "случайно обнаружить"
    ('come', 10, 'example.ru',
     r'^учайно',
     lambda m: 'случайно'),

    # compensate [4] translation — trailing "compensation [...]"
    ('compensate', 4, 'translation',
     r'(поддерживать устойчивость валюты)\s+compensation\b.*$',
     lambda m: m.group(1)),

    # competence [4] translation: "петенция, правомочность" -> "компетенция..."
    ('competence', 4, 'translation',
     r'^петенци',
     lambda m: 'компетенци'),

    # conversation [3] translation — trailing "conversational [...]"
    ('conversation', 3, 'translation',
     r'(жанровая картина \(тж\. conversation piece\))\s+conversational\b.*$',
     lambda m: m.group(1)),
]

# Дубликаты: (word, meaning_id, ru_text_of_dup_example)
DUPS_BATCH2 = [
    ('book',          2,  'Библия'),
    ('boot',          5,  'увольнение (с работы)'),
    ('born',          2,  'прирождённый'),
    ('break',         4,  'рассвет'),
    ('buddy',         1,  'коляска мотоцикла'),
    ('bus',           4,  'ехать в автобусе, омнибусе'),
    ('cabinet',       3,  'кабинет министров, правительство'),
    ('capital',       7,  'прописная буква'),
    ('cease',         3,  'непрестанно'),
    ('certain',       4,  'удостовериться в'),
    ('cheap',         6,  'по невысокой цене, по дешёвке'),
    ('clock',         2,  'который час?'),
    ('collective',    2,  'имя существительное собирательное'),
    ('congregation',  2,  'университетский совет'),
    ('conservative',  3,  'относящийся к консервативной партии'),
    ('conservative',  6,  'член консервативной партии'),
    ('constitutional', 3, 'формула строения, структурная формула'),
]


def apply_regex_fix(text, pattern, replacement_func):
    m = re.search(pattern, text, re.DOTALL)
    if m:
        if callable(replacement_func):
            new_text = text[:m.start()] + replacement_func(m) + text[m.end():]
        else:
            new_text = replacement_func
        return new_text, True
    return text, False


def main():
    print("Loading JSON...")
    data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
    word_index = {e['word']: i for i, e in enumerate(data)}

    applied = []
    skipped = []

    # Apply regex fixes
    for (word, mid, field, pattern, repl) in REGEX_FIXES:
        if word not in word_index:
            skipped.append(f"[{word}] not found in JSON")
            continue
        entry = data[word_index[word]]
        meaning = next((m for m in entry.get('meanings', []) if m['id'] == mid), None)
        if not meaning:
            skipped.append(f"[{word} mid={mid}] meaning not found")
            continue

        if field == 'translation':
            old = meaning.get('translation', '')
            new, ok = apply_regex_fix(old, pattern, repl)
            if ok:
                meaning['translation'] = new
                applied.append(f"[{word} mid={mid}] translation: '{old[:50]}' -> '{new[:50]}'")
            else:
                skipped.append(f"[{word} mid={mid}] translation pattern not matched in: '{old[:60]}'")

        elif field.startswith('example.'):
            sub = field.split('.')[1]
            fixed = False
            for ex in meaning.get('examples', []):
                old = ex.get(sub, '')
                new, ok = apply_regex_fix(old, pattern, repl)
                if ok:
                    ex[sub] = new
                    applied.append(f"[{word} mid={mid}] {field}: '{old[:50]}' -> '{new[:50]}'")
                    fixed = True
                    break
            if not fixed:
                skipped.append(f"[{word} mid={mid}] {field} pattern not matched")

    # Remove duplicate examples
    dup_applied = []
    dup_skipped = []
    for (word, mid, ru_text) in DUPS_BATCH2:
        if word not in word_index:
            dup_skipped.append(f"[{word}] not found")
            continue
        entry = data[word_index[word]]
        meaning = next((m for m in entry.get('meanings', []) if m['id'] == mid), None)
        if not meaning:
            dup_skipped.append(f"[{word} mid={mid}] meaning not found")
            continue
        examples = meaning.get('examples', [])
        trans = meaning.get('translation', '')
        removed = False
        for i, ex in enumerate(examples):
            if ex.get('ru') == ru_text:
                examples.pop(i)
                dup_applied.append(f"[{word} mid={mid}] removed example ru='{ru_text[:40]}'")
                removed = True
                break
        if not removed:
            dup_skipped.append(f"[{word} mid={mid}] example ru='{ru_text[:40]}' not found")

    print(f"\nRegex fixes applied: {len(applied)}, skipped: {len(skipped)}")
    print(f"Dups removed: {len(dup_applied)}, skipped: {len(dup_skipped)}")

    if skipped:
        print("\nSkipped regex fixes:")
        for s in skipped:
            print(f"  {s}")
    if dup_skipped:
        print("\nSkipped dup removes:")
        for s in dup_skipped:
            print(f"  {s}")

    with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("\nSaved.")

    # Write log
    with io.open('tmp/apply_batch2_log.txt', 'w', encoding='utf-8') as f:
        f.write("APPLIED:\n")
        for s in applied: f.write(f"  {s}\n")
        f.write("\nSKIPPED:\n")
        for s in skipped: f.write(f"  {s}\n")
        f.write("\nDUP APPLIED:\n")
        for s in dup_applied: f.write(f"  {s}\n")
        f.write("\nDUP SKIPPED:\n")
        for s in dup_skipped: f.write(f"  {s}\n")
    print("Log: tmp/apply_batch2_log.txt")

if __name__ == "__main__":
    main()
