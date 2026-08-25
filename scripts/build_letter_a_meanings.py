# -*- coding: utf-8 -*-
"""
Build, deeply verify, and audit all words in Letter A for oxford_5000.json.
"""

import sys
import json
import re
from pathlib import Path

ROOT = Path(".").resolve()
sys.path.insert(0, str(ROOT))

from scripts.align_muller_precision import (
    PDF2_ARTICLES_PATH, RUSSIAN_VOCAB_PATH, OXFORD_PATH, APP_OXFORD_PATH,
    build_article_index, resolve_entry_articles, parse_article, strip_markup,
    deep_clean_russian, expand_english_phrase
)

FALLBACK_ENTRIES = {
    "according to": [
        {
            "id": 1,
            "partOfSpeech": "preposition",
            "translation": "согласно, в соответствии с; по утверждению, по словам, по мнению",
            "examples": [
                {
                    "en": "he came according to his promise",
                    "ru": "он пришёл, как и обещал"
                },
                {
                    "en": "according to him",
                    "ru": "по его словам"
                },
                {
                    "en": "according to BBC",
                    "ru": "по сообщению Би-би-си"
                }
            ]
        }
    ],
    "all right": [
        {
            "id": 1,
            "partOfSpeech": "adjective",
            "translation": "в порядке, всё в порядке; благополучно",
            "examples": [
                {
                    "en": "to be all right",
                    "ru": "а) быть в порядке; б) чувствовать себя хорошо"
                },
                {
                    "en": "if it's all right with you",
                    "ru": "если это вас устраивает, если вы согласны"
                },
                {
                    "en": "it all came right",
                    "ru": "всё уладилось"
                }
            ]
        }
    ],
    "any more": [
        {
            "id": 1,
            "partOfSpeech": "adverb",
            "translation": "больше, уже (при отрицании)",
            "examples": [
                {
                    "en": "not any more",
                    "ru": "больше не, уже не"
                }
            ]
        }
    ]
}


def audit_meaning(word: str, meaning_idx: int, m: dict) -> list[str]:
    issues = []
    trans = m.get("translation", "")
    examples = m.get("examples", [])
    pos = m.get("partOfSpeech")

    if not pos:
        issues.append("Missing partOfSpeech")

    # Check for unexpanded Russian abbreviations
    ru_texts = [trans] + [ex.get("ru", "") for ex in examples]
    for text in ru_texts:
        if re.search(r'\b(кого|кому|кем|ком|что|чему|чем|чём|чей|чья|чьё|чьи|какой|какая|какое|какие|где|куда|откуда|когда|как)-л\b\.?', text):
            issues.append(f"Unexpanded -л abbreviation in: '{text[:60]}'")
        if re.search(r'\b(pl|sing|attr|predic)\b', text, flags=re.IGNORECASE):
            issues.append(f"Unexpanded grammatical marker in: '{text[:60]}'")
        if re.search(r'\b(тж|особ|преим|обыкн)\b\.?', text):
            issues.append(f"Unexpanded editorial marker in: '{text[:60]}'")
        if re.search(r'\b[а-яА-ЯёЁ]+-\s+[а-яА-ЯёЁ]+\b', text):
            issues.append(f"OCR hyphen in: '{text[:60]}'")
        if "занесение насчёт" in text or "начей" in text:
            issues.append(f"Glued word in: '{text[:60]}'")

    # Check for unexpanded English abbreviations
    en_texts = [ex.get("en", "") for ex in examples]
    for text in en_texts:
        if re.search(r'\b(smb|smth|sb|sth)\b\.?', text):
            issues.append(f"Unexpanded English abbreviation in: '{text[:60]}'")
        if "~" in text:
            issues.append(f"Unexpanded tilde ~ in: '{text[:60]}'")

    return issues


def run_letter_a_pipeline(apply_changes: bool = False):
    vocab = set()
    with open(RUSSIAN_VOCAB_PATH, "r", encoding="utf-8") as f:
        vocab.update(json.load(f))

    with open(PDF2_ARTICLES_PATH, "r", encoding="utf-8") as f:
        articles = json.load(f)

    for art in articles:
        plain = strip_markup(art.get("body", ""))
        for w in re.findall(r"[А-Яа-яЁё]+", plain):
            if len(w) >= 2:
                vocab.add(w.lower())

    vocab.update([
        "мощения", "пенициллина", "подозрений", "платёжеспособность",
        "высокоодарённый", "сверхкомплектный", "самозабвенно"
    ])

    index = build_article_index(articles)

    with open(OXFORD_PATH, "r", encoding="utf-8") as f:
        full_oxford = json.load(f)

    a_words = [item for item in full_oxford if item["word"].lower().startswith("a")]
    print(f"=== Running Letter A Pipeline on {len(a_words)} words ===")

    all_issues = []
    updated_entries = {}

    for entry in a_words:
        word = entry["word"]

        if word in FALLBACK_ENTRIES:
            meanings = FALLBACK_ENTRIES[word]
        else:
            selected, res = resolve_entry_articles(word, index)
            if selected:
                raw_meanings = []
                for art in selected:
                    raw_meanings.extend(parse_article(art, word, vocab))
                meanings = []
                for idx, rm in enumerate(raw_meanings, 1):
                    item = {
                        "id": idx,
                        "partOfSpeech": rm.get("partOfSpeech", "other"),
                        "translation": rm.get("translation", "").strip(),
                        "examples": rm.get("examples", [])
                    }
                    if rm.get("register"):
                        item["register"] = rm["register"]
                    meanings.append(item)
            else:
                # Derivative or modern word: clean existing meanings thoroughly
                meanings = []
                for idx, m in enumerate(entry.get("meanings", []), 1):
                    item = {
                        "id": idx,
                        "partOfSpeech": m.get("partOfSpeech", "other"),
                        "translation": deep_clean_russian(m.get("translation", ""), vocab),
                        "examples": [
                            {
                                "en": expand_english_phrase(ex.get("en", ""), word),
                                "ru": deep_clean_russian(ex.get("ru", ""), vocab)
                            }
                            for ex in m.get("examples", [])
                            if ex.get("en") or ex.get("ru")
                        ]
                    }
                    if m.get("register"):
                        item["register"] = m["register"]
                    meanings.append(item)

        # Audit this word
        for m_idx, m in enumerate(meanings, 1):
            issues = audit_meaning(word, m_idx, m)
            for iss in issues:
                all_issues.append(f"{word} [m:{m_idx}]: {iss}")

        entry_copy = {k: v for k, v in entry.items() if k != "meanings"}
        entry_copy["meanings"] = meanings
        updated_entries[word] = entry_copy

    print(f"Total audit issues detected in Letter A: {len(all_issues)}")
    if all_issues:
        print("First 15 issues:")
        for iss in all_issues[:15]:
            print(" -", iss)

    if apply_changes and not all_issues:
        for i, item in enumerate(full_oxford):
            w = item["word"]
            if w in updated_entries:
                full_oxford[i] = updated_entries[w]

        with open(OXFORD_PATH, "w", encoding="utf-8") as f:
            json.dump(full_oxford, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"Saved {len(updated_entries)} updated words to {OXFORD_PATH}")

        with open(APP_OXFORD_PATH, "w", encoding="utf-8") as f:
            json.dump(full_oxford, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"Saved {len(updated_entries)} updated words to {APP_OXFORD_PATH}")

    return len(a_words), len(all_issues)


if __name__ == "__main__":
    apply = "--apply" in sys.argv
    run_letter_a_pipeline(apply_changes=apply)
