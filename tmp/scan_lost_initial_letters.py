import json
import re
from collections import defaultdict
from pathlib import Path

from wordfreq import zipf_frequency
from audit_meanings import DATA_PATH, build_source_map, base_word

ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "scripts" / "parsed_index.json"
OUT_PATH = ROOT / "tmp" / "lost_initial_letter_candidates.json"
CYR = "А-Яа-яЁё"

def normalized_source_words(raw):
    raw = re.sub(r"(?:\u00ad|-)\s*\n\s*", "", raw)
    return set(re.findall(rf"[{CYR}]{{3,}}", raw.lower()))

def candidates_for_value(value, raw_words):
    candidates = []
    for match in re.finditer(rf"(?<![{CYR}])([{CYR}]{{3,}})(?![{CYR}])", value):
        token = match.group(1)
        lower = token.lower()
        # A lost initial character turns a word into an unlikely token. Require
        # an exact one-letter extension present in this same source article.
        if zipf_frequency(lower, "ru") > 2.2:
            continue
        matches = sorted(word for word in raw_words if len(word) == len(lower) + 1 and word.endswith(lower))
        if matches:
            candidates.append({"before": token, "possible_source_words": matches})
    return candidates

def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    sources = build_source_map(index)
    results = []
    for entry in data:
        raws = sources.get(base_word(entry["word"]), [])
        raw_words = set().union(*(normalized_source_words(raw) for _, raw in raws)) if raws else set()
        for meaning in entry["meanings"]:
            for field, value in [("translation", meaning["translation"])]:
                found = candidates_for_value(value, raw_words)
                if found:
                    results.append({"word": entry["word"], "meaning_id": meaning["id"],
                                    "field": field, "value": value, "candidates": found})
            for i, ex in enumerate(meaning.get("examples", [])):
                found = candidates_for_value(ex.get("ru", ""), raw_words)
                if found:
                    results.append({"word": entry["word"], "meaning_id": meaning["id"],
                                    "example_index": i, "field": "examples.ru", "value": ex["ru"],
                                    "candidates": found})
    OUT_PATH.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"records: {len(results)}")
    for result in results[:250]:
        print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
