import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "oxford_5000_2026-08-27.json"
MIRROR = ROOT / "src" / "data" / "oxford_5000.json"
REPORT = ROOT / "tmp" / "reverted_ambiguous_inline_extractions.json"

# These fragments begin a Müller phrasal/idiom sub-block (rather than a
# context example) or leave an unmatched parenthesis.  They require a full
# phrase-block parser, so retaining the original string is safer than moving
# only one line into examples.
RESTORE = {
    ("burst", 7): "взрывать, разрывать, разрушать; разламывать; вскрывать; burst into: to burst into blossom расцвести; to burst into (или upon) the view внезапно появиться (в поле зрения); to burst out crying (laughing) = to burst into tears (into laughter); burst up; взорваться; потерпеть неудачу, крушение",
    ("laugh", 5): "высмеять laugh away рассеять, прогнать смехом (скуку, опасения); заглушить смехом (речь и т. п.); laugh out: to laugh smb. out of smth. насмешкой отучить кого-л. от чего-либо",
    ("push", 7): "продавать наркотики push around помыкать (кем-либо); push forward; торопиться; стремиться вперёд; продвигать; способствовать осуществлению; push off; отталкиваться (от берега); отталкивать; убираться, исчезать; push on; спешить (вперёд); проталкивать, ускорять; push out; выпускать; давать ростки (о растении); выступать, выдаваться вперёд; пробиваться; push upon: to push smth. upon smb. навязывать что-либо кому-либо",
    ("ring", 25): "оглашаться (with); ring down: to ring the curtain down дать звонок к спуску занавеса; перен. положить конец (чему-либо) [ср. тж. ring up; ]; ring in; вводить, представлять; ознаменовывать колокольным звоном; вешать трубку; ring out; прозвучать; провожать колокольным звоном; ring up; разбудить звонком; звонить, вызывать по телефону; : to ring the curtain up дать звонок к поднятию занавеса; перен. начать (что-либо) [ср. тж. ring down]",
    ("visit", 10): "карать; отмщать (upon — кому-либо, with — чем-либо); the sins of the fathers are visited upon the children = грехи отцов падают на головы детей visit with (преим. поговорить, поболтать; she loves visiting with her neighbours and having a good gossip она любит поболтать и посплетничать с соседями",
}

FIX_EXAMPLES = {
    ("colour", 11, "colour bar, colour line «"): {"en": "colour bar, colour line", "ru": "«цветной барьер», расовая дискриминация"},
    ("cream", 3, "the cream of society «"): {"en": "the cream of society", "ru": "«сливки общества»"},
    ("winter", 2, "of fifty winters 50-"): {"en": "of fifty winters", "ru": "50-летний"},
}


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    made = []
    for entry in data:
        for meaning in entry["meanings"]:
            key = (entry["word"], meaning["id"])
            if key in RESTORE:
                before = meaning["translation"]
                meaning["translation"] = RESTORE[key]
                # Remove the specifically extracted tail, preserving any
                # pre-existing examples.
                examples = meaning.get("examples", [])
                if examples:
                    examples.pop()
                made.append({"word": key[0], "meaning_id": key[1], "before": before, "after": meaning["translation"], "action": "restore_ambiguous_block"})
            for (word, meaning_id, bad_en), fixed in FIX_EXAMPLES.items():
                if key != (word, meaning_id):
                    continue
                for example in meaning.get("examples", []):
                    if example.get("en") == bad_en:
                        before = dict(example)
                        example.clear()
                        example.update(fixed)
                        made.append({"word": word, "meaning_id": meaning_id, "before": before, "after": fixed, "action": "repair_quote_or_hyphen_boundary"})
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    DATA.write_text(text, encoding="utf-8")
    MIRROR.write_text(text, encoding="utf-8")
    REPORT.write_text(json.dumps(made, ensure_ascii=False, indent=2), encoding="utf-8")
    print(len(made))


if __name__ == "__main__":
    main()
