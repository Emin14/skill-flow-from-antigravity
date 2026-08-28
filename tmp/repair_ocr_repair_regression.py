import hashlib
import json
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
OUT_PATH = ROOT / "tmp" / "ocr_repair_regression_corrections.json"

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: JSON mirrors are not synchronized.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    by_word = {entry["word"]: entry for entry in data}
    fixes = [
        ("heat", 14, "разгорячить; горячить; раздражать", "Мюллер: heat, v 4"),
        ("review", 3, "просмотр, проверка", "Мюллер: review, n 2"),
    ]
    changes = []
    for word, meaning_id, after, source in fixes:
        meaning = by_word[word]["meanings"][meaning_id - 1]
        before = meaning["translation"]
        if before != after:
            meaning["translation"] = after
            changes.append({"word": word, "meaning_id": meaning_id, "before": before,
                            "after": after, "reason": "correct_unsafe_substring_replacement",
                            "source": source})
    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    OUT_PATH.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired meanings: {len(changes)}")

if __name__ == "__main__":
    main()
