import hashlib
import json
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
OUT_PATH = ROOT / "tmp" / "empty_meaning_repairs.json"

FIXES = {
    ("clock", 2): ("который час?", None),
    ("else", 1): ("ещё, кроме", {"en": "(c pron indef", "ru": "и pron inter) ещё, кроме"}),
    ("off", 28): ("прочь!, вон!", {"en": "to off it уйти, смыться 6. int прочь!", "ru": ", вон!"}),
    ("pretty", 4): ("моя прелесть! (в обращении)", None),
    ("rat", 5): ("вздор!, чепуха!", None),
    ("wheel", 10): ("правое (левое) плечо вперёд!", None),
    ("why", 1): ("почему?", {"en": "inter.", "ru": "почему?"}),
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: JSON mirrors are not synchronized.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    words = {entry["word"]: entry for entry in data}
    changes = []
    for (word, meaning_id), (translation, remove_example) in FIXES.items():
        meaning = words[word]["meanings"][meaning_id - 1]
        before = meaning["translation"]
        meaning["translation"] = translation
        if remove_example:
            meaning["examples"] = [ex for ex in meaning["examples"] if ex != remove_example]
        changes.append({"word": word, "meaning_id": meaning_id, "before": before,
                        "after": translation, "reason": "restore_nonempty_sense_translation"})
    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    OUT_PATH.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired meanings: {len(changes)}")

if __name__ == "__main__":
    main()
