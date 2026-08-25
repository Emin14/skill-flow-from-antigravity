# -*- coding: utf-8 -*-
"""
Precision alignment and deep cleaning of Oxford 5000 meanings from Muller 2021 dictionary.
Adheres strictly to all user requirements:
- Full expansion of abbreviations (кого-либо, что-либо, somebody, something, во мн. ч., etc.)
- Strict extraction of register markers into "register": [...]
- Standalone phrasal verbs and idioms as {"translation": "", "examples": [{"en": "...", "ru": "..."}]}
- Accurate part of speech mapping
- No OCR syllable breaks or word glues
"""

import sys
import os
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(".").resolve()
OXFORD_PATH = ROOT / "oxford_5000.json"
APP_OXFORD_PATH = ROOT / "src" / "data" / "oxford_5000.json"
PDF2_ARTICLES_PATH = ROOT / "tmp" / "muller_rebuild" / "pdf2_articles_styled.json"
PDF1_ARTICLES_PATH = ROOT / "tmp" / "muller_rebuild" / "articles.json"
RUSSIAN_VOCAB_PATH = ROOT / "tmp" / "muller_rebuild" / "russian_vocab.json"


ROMAN_TOKEN_PATTERN = r"(?:IX|VIII|VII|VI|IV|V|III|II|I)"
ROMAN_SUFFIX_RE = re.compile(rf"\s+({ROMAN_TOKEN_PATTERN}(?:,\s*{ROMAN_TOKEN_PATTERN})*)$")

POS_MAP = {
    "n": "noun",
    "v": "verb",
    "a": "adjective",
    "adj": "adjective",
    "adv": "adverb",
    "pron": "pronoun",
    "prep": "preposition",
    "cj": "conjunction",
    "conj": "conjunction",
    "int": "interjection",
    "num": "numeral",
    "pref": "prefix",
    "suff": "suffix",
    "art": "article",
    "part": "particle",
    "vi": "verb",
    "vt": "verb",
    "p. p.": "participle",
    "pres. p.": "participle",
    "pres p.": "participle",
    "р. р.": "participle",
}

REGISTER_MAP = {
    "разг.": "разговорное",
    "прост.": "просторечное",
    "книжн.": "книжное",
    "поэт.": "поэтическое",
    "посл.": "пословица",
    "уст.": "устаревшее",
    "архаич.": "архаичное",
    "редк.": "редкое",
    "редко.": "редкое",
    "офиц.": "официальное",
    "шутл.": "шутливое",
    "ирон.": "ироническое",
    "неодобр.": "неодобрительное",
    "пренебр.": "пренебрежительное",
    "презр.": "презрительное",
    "эвф.": "эвфемизм",
    "амер.": "американизм",
    "англ.": "британское",
    "брит.": "британское",
    "австрал.": "австралийское",
    "шотл.": "шотландское",
    "ирл.": "ирландское",
    "воен.": "военное",
    "юр.": "юридическое",
    "юрид.": "юридическое",
    "тех.": "техническое",
    "мед.": "медицинское",
    "биол.": "биологическое",
    "бот.": "ботаника",
    "зоол.": "зоология",
    "анат.": "анатомия",
    "физиол.": "физиология",
    "эл.": "электротехника",
    "церк.": "церковное",
    "рел.": "религиозное",
    "метал.": "металлургия",
    "металл.": "металлургия",
    "полигр.": "полиграфия",
    "стр.": "строительное",
    "грам.": "грамматика",
    "лингв.": "лингвистика",
    "фон.": "фонетика",
    "мат.": "математика",
    "физ.": "физика",
    "хим.": "химия",
    "геол.": "геология",
    "геогр.": "география",
    "ист.": "историческое",
    "экон.": "экономика",
    "фин.": "финансы",
    "торг.": "торговое",
    "ком.": "коммерческое",
    "мор.": "морское",
    "ав.": "авиация",
    "авт.": "автомобильное",
    "ж.-д.": "железнодорожное",
    "радио": "радио",
    "кино": "кино",
    "театр.": "театр",
    "муз.": "музыка",
    "спорт.": "спортивное",
    "карт.": "карточное",
    "охот.": "охота",
    "кулин.": "кулинария",
    "фото": "фотография",
    "горн.": "горное дело",
    "текст.": "текстильное",
    "сл.": "сленг",
    "жарг.": "сленг",
    "диал.": "диалектное",
    "груб.": "грубое",
    "лат.": "латинское",
    "фр.": "французское",
    "шахм.": "шахматное",
    "архит.": "архитектура",
    "астр.": "астрономия",
    "парл.": "парламентское",
    "бухг.": "бухгалтерия",
    "полит.-эк.": "полит.-экон.",
    "полит.": "политическое",
    "эк.": "экономика",
    "собир.": "собирательное",
    "информ.": "информатика",
    "филол.": "филология",
    "психол.": "психология",
    "вет.": "ветеринария",
    "с.-х.": "сельскохозяйственное",
}

SINGLE_PREPS = {
    'в', 'во', 'к', 'ко', 'с', 'со', 'у', 'о', 'об', 'обо', 'из', 'от',
    'до', 'по', 'за', 'на', 'над', 'под', 'при', 'про', 'без', 'для', 'не', 'ни'
}

VALID_TWO_WORD_PREPS = {
    ('в', 'том'), ('в', 'этом'), ('в', 'чём'), ('в', 'чем'), ('в', 'ком'),
    ('на', 'днях'), ('на', 'вид'), ('на', 'глаз'), ('на', 'память'), ('на', 'ощупь'),
    ('по', 'мере'), ('по', 'сути'), ('по', 'правде'), ('по', 'крайней'), ('по', 'всей'),
    ('не', 'то'), ('не', 'так'), ('не', 'раз'), ('не', 'в'), ('не', 'на'), ('не', 'для'),
    ('до', 'сих'), ('до', 'пор'), ('до', 'того'), ('до', 'конца'),
    ('за', 'счёт'), ('за', 'счет'), ('за', 'тем'), ('за', 'то'), ('за', 'что'),
    ('из', 'за'), ('из', 'под'), ('от', 'того'), ('с', 'тех'), ('с', 'пор')
}

EXPANSION_RULES = [
    # Pronoun expansions
    (r'\bкого\s*-\s*л\b\.?', 'кого-либо'),
    (r'\bкому\s*-\s*л\b\.?', 'кому-либо'),
    (r'\bком\s*-\s*л\b\.?', 'ком-либо'),
    (r'\bкем\s*-\s*л\b\.?', 'кем-либо'),
    (r'\bкто\s*-\s*л\b\.?', 'кто-либо'),
    (r'\bчто\s*-\s*л\b\.?', 'что-либо'),
    (r'\bчего\s*-\s*л\b\.?', 'чего-либо'),
    (r'\bчему\s*-\s*л\b\.?', 'чему-либо'),
    (r'\bчем\s*-\s*л\b\.?', 'чем-либо'),
    (r'\bчём\s*-\s*л\b\.?', 'чём-либо'),
    (r'\bкакой\s*-\s*л\b\.?', 'какой-либо'),
    (r'\bкакая\s*-\s*л\b\.?', 'какая-либо'),
    (r'\bкакое\s*-\s*л\b\.?', 'какое-либо'),
    (r'\bкакие\s*-\s*л\b\.?', 'какие-либо'),
    (r'\bкакого\s*-\s*л\b\.?', 'какого-либо'),
    (r'\bкакому\s*-\s*л\b\.?', 'какому-либо'),
    (r'\bкаким\s*-\s*л\b\.?', 'каким-либо'),
    (r'\bкаких\s*-\s*л\b\.?', 'каких-либо'),
    (r'\bкакими\s*-\s*л\b\.?', 'какими-либо'),
    (r'\bкаком\s*-\s*л\b\.?', 'каком-либо'),
    (r'\bкакую\s*-\s*л\b\.?', 'какую-либо'),
    (r'\bчей\s*-\s*л\b\.?', 'чей-либо'),
    (r'\bчья\s*-\s*л\b\.?', 'чья-либо'),
    (r'\bчьё\s*-\s*л\b\.?', 'чьё-либо'),
    (r'\bчьи\s*-\s*л\b\.?', 'чьи-либо'),
    (r'\bчьего\s*-\s*л\b\.?', 'чьего-либо'),
    (r'\bчьему\s*-\s*л\b\.?', 'чьему-либо'),
    (r'\bчьих\s*-\s*л\b\.?', 'чьих-либо'),
    (r'\bчьим\s*-\s*л\b\.?', 'чьим-либо'),
    (r'\bчьими\s*-\s*л\b\.?', 'чьими-либо'),
    (r'\bчьей\s*-\s*л\b\.?', 'чьей-либо'),
    (r'\bчью\s*-\s*л\b\.?', 'чью-либо'),
    (r'\bчьём\s*-\s*л\b\.?', 'чьём-либо'),
    (r'\bгде\s*-\s*л\b\.?', 'где-либо'),
    (r'\bкуда\s*-\s*л\b\.?', 'куда-либо'),
    (r'\bоткуда\s*-\s*л\b\.?', 'откуда-либо'),
    (r'\bкогда\s*-\s*л\b\.?', 'когда-либо'),
    (r'\bкак\s*-\s*л\b\.?', 'как-либо'),
    (r'\bсколько\s*-\s*л\b\.?', 'сколько-либо'),
    (r'\bскольких\s*-\s*л\b\.?', 'скольких-либо'),
    (r'\bскольким\s*-\s*л\b\.?', 'скольким-либо'),
    (r'\bсколькими\s*-\s*л\b\.?', 'сколькими-либо'),
    (r'\bкто\s*-\s*то\b', 'кто-то'),
    (r'\bктото\b', 'кто-то'),
    (r'\bчто\s*-\s*то\b', 'что-то'),
    (r'\bчтото\b', 'что-то'),
    (r'\bчего\s*-\s*то\b', 'чего-то'),
    (r'\bчему\s*-\s*то\b', 'чему-то'),
    (r'\bчем\s*-\s*то\b', 'чем-то'),
    (r'\bчём\s*-\s*то\b', 'чём-то'),
    (r'\bгде\s*-\s*то\b', 'где-то'),
    (r'\bгдето\b', 'где-то'),
    (r'\bкуда\s*-\s*то\b', 'куда-то'),
    (r'\bкудато\b', 'куда-то'),
    (r'\bкогда\s*-\s*то\b', 'когда-то'),
    (r'\bкогдато\b', 'когда-то'),
    (r'\bкак\s*-\s*то\b', 'как-то'),
    (r'\bкакто\b', 'как-то'),
    (r'\bкакой\s*-\s*то\b', 'какой-то'),
    (r'\bкакойто\b', 'какой-то'),
    (r'\bкакая\s*-\s*то\b', 'какая-то'),
    (r'\bкакаято\b', 'какая-то'),
    (r'\bкакое\s*-\s*то\b', 'какое-то'),
    (r'\bкакоето\b', 'какое-то'),
    (r'\bкакие\s*-\s*то\b', 'какие-то'),
    (r'\bкакието\b', 'какие-то'),
    (r'\bкакого\s*-\s*то\b', 'какого-то'),
    (r'\bкакому\s*-\s*то\b', 'какому-то'),
    (r'\bкаким\s*-\s*то\b', 'каким-то'),
    (r'\bкаких\s*-\s*то\b', 'каких-то'),
    (r'\bкакими\s*-\s*то\b', 'какими-то'),
    (r'\bкаком\s*-\s*то\b', 'каком-то'),
    (r'\bкакую\s*-\s*то\b', 'какую-то'),
    (r'\bкто\s*-\s*нибудь\b', 'кто-нибудь'),
    (r'\bчто\s*-\s*нибудь\b', 'что-нибудь'),
    (r'\bчего\s*-\s*нибудь\b', 'чего-нибудь'),
    (r'\bчему\s*-\s*нибудь\b', 'чему-нибудь'),
    (r'\bчем\s*-\s*нибудь\b', 'чем-нибудь'),
    (r'\bчём\s*-\s*нибудь\b', 'чём-нибудь'),
    (r'\bгде\s*-\s*нибудь\b', 'где-нибудь'),
    (r'\bкуда\s*-\s*нибудь\b', 'куда-нибудь'),
    (r'\bкогда\s*-\s*нибудь\b', 'когда-нибудь'),
    (r'\bкак\s*-\s*нибудь\b', 'как-нибудь'),
    (r'\bкакой\s*-\s*нибудь\b', 'какой-нибудь'),
    (r'\bкакая\s*-\s*нибудь\b', 'какая-нибудь'),
    (r'\bкакое\s*-\s*нибудь\b', 'какое-нибудь'),
    (r'\bкакие\s*-\s*нибудь\b', 'какие-нибудь'),
    (r'\bкакого\s*-\s*нибудь\b', 'какого-нибудь'),
    (r'\bкакому\s*-\s*нибудь\b', 'какому-нибудь'),
    (r'\bкаким\s*-\s*нибудь\b', 'каким-нибудь'),
    (r'\bкаких\s*-\s*нибудь\b', 'каких-нибудь'),
    (r'\bкакими\s*-\s*нибудь\b', 'какими-нибудь'),
    (r'\bкаком\s*-\s*нибудь\b', 'каком-нибудь'),
    (r'\bкакую\s*-\s*нибудь\b', 'какую-нибудь'),
    (r'\bиз\s*-\s*за\b', 'из-за'),
    (r'\bиз\s*-\s*под\b', 'из-под'),

    # Grammatical and editorial expansions
    (r'\bpl\b\.?', 'во мн. ч.'),
    (r'\bsing\b\.?', 'в ед. ч.'),
    (r'\battr\b\.?', 'в значении прилагательного'),
    (r'\bpredic\b\.?', 'в роли сказуемого'),
    (r'\bтж\b\.?', 'также'),
    (r'\bособ\b\.?', 'особенно'),
    (r'\bпреим\b\.?', 'преимущественно'),
    (r'\bобыкн\b\.?', 'обычно'),
    (r'\bнапр\b\.?', 'например'),
    (r'\bт\s*\.\s*е\b\.?', 'то есть'),
    (r'\bи\s*т\s*\.\s*п\b\.?', 'и тому подобное'),
    (r'\bи\s*т\s*\.\s*д\b\.?', 'и так далее'),
    (r'\bи\s*др\b\.?', 'и другие'),
    (r'\bсм\b\.\s*тж\b\.?', 'смотрите также'),
    (r'\bсм\b\.?', 'смотрите'),
    (r'\bср\b\.\s*тж\b\.?', 'сравните также'),
    (r'\bср\b\.?', 'сравните'),
    (r'\bбукв\b\.?', 'буквально'),

    # Fix glued prepositions and common OCR errors
    (r'\bначей\s*-\s*либо\b', 'на чей-либо'),
    (r'\bначей\s*-\s*л\b\.?', 'на чей-либо'),
    (r'\bначей\b', 'на чей'),
    (r'\bзанесение насчёт\b', 'занесение на счёт'),
    (r'\bнасчёт кого\b', 'на счёт кого'),
    (r'\bнасчёт чего\b', 'на счёт чего'),
    (r'\bвтирать\s+очкикому\s*-\s*л\b\.?', 'втирать очки кому-либо'),
    (r'\bочкикому\s*-\s*либо\b', 'очки кому-либо'),
    (r'\bочкикому\s*-\s*л\b\.?', 'очки кому-либо'),
    (r'\bочкикому\b', 'очки кому'),
    (r'\bко\s*-\s*му\s*-\s*л\b\.?', 'кому-либо'),
    (r'\bко\s*-\s*му\s*-\s*либо\b', 'кому-либо'),
    (r'\bко\s*-\s*му\b', 'кому'),
    (r'\bкк\s*ому\b', 'к кому'),
    (r'\bкко\s*-\s*му\b', 'к кому'),
    (r'\bкко\s*му\b', 'к кому'),
    (r'\bкем\s*-\s*то\b', 'кем-то'),
    (r'\bкем\s*-\s*нибудь\b', 'кем-нибудь'),
    (r'\bс\s+кем\s*-\s*л\b\.?', 'с кем-либо'),
    (r'\bс\s+кемл\b\.?', 'с кем-либо'),
    (r'\bс\s+кем\s*либо\b', 'с кем-либо'),
    (r'\bкемл\b\.?', 'кем-либо'),
    (r'\bкомл\b\.?', 'ком-либо'),
    (r'\bквартира\s+истол\b', 'квартира и стол'),
    (r'\bтои\s+пожнёшь\b', 'то и пожнёшь'),
    (r'\bвовремя\b(?=\s+миграции)', 'во время'),
    (r'\bво\s*время\b(?=\s+[а-яА-ЯёЁ]+)', 'во время'),
    (r'\bприсуждён\s+ное\b', 'присуждённое'),
    (r'\bнаграж\s*дённый\b', 'награждённый'),
]

ENGLISH_EXPANSIONS = [
    (r"\bsmb\.'s\b", "somebody's"),
    (r"\bsmb\b\.?", "somebody"),
    (r"\bsb\.'s\b", "somebody's"),
    (r"\bsb\b\.?", "somebody"),
    (r"\bsmth\b\.?", "something"),
    (r"\bsth\b\.?", "something"),
    (r"\bques\s+tion\b", "question"),
    (r"\bcon\s+siderable\b", "considerable"),
    (r"\btran\s+sitive\b", "transitive"),
]


def normalize_spaces(text: str) -> str:
    text = unicodedata.normalize("NFC", text)
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def normalize_headword(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("’", "'").replace("‘", "'")
    text = re.sub(r"\(cid:\d+\)", "-", text)
    text = re.sub(r"(?<=[A-Za-z])п(?=[A-Za-z])", "-", text)
    text = re.sub(r"\s*-\s*", "-", text)
    text = normalize_spaces(text)
    return text


def strip_markup(text: str) -> str:
    return re.sub(r"</?[a-zA-Z0-9]+[^>]*>", "", text)


def dedupe(values: Iterable[str]) -> list[str]:
    return list(dict.fromkeys(value for value in values if value))


def clean_plain(text: str) -> str:
    text = strip_markup(text)
    text = text.replace("≅", "≈")
    text = normalize_spaces(text)
    text = re.sub(r"\s+([,.;:!?%)\]])", r"\1", text)
    text = re.sub(r"([([])\s+", r"\1", text)
    text = re.sub(r"\s+([-–—])\s+", r" \1 ", text)
    return text.strip(" ;:")


def clean_english_phrase(text: str, headword: str) -> tuple[str, list[str]]:
    text = clean_plain(text)
    if not text:
        return "", []

    base = re.sub(r"[1-9]$", "", headword)
    forms = {
        "~est": base + "est",
        "~er": base + "er",
        "~ies": (base[:-1] + "ies") if base.endswith("y") else base + "ies",
        "~ing": (base[:-1] + "ing") if base.endswith("e") else base + "ing",
        "~ed": (base + "d") if base.endswith("e") else base + "ed",
        "~d": (base + "d") if base.endswith("e") else base + "ed",
        "~s": (base[:-1] + "ies") if base.endswith("y") else base + "s",
        "~'s": base + "'s",
        "~": base,
    }
    for source in sorted(forms, key=len, reverse=True):
        text = text.replace(source, forms[source])

    # 1. Expand single-letter headword abbreviation: e.g. 'Holy A.' -> 'Holy Alliance'
    if base:
        cap_initial = base[0].upper()
        text = re.sub(rf"\b{cap_initial}\.(?!\w)", base, text)

    # 2. Extract and strip Russian register tags from English phrase
    found_regs: list[str] = []
    for tag, reg_val in sorted(REGISTER_MAP.items(), key=lambda x: len(x[0]), reverse=True):
        tag_clean = tag.rstrip(".")
        tag_pattern = rf"(?<!\w){re.escape(tag_clean)}\.?(?!\w)"
        if re.search(tag_pattern, text, flags=re.IGNORECASE):
            found_regs.append(reg_val)
            text = re.sub(tag_pattern, "", text, flags=re.IGNORECASE)

    # 3. Clean Russian editorial annotations inside English phrase:
    text = re.sub(r"\bили\b", "or", text, flags=re.IGNORECASE)
    text = re.sub(r"\(с\s+inf\.?\)", "(+ inf.)", text, flags=re.IGNORECASE)
    text = re.sub(r"\bpl\s+собир\.?", "pl", text, flags=re.IGNORECASE)
    text = re.sub(r"\bсобир\.?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\[(?:см\.|сравн\.)[^\]]*\]", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\((?:употр\.|обыкн\.|часто|редко|сокр\.)[^)]*\)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\[[^\]]*\]", "", text)  # strip leftover phonetic brackets
    text = re.sub(r"^[=\s]+", "", text)  # strip leading =
    text = re.sub(r"\s+[=]\s*$", "", text)  # strip trailing =
    text = re.sub(r"\bв\s+значении\s+прилагательного\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\bв\s+роли\s+сказуемого\b", "", text, flags=re.IGNORECASE)

    for pattern, repl in ENGLISH_EXPANSIONS:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)

    text = re.sub(r"\(\s+", "(", text)
    text = re.sub(r"\s+\)", ")", text)
    text = re.sub(r"\s+", " ", text).strip(" ,:;=")
    return text, dedupe(found_regs)


def expand_english_phrase(text: str, headword: str) -> str:
    cleaned, _ = clean_english_phrase(text, headword)
    return cleaned


INVALID_COMBINATIONS = {
    'начей', 'начейский', 'начейство', 'значейства', 'казначейст',
    'сили', 'ливы', 'отчего'
}

PRONOUN_BASES = {
    'чей', 'чью', 'чьё', 'чье', 'чьи', 'чьих', 'чьем', 'чьём',
    'кого', 'кому', 'кем', 'ком', 'что', 'чего', 'чему', 'чем', 'чём',
    'какой', 'какая', 'какое', 'какие', 'какого', 'какому', 'каким', 'каких', 'какими', 'каком', 'какую'
}


def token_smart_rejoin(text: str, vocab: set[str]) -> str:
    tokens = re.split(r'(\s+|[^\w\s])', text)
    tokens = [t for t in tokens if t]

    changed = True
    iterations = 0
    while changed and iterations < 6:
        changed = False
        iterations += 1
        i = 0
        new_tokens = []
        while i < len(tokens):
            if i + 2 < len(tokens) and tokens[i + 1].isspace() and re.match(r'^[а-яА-ЯёЁ]+$', tokens[i]) and re.match(r'^[а-яА-ЯёЁ]+$', tokens[i + 2]):
                w1 = tokens[i]
                w2 = tokens[i + 2]
                w1_low, w2_low = w1.lower(), w2.lower()
                combined = w1_low + w2_low

                # Never join prepositions with pronoun bases
                if w1_low in SINGLE_PREPS and w2_low in PRONOUN_BASES:
                    new_tokens.append(tokens[i])
                    i += 1
                    continue

                if combined in INVALID_COMBINATIONS:
                    new_tokens.append(tokens[i])
                    i += 1
                    continue

                # Check if w2 + w3 is a valid word and w1 is a single preposition
                if i + 4 < len(tokens) and tokens[i + 3].isspace() and re.match(r'^[а-яА-ЯёЁ]+$', tokens[i + 4]):
                    w3 = tokens[i + 4]
                    if (w2_low + w3.lower()) in vocab and w1_low in SINGLE_PREPS:
                        new_tokens.append(tokens[i])
                        i += 1
                        continue

                if (w1_low, w2_low) in VALID_TWO_WORD_PREPS:
                    new_tokens.append(tokens[i])
                    i += 1
                    continue

                if w1_low in {'в', 'к', 'с', 'у', 'о'} and w2_low in vocab and len(w2_low) >= 3:
                    new_tokens.append(tokens[i])
                    i += 1
                    continue

                if combined in vocab:
                    if w1.isupper() and w2.isupper():
                        joined = combined.upper()
                    elif w1[0].isupper():
                        joined = combined.capitalize()
                    else:
                        joined = combined
                    new_tokens.append(joined)
                    i += 3
                    changed = True
                    continue
            new_tokens.append(tokens[i])
            i += 1
        tokens = new_tokens

    return ''.join(tokens)


KNOWN_HYPHEN_PREFIXES = {
    ('по', 'видимому'): 'по-видимому',
    ('по', 'прежнему'): 'по-прежнему',
    ('по', 'моему'): 'по-моему',
    ('по', 'твоему'): 'по-твоему',
    ('по', 'своему'): 'по-своему',
    ('по', 'новому'): 'по-новому',
    ('по', 'старому'): 'по-старому',
    ('кое', 'как'): 'кое-как',
    ('кое', 'кто'): 'кое-кто',
    ('кое', 'что'): 'кое-что',
    ('кое', 'где'): 'кое-где',
    ('кое', 'куда'): 'кое-куда',
}


def clean_ocr_hyphens(text: str) -> str:
    def repl(m):
        w1 = m.group(1).lower()
        w2 = m.group(2).lower()
        if (w1, w2) in KNOWN_HYPHEN_PREFIXES:
            return KNOWN_HYPHEN_PREFIXES[(w1, w2)]
        return m.group(1) + m.group(2)

    text = re.sub(r'([а-яА-ЯёЁйЙ]+)[\-\­]\s+([а-яА-ЯёЁйЙ]+)', repl, text)
    text = text.replace('лй- нию', 'линию').replace('лйнию', 'линию')
    return text


def deep_clean_russian(text: str, vocab: set[str], word: str = "") -> str:
    if not text:
        return ""
    text = clean_plain(text)

    # Strip OCR transcription fragments like [риЦ or [puʃ]
    text = re.sub(r"^\[[^\]]{1,120}\]\s*", "", text)
    text = re.sub(r"^\d+\.\s*(?:[a-zA-Z]+\s+)?(?:\d+\)\s*)?", "", text)

    # Clean OCR line break hyphens
    text = clean_ocr_hyphens(text)

    # Expand any tildes if word is provided
    if word:
        base = re.sub(r"[1-9]$", "", word)
        forms = {
            "~est": base + "est",
            "~er": base + "er",
            "~ies": (base[:-1] + "ies") if base.endswith("y") else base + "ies",
            "~ing": (base[:-1] + "ing") if base.endswith("e") else base + "ing",
            "~ed": (base + "d") if base.endswith("e") else base + "ed",
            "~d": (base + "d") if base.endswith("e") else base + "ed",
            "~s": (base[:-1] + "ies") if base.endswith("y") else base + "s",
            "~'s": base + "'s",
            "~": base,
        }
        for source in sorted(forms, key=len, reverse=True):
            text = text.replace(source, forms[source])

    # Lowercase stressed capital letters inside words: "манИльская" -> "манильская"
    text = re.sub(r'([а-яё])[А-ЯЁ]([а-яё])', lambda m: m.group(1) + m.group(0)[1].lower() + m.group(2), text)
    text = re.sub(r'\b([а-яё]{1,4})([А-ЯЁ])([а-яё]+)\b', lambda m: m.group(1) + m.group(2).lower() + m.group(3), text)
    text = re.sub(r'\b([а-яё]{1,3})([А-ЯЁ])\s+([а-яё]+)\b', lambda m: m.group(1) + m.group(2).lower() + m.group(3), text)

    # Standard Russian expansions & fixes
    for pattern, repl in EXPANSION_RULES:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)

    # Clean government patterns e.g. (with, against — с; on, about — о) -> (с кем-либо; о ком-либо/чём-либо)
    text = clean_government_patterns(text)

    # English expansions inside Russian text (e.g. government patterns like 'against smb.')
    for pattern, repl in ENGLISH_EXPANSIONS:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)

    # Clean OCR line break hyphens again after expansions
    text = clean_ocr_hyphens(text)

    # Token smart rejoin
    text = token_smart_rejoin(text, vocab)

    # Final fix for glued phrases that might be re-glued by token_smart_rejoin
    text = text.replace("занесение насчёт", "занесение на счёт")
    text = text.replace("начей", "на чей")

    # Clean double spaces and punctuation spaces
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s+([,.;:!?%)\]])', r'\1', text)
    text = re.sub(r'([([])\s+', r'\1', text)
    return text.strip(" ;:")




def registers_in_text(text: str) -> list[str]:
    found: list[str] = []
    lowered = text.lower()
    for key in sorted(REGISTER_MAP, key=len, reverse=True):
        pattern = rf"(?<!\w){re.escape(key)}(?!\w)"
        if re.search(pattern, lowered, flags=re.IGNORECASE):
            found.append(REGISTER_MAP[key])
    return dedupe(found)


def remove_register_tokens(text: str) -> str:
    for key in sorted(REGISTER_MAP, key=len, reverse=True):
        text = re.sub(rf"(?<!\w){re.escape(key)}(?!\w)", "", text, flags=re.IGNORECASE)
    return text


def strip_roman_suffix(headword: str) -> tuple[str, str | None]:
    match = ROMAN_SUFFIX_RE.search(headword)
    if not match:
        return headword.strip(), None
    return headword[: match.start()].strip(), match.group(1)


def expand_parenthetical_spelling(headword: str) -> list[str]:
    match = re.search(r"\(([^)]+)\)", headword)
    if not match:
        return [headword]
    prefix = headword[: match.start()]
    optional = match.group(1)
    suffix = headword[match.end() :]
    return [
        normalize_headword(f"{prefix}{optional}{suffix}"),
        normalize_headword(f"{prefix}{suffix}"),
    ]


def article_aliases(headword: str) -> set[str]:
    base, _ = strip_roman_suffix(headword)
    base = normalize_headword(base)
    aliases: set[str] = set()
    variants = [part.strip() for part in re.split(r"\s*,\s*", base) if part.strip()]
    for variant in variants:
        for expanded in expand_parenthetical_spelling(variant):
            normalized = expanded.lower().strip()
            aliases.add(normalized)
            if not normalized.startswith("-") and not normalized.endswith("-"):
                aliases.add(normalized.replace("-", " "))
                aliases.add(normalized.replace(" ", "-"))
                aliases.add(re.sub(r"[- .]", "", normalized))
    return {alias for alias in aliases if alias}


def build_article_index(articles: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    index: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for article in articles:
        for alias in article_aliases(article["headword"]):
            index[alias].append(article)
    return index


def oxford_lookup_keys(word: str) -> tuple[list[str], int | None]:
    word = normalize_headword(word).lower()
    digit_match = re.fullmatch(r"(.+?)([1-9])", word)
    homonym_number = int(digit_match.group(2)) if digit_match else None
    base = digit_match.group(1) if digit_match else word
    keys = [
        base,
        base.replace("-", " "),
        base.replace(" ", "-"),
        re.sub(r"[- .]", "", base),
    ]
    return list(dict.fromkeys(keys)), homonym_number


def article_match_rank(word: str, article: dict[str, Any]) -> int:
    normalized_word = normalize_headword(word)
    digit_match = re.fullmatch(r"(.+?)([1-9])", normalized_word)
    target = digit_match.group(1) if digit_match else normalized_word
    source, _ = strip_roman_suffix(article["headword"])
    source = normalize_headword(source)
    direct = [part.strip() for part in re.split(r"\s*,\s*", source) if part.strip()]
    expanded = {
        spelling
        for variant in direct
        for spelling in expand_parenthetical_spelling(variant)
        if spelling not in direct
    }

    if target in direct:
        return 0
    if target.lower() in {variant.lower() for variant in direct}:
        return 1
    if target in expanded:
        return 2
    if target.lower() in {variant.lower() for variant in expanded}:
        return 3

    target_spaced = re.sub(r"[- ]+", " ", target.lower()).strip()
    target_compact = re.sub(r"[- .]", "", target.lower())
    for variant in [*direct, *expanded]:
        lowered = variant.lower().strip()
        if lowered.startswith("-") or lowered.endswith("-"):
            continue
        if re.sub(r"[- ]+", " ", lowered).strip() == target_spaced:
            return 4
        if re.sub(r"[- .]", "", lowered) == target_compact:
            return 5
    return 99


def select_articles(word: str, index: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    keys, homonym_number = oxford_lookup_keys(word)
    candidates: list[dict[str, Any]] = []
    seen: set[tuple[int, int, float, str]] = set()
    for key in keys:
        for article in index.get(key, []):
            identity = (article["page"], article["column"], article.get("top", 0), article["headword"])
            if identity not in seen:
                seen.add(identity)
                candidates.append(article)

    if candidates:
        best_rank = min(article_match_rank(word, article) for article in candidates)
        candidates = [
            article
            for article in candidates
            if article_match_rank(word, article) == best_rank
        ]

    if word.lower() == "a":
        article_a = [
            article
            for article in candidates
            if strip_roman_suffix(article["headword"])[1] == "II"
        ]
        if article_a:
            return article_a

    if homonym_number is None:
        return candidates

    roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][homonym_number - 1]
    exact = [article for article in candidates if strip_roman_suffix(article["headword"])[1] == roman]
    if exact:
        return exact
    if len(candidates) >= homonym_number:
        return [candidates[homonym_number - 1]]
    return []


def spelling_variants(word: str) -> list[str]:
    variants: list[str] = []
    replacements = (
        ("ization", "isation"),
        ("isation", "ization"),
        ("ize", "ise"),
        ("ise", "ize"),
        ("or", "our"),
        ("our", "or"),
        ("eling", "elling"),
        ("elling", "eling"),
    )
    for source, target in replacements:
        if word.endswith(source):
            variants.append(word[: -len(source)] + target)
    return variants


SOURCE_FORM_EQUIVALENTS = {
    "arms": "arm2",
    "tactic": "tactics",
    "terms": "term",
    "thanks": "thank",
}


def resolve_entry_articles(
    word: str, index: dict[str, list[dict[str, Any]]]
) -> tuple[list[dict[str, Any]], str]:
    selected = select_articles(word, index)
    if selected:
        return selected, "exact"
    for variant in spelling_variants(word.lower()):
        selected = select_articles(variant, index)
        if selected:
            return selected, f"spelling:{variant}"
    source_form = SOURCE_FORM_EQUIVALENTS.get(word.lower())
    if source_form:
        selected = select_articles(source_form, index)
        if selected:
            return selected, f"source_form:{source_form}"
    return [], "missing"


class Marker:
    def __init__(self, start: int, end: int, number: int):
        self.start = start
        self.end = end
        self.number = number


def find_top_level_markers(text: str, delimiter: str) -> list[Marker]:
    markers: list[Marker] = []
    paren_depth = 0
    bracket_depth = 0
    index = 0
    while index < len(text):
        if text.startswith("<i>", index):
            index += 3
            continue
        if text.startswith("</i>", index):
            index += 4
            continue
        char = text[index]
        if char == "(":
            paren_depth += 1
        elif char == ")":
            if paren_depth > 0:
                paren_depth -= 1
        elif char == "[":
            bracket_depth += 1
        elif char == "]":
            if bracket_depth > 0:
                bracket_depth -= 1
        elif char.isdigit() and paren_depth == 0 and bracket_depth == 0:
            previous = text[index - 1] if index else " "
            if previous.isspace() or index == 0:
                end = index + 1
                while end < len(text) and text[end].isdigit():
                    end += 1
                if end < len(text) and text[end] == delimiter:
                    markers.append(Marker(index, end + 1, int(text[index:end])))
                    index = end + 1
                    continue
        index += 1
    return markers


def split_top_level(text: str, delimiter: str = ";") -> list[str]:
    parts: list[str] = []
    start = 0
    paren_depth = 0
    bracket_depth = 0
    index = 0
    while index < len(text):
        if text.startswith("<i>", index):
            index += 3
            continue
        if text.startswith("</i>", index):
            index += 4
            continue
        char = text[index]
        if char == "(":
            paren_depth += 1
        elif char == ")":
            if paren_depth > 0:
                paren_depth -= 1
        elif char == "[":
            bracket_depth += 1
        elif char == "]":
            if bracket_depth > 0:
                bracket_depth -= 1
        elif char == delimiter and paren_depth == 0 and bracket_depth == 0:
            parts.append(text[start:index])
            start = index + 1
        index += 1
    parts.append(text[start:])
    return [part.strip() for part in parts if part.strip()]


def pos_prefix(text: str) -> tuple[str | None, list[str], str]:
    text = re.sub(r"^\s*\[[^\]]{1,160}\]\s*", "", text)
    morphology_match = re.match(r"^\s*(\([^)]{1,160}\))\s*", text)
    if morphology_match:
        candidate_tail = text[morphology_match.end() :].strip()
        candidate_pos, candidate_registers, candidate_content = pos_prefix(candidate_tail)
        if candidate_pos:
            morphology = morphology_match.group(1)
            content = morphology + (" " + candidate_content if candidate_content else "")
            return candidate_pos, candidate_registers, content

    match = re.match(r"^\s*((?:<i>.*?</i>\s*)+)", text)
    if not match:
        plain_pos = re.match(
            r"^\s*(adv|adj|pron|prep|conj|pref|suff|art|part|int|num|cj|vi|vt|n|v|a)(?=\s)",
            text,
            re.IGNORECASE,
        )
        if plain_pos:
            token = plain_pos.group(1).lower()
            return POS_MAP.get(token, "other"), [], text[plain_pos.end() :].strip()
        return None, [], text.strip()

    descriptor = normalize_spaces(" ".join(re.findall(r"<i>(.*?)</i>", match.group(1))))
    pos_pattern = re.compile(
        r"^(pres\.?\s*p\.|p\.\s*p\.|\u0440\.\s*\u0440\.|adv|adj|pron|prep|conj|pref|suff|art|part|int|num|cj|vi|vt|n|v|a)(?=\s|[,.:]|$)[.,:]?\s*",
        re.IGNORECASE,
    )
    found: list[str] = []
    remaining = descriptor
    while True:
        pos_match = pos_pattern.match(remaining)
        if not pos_match:
            break
        token = re.sub(r"\s+", " ", pos_match.group(1).lower())
        if re.fullmatch(r"pres\.? p\.", token):
            token = "pres. p."
        elif re.fullmatch(r"\u0440\. \u0440\.", token):
            token = "р. р."
        found.append(POS_MAP.get(token, "other"))
        remaining = remaining[pos_match.end() :].lstrip(" ,")

    if not found:
        lowered_descriptor = descriptor.lower()
        if "артикль" in lowered_descriptor:
            return "article", [], text.strip()
        if "глагол" in lowered_descriptor:
            return "verb", registers_in_text(descriptor), text.strip()
        return None, [], text.strip()

    registers = registers_in_text(remaining)
    remaining = remove_register_tokens(remaining)
    remaining = normalize_spaces(remaining).strip(" ,:;")
    tail = text[match.end() :].strip()
    if remaining:
        tail = f"<i>{remaining}</i>" + (" " + tail if tail else "")
    pos_value = "/".join(dedupe(found))
    return pos_value, registers, tail


def major_sections(body: str) -> list[tuple[str | None, list[str], str]]:
    markers = find_top_level_markers(body, ".")
    prefix_registers: list[str] = []
    morphology_prefix = ""
    raw_sections: list[str] = [body.strip()]

    if markers and markers[0].number == 1:
        prefix = body[: markers[0].start].strip()
        prefix_registers = registers_in_text(strip_markup(prefix))
        prefix_without_registers = remove_register_tokens(prefix)
        prefix_pos, _, prefix_tail = pos_prefix(prefix_without_registers)
        if prefix_pos and not clean_plain(prefix_tail):
            prefix_without_registers = ""
        prefix_plain = clean_plain(prefix_without_registers)
        prefix_plain = re.sub(r"^\[[^\]]{1,120}\]\s*", "", prefix_plain)
        if prefix_plain:
            morphology_prefix = prefix_plain
        raw_sections = []
        for index, marker in enumerate(markers):
            end = markers[index + 1].start if index + 1 < len(markers) else len(body)
            raw_sections.append(body[marker.end:end].strip())
    elif markers and markers[0].number >= 2 and pos_prefix(body)[0]:
        raw_sections = [body[: markers[0].start].strip()]
        for index, marker in enumerate(markers):
            end = markers[index + 1].start if index + 1 < len(markers) else len(body)
            raw_sections.append(body[marker.end:end].strip())

    sections: list[tuple[str | None, list[str], str]] = []
    previous_pos: str | None = None
    for index, raw in enumerate(raw_sections):
        part_of_speech, registers, content = pos_prefix(raw)
        registers = dedupe([*prefix_registers, *registers])
        if index == 0 and morphology_prefix:
            content = morphology_prefix + (" " + content if content else "")
        if part_of_speech is None and len(raw_sections) > 1 and index == 0:
            later_has_verb = any(
                pos_prefix(candidate)[0] == "verb" for candidate in raw_sections[1:]
            )
            if later_has_verb or re.match(r"^\s*\(<i>pl</i>", content):
                part_of_speech = "noun"
        if part_of_speech is None:
            part_of_speech = previous_pos
        previous_pos = part_of_speech or previous_pos
        sections.append((part_of_speech, registers, content))
    return sections


def split_senses(text: str) -> list[str]:
    markers = find_top_level_markers(text, ")")
    if not markers:
        return [text.strip()] if text.strip() else []

    prefix = text[: markers[0].start].strip()
    senses: list[str] = []
    for index, marker in enumerate(markers):
        end = markers[index + 1].start if index + 1 < len(markers) else len(text)
        content = text[marker.end:end].strip()
        if index == 0 and prefix:
            content = prefix + (" " + content if content else "")
        senses.append(content)
    return [sense for sense in senses if sense]


def remove_leading_registers(text: str) -> tuple[list[str], str]:
    registers: list[str] = []
    remaining = text.strip()
    while True:
        match = re.match(r"^<i>(.*?)</i>\s*", remaining)
        if not match:
            break
        content = normalize_spaces(match.group(1))
        found = registers_in_text(content)
        if not found:
            break
        residual = content
        residual = remove_register_tokens(residual)
        residual = normalize_spaces(residual).strip(" ,:;")
        registers.extend(found)
        remaining = remaining[match.end() :].lstrip(" ,;:")
        if residual:
            remaining = f"<i>{residual}</i>" + (" " + remaining if remaining else "")
            break
    return dedupe(registers), remaining


def starts_like_example(text: str) -> bool:
    parenthetical = re.match(r"^\s*(\([^)]*\))\s*(.*)$", strip_markup(text))
    if parenthetical and re.match(r"[А-Яа-яЁё]", parenthetical.group(2).lstrip(" (")):
        return False
    leading_italic = re.match(r"^\s*\(?\s*<i>(.*?)</i>", text)
    if leading_italic:
        annotation = normalize_spaces(leading_italic.group(1)).lower().strip(" .,:;")
        if re.match(
            r"^(?:pl|sing|attr|predic|card|ord|poss|pers|refl|emph|neg|inter|rel|conj|indef|demonstr|imp|impers|recipr|inf|pass|perf|absol|subst|trans|intr|обыкн|обычно|часто|редко|употр|особ|тж|букв)(?:\.|\b)",
            annotation,
        ):
            return False
    plain = clean_plain(text).lstrip("(—–- ")
    if not plain:
        return False
    if re.match(r"[А-Яа-яЁё]", plain):
        return False
    return plain.startswith("~") or plain.startswith("=") or bool(re.match(r"[A-Za-z£$]", plain))


def top_level_colon(text: str) -> int | None:
    parts = split_top_level(text, ":")
    if len(parts) < 2:
        return None
    offset = 0
    for before in parts[:-1]:
        offset = text.find(":", offset + len(before))
        suffix = text[offset + 1 :].strip()
        if starts_like_example(suffix):
            return offset
        offset += 1
    return None


def first_cyrillic_outside_italic(text: str) -> int | None:
    in_italic = False
    index = 0
    while index < len(text):
        if text.startswith("<i>", index):
            in_italic = True
            index += 3
            continue
        if text.startswith("</i>", index):
            in_italic = False
            index += 4
            continue
        if not in_italic and re.match(r"[А-Яа-яЁё]", text[index]):
            return index
        index += 1
    return None


def is_valid_example(en: str, ru: str) -> bool:
    if not en or not ru or not ru.strip():
        return False
    if re.search(r"[а-яА-ЯёЁ]", en):
        return False
    en_clean = en.strip().lower()
    if en_clean in [
        "to", "of", "for", "with", "in", "at", "on", "into", "by", "from",
        "as", "there is", "with one's", "i have no", "by (or in)", "what's", "as opposed to",
        "it is", "one's", "somebody's", "something's"
    ]:
        return False
    words = en_clean.split()
    if len(words) < 2:
        return False
    return True


def split_example_clause(clause: str, word: str, vocab: set[str]) -> tuple[dict[str, str] | None, list[str]]:
    clause = clause.strip()
    if not clause or not starts_like_example(clause):
        return None, []

    boundary = first_cyrillic_outside_italic(clause)
    if boundary is None or boundary == 0:
        return None, []

    en_raw = clause[:boundary]
    ru_raw = clause[boundary:]
    en, regs = clean_english_phrase(clean_plain(en_raw), word)
    ru = deep_clean_russian(ru_raw, vocab, word)
    if not is_valid_example(en, ru):
        return None, []
    return {"en": en, "ru": ru}, regs


def split_sense_payload(sense_text: str, word: str, vocab: set[str]) -> tuple[str, list[dict[str, str]], list[str]]:
    sense_text = sense_text.strip()
    colon_index = top_level_colon(sense_text)
    translation_source = sense_text
    example_clauses: list[str] = []

    if colon_index is not None:
        translation_source = sense_text[:colon_index].strip()
        example_clauses = split_top_level(sense_text[colon_index + 1 :].strip(), ";")
    else:
        clauses = split_top_level(sense_text, ";")
        first_example_index: int | None = None
        for index, clause in enumerate(clauses):
            if starts_like_example(clause):
                first_example_index = index
                break
        if first_example_index is not None:
            translation_source = "; ".join(clauses[:first_example_index]).strip()
            example_clauses = clauses[first_example_index:]

    examples: list[dict[str, str]] = []
    collected_registers: list[str] = []
    for clause in example_clauses:
        parsed, regs = split_example_clause(clause, word, vocab)
        if parsed:
            examples.append(parsed)
            collected_registers.extend(regs)
        elif not translation_source and not examples:
            translation_source = clause

    translation = deep_clean_russian(translation_source, vocab, word)
    return translation, examples, dedupe(collected_registers)


def parse_phrasal_block(text: str, word: str, part_of_speech: str, registers: list[str], vocab: set[str]) -> list[dict[str, Any]]:
    text = text.lstrip(" ¬♦").strip()
    lead_registers, text = remove_leading_registers(text)
    registers = dedupe([*registers, *lead_registers])

    unit_split_re = re.compile(
        rf"(\s+(?:¬\s*)?~\s+(?:{PHRASAL_PARTICLES})\b|\s+[¬♦]\s+|\s*;\s*(?=(?:to\s+)?~|(?:to\s+)?[a-zA-Z\s]+[—–-]))"
    )
    raw_chunks = unit_split_re.split(text)

    units: list[str] = []
    current = raw_chunks[0].strip()
    i = 1
    while i < len(raw_chunks):
        delim = raw_chunks[i].strip()
        body = raw_chunks[i + 1].strip() if i + 1 < len(raw_chunks) else ""
        if current:
            units.append(current)
        current = (delim + " " + body).strip()
        i += 2
    if current:
        units.append(current)

    results: list[dict[str, Any]] = []
    for u in units:
        u = u.lstrip(" ¬♦;").strip()
        if not u:
            continue
        u_lead_regs, u_clean = remove_leading_registers(u)
        u_regs = dedupe([*registers, *u_lead_regs])

        boundary = first_cyrillic_outside_italic(u_clean)
        if boundary is not None and boundary > 0:
            en_part = u_clean[:boundary].strip(" —–-:")
            ru_part = u_clean[boundary:].strip(" —–-:")
            en, en_regs = clean_english_phrase(clean_plain(en_part), word)
            ru = deep_clean_russian(ru_part, vocab, word)
            u_regs = dedupe([*u_regs, *en_regs])
            if is_valid_example(en, ru):
                m_item = {
                    "partOfSpeech": part_of_speech,
                    "translation": "",
                    "examples": [{"en": en, "ru": ru}],
                }
                if u_regs:
                    m_item["register"] = u_regs
                results.append(m_item)
            elif ru:
                m_item = {
                    "partOfSpeech": part_of_speech,
                    "translation": ru,
                    "examples": [],
                }
                if u_regs:
                    m_item["register"] = u_regs
                results.append(m_item)
        else:
            clean_ru = deep_clean_russian(u_clean, vocab, word)
            if clean_ru:
                m_item = {
                    "partOfSpeech": part_of_speech,
                    "translation": clean_ru,
                    "examples": [],
                }
                if u_regs:
                    m_item["register"] = u_regs
                results.append(m_item)

    return results


PHRASAL_PARTICLES = (
    r"down|in|out|off|away|up|over|through|back|on|about|along|across|around|"
    r"by|for|from|into|of|to|with|upon|ahead|apart|aside|forth|together|under"
)
PHRASAL_SPLIT_RE = re.compile(
    rf"(\s+[¬♦]\s+|(?:(?<=[а-яА-ЯёЁ])|(?<=[а-яА-ЯёЁ]\))|(?<=\.\))|(?<=>)|(?<=>\)))\s+(?:¬\s*)?~\s+(?:{PHRASAL_PARTICLES})\b)"
)


def clean_government_patterns(text: str) -> str:
    def repl_gov(m):
        content = m.group(1).strip()
        major_clauses = [c.strip() for c in content.split(";") if c.strip()]
        clauses = []
        for mc in major_clauses:
            dashes = len(re.findall(r"[—–-]", mc))
            if dashes > 1:
                clauses.extend(re.split(r",\s*(?=[a-zA-Z\s,]+[—–-])", mc))
            else:
                clauses.append(mc)

        ru_parts = []
        for c in clauses:
            c = c.strip()
            if not c:
                continue
            if "—" in c or "–" in c or "-" in c:
                parts = re.split(r"\s*[—–-]\s*", c, maxsplit=1)
                ru = parts[1].strip() if len(parts) > 1 else ""
                if ru in ["с", "со"]:
                    ru = "с кем-либо"
                elif ru in ["до"]:
                    ru = "до чего-либо"
                elif ru in ["о", "об", "обо"]:
                    ru = "о ком-либо/чём-либо"
                elif ru in ["к", "ко"]:
                    ru = "к кому-либо/чему-либо"
                elif ru in ["над"]:
                    ru = "над кем-либо/чем-либо"
                elif ru in ["под"]:
                    ru = "под чем-либо"
                elif ru in ["в", "во"]:
                    ru = "в чём-либо"
                elif ru in ["на"]:
                    ru = "на что-либо"
                elif ru in ["за"]:
                    ru = "за что-либо"
                elif ru in ["от"]:
                    ru = "от чего-либо"
                elif ru in ["из"]:
                    ru = "из чего-либо"
                elif ru in ["перед"]:
                    ru = "перед кем-либо"
                if ru:
                    ru_parts.append(ru)
            else:
                p_low = c.lower()
                if p_low in ["about", "on", "upon"]:
                    ru_parts.append("о чём-либо")
                elif p_low in ["to"]:
                    ru_parts.append("к чему-либо")
                elif p_low in ["of"]:
                    ru_parts.append("чего-либо")
                elif p_low in ["for"]:
                    ru_parts.append("для чего-либо")
                elif p_low in ["with"]:
                    ru_parts.append("с кем-либо")
                elif p_low in ["in"]:
                    ru_parts.append("в чём-либо")
                elif p_low in ["at"]:
                    ru_parts.append("на что-либо")
                elif p_low in ["from"]:
                    ru_parts.append("от чего-либо")
    text = re.sub(r"\[\-[a-zA-Z]+\]", "", text)
    text = re.sub(r",\s*-\w+\b", "", text)
    text = re.sub(r"\(([a-zA-Z\s,;]+(?:\s*[—–]\s*|\s+-\s+)[^)]*?)\)", repl_gov, text)
    text = re.sub(
        r"\(\s*(?:to|of|for|with|in|at|from|on|upon|about|towards|between|against|into)\s*\)",
        "",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        r"\(\s*(?:to|for|on|upon|about|towards|with|from)\s*,\s*(?:to|for|on|upon|about|towards|with|from)\s*\)",
        "",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"\brefl\.\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip(" ,:;")
    return text


def extract_collocation_notes(trans: str, word: str) -> tuple[str, list[dict[str, str]]]:
    new_examples: list[dict[str, str]] = []

    def repl_colloc(m):
        content = m.group(1).strip()
        ru_clean = re.sub(r"\([^)]*~[^)]*\)", "", trans).strip(" ,:;")
        if re.search(r"\b(the|a|an)\s+~", content, flags=re.IGNORECASE):
            art_m = re.search(r"\b(the|a|an)\b", content, flags=re.IGNORECASE)
            art = art_m.group(1) if art_m else "the"
            if ru_clean and is_valid_example(f"{art} {word}", ru_clean):
                new_examples.append({"en": f"{art} {word}", "ru": ru_clean})
            return ""

        phrases = re.split(r"[,;]|или", content)
        for p in phrases:
            p_clean = re.sub(
                r"^(?:также|часто|обыкн\.|обычно|редко|тж\.|сокр\.)\s+",
                "",
                p.strip(),
                flags=re.IGNORECASE,
            )
            p_clean = re.sub(r"^to\s+", "", p_clean).strip()
            if "~" in p_clean:
                en_phrase = expand_english_phrase(p_clean, word)
                if is_valid_example(en_phrase, ru_clean):
                    new_examples.append({"en": en_phrase, "ru": ru_clean})
        return ""

    clean_trans = re.sub(r"\(([^)]*~[^)]*)\)", repl_colloc, trans)

    # Also handle bare tildes left in translation e.g. "medical ~" or "~ hit попадание в цель"
    if "~" in clean_trans:
        parts = clean_trans.split(";")
        remaining_trans = []
        for pt in parts:
            pt = pt.strip()
            if "~" in pt:
                en_match = re.search(r"(?:(?:to|a|an|the|[a-zA-Z]+)\s+)?~(?:\s+[a-zA-Z]+)?", pt)
                if en_match:
                    en_chunk = en_match.group(0)
                    ru_chunk = (pt[: en_match.start()] + " " + pt[en_match.end() :]).strip(" ,:;—–-")
                    en_clean = expand_english_phrase(en_chunk, word)
                    ru_clean = deep_clean_russian(ru_chunk, set())
                    if is_valid_example(en_clean, ru_clean):
                        new_examples.append({"en": en_clean, "ru": ru_clean})
                    elif ru_clean:
                        remaining_trans.append(ru_clean)
                else:
                    remaining_trans.append(pt.replace("~", word))
            else:
                remaining_trans.append(pt)
        clean_trans = "; ".join(remaining_trans)

    clean_trans = re.sub(r"\s+", " ", clean_trans).strip(" ,:;")
    return clean_trans, new_examples


def split_top_level_phrasal(text: str) -> list[str]:
    chunks = []
    last_end = 0
    paren_depth = 0
    in_tag = False

    i = 0
    while i < len(text):
        c = text[i]
        if c == "<":
            in_tag = True
        elif c == ">":
            in_tag = False
        elif not in_tag:
            if c in "([":
                paren_depth += 1
            elif c in ")]" and paren_depth > 0:
                paren_depth -= 1

        m = PHRASAL_SPLIT_RE.match(text, i)
        if m and paren_depth == 0:
            chunks.append(text[last_end:i].strip())
            chunks.append(m.group(0))
            last_end = m.end()
            i = m.end()
            continue
        i += 1
    chunks.append(text[last_end:].strip())
    return [c for c in chunks if c]


def parse_article(article: dict[str, Any], word: str, vocab: set[str]) -> list[dict[str, Any]]:
    body = article.get("body", "").strip()
    if not body:
        return []

    sections = major_sections(body)
    meanings: list[dict[str, Any]] = []

    for part_of_speech, section_registers, content in sections:
        pos_value = part_of_speech or "other"

        # Split special blocks: ¬ (phrasal verbs) and ♦ (idioms)
        split_pattern = re.compile(r"(\s+[¬♦]\s+)")
        chunks = split_pattern.split(content)
        main_chunk = chunks[0].strip()
        tail_chunks = chunks[1:]

        senses = split_senses(main_chunk)
        for sense in senses:
            # Check if this sense contains embedded phrasal verbs e.g. ~ down, ~ in
            phrasal_subchunks = split_top_level_phrasal(sense)
            main_sense_text = phrasal_subchunks[0].strip() if phrasal_subchunks else ""
            extra_phrasal_chunks = phrasal_subchunks[1:] if phrasal_subchunks else []

            lead_registers, sense_tail = remove_leading_registers(main_sense_text)
            all_registers = dedupe([*section_registers, *lead_registers])
            translation, examples, ex_regs = split_sense_payload(sense_tail, word, vocab)
            all_registers = dedupe([*all_registers, *ex_regs])

            if translation:
                translation = clean_government_patterns(translation)
                translation, colloc_exs = extract_collocation_notes(translation, word)
                examples = [*examples, *colloc_exs]

            if translation or examples:
                # Remove leading register from translation if any leaked
                translation_lead_regs = registers_in_text(translation[:40])
                if translation_lead_regs:
                    all_registers = dedupe([*all_registers, *translation_lead_regs])
                    translation = remove_register_tokens(translation).strip(" ,:;")

                m_item = {
                    "partOfSpeech": pos_value,
                    "translation": translation,
                    "examples": examples,
                }
                if all_registers:
                    m_item["register"] = all_registers
                meanings.append(m_item)

            # Process any extra phrasal chunks embedded in this sense
            j = 0
            while j < len(extra_phrasal_chunks):
                delimiter = extra_phrasal_chunks[j].strip()
                block_content = extra_phrasal_chunks[j + 1].strip() if j + 1 < len(extra_phrasal_chunks) else ""
                full_block = (delimiter + " " + block_content).strip()
                if full_block:
                    phrasal_meanings = parse_phrasal_block(full_block, word, pos_value, section_registers, vocab)
                    for pm in phrasal_meanings:
                        if pm.get("translation") or pm.get("examples"):
                            meanings.append(pm)
                j += 2

        # Process tail phrasal and idiom blocks
        i = 0
        while i < len(tail_chunks):
            delimiter = tail_chunks[i].strip()
            block_content = tail_chunks[i + 1].strip() if i + 1 < len(tail_chunks) else ""
            if block_content:
                phrasal_meanings = parse_phrasal_block(block_content, word, pos_value, section_registers, vocab)
                for pm in phrasal_meanings:
                    if pm.get("translation") or pm.get("examples"):
                        meanings.append(pm)
            i += 2

    return meanings
