import json
import re
from pathlib import Path

from audit_meanings import DATA_PATH, INDEX_PATH, base_word, build_source_map

ROOT = Path(__file__).resolve().parents[1]
MIRROR_PATH = ROOT / "src" / "data" / "oxford_5000.json"
REPORT_PATH = ROOT / "tmp" / "source_confirmed_inline_example_repairs.json"
CYR = "А-Яа-яЁё"


def normal(text):
    # The parsed PDF uses soft hyphens at line endings and sometimes the source
    # uses a tilde for the headword.  This conservative normalisation is only
    # for confirming that the English fragment literally occurs in the source.
    text = text.replace("\u00ad\n", "").replace("-\n", "")
    text = re.sub(r"\s+", " ", text).replace("~", " ")
    return text.lower().strip()


def parse_clause(clause):
    """Return (en, ru) only for a simple, unambiguous inline example.

    Parentheses, equations and multi-part English blocks are deliberately
    excluded: their boundaries belong to dictionary syntax and require manual
    source parsing rather than a text substitution.
    """
    clause = clause.strip()
    if not clause or any(ch in clause for ch in "()[]=—"):
        return None
    if not re.match(r"(?:[A-Za-z£])", clause):
        return None
    first_cyr = re.search(rf"[{CYR}]", clause)
    if not first_cyr:
        return None
    en = clause[:first_cyr.start()].strip(" ,:;")
    ru = clause[first_cyr.start():].strip()
    if not en or not ru or re.search(r"[A-Za-z]", ru):
        return None
    words = re.findall(r"[A-Za-z]{2,}", en)
    if len(words) < 2 and not (en.startswith("£") and words):
        return None
    # A grammatical marker and a Russian gloss (e.g. ``for за``) are not an
    # example.  Sentence-like material must contain a verb-form or at least
    # three English lexical words.
    if len(words) < 3 and not re.search(r"\b(?:is|are|was|were|be|been|am|do|does|did|go|went|come|came|make|made|take|took|have|has|had|will|shall|can|could|may|might|must|should|would)\b", en, re.I):
        return None
    return en, ru


def changes_for(data, sources):
    changes = []
    for entry in data:
        raws = sources.get(base_word(entry["word"]), [])
        if not raws:
            continue
        # Müller abbreviates repetitions of the headword with ``~``.  Expand
        # only that conventional mark for the current headword before the
        # literal English-fragment check.
        source_text = " ".join(
            normal(raw.replace("~", base_word(entry["word"]))) for _, raw in raws
        )
        for meaning in entry.get("meanings", []):
            before = meaning.get("translation", "")
            clauses = [part.strip() for part in before.split(";")]
            kept, extracted = [], []
            for clause in clauses:
                pair = parse_clause(clause)
                if not pair:
                    kept.append(clause)
                    continue
                en, ru = pair
                if normal(en) not in source_text:
                    kept.append(clause)
                    continue
                extracted.append({"en": en, "ru": ru})
            after = "; ".join(part for part in kept if part)
            if extracted and after and after != before:
                existing = meaning.setdefault("examples", [])
                additions = [x for x in extracted if x not in existing]
                if additions:
                    existing.extend(additions)
                    meaning["translation"] = after
                    changes.append({
                        "word": entry["word"], "meaning_id": meaning["id"],
                        "before": before, "after": after, "examples_added": additions,
                        "reason": "source_confirmed_inline_english_example",
                    })
    return changes


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    changes = changes_for(data, build_source_map(index))
    if changes:
        text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        DATA_PATH.write_text(text, encoding="utf-8")
        MIRROR_PATH.write_text(text, encoding="utf-8")
    REPORT_PATH.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"changes": len(changes), "report": str(REPORT_PATH)}, ensure_ascii=False))
    for change in changes:
        print(json.dumps(change, ensure_ascii=False))


if __name__ == "__main__":
    main()
