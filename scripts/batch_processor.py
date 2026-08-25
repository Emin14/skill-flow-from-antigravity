# -*- coding: utf-8 -*-
"""
Batch processor for all letter batches in Oxford 5000 from Muller 2021 dictionary.
Performs deep verification and quality audit on every word and meaning.
"""

import sys
import os
import json
import re
from pathlib import Path
from typing import Optional

ROOT = Path(".").resolve()
sys.path.insert(0, str(ROOT))

from scripts.align_muller_precision import (
    PDF2_ARTICLES_PATH, RUSSIAN_VOCAB_PATH, OXFORD_PATH, APP_OXFORD_PATH,
    build_article_index, resolve_entry_articles, parse_article, strip_markup,
    deep_clean_russian, expand_english_phrase, clean_government_patterns, extract_collocation_notes
)

KNOWN_PHRASE_FALLBACKS = {
    "according to": [
        {
            "id": 1,
            "partOfSpeech": "preposition",
            "translation": "согласно, в соответствии с; по утверждению, по словам, по мнению",
            "examples": [
                {"en": "he came according to his promise", "ru": "он пришёл, как и обещал"},
                {"en": "according to him", "ru": "по его словам"},
                {"en": "according to BBC", "ru": "по сообщению Би-би-си"}
            ]
        }
    ],
    "all right": [
        {
            "id": 1,
            "partOfSpeech": "adjective",
            "translation": "в порядке, всё в порядке; благополучно",
            "examples": [
                {"en": "to be all right", "ru": "а) быть в порядке; б) чувствовать себя хорошо"},
                {"en": "if it's all right with you", "ru": "если это вас устраивает, если вы согласны"},
                {"en": "it all came right", "ru": "всё уладилось"}
            ]
        }
    ],
    "any more": [
        {
            "id": 1,
            "partOfSpeech": "adverb",
            "translation": "больше, уже (при отрицании)",
            "examples": [
                {"en": "not any more", "ru": "больше не, уже не"}
            ]
        }
    ],
    "have to": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "быть должным, вынужденным (сделать что-либо)",
            "examples": [
                {"en": "I have to go", "ru": "я должен идти, мне нужно идти"}
            ]
        }
    ],
    "ice cream": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "мороженое",
            "examples": []
        }
    ],
    "next to": [
        {
            "id": 1,
            "partOfSpeech": "preposition",
            "translation": "рядом с, около, возле; почти",
            "examples": [
                {"en": "sit next to me", "ru": "сядь рядом со мной"},
                {"en": "next to nothing", "ru": "почти ничего"}
            ]
        }
    ],
    "no one": [
        {
            "id": 1,
            "partOfSpeech": "pronoun",
            "translation": "никто",
            "examples": [
                {"en": "no one knows", "ru": "никто не знает"}
            ]
        }
    ],
    "per cent": [
        {
            "id": 1,
            "partOfSpeech": "noun",
            "translation": "процент",
            "examples": [
                {"en": "ten per cent", "ru": "десять процентов"}
            ]
        }
    ],
    "used to": [
        {
            "id": 1,
            "partOfSpeech": "verb",
            "translation": "имел обыкновение (в прошлом); бывало",
            "examples": [
                {"en": "I used to live here", "ru": "я когда-то жил здесь"}
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

    if "~" in trans:
        issues.append(f"Unexpanded tilde in translation: '{trans[:60]}'")
    if re.search(r'\([a-zA-Z\s,;]+(?:\s*[—–]\s*|\s+-\s+)', trans):
        issues.append(f"Uncleaned government note in translation: '{trans[:60]}'")
    if re.search(r'\brefl\.\b', trans, flags=re.IGNORECASE):
        issues.append(f"Uncleaned refl marker in translation: '{trans[:60]}'")
    if re.search(r'\(\s*(?:to|of|for|with|in|at|from|on|upon|about)\s*\)', trans, flags=re.IGNORECASE):
        issues.append(f"Uncleaned bare Latin preposition in translation: '{trans[:60]}'")

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
        if "занесение насчёт" in text or re.search(r'\bначей\b', text):
            issues.append(f"Glued word in: '{text[:60]}'")

    en_texts = [ex.get("en", "") for ex in examples]
    for text in en_texts:
        if re.search(r'[а-яА-ЯёЁ]', text):
            issues.append(f"Cyrillic in ex.en: '{text[:60]}'")
        if re.search(r'\b(smb|smth|sb|sth)\b\.?', text):
            issues.append(f"Unexpanded English abbreviation in: '{text[:60]}'")
        if "~" in text:
            issues.append(f"Unexpanded tilde ~ in: '{text[:60]}'")

    for ex in examples:
        if ex.get("en") and not ex.get("ru"):
            issues.append(f"Empty ru for en example: '{ex.get('en')[:60]}'")

    return issues


def process_letter(target_letter: str, index, vocab, full_oxford, apply_changes: bool = True):
    target_letter = target_letter.lower()
    words_in_letter = [item for item in full_oxford if item["word"].lower().startswith(target_letter)]

    print(f"\n==========================================")
    print(f"Processing Letter '{target_letter.upper()}' ({len(words_in_letter)} words)...")

    all_issues = []
    updated_entries = {}

    for entry in words_in_letter:
        word = entry["word"]

        if word in KNOWN_PHRASE_FALLBACKS:
            meanings = KNOWN_PHRASE_FALLBACKS[word]
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
                meanings = []
                for idx, m in enumerate(entry.get("meanings", []), 1):
                    raw_t = m.get("translation", "")
                    clean_t = deep_clean_russian(raw_t, vocab)
                    clean_t = clean_government_patterns(clean_t)
                    clean_t, extra_exs = extract_collocation_notes(clean_t, word)
                    exs = [
                        {
                            "en": expand_english_phrase(ex.get("en", ""), word),
                            "ru": deep_clean_russian(ex.get("ru", ""), vocab)
                        }
                        for ex in m.get("examples", [])
                        if ex.get("en") or ex.get("ru")
                    ]
                    exs.extend(extra_exs)
                    item = {
                        "id": idx,
                        "partOfSpeech": m.get("partOfSpeech", "other"),
                        "translation": clean_t.strip(),
                        "examples": exs
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

    print(f"Letter '{target_letter.upper()}': {len(words_in_letter)} words processed, {len(all_issues)} audit issues.")
    if all_issues:
        print("Issues found:")
        for iss in all_issues[:10]:
            print(" -", iss)

    if apply_changes and not all_issues:
        for i, item in enumerate(full_oxford):
            w = item["word"]
            if w in updated_entries:
                full_oxford[i] = updated_entries[w]

    return len(words_in_letter), len(all_issues)


def process_all_letters(letters: Optional[list[str]] = None, apply_changes: bool = True):
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

    if letters is None:
        letters = sorted(list({item["word"][0].lower() for item in full_oxford}))

    total_words = 0
    total_issues = 0

    for letter in letters:
        words_count, issues_count = process_letter(letter, index, vocab, full_oxford, apply_changes=apply_changes)
        total_words += words_count
        total_issues += issues_count

    print(f"\n==========================================")
    print(f"SUMMARY: Processed {total_words} words across {len(letters)} letters.")
    print(f"Total audit issues: {total_issues}")

    if apply_changes and total_issues == 0:
        with open(OXFORD_PATH, "w", encoding="utf-8") as f:
            json.dump(full_oxford, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"SUCCESS: Saved full dataset to {OXFORD_PATH}")

        with open(APP_OXFORD_PATH, "w", encoding="utf-8") as f:
            json.dump(full_oxford, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"SUCCESS: Saved full dataset to {APP_OXFORD_PATH}")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "all"
    if target == "all":
        process_all_letters(apply_changes=True)
    else:
        letters = [ch.strip().lower() for ch in target.split(",")]
        process_all_letters(letters=letters, apply_changes=True)
