import hashlib
import json
import re
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
OUT_PATH = ROOT / "tmp" / "remaining_inline_example_repairs.json"

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def split_embedded_example(clause):
    latin = re.search(r"[A-Za-z]", clause)
    if not latin:
        return None
    cyr = re.search(r"[А-Яа-яЁё]", clause[latin.start():])
    if not cyr:
        return None
    cyr_pos = latin.start() + cyr.start()
    en = clause[latin.start():cyr_pos].strip()
    if not en.endswith(("!", "?")):
        return None
    ru = clause[cyr_pos:].strip()
    if not ru:
        return None
    return clause[:latin.start()].rstrip(), en, ru

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: JSON mirrors are not synchronized.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    changes = []
    for entry in data:
        for meaning in entry["meanings"]:
            before = meaning["translation"]
            clauses = [part.strip() for part in before.split(";")]
            retained, added = [], []
            for clause in clauses:
                split = split_embedded_example(clause)
                if split is None:
                    retained.append(clause)
                    continue
                prefix, en, ru = split
                if prefix:
                    retained.append(prefix.rstrip(":"))
                added.append({"en": en, "ru": ru})
            after = "; ".join(part for part in retained if part)
            existing = {(ex.get("en"), ex.get("ru")) for ex in meaning.get("examples", [])}
            new_examples = [ex for ex in added if (ex["en"], ex["ru"]) not in existing]
            if after != before and new_examples:
                meaning["translation"] = after
                meaning["examples"].extend(new_examples)
                changes.append({"word": entry["word"], "meaning_id": meaning["id"],
                                "before": before, "after": after,
                                "moved_to_examples": new_examples,
                                "reason": "embedded_english_example_in_translation"})
    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    OUT_PATH.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired meanings: {len(changes)}")
    print(f"Extracted examples: {sum(len(c['moved_to_examples']) for c in changes)}")

if __name__ == "__main__":
    main()
