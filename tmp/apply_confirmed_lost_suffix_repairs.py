import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "oxford_5000_2026-08-27.json"
MIRROR = ROOT / "src" / "data" / "oxford_5000.json"
OUT = ROOT / "tmp" / "confirmed_lost_suffix_repairs.json"

REPAIRS = {
    ("cycle", 2, "translation"): [("велоси", "велосипед")],
    ("edge", 14, "examples.ru"): [("втиски- вать(ся)", "втискивать(ся)")],
    ("exchange", 10, "examples.ru"): [("нескольки- ми", "несколькими")],
    ("experience", 1, "examples.ru"): [("(горь)", "(горьком)")],
    ("hold", 22, "examples.ru"): [("сдер- живать(ся)", "сдерживать(ся)")],
    ("master", 13, "examples.ru"): [("радиопелен- гаторная", "радиопеленгаторная")],
    ("near", 3, "examples.ru"): [("родст- венник", "родственник")],
    ("open", 2, "examples.ru"): [("незагоро- женное", "незагороженное")],
    ("plug", 6, "translation"): [("бисма", "бисмалит")],
    ("position", 5, "translation"): [("положе- postgraduate ние", "положение")],
    ("push", 7, "examples.ru"): [("проталки- вать(ся)", "проталкивать(ся)")],
    ("ring", 14, "translation"): [("круж", "кружком")],
    ("run", 10, "examples.ru"): [("распола- гать(ся)", "располагать(ся)")],
    ("side", 5, "examples.ru"): [("изнан- ка", "изнанка")],
    ("space", 5, "examples.ru"): [("недостат места", "недостатком места")],
    ("walk", 7, "translation"): [("разносчи и т. п.", "разносчика и т. п.")],
}


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    made = []
    for entry in data:
        for meaning in entry["meanings"]:
            for (word, meaning_id, field), pairs in REPAIRS.items():
                if (entry["word"], meaning["id"]) != (word, meaning_id):
                    continue
                containers = [(field, meaning)] if field == "translation" else [
                    (field, example) for example in meaning.get("examples", [])
                ]
                for _, obj in containers:
                    attr = "translation" if field == "translation" else "ru"
                    value = obj[attr]
                    for before, after in pairs:
                        if before in value:
                            obj[attr] = value.replace(before, after, 1)
                            made.append({"word": word, "meaning_id": meaning_id, "field": field, "before": before, "after": after, "source": "Müller soft-hyphen continuation"})
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA.write_text(text, encoding="utf-8")
    MIRROR.write_text(text, encoding="utf-8")
    OUT.write_text(json.dumps(made, ensure_ascii=False, indent=2), encoding="utf-8")
    print(len(made))


if __name__ == "__main__":
    main()
