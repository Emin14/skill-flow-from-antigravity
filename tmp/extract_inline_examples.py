import hashlib
import json
import re
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
OUT_PATH = ROOT / "tmp" / "inline_example_repairs.json"

INLINE = re.compile(r"^\s*([A-Za-z][^;!?]*[!?])\s*(.*?)\s*$")

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def has_cyrillic(text):
    return bool(re.search(r"[А-Яа-яЁё]", text))

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: JSON mirrors are not synchronized.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    changes = []
    for entry in data:
        for meaning in entry["meanings"]:
            before = meaning["translation"]
            clauses = [part.strip() for part in before.split(";")]
            retained = []
            added = []
            i = 0
            while i < len(clauses):
                clause = clauses[i]
                match = INLINE.match(clause)
                if not match:
                    retained.append(clause)
                    i += 1
                    continue
                en, ru = match.groups()
                if has_cyrillic(ru):
                    added.append({"en": en.strip(), "ru": ru.strip()})
                    i += 1
                    continue
                # The source frequently prints an imperative English example
                # in one semicolon chunk and its Russian counterpart(s) in the
                # next chunk(s). Consume only punctuated Russian continuations.
                following = []
                j = i + 1
                while j < len(clauses) and has_cyrillic(clauses[j]) and not re.search(r"[A-Za-z]", clauses[j]) and re.search(r"[!?]$", clauses[j]):
                    following.append(clauses[j])
                    j += 1
                if following:
                    added.append({"en": en.strip(), "ru": "; ".join(following)})
                    i = j
                    continue
                retained.append(clause)
                i += 1
            after = "; ".join(part for part in retained if part)
            # Avoid creating duplicate examples from a pre-existing correctly
            # extracted context.
            existing = {(ex.get("en"), ex.get("ru")) for ex in meaning.get("examples", [])}
            new_examples = [ex for ex in added if (ex["en"], ex["ru"]) not in existing]
            if after != before and new_examples:
                meaning["translation"] = after
                meaning["examples"].extend(new_examples)
                changes.append({"word": entry["word"], "meaning_id": meaning["id"],
                                "before": before, "after": after,
                                "moved_to_examples": new_examples,
                                "reason": "inline_english_example_in_translation"})
    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    OUT_PATH.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired meanings: {len(changes)}")
    print(f"Extracted examples: {sum(len(c['moved_to_examples']) for c in changes)}")

if __name__ == "__main__":
    main()
