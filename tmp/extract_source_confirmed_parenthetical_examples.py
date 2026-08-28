import json
import re
from pathlib import Path

from audit_meanings import DATA_PATH, INDEX_PATH, base_word, build_source_map
from extract_source_confirmed_inline_examples import normal

ROOT = Path(__file__).resolve().parents[1]
MIRROR = ROOT / "src" / "data" / "oxford_5000.json"
REPORT = ROOT / "tmp" / "source_confirmed_parenthetical_example_repairs.json"
CYR = "А-Яа-яЁё"


def split_pair(clause):
    """Parse English examples with parenthetical English variants only.

    Inside parentheses the sole allowed Cyrillic token is ``или`` followed by
    another English alternative.  Thus source labels such as ``(спорт.)`` and
    Russian explanatory parentheses cannot be silently consumed as English.
    """
    clause = clause.strip()
    if not clause or not re.match(r"[A-Za-z]", clause):
        return None
    if any(ch in clause for ch in ":=[]—«»"):
        return None
    depth = 0
    i = 0
    boundary = None
    while i < len(clause):
        char = clause[i]
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth < 0:
                return None
        elif re.match(r"[А-Яа-яЁё]", char):
            if depth == 0:
                boundary = i
                break
            if clause[i:].startswith("или") and (i + 3 == len(clause) or not clause[i + 3].isalpha()):
                i += 3
                continue
            return None
        i += 1
    if boundary is None or depth != 0:
        return None
    en = clause[:boundary].strip(" ,;")
    ru = clause[boundary:].strip()
    if not en or not ru or re.search(r"[A-Za-z]", ru) or en.endswith("-"):
        return None
    # Parsed-source OCR dropped ``be`` in this particular construction; it is
    # retained for direct-PDF review rather than emitted as a malformed
    # example.
    if "to called" in en.lower():
        return None
    words = re.findall(r"[A-Za-z]{2,}", en)
    if len(words) < 2:
        return None
    return en, ru


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    sources = build_source_map(index)
    changes = []
    for entry in data:
        raw_text = " ".join(
            normal(raw.replace("~", base_word(entry["word"])))
            for _, raw in sources.get(base_word(entry["word"]), [])
        )
        if not raw_text:
            continue
        for meaning in entry["meanings"]:
            before = meaning["translation"]
            kept, additions = [], []
            for clause in (item.strip() for item in before.split(";")):
                pair = split_pair(clause)
                if not pair or normal(pair[0]) not in raw_text:
                    kept.append(clause)
                    continue
                additions.append({"en": pair[0], "ru": pair[1]})
            after = "; ".join(item for item in kept if item)
            if additions and after and after != before:
                examples = meaning.setdefault("examples", [])
                new_additions = [x for x in additions if x not in examples]
                examples.extend(new_additions)
                meaning["translation"] = after
                changes.append({"word": entry["word"], "meaning_id": meaning["id"], "before": before, "after": after, "examples_added": new_additions})
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA_PATH.write_text(text, encoding="utf-8")
    MIRROR.write_text(text, encoding="utf-8")
    REPORT.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"changes": len(changes)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
