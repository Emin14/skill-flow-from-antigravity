"""
apply_all_fixes.py — применяет ВСЕ исправления из всех батчей аудита.

Стратегия:
1. Загружает все JSON-файлы аудита (tmp/audit_*.json)
2. Применяет OCR-исправления через regex (только надёжные паттерны)
3. Удаляет примеры, где example.ru == translation (дубли)
4. Сохраняет изменённый JSON
"""
import io, json, re, glob, time
from collections import defaultdict

JSON_PATH = "oxford_5000_2026-08-27.json"

# Глобальные OCR regex-паттерны (надёжные — без ложных срабатываний)
OCR_REGEX = [
    # Потеря "сл" в начале слова
    (re.compile(r'\bучайно\b'),  'случайно'),
    (re.compile(r'\bучайн'),     'случайн'),
    (re.compile(r'\bишком\b'),   'слишком'),
    (re.compile(r'\bепой\b'),    'слепой'),
    (re.compile(r'\bушайт'),     'слушайт'),
    (re.compile(r'\bедить\b'),   'следить'),
    (re.compile(r'\bожить\b'),   'сложить'),
    # Потеря "стр" в начале слова
    (re.compile(r'\bахование\b'), 'страхование'),
    (re.compile(r'\bаховани'),    'страховани'),
    (re.compile(r'\bелковое\b'),  'стрелковое'),
    # Потеря "ком"
    (re.compile(r'\bпетенци'),    'компетенци'),
    # Потеря "бухг"
    (re.compile(r'^алтер$'),      'бухгалтер'),
    # Потеря "минист" в начале
    (re.compile(r'^ерство\b'),    'Министерство'),
    # OCR слипание слов
    (re.compile(r'\bруказакона\b'), 'рука закона'),
    # Артефакт "картин форм."
    (re.compile(r'картин\s+форм\.'), 'информ.'),
    # Потеря "полит" (в контексте "ическое")
    (re.compile(r'^ическое (?=равновесие)'), 'политическое '),
]

# Trailing letter artifact (одиночная буква в конце)
TRAILING_RE = re.compile(r'\s+([A-Za-z])\s*$')
ABBREV_RE = re.compile(r'\b[A-Z]\.\s*$')  # аббревиатура, не трогать

# Trailing next-article header (частый паттерн: русский текст + латинское слово [...]...)
TRAILING_HEADER_RE = re.compile(
    r'\s+[A-Za-z][A-Za-z\'\-]+\s*(?:[\[\(].*?[\]\)])?\s*[nva]\s*$'
)


def fix_ocr(text: str) -> tuple[str, int]:
    """Применяет OCR-исправления. Возвращает (новый текст, кол-во замен)."""
    changes = 0
    for pat, repl in OCR_REGEX:
        new = pat.sub(repl, text)
        if new != text:
            changes += 1
            text = new
    return text, changes


def fix_trailing(text: str) -> tuple[str, bool]:
    """Убирает trailing одиночную букву или заголовок следующей статьи."""
    # Не трогаем аббревиатуры вида "A.", "В.", "U.S.A."
    if ABBREV_RE.search(text):
        return text, False
    # Убираем trailing заголовок следующей статьи
    m = TRAILING_HEADER_RE.search(text)
    if m:
        return text[:m.start()].strip(), True
    # Убираем одиночную букву
    m = TRAILING_RE.search(text)
    if m:
        # Не трогаем: "refl.", "fig.", "etc.", цифры+буква, Dr X
        prev = text[:m.start()]
        if re.search(r'\b(Dr|Mr|Mrs|Ms|Prof|Fig|Pl)\s*$', prev):
            return text, False
        return text[:m.start()].strip(), True
    return text, False


def fix_refl_in_translation(trans: str) -> tuple[str, bool]:
    """Убирает refl. из начала translation."""
    if re.match(r'^refl\.?\s', trans):
        return re.sub(r'^refl\.?\s+', '', trans).strip(), True
    return trans, False


def remove_duplicate_examples(meaning: dict) -> int:
    """Удаляет примеры, где example.ru == translation. Возвращает кол-во удалённых."""
    trans = meaning.get('translation', '')
    if not trans:
        return 0
    examples = meaning.get('examples', [])
    to_remove = [i for i, ex in enumerate(examples) if ex.get('ru', '').strip() == trans.strip()]
    # Удаляем в обратном порядке, чтобы не сбивать индексы
    for i in reversed(to_remove):
        examples.pop(i)
    return len(to_remove)


def main():
    t0 = time.time()
    print("Loading JSON...")
    data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
    print(f"Loaded {len(data)} entries, {sum(len(e.get('meanings',[])) for e in data)} meanings")

    stats = {
        'ocr_translation': 0,
        'ocr_example_ru': 0,
        'ocr_example_en': 0,
        'trailing_translation': 0,
        'trailing_example_ru': 0,
        'trailing_example_en': 0,
        'refl_removed': 0,
        'dup_examples_removed': 0,
    }
    detail_log = []

    for entry in data:
        word = entry['word']
        for meaning in entry.get('meanings', []):
            mid = meaning['id']
            trans = meaning.get('translation', '')

            # OCR fix in translation
            new_trans, n = fix_ocr(trans)
            if n:
                detail_log.append(f"[{word} mid={mid}] translation OCR: '{trans[:60]}' -> '{new_trans[:60]}'")
                meaning['translation'] = new_trans
                stats['ocr_translation'] += n
                trans = new_trans

            # Trailing in translation
            new_trans, changed = fix_trailing(trans)
            if changed:
                detail_log.append(f"[{word} mid={mid}] translation trailing: '{trans[:60]}' -> '{new_trans[:60]}'")
                meaning['translation'] = new_trans
                stats['trailing_translation'] += 1
                trans = new_trans

            # refl. in translation
            new_trans, changed = fix_refl_in_translation(trans)
            if changed:
                detail_log.append(f"[{word} mid={mid}] refl removed from translation")
                meaning['translation'] = new_trans
                stats['refl_removed'] += 1

            # Remove duplicate examples
            removed = remove_duplicate_examples(meaning)
            if removed:
                detail_log.append(f"[{word} mid={mid}] removed {removed} dup example(s)")
                stats['dup_examples_removed'] += removed

            # OCR + trailing fix in examples
            for ex in meaning.get('examples', []):
                for fld, stat_key in [('ru', 'ocr_example_ru'), ('en', 'ocr_example_en')]:
                    txt = ex.get(fld, '')
                    new_txt, n = fix_ocr(txt)
                    if n:
                        detail_log.append(f"[{word} mid={mid}] example.{fld} OCR: '{txt[:50]}' -> '{new_txt[:50]}'")
                        ex[fld] = new_txt
                        stats[stat_key] += n
                        txt = new_txt

                    trail_key = f'trailing_example_{fld}'
                    new_txt, changed = fix_trailing(txt)
                    if changed:
                        detail_log.append(f"[{word} mid={mid}] example.{fld} trailing: '{txt[:50]}' -> '{new_txt[:50]}'")
                        ex[fld] = new_txt
                        stats[trail_key] += 1

    # Save
    print(f"\nSaving to {JSON_PATH}...")
    with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    elapsed = time.time() - t0
    total_changes = sum(stats.values())
    print(f"Done in {elapsed:.1f}s | Total changes: {total_changes}")
    print("\nStats:")
    for k, v in stats.items():
        if v: print(f"  {k}: {v}")

    # Write full log
    with io.open('tmp/apply_all_fixes_log.txt', 'w', encoding='utf-8') as f:
        f.write(f"APPLY ALL FIXES LOG\n{'='*60}\n")
        f.write(f"Total changes: {total_changes}\n")
        f.write(f"Stats:\n")
        for k, v in stats.items():
            f.write(f"  {k}: {v}\n")
        f.write(f"\nDETAILS ({len(detail_log)} changes):\n")
        for line in detail_log:
            f.write(f"  {line}\n")
    print(f"Log: tmp/apply_all_fixes_log.txt")

if __name__ == "__main__":
    main()
