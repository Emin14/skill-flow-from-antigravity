import hashlib
import json
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
OUT_PATH = ROOT / "tmp" / "confirmed_ocr_confusable_repairs.json"

REPLACEMENTS = [
    ("beside", 1, "translation", None, "Okoло", "Около"),
    ("Friday", 4, "translation", None, "Cтрастная", "Страстная"),
    ("horn", 1, "translation", None, "poг", "рог"),
    ("relation", 5, "translation", None, "родctво", "родство"),
    ("tenant", 1, "translation", None, "cъёмщик", "съёмщик"),
    ("through", 8, "translation", None, "cквозной", "сквозной"),
    ("translate", 5, "translation", None, "оcуществлять", "осуществлять"),
    ("worth", 2, "translation", None, "sзнать", "знать"),
    ("anything", 2, "examples.ru", 3, "далеkO", "далеко"),
    ("heat", 14, "translation", None, "орячить", "горячить"),
    ("review", 3, "translation", None, "мотр, проверка", "смотр, проверка"),
]

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: JSON mirrors are not synchronized.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    by_word = {entry["word"]: entry for entry in data}
    changes = []
    for word, meaning_id, field, example_index, old, new in REPLACEMENTS:
        meaning = by_word[word]["meanings"][meaning_id - 1]
        if field == "translation":
            holder, key = meaning, "translation"
        else:
            holder, key = meaning["examples"][example_index], "ru"
        before = holder[key]
        after = before.replace(old, new)
        if after == before:
            continue
        holder[key] = after
        changes.append({"word": word, "meaning_id": meaning_id, "field": field,
                        "example_index": example_index, "before": before, "after": after,
                        "reason": "latin_cyrillic_ocr_confusable_or_lost_initial_letter"})
    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    previous = json.loads(OUT_PATH.read_text(encoding="utf-8")) if OUT_PATH.exists() else []
    OUT_PATH.write_text(json.dumps(previous + changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired fields: {len(changes)}")

if __name__ == "__main__":
    main()
