import hashlib
import json
from pathlib import Path

from audit_meanings import DATA_PATH, CHANGES_PATH, build_source_map, apply_repairs

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
INDEX_PATH = ROOT / "scripts" / "parsed_index.json"

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    if digest(DATA_PATH) != digest(MIRROR_PATH):
        raise SystemExit("Refusing repair: the two JSON files are not synchronized before the repair.")
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    changes = apply_repairs(data, build_source_map(index))
    previous = []
    if CHANGES_PATH.exists():
        previous = json.loads(CHANGES_PATH.read_text(encoding="utf-8"))
    encoded = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(encoded, encoding="utf-8")
    MIRROR_PATH.write_text(encoded, encoding="utf-8")
    CHANGES_PATH.write_text(json.dumps(previous + changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repaired fields: {len(changes)}")
    print(f"Individual confirmed word joins: {sum(len(c['repairs']) for c in changes)}")

if __name__ == "__main__":
    main()
