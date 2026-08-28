import json
import re
from collections import defaultdict
from pathlib import Path

from wordfreq import zipf_frequency
from audit_meanings import DATA_PATH, INDEX_PATH, base_word, build_source_map

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tmp" / "source_confirmed_lost_suffix_candidates.json"
CYR = "А-Яа-яЁё"


def splits(raw):
    return set(re.findall(rf"(?<![{CYR}])([{CYR}]{{3,}})(?:\u00ad|-)[ \t]*\n[ \t]*([{CYR}]{{1,}})(?![{CYR}])", raw, re.I))


def candidates(value, raw_parts):
    found = []
    for left, right in raw_parts:
        # A short, rare standalone prefix where the source explicitly
        # continues that same word on the next line is high-confidence OCR
        # loss.  Do not touch ordinary words or existing complete forms.
        if zipf_frequency(left.lower(), "ru") >= 2.0:
            continue
        if re.search(rf"(?<![{CYR}]){re.escape(left + right)}(?![{CYR}])", value, re.I):
            continue
        if re.search(rf"(?<![{CYR}]){re.escape(left)}(?![{CYR}])", value, re.I):
            found.append({"before": left, "after": left + right})
    return found


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    sources = build_source_map(json.loads(INDEX_PATH.read_text(encoding="utf-8")))
    report = []
    for entry in data:
        raw_parts = set().union(*(splits(raw) for _, raw in sources.get(base_word(entry["word"]), [])))
        if not raw_parts:
            continue
        for meaning in entry["meanings"]:
            for field, value in [("translation", meaning["translation"])]:
                hits = candidates(value, raw_parts)
                if hits:
                    report.append({"word": entry["word"], "meaning_id": meaning["id"], "field": field, "value": value, "hits": hits})
            for index, example in enumerate(meaning.get("examples", [])):
                hits = candidates(example["ru"], raw_parts)
                if hits:
                    report.append({"word": entry["word"], "meaning_id": meaning["id"], "example_index": index, "field": "examples.ru", "value": example["ru"], "hits": hits})
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"records": len(report)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
