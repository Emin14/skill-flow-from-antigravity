"""
apply_all_fixes_v2.py — БЕЗОПАСНАЯ версия.

Применяет ТОЛЬКО:
1. OCR-исправления в переводах (русский текст) — по точным паттернам
2. Удаление дублей example.ru == translation
3. Trailing letter ТОЛЬКО для кириллических текстов (пример.ru, translation)
   и только явных артефактов (одиночная буква-колонка в конце кириллического текста)

НЕ ТРОГАЕТ:
- example.en — английский текст (там trailing letter может быть нормой)
- Слова без уверенного OCR-паттерна
"""
import io, json, re, time

JSON_PATH = "oxford_5000_2026-08-27.json"

# ═══════════════════════════════════════════════════════════
# OCR regex-паттерны — ТОЛЬКО для кириллических полей
# ═══════════════════════════════════════════════════════════
OCR_RU_REGEX = [
    # Потеря "сл"
    (re.compile(r'\bучайно\b'),   'случайно'),
    (re.compile(r'\bучайн'),      'случайн'),
    (re.compile(r'\bишком\b'),    'слишком'),
    (re.compile(r'\bепой\b'),     'слепой'),
    (re.compile(r'\bушайт'),      'слушайт'),
    (re.compile(r'\bедить\b'),    'следить'),
    (re.compile(r'\bожить\b'),    'сложить'),
    # Потеря "стр"
    (re.compile(r'\bахование\b'), 'страхование'),
    (re.compile(r'\bаховани'),    'страховани'),
    (re.compile(r'\bелковое\b'),  'стрелковое'),
    # Потеря "ком"
    (re.compile(r'\bпетенци'),    'компетенци'),
    # Потеря "бухг" (только отдельное слово)
    (re.compile(r'^алтер$'),      'бухгалтер'),
    # Потеря "минист" в начале строки
    (re.compile(r'^ерство\b'),    'Министерство'),
    # Слипание
    (re.compile(r'\bруказакона\b'), 'рука закона'),
    # "картин форм." → "информ."
    (re.compile(r'картин\s+форм\.'), 'информ.'),
    # Потеря "полит" (конкретный контекст)
    (re.compile(r'^ическое равновесие'), 'политическое равновесие'),
]

# ═══════════════════════════════════════════════════════════
# Trailing артефакт ТОЛЬКО для кириллического текста
# Признаки: кириллический текст, заканчивается одиночной латинской буквой
# ТОЛЬКО если перед ней — кириллическое слово (не латинская аббревиатура)
# ═══════════════════════════════════════════════════════════
CYRILLIC_TRAILING_RE = re.compile(
    r'^(.*[а-яёА-ЯЁ])\s+([A-Za-z])\s*$'
)

def fix_ocr_ru(text: str):
    changed = False
    for pat, repl in OCR_RU_REGEX:
        new = pat.sub(repl, text)
        if new != text:
            text = new
            changed = True
    return text, changed


def fix_trailing_cyrillic(text: str):
    """Убирает одиночную латинскую букву после кириллического слова."""
    m = CYRILLIC_TRAILING_RE.match(text)
    if m:
        return m.group(1).strip(), True
    return text, False


def fix_refl_in_translation(trans: str):
    if re.match(r'^refl\.?\s', trans):
        return re.sub(r'^refl\.?\s+', '', trans).strip(), True
    return trans, False


def remove_dup_examples(meaning: dict) -> int:
    """Удаляет примеры где example.ru == translation."""
    trans = meaning.get('translation', '')
    if not trans:
        return 0
    examples = meaning.get('examples', [])
    to_remove = [i for i, ex in enumerate(examples)
                 if ex.get('ru', '').strip() == trans.strip()]
    for i in reversed(to_remove):
        examples.pop(i)
    return len(to_remove)


def main():
    t0 = time.time()
    print("Loading JSON...")
    data = json.load(io.open(JSON_PATH, 'r', encoding='utf-8'))
    n_entries = len(data)
    n_meanings = sum(len(e.get('meanings',[])) for e in data)
    print(f"Loaded {n_entries} entries, {n_meanings} meanings")

    stats = dict(
        ocr_translation=0, ocr_example_ru=0,
        trailing_translation=0, trailing_example_ru=0,
        refl_removed=0, dup_removed=0,
    )
    log = []

    for entry in data:
        word = entry['word']
        for meaning in entry.get('meanings', []):
            mid = meaning['id']

            # ── Translation ──────────────────────────────
            trans = meaning.get('translation', '')

            new_trans, ch = fix_ocr_ru(trans)
            if ch:
                log.append(f"[{word} {mid}] tr OCR: '{trans[:60]}' → '{new_trans[:60]}'")
                meaning['translation'] = new_trans
                stats['ocr_translation'] += 1
                trans = new_trans

            new_trans, ch = fix_trailing_cyrillic(trans)
            if ch:
                log.append(f"[{word} {mid}] tr trail: '{trans[:60]}' → '{new_trans[:60]}'")
                meaning['translation'] = new_trans
                stats['trailing_translation'] += 1
                trans = new_trans

            new_trans, ch = fix_refl_in_translation(trans)
            if ch:
                log.append(f"[{word} {mid}] refl removed")
                meaning['translation'] = new_trans
                stats['refl_removed'] += 1

            # ── Duplicate examples ────────────────────────
            n_dup = remove_dup_examples(meaning)
            if n_dup:
                log.append(f"[{word} {mid}] {n_dup} dup example(s) removed")
                stats['dup_removed'] += n_dup

            # ── Examples — ONLY Russian text ─────────────
            for ex in meaning.get('examples', []):
                # example.ru
                txt_ru = ex.get('ru', '')
                new_ru, ch = fix_ocr_ru(txt_ru)
                if ch:
                    log.append(f"[{word} {mid}] ex.ru OCR: '{txt_ru[:50]}' → '{new_ru[:50]}'")
                    ex['ru'] = new_ru
                    stats['ocr_example_ru'] += 1
                    txt_ru = new_ru

                new_ru, ch = fix_trailing_cyrillic(txt_ru)
                if ch:
                    log.append(f"[{word} {mid}] ex.ru trail: '{txt_ru[:50]}' → '{new_ru[:50]}'")
                    ex['ru'] = new_ru
                    stats['trailing_example_ru'] += 1

                # example.en — НЕ трогаем (английский текст)

    # Save
    with io.open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    elapsed = time.time() - t0
    total = sum(stats.values())
    print(f"\nDone in {elapsed:.1f}s | Total changes: {total}")
    print("Stats:")
    for k, v in stats.items():
        if v: print(f"  {k}: {v}")

    with io.open('tmp/apply_all_v2_log.txt', 'w', encoding='utf-8') as f:
        f.write(f"APPLY ALL FIXES v2\n{'='*60}\nTotal: {total}\n")
        for k, v in stats.items():
            f.write(f"  {k}: {v}\n")
        f.write(f"\nDETAILS:\n")
        for line in log:
            f.write(f"  {line}\n")
    print(f"Log: tmp/apply_all_v2_log.txt ({len(log)} changes)")

if __name__ == "__main__":
    main()
