import hashlib
import json
import re
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
CANDIDATES_PATH = ROOT / "tmp" / "residual_corruption_candidates.json"
OUT_PATH = ROOT / "tmp" / "confirmed_residual_repairs.json"
CYR = "А-Яа-яЁё"

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def get_value(entry, rec):
    meaning = entry["meanings"][rec["meaning_id"] - 1]
    if rec["field"] == "translation":
        return meaning, "translation"
    return meaning["examples"][rec["example_index"]], "ru"

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: JSON mirrors are not synchronized.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    by_word = {entry["word"]: entry for entry in data}
    records = json.loads(CANDIDATES_PATH.read_text(encoding="utf-8"))
    changes = []
    for rec in records:
        # This field lost a letter as well as a boundary; it is repaired from
        # the source in a separate explicit correction below.
        if rec["word"] == "wet" and rec.get("meaning_id") == 7:
            continue
        container, key = get_value(by_word[rec["word"]], rec)
        before = container[key]
        after = before
        reasons = []
        for candidate in rec["candidates"]:
            if "after" in candidate:
                after = after.replace(candidate["before"], candidate["after"])
                reasons.append({"class": "missing_word_space", **candidate})
            elif candidate.get("kind") == "hyphen_space":
                repaired = re.sub(rf"([{CYR}])-\s+([{CYR}])", r"\1\2", after)
                if repaired != after:
                    after = repaired
                    reasons.append({"class": "line_break_hyphen"})
        if after != before:
            container[key] = after
            change = {k: rec[k] for k in ("word", "meaning_id", "field", "example_index") if k in rec}
            change.update({"before": before, "after": after, "repairs": reasons})
            changes.append(change)

    # Source text: "штат, в котором разрешена продажа спиртных напитков".
    wet = by_word["wet"]["meanings"][6]["examples"][0]
    before = wet["ru"]
    after = "штат, в котором разрешена продажа спиртных напитков"
    if before != after:
        wet["ru"] = after
        changes.append({"word": "wet", "meaning_id": 7, "example_index": 0,
                        "field": "examples.ru", "before": before, "after": after,
                        "repairs": [{"class": "lost_letters_and_word_space",
                                     "source_keys": ["wet"]}]})

    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    OUT_PATH.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired fields: {len(changes)}")
    print(f"Individual repair operations: {sum(len(c['repairs']) for c in changes)}")

if __name__ == "__main__":
    main()
