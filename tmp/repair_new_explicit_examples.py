import hashlib
import json
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
OUT_PATH = ROOT / "tmp" / "new_explicit_example_repairs.json"

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def add_example(meaning, en, ru):
    pair = {"en": en, "ru": ru}
    if pair not in meaning["examples"]:
        meaning["examples"].append(pair)

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: JSON mirrors are not synchronized.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    by_word = {entry["word"]: entry for entry in data}
    changes = []

    famous = by_word["glorious"]["meanings"][0]
    before = famous["translation"]
    after = before.replace("авный; знаменитый", "славный; знаменитый")
    if after != before:
        famous["translation"] = after
        changes.append({"word": "glorious", "meaning_id": 1, "before": before, "after": after,
                        "reason": "lost_initial_cyrillic_letter", "source_keys": ["glorious"]})

    corrections = [
        (2, "ехать, путешествовать", "I shall go to France", "я поеду во Францию"),
        (20, "расходоваться, тратиться", "£200 went on a new coat", "200 фунтов ушло на новое пальто"),
        (26, "доходить до (какого-либо предела; to)", "the price went as high as £100", "цена дошла до 100 фунтов"),
    ]
    for meaning_id, translation, en, ru in corrections:
        meaning = by_word["go"]["meanings"][meaning_id - 1]
        before = meaning["translation"]
        add_example(meaning, en, ru)
        if before != translation:
            meaning["translation"] = translation
            changes.append({"word": "go", "meaning_id": meaning_id, "before": before,
                            "after": translation, "moved_to_examples": [{"en": en, "ru": ru}],
                            "reason": "inline_english_example_in_translation", "source_keys": ["go"]})

    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    previous = json.loads(OUT_PATH.read_text(encoding="utf-8")) if OUT_PATH.exists() else []
    OUT_PATH.write_text(json.dumps(previous + changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired meanings: {len(changes)}")

if __name__ == "__main__":
    main()
