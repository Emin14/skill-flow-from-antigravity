import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "oxford_5000_2026-08-27.json"
INDEX_PATH = ROOT / "scripts" / "parsed_index.json"
REPORT_PATH = ROOT / "tmp" / "meanings_audit_candidates.json"
CHANGES_PATH = ROOT / "tmp" / "confirmed_soft_split_repairs.json"

CYR = "А-Яа-яЁё"

def base_word(word):
    return re.sub(r"\d+$", "", word.lower())

def build_source_map(index):
    result = defaultdict(list)
    for key, items in index.items():
        head = key.split("\n", 1)[0].lower()
        base = re.sub(r"\s+[ivx]+$", "", head)
        result[base].extend((key, item["text"]) for item in items)
    return result

def soft_split_confirmed(raw, left, right):
    # Explicit source evidence: the two parts are separated only by a printed
    # hyphen/soft hyphen at the source line boundary.
    return re.search(
        rf"(?<![{CYR}]){re.escape(left)}(?:\u00ad|-)\s*\n\s*{re.escape(right)}(?![{CYR}])",
        raw,
        re.I,
    ) is not None

def find_split_candidates(value, raws):
    found = []
    # Every adjacent Cyrillic pair is considered, but only a literal source
    # line-break hyphen confirms that its space is erroneous.
    # The look-ahead makes every word boundary independently visible. A normal
    # consuming two-word regex would skip the second boundary in
    # ``быть олицетво рением`` after testing ``быть олицетво``.
    for match in re.finditer(rf"(?<![{CYR}])([{CYR}]{{1,}})(?=\s+([{CYR}]{{1,}})(?![{CYR}]))", value):
        left, right = match.group(1), match.group(2)
        evidence = [key for key, raw in raws if soft_split_confirmed(raw, left, right)]
        if evidence:
            found.append({
                "span": [match.start(1), match.end(2)],
                "before": left + value[match.end(1):match.start(2)] + right,
                "after": left + right,
                "source_keys": sorted(set(evidence)),
            })
    return found

def repair_value(value, raws):
    repairs = []
    replacements = []
    for match in re.finditer(rf"(?<![{CYR}])([{CYR}]{{1,}})(?=\s+([{CYR}]{{1,}})(?![{CYR}]))", value):
        left, right = match.group(1), match.group(2)
        evidence = [key for key, raw in raws if soft_split_confirmed(raw, left, right)]
        if not evidence:
            continue
        start, end = match.start(1), match.end(2)
        before = value[start:end]
        repairs.append({"before": before, "after": left + right,
                        "source_keys": sorted(set(evidence))})
        replacements.append((start, end, left + right))
    repaired = value
    for start, end, replacement in reversed(replacements):
        repaired = repaired[:start] + replacement + repaired[end:]
    return repaired, repairs

def apply_repairs(data, sources):
    changes = []
    for entry in data:
        raws = sources.get(base_word(entry["word"]), [])
        if not raws:
            continue
        for meaning in entry.get("meanings", []):
            before = meaning.get("translation", "")
            after, repairs = repair_value(before, raws)
            if repairs:
                meaning["translation"] = after
                changes.append({"word": entry["word"], "meaning_id": meaning["id"],
                                "field": "translation", "before": before, "after": after,
                                "repairs": repairs, "reason": "source_soft_hyphen"})
            for ex_index, example in enumerate(meaning.get("examples", [])):
                before = example.get("ru", "")
                after, repairs = repair_value(before, raws)
                if repairs:
                    example["ru"] = after
                    changes.append({"word": entry["word"], "meaning_id": meaning["id"],
                                    "example_index": ex_index, "field": "examples.ru",
                                    "before": before, "after": after, "repairs": repairs,
                                    "reason": "source_soft_hyphen"})
    return changes

def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    sources = build_source_map(index)
    hits = []
    counts = Counter()
    no_source = []
    for entry in data:
        raws = sources.get(base_word(entry["word"]), [])
        if not raws:
            no_source.append(entry["word"])
            continue
        for meaning in entry.get("meanings", []):
            for field, value in [("translation", meaning.get("translation", ""))]:
                for hit in find_split_candidates(value, raws):
                    hits.append({
                        "word": entry["word"], "meaning_id": meaning["id"],
                        "field": field, "value": value, **hit,
                    })
                    counts["meaning_translation_soft_hyphen_split"] += 1
            for ex_index, ex in enumerate(meaning.get("examples", [])):
                value = ex.get("ru", "")
                for hit in find_split_candidates(value, raws):
                    hits.append({
                        "word": entry["word"], "meaning_id": meaning["id"],
                        "example_index": ex_index, "field": "examples.ru", "value": value, **hit,
                    })
                    counts["example_ru_soft_hyphen_split"] += 1
    report = {
        "entries": len(data),
        "candidates": len(hits),
        "counts": dict(counts),
        "entries_without_source_match": no_source,
        "hits": hits,
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: report[k] for k in ["entries", "candidates", "counts", "entries_without_source_match"]}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
