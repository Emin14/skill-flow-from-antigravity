import json
import re
from pathlib import Path

from audit_meanings import DATA_PATH

ROOT = Path(__file__).resolve().parents[1]
OUT_PATH = ROOT / "tmp" / "inline_english_russian_pair_candidates.json"

def pair_from_clause(clause):
    clause = clause.strip()
    if not re.match(r"(?:[A-Za-z£]|\([^А-Яа-яЁё]*[A-Za-z])", clause):
        return None
    first_cyr = re.search(r"[А-Яа-яЁё]", clause)
    if not first_cyr:
        return None
    en = clause[:first_cyr.start()].strip(" ,:;")
    ru = clause[first_cyr.start():].strip()
    # Prevent valency labels such as ``for — за`` from being treated as
    # examples. A sentence/phrase must have two English lexical words, or a
    # currency amount followed by an English verb phrase.
    english_words = re.findall(r"[A-Za-z]{2,}", en)
    if len(english_words) < 2 and not (en.startswith("£") and english_words):
        return None
    if not ru or not re.search(r"[А-Яа-яЁё]", ru):
        return None
    return en, ru

def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    found = []
    for entry in data:
        for meaning in entry["meanings"]:
            for index, clause in enumerate(meaning["translation"].split(";")):
                pair = pair_from_clause(clause)
                if pair:
                    found.append({"word": entry["word"], "meaning_id": meaning["id"],
                                  "clause_index": index, "translation": meaning["translation"],
                                  "en": pair[0], "ru": pair[1]})
    OUT_PATH.write_text(json.dumps(found, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"candidates: {len(found)}")
    for item in found[:300]:
        print(json.dumps(item, ensure_ascii=False))

if __name__ == "__main__":
    main()
