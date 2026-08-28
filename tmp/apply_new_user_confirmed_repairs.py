import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "oxford_5000_2026-08-27.json"
MIRROR = ROOT / "src" / "data" / "oxford_5000.json"
REPORT = ROOT / "tmp" / "new_user_confirmed_repairs.json"


def meaning(entry, meaning_id):
    return next(x for x in entry["meanings"] if x["id"] == meaning_id)


def add_example(item, example):
    if example not in item["examples"]:
        item["examples"].append(example)


def add_phrase(entry, phrase, translation):
    phrases = entry.setdefault("phrases", [])
    if any(x["phrase"] == phrase for x in phrases):
        return
    phrases.append({
        "id": max((x["id"] for x in phrases), default=0) + 1,
        "phrase": phrase,
        "partOfSpeech": "verb",
        "translation": translation,
        "examples": [],
        "register": [],
    })


def change(changes, word, ident, field, before, after, source):
    if before != after:
        changes.append({"word": word, "meaning_id": ident, "field": field,
                        "before": before, "after": after, "source": source})


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    by_word = {x["word"]: x for x in data}
    changes = []

    go = by_word["go"]
    m = meaning(go, 31)
    before = m["translation"]
    m["translation"] = "в обороте be going + inf. смыслового глагола выражает намерение совершить какое-либо действие в ближайшем будущем"
    add_example(m, {"en": "I am going to speak to her", "ru": "я намереваюсь поговорить с ней"})
    change(changes, "go", 31, "translation", before, m["translation"], "PDF Müller: embedded example")
    m = meaning(go, 32)
    before = m["translation"]
    m["translation"] = "движение; ход, ходьба"
    add_phrase(go, "to be on the go", "1) быть в движении, в работе; 2) собираться уходить; 3) быть пьяным; 4) быть на склоне лет, на закате дней")
    change(changes, "go", 32, "translation", before, m["translation"], "PDF Müller / README: idiomatic block to phrases")

    grace = by_word["grace"]
    m = meaning(grace, 10)
    before = list(m["examples"])
    m["examples"] = [x for x in m["examples"] if x != {"en": "(the Graces)", "ru": "при англ. мн. ч.: миф. Грации"}]
    change(changes, "grace", 10, "examples", before, m["examples"], "duplicate of translation")

    ground = by_word["ground"]
    for m in ground["meanings"]:
        if "опус кать(ся)" in m["translation"]:
            before = m["translation"]
            m["translation"] = before.replace("опус кать(ся)", "опускать(ся)")
            change(changes, "ground", m["id"], "translation", before, m["translation"], "PDF soft-hyphen word continuation")

    hand = by_word["hand"]
    m = meaning(hand, 3)
    before = m["translation"]
    m["translation"] = "(часто при англ. мн. ч.:) власть, контроль"
    add_example(m, {"en": "in hand", "ru": "в руках; в подчинении"})
    change(changes, "hand", 3, "translation", before, m["translation"], "PDF Müller: embedded English phrase")

    hunt = by_word["hunt"]
    m = meaning(hunt, 6)
    before = m["translation"]
    m["translation"] = "травить, гнать, преследовать (зверя и т. п.)"
    add_phrase(hunt, "hunt after", "гоняться; искать, рыскать")
    change(changes, "hunt", 6, "translation", before, m["translation"], "PDF Müller / README: phrasal-verb block")

    identity = by_word["identity"]
    m = meaning(identity, 5)
    for ex in m["examples"]:
        if ex["en"] == "identity card":
            before = ex["ru"]
            ex["ru"] = "удостоверение личности"
            change(changes, "identity", 5, "examples.ru", before, ex["ru"], "next headword leaked into example")

    if_word = by_word["if"]
    m = meaning(if_word, 5)
    before = m["translation"]
    m["translation"] = "с гл. в отрицательной форме выражает удивление, негодование и т. п."
    add_example(m, {"en": "well, if I haven't left my umbrella in the train!", "ru": "подумать только, я оставил зонтик в поезде!"})
    change(changes, "if", 5, "translation", before, m["translation"], "PDF Müller p. 400")
    phrase = next(x for x in if_word["phrases"] if x["id"] == 5)
    before_phrase, before_translation = phrase["phrase"], phrase["translation"]
    phrase["phrase"] = "as if you didn't know"
    phrase["translation"] = "(как) будто вы не знали"
    change(changes, "if", 5, "phrase", before_phrase, phrase["phrase"], "PDF Müller p. 400")
    change(changes, "if", 5, "phrase.translation", before_translation, phrase["translation"], "PDF Müller p. 400")

    ill = by_word["ill"]
    for ident, translation in [(2, "дурной, плохой"), (3, "злой, вредный, гибельный")]:
        m = meaning(ill, ident)
        before = m["translation"]
        m["translation"] = translation
        m["partOfSpeech"] = "adjective"
        m["examples"] = [x for x in m["examples"] if x.get("en") != "worst)"]
        change(changes, "ill", ident, "translation", before, translation, "comparative-form OCR fragment removed")

    illusion = by_word["illusion"]
    m = meaning(illusion, 1)
    for ex in m["examples"]:
        if ex["en"] == "to have no illusions about smb. (smth.)":
            before = ex["ru"]
            ex["ru"] = "не обольщаться насчёт кого-либо, чего-либо"
            change(changes, "illusion", 1, "examples.ru", before, ex["ru"], "OCR word-boundary repair")

    it = by_word["it"]
    m = meaning(it, 2)
    before = m["translation"]
    m["translation"] = "это"
    m["examples"] = [x for x in m["examples"] if x.get("en") != "demonstr."]
    for ex in [{"en": "who is it?", "ru": "кто это?; кто там?"}, {"en": "it's me, it is I", "ru": "это я"}]:
        add_example(m, ex)
    change(changes, "it", 2, "translation", before, m["translation"], "PDF Müller p. 431")
    m = meaning(it, 3)
    before = m["translation"]
    m["translation"] = "употребляется в безличных предложениях"
    add_example(m, {"en": "it is raining", "ru": "идёт дождь"})
    change(changes, "it", 3, "translation", before, m["translation"], "PDF Müller p. 431")
    m = meaning(it, 4)
    before = m["translation"]
    m["translation"] = "в качестве подлежащего заменяет какое-либо подразумеваемое понятие"
    for ex in [
        {"en": "it (= the season) is winter", "ru": "теперь зима"},
        {"en": "it (= the distance) is 6 miles to Oxford", "ru": "до Оксфорда 6 миль"},
        {"en": "it (= the scenery) is very pleasant here", "ru": "здесь очень хорошо"},
    ]:
        add_example(m, ex)
    change(changes, "it", 4, "translation", before, m["translation"], "PDF Müller p. 431")
    m = meaning(it, 5)
    before = m["translation"]
    m["translation"] = "в качестве дополнения образует вместе с глаголами (как переходными, так и непереходными) разговорные идиомы"
    change(changes, "it", 5, "translation", before, m["translation"], "PDF Müller p. 431; phrases already present")

    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA.write_text(text, encoding="utf-8")
    MIRROR.write_text(text, encoding="utf-8")
    REPORT.write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"changes": len(changes)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
