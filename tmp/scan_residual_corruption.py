import json
import re
from collections import defaultdict
from pathlib import Path

from wordfreq import zipf_frequency
from audit_meanings import DATA_PATH, build_source_map, base_word

ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "scripts" / "parsed_index.json"
OUT_PATH = ROOT / "tmp" / "residual_corruption_candidates.json"
CYR = "А-Яа-яЁё"

def source_has_words(raw, left, right):
    # A trailing source hyphen means that ``right`` itself is truncated, so it
    # cannot prove a boundary after the target token (e.g. ``за рабо-\nту``).
    return re.search(rf"(?<![{CYR}\u00ad]){re.escape(left)}[ \t]+{re.escape(right)}(?![{CYR}\-\u00ad])", raw, re.I) is not None

def joins_from_unlikely_token(value, raws):
    candidates = []
    for token_match in re.finditer(rf"(?<![{CYR}])([{CYR}]{{6,}})(?![{CYR}])", value):
        token = token_match.group(1)
        if zipf_frequency(token.lower(), "ru") > 1.5:
            continue
        for i in range(2, len(token) - 1):
            left, right = token[:i], token[i:]
            if (zipf_frequency(left.lower(), "ru") < 2.2 or
                    zipf_frequency(right.lower(), "ru") < 2.2):
                continue
            evidence = [key for key, raw in raws if source_has_words(raw, left, right)]
            if evidence:
                candidates.append({"before": token, "after": f"{left} {right}",
                                   "source_keys": sorted(set(evidence))})
    return candidates

def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    sources = build_source_map(index)
    records = []
    for entry in data:
        raws = sources.get(base_word(entry["word"]), [])
        for meaning in entry.get("meanings", []):
            for field, value in [("translation", meaning.get("translation", ""))]:
                join_candidates = joins_from_unlikely_token(value, raws)
                if join_candidates:
                    records.append({"word": entry["word"], "meaning_id": meaning["id"],
                                    "field": field, "value": value,
                                    "candidates": join_candidates})
                if re.search(rf"[{CYR}]-\s+[{CYR}]", value):
                    records.append({"word": entry["word"], "meaning_id": meaning["id"],
                                    "field": field, "value": value,
                                    "candidates": [{"kind": "hyphen_space"}]})
            for i, ex in enumerate(meaning.get("examples", [])):
                value = ex.get("ru", "")
                join_candidates = joins_from_unlikely_token(value, raws)
                if join_candidates:
                    records.append({"word": entry["word"], "meaning_id": meaning["id"],
                                    "example_index": i, "field": "examples.ru", "value": value,
                                    "candidates": join_candidates})
    OUT_PATH.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"records: {len(records)}")
    for rec in records[:200]:
        print(json.dumps(rec, ensure_ascii=False))

if __name__ == "__main__":
    main()
