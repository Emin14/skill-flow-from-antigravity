import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "oxford_5000_2026-08-27.json"
MIRROR = ROOT / "src" / "data" / "oxford_5000.json"
INPUT = ROOT / "tmp" / "source_confirmed_parenthetical_example_repairs.json"
OUT = ROOT / "tmp" / "reverted_parenthetical_example_pass.json"


def main():
    changes = json.loads(INPUT.read_text(encoding="utf-8"))
    data = json.loads(DATA.read_text(encoding="utf-8"))
    lookup = {
        (entry["word"], meaning["id"]): meaning
        for entry in data
        for meaning in entry["meanings"]
    }
    reverted = []
    for change in changes:
        meaning = lookup[(change["word"], change["meaning_id"])]
        meaning["translation"] = change["before"]
        for addition in change["examples_added"]:
            # The addition was appended by this pass; remove just one equal
            # object, leaving every preceding, valid example untouched.
            for index in range(len(meaning.get("examples", [])) - 1, -1, -1):
                if meaning["examples"][index] == addition:
                    meaning["examples"].pop(index)
                    break
        reverted.append({"word": change["word"], "meaning_id": change["meaning_id"]})
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA.write_text(text, encoding="utf-8")
    MIRROR.write_text(text, encoding="utf-8")
    OUT.write_text(json.dumps(reverted, ensure_ascii=False, indent=2), encoding="utf-8")
    print(len(reverted))


if __name__ == "__main__":
    main()
