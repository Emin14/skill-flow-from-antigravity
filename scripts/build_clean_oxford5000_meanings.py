# -*- coding: utf-8 -*-
"""
Rebuild and deeply clean meanings in oxford_5000.json from Muller 2021 dictionary.
Removes 'primary' and 'synonyms'.
"""

import sys
import os
import json
import re
import unicodedata
from collections import defaultdict, Counter
from typing import Any, Iterable

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OXFORD_PATH = os.path.join(ROOT, 'oxford_5000.json')
SRC_OXFORD_PATH = os.path.join(ROOT, 'src', 'data', 'oxford_5000.json')
PDF2_ARTICLES_PATH = os.path.join(ROOT, 'tmp', 'muller_rebuild', 'pdf2_articles_styled.json')
PDF1_ARTICLES_PATH = os.path.join(ROOT, 'tmp', 'muller_rebuild', 'articles.json')
RUSSIAN_VOCAB_PATH = os.path.join(ROOT, 'tmp', 'muller_rebuild', 'russian_vocab.json')
REBUILT_OUT_PATH = os.path.join(ROOT, 'tmp', 'muller_rebuild', 'oxford_5000.clean.json')

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
    "офиц.": "официальное",
    "перен.": "переносное",
    "шутл.": "шутливое",
    "ирон.": "ироническое",
    "неодобр.": "неодобрительное",
    "пренебр.": "пренебрежительное",
    "эвф.": "эвфемизм",
    "амер.": "американизм",
    "англ.": "британское",
    "австрал.": "австралийское",
    "шотл.": "шотландское",
    "воен.": "военное",
    "юр.": "юридическое",
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
    "мор.": "морское",
    "ав.": "авиация",
    "ж.-д.": "железнодорожное",
    "радио": "радио",
    "кино": "кино",
    "театр.": "театр",
    "муз.": "музыка",
    "спорт.": "спортивное",
    "карт.": "карточное",
    "охот.": "охота",
    "кулин.": "кулинария",
    "морф.": "морфология",
    "фото": "фотография",
    "ком.": "коммерческое",
    "горн.": "горное дело",
    "текст.": "текстильное",
    "сл.": "сленг",
    "диал.": "диалектное",
    "груб.": "грубое",
    "лат.": "латинское",
    "фр.": "французское",
    "шахм.": "шахматное",
    "архит.": "архитектура",
    "разг": "разговорное",
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

HYPHEN_REPLACEMENTS = [
    (r'\bчего\s*-\s*л\b\.?', 'чего-л.'),
    (r'\bкого\s*-\s*л\b\.?', 'кого-л.'),
    (r'\bкому\s*-\s*л\b\.?', 'кому-л.'),
    (r'\bком\s*-\s*л\b\.?', 'ком-л.'),
    (r'\bчем\s*-\s*л\b\.?', 'чем-л.'),
    (r'\bчему\s*-\s*л\b\.?', 'чему-л.'),
    (r'\bчто\s*-\s*л\b\.?', 'что-л.'),
    (r'\bкем\s*-\s*л\b\.?', 'кем-л.'),
    (r'\bкакой\s*-\s*л\b\.?', 'какой-л.'),
    (r'\bкакая\s*-\s*л\b\.?', 'какая-л.'),
    (r'\bкакое\s*-\s*л\b\.?', 'какое-л.'),
    (r'\bкакие\s*-\s*л\b\.?', 'какие-л.'),
    (r'\bкаким\s*-\s*л\b\.?', 'каким-л.'),
    (r'\bкаких\s*-\s*л\b\.?', 'каких-л.'),
    (r'\bкакими\s*-\s*л\b\.?', 'какими-л.'),
    (r'\bгде\s*-\s*л\b\.?', 'где-л.'),
    (r'\bкуда\s*-\s*л\b\.?', 'куда-л.'),
    (r'\bоткуда\s*-\s*л\b\.?', 'откуда-л.'),
    (r'\bкак\s*-\s*л\b\.?', 'как-л.'),
    (r'\bкогда\s*-\s*л\b\.?', 'когда-л.'),
    (r'\bчей\s*-\s*л\b\.?', 'чей-л.'),
    (r'\bчья\s*-\s*л\b\.?', 'чья-л.'),
    (r'\bчьё\s*-\s*л\b\.?', 'чьё-л.'),
    (r'\bчьи\s*-\s*л\b\.?', 'чьи-л.'),
    (r'\bкто\s*-\s*то\b', 'кто-то'),
    (r'\bчто\s*-\s*то\b', 'что-то'),
    (r'\bгде\s*-\s*то\b', 'где-то'),
    (r'\bкуда\s*-\s*то\b', 'куда-то'),
    (r'\bкогда\s*-\s*то\b', 'когда-то'),
    (r'\bкак\s*-\s*то\b', 'как-то'),
    (r'\bкакой\s*-\s*то\b', 'какой-то'),
    (r'\bкто\s*-\s*нибудь\b', 'кто-нибудь'),
    (r'\bчто\s*-\s*нибудь\b', 'что-нибудь'),
    (r'\bгде\s*-\s*нибудь\b', 'где-нибудь'),
    (r'\bкуда\s*-\s*нибудь\b', 'куда-нибудь'),
    (r'\bкогда\s*-\s*нибудь\b', 'когда-нибудь'),
    (r'\bкак\s*-\s*нибудь\b', 'как-нибудь'),
    (r'\bкакой\s*-\s*нибудь\b', 'какой-нибудь'),
    (r'\bиз\s*-\s*за\b', 'из-за'),
    (r'\bиз\s*-\s*под\b', 'из-под'),
    (r'\b1\s*-\s*й\b', '1-й'),
    (r'\b1\s*-\s*я\b', '1-я'),
    (r'\b1\s*-\s*е\b', '1-е'),
    (r'\b2\s*-\s*й\b', '2-й'),
    (r'\b2\s*-\s*я\b', '2-я'),
    (r'\b2\s*-\s*е\b', '2-е'),
    (r'\b3\s*-\s*й\b', '3-й'),
    (r'\b3\s*-\s*я\b', '3-я'),
    (r'\b3\s*-\s*е\b', '3-е'),
    (r'\bт\s*\.\s*е\s*\.', 'т. е.'),
    (r'\bт\s*\.\s*п\s*\.', 'т. п.'),
    (r'\bи\s*т\s*\.\s*д\s*\.', 'и т. д.'),
    (r'\bи\s*др\s*\.', 'и др.'),
    (r'\bнапр\s*\.', 'напр.'),
    (r'\bв\s*т\s*\.\s*ч\s*\.', 'в т. ч.'),
]

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
            if i + 2 < len(tokens) and tokens[i+1].isspace() and re.match(r'^[а-яА-ЯёЁ]+$', tokens[i]) and re.match(r'^[а-яА-ЯёЁ]+$', tokens[i+2]):
                w1 = tokens[i]
                w2 = tokens[i+2]
                w1_low, w2_low = w1.lower(), w2.lower()
                combined = w1_low + w2_low
                
                # Check if w2 + w3 is a valid word and w1 is a single preposition
                if i + 4 < len(tokens) and tokens[i+3].isspace() and re.match(r'^[а-яА-ЯёЁ]+$', tokens[i+4]):
                    w3 = tokens[i+4]
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

def deep_clean_russian(text: str, vocab: set[str]) -> str:
    if not text:
        return ""
    text = clean_plain(text)
    
    # Lowercase stressed capital letters inside words: "манИльская" -> "манильская", "отлИчно" -> "отлично", "пО мощь" -> "помощь"
    text = re.sub(r'([а-яё])[А-ЯЁ]([а-яё])', lambda m: m.group(1) + m.group(0)[1].lower() + m.group(2), text)
    text = re.sub(r'\b([а-яё]{1,4})([А-ЯЁ])([а-яё]+)\b', lambda m: m.group(1) + m.group(2).lower() + m.group(3), text)
    text = re.sub(r'\b([а-яё]{1,3})([А-ЯЁ])\s+([а-яё]+)\b', lambda m: m.group(1) + m.group(2).lower() + m.group(3), text)

    # Standard Russian hyphenated word patterns
    for pattern, repl in HYPHEN_REPLACEMENTS:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)

    # Token smart rejoin
    text = token_smart_rejoin(text, vocab)

    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s+([,.;:!?%)\]])', r'\1', text)
    text = re.sub(r'([([])\s+', r'\1', text)
    return text.strip(" ;:")

def normalize_article_markup(text: str) -> str:
    text = re.sub(r'<i>(\d+\.)\s*', r'\1 <i>', text)
    text = re.sub(r'<i>(\d+\))\s*', r'\1 <i>', text)
    text = re.sub(r'(\d+\.)<i>\s*', r'\1 <i>', text)
    text = re.sub(r'(\d+\))<i>\s*', r'\1 <i>', text)
    text = re.sub(r'\(([^)]*?)\s*(?=[♦¬])', r'(\1) ', text)
    text = re.sub(r'\(([^)]*?)\s*(?=\s+\d+\))', r'(\1) ', text)
    text = re.sub(r'</i>\s*<i>', ' ', text)
    text = re.sub(r'<i>\s*</i>', '', text)
    return text

class Marker:
    def __init__(self, start: int, end: int, number: int):
        self.start = start
        self.end = end
        self.number = number

def find_top_level_markers(text: str, delimiter: str) -> list[Marker]:
    markers: list[Marker] = []
    paren_depth = 0
    bracket_depth = 0
    in_tag = False
    index = 0
    while index < len(text):
        if text.startswith("<i>", index):
            in_tag = True
            index += 3
            continue
        if text.startswith("</i>", index):
            in_tag = False
            index += 4
            continue
        char = text[index]
        if not in_tag:
            if char == "(":
                paren_depth += 1
            elif char == ")" and paren_depth:
                paren_depth -= 1
            elif char == "[":
                bracket_depth += 1
            elif char == "]" and bracket_depth:
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
    in_tag = False
    index = 0
    while index < len(text):
        if text.startswith("<i>", index):
            in_tag = True
            index += 3
            continue
        if text.startswith("</i>", index):
            in_tag = False
            index += 4
            continue
        char = text[index]
        if not in_tag:
            if char == "(":
                paren_depth += 1
            elif char == ")" and paren_depth:
                paren_depth -= 1
            elif char == "[":
                bracket_depth += 1
            elif char == "]" and bracket_depth:
                bracket_depth -= 1
            elif char == delimiter and paren_depth == 0 and bracket_depth == 0:
                parts.append(text[start:index])
                start = index + 1
        index += 1
    parts.append(text[start:])
    return [part.strip() for part in parts if part.strip()]

def expand_tilde(text: str, word: str) -> str:
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
    return text

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
    if not plain or plain.startswith("="):
        return False
    return plain.startswith("~") or bool(re.match(r"[A-Za-z£$]", plain))

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

def extract_example(clause: str, word: str, vocab: set[str]) -> dict[str, str] | None:
    boundary = first_cyrillic_outside_italic(clause)
    if boundary is None:
        return None
    en_raw = clause[:boundary].strip()
    ru_raw = clause[boundary:].strip()

    en_raw = re.sub(r"<i>(.*?)</i>", lambda m: "" if registers_in_text(m.group(1)) else m.group(1), en_raw)
    en = clean_plain(en_raw)
    en = clean_plain(remove_register_tokens(en))
    en = expand_tilde(en, word).strip(" ,:;")
    ru = deep_clean_russian(ru_raw, vocab).strip(" ,:;")
    
    if en.endswith("(") and ")" in ru:
        en = en[:-1].rstrip()
        ru = "(" + ru
    if not re.search(r"[A-Za-z~]", en) or not re.search(r"[А-Яа-яЁё]", ru):
        return None
    return {"en": en, "ru": ru}

def split_embedded_examples(example: dict[str, str], word: str, vocab: set[str]) -> list[dict[str, str]]:
    results = [example]
    while True:
        current = results[-1]
        ru = current["ru"]
        separator = re.search(r"[,;]\s*(?=[A-Za-z~])", ru)
        if not separator:
            break
        remainder = ru[separator.end() :]
        boundary = re.search(r"[А-Яа-яЁё]", remainder)
        if not boundary:
            break
        en = expand_tilde(remainder[: boundary.start()].strip(), word)
        translated = deep_clean_russian(remainder[boundary.start() :].strip(), vocab)
        if not re.search(r"[A-Za-z]", en) or not translated:
            break
        current["ru"] = ru[: separator.start()].rstrip()
        results.append({"en": en, "ru": translated})
    return results

def parse_sense_text(text: str, word: str, vocab: set[str]) -> tuple[str, list[dict[str, str]], list[str]]:
    meaning_registers, text = remove_leading_registers(text)
    after_morphology = re.match(r"^(\([^)]*\)\s*)<i>(.*?)</i>\s*(.*)$", text)
    if after_morphology:
        scoped = registers_in_text(after_morphology.group(2))
        if scoped:
            meaning_registers = dedupe([*meaning_registers, *scoped])
            text = after_morphology.group(1) + after_morphology.group(3)
    clauses = split_top_level(text)
    translations: list[str] = []
    examples: list[dict[str, str]] = []
    translation_after_examples = False

    for clause in clauses:
        colon = top_level_colon(clause)
        if colon is not None:
            before = deep_clean_russian(clause[:colon], vocab)
            if before:
                translations.append(before)
            clause = clause[colon + 1 :].strip()

        if starts_like_example(clause):
            example = extract_example(clause, word, vocab)
            if example:
                examples.extend(split_embedded_examples(example, word, vocab))
                translation_after_examples = False
                continue

        plain = deep_clean_russian(clause, vocab)
        if not plain:
            continue
        structural_letter = bool(
            examples
            and re.match(r"^[а-яё]\)", plain, re.IGNORECASE)
            and any(re.search(r"(?:^|\s)а\)", part) for part in translations)
        )
        if structural_letter:
            translations.append(plain)
            translation_after_examples = True
        elif examples and not translation_after_examples:
            examples[-1]["ru"] = normalize_spaces(examples[-1]["ru"] + "; " + plain)
        elif translation_after_examples and translations:
            translations[-1] = normalize_spaces(translations[-1] + "; " + plain)
        else:
            translations.append(plain)

    translation = "; ".join(part for part in translations if part)
    translation = expand_tilde(translation, word)
    translation = deep_clean_russian(translation, vocab)
    return translation, examples, meaning_registers

def split_special_blocks(text: str) -> tuple[str, list[tuple[str, str]]]:
    positions = [(match.start(), match.group(0)) for match in re.finditer(r"[¬♦]", text)]
    if not positions:
        return text, []
    main = text[: positions[0][0]].strip()
    blocks: list[tuple[str, str]] = []
    for index, (start, symbol) in enumerate(positions):
        end = positions[index + 1][0] if index + 1 < len(positions) else len(text)
        content = text[start + 1 : end].strip()
        if content:
            blocks.append((symbol, content))
    return main, blocks

def parse_idiom_block(content: str, word: str, part_of_speech: str, section_registers: list[str], vocab: set[str]) -> dict[str, Any]:
    examples: list[dict[str, str]] = []
    translations: list[str] = []
    for clause in split_top_level(content):
        example = extract_example(clause, word, vocab)
        if example:
            examples.append(example)
            translations.append(example["ru"])
        else:
            plain = expand_tilde(deep_clean_russian(clause, vocab), word)
            if plain:
                translations.append(plain)
    return {
        "partOfSpeech": part_of_speech,
        "translation": "; ".join(translations),
        "examples": examples,
        "register": dedupe(section_registers),
    }

def parse_phrasal_block(content: str, word: str, part_of_speech: str, section_registers: list[str], vocab: set[str]) -> dict[str, Any]:
    boundary = first_cyrillic_outside_italic(content)
    if boundary is None:
        translation = expand_tilde(deep_clean_russian(content, vocab), word)
        examples: list[dict[str, str]] = []
        registers: list[str] = []
    else:
        heading = expand_tilde(clean_plain(content[:boundary]), word).strip(" :;")
        tail = content[boundary:].strip()
        parsed_translation, examples, registers = parse_sense_text(tail, word, vocab)
        translation = f"{heading} — {parsed_translation}" if parsed_translation else heading
    return {
        "partOfSpeech": part_of_speech,
        "translation": translation,
        "examples": examples,
        "register": dedupe([*section_registers, *registers]),
    }

def parse_article(article: dict[str, Any], word: str, vocab: set[str]) -> list[dict[str, Any]]:
    body_normalized = normalize_article_markup(article["body"])
    parsed: list[dict[str, Any]] = []
    for section_pos, section_registers, section_text in major_sections(body_normalized):
        part_of_speech = section_pos or ("article" if word.lower() == "a" else "other")
        main, blocks = split_special_blocks(section_text)
        for raw_sense in split_senses(main):
            inline_pos, inline_registers, inline_tail = pos_prefix(raw_sense)
            if inline_pos:
                part_of_speech = inline_pos
                section_registers = dedupe([*section_registers, *inline_registers])
                raw_sense = inline_tail
            translation, examples, registers = parse_sense_text(raw_sense, word, vocab)
            if not translation and not examples:
                continue
            parsed.append(
                {
                    "partOfSpeech": part_of_speech,
                    "translation": translation,
                    "examples": examples,
                    "register": dedupe([*section_registers, *registers]),
                }
            )
        for symbol, content in blocks:
            if symbol == "♦":
                parsed.append(parse_idiom_block(content, word, part_of_speech, section_registers, vocab))
            else:
                phrasal_parts = re.split(r";\s*(?=~\s+[A-Za-z])", content)
                for phrasal in phrasal_parts:
                    parsed.append(parse_phrasal_block(phrasal, word, part_of_speech, section_registers, vocab))
    return parsed

def strip_roman_suffix(headword: str) -> tuple[str, str | None]:
    match = ROMAN_SUFFIX_RE.search(headword)
    if not match:
        return headword, None
    return headword[: match.start()].strip(), match.group(1)

def expand_parenthetical_spelling(value: str) -> set[str]:
    match = re.search(r"\(([A-Za-z]+)\)", value)
    if not match:
        return {value}
    without = value[: match.start()] + value[match.end() :]
    with_letters = value[: match.start()] + match.group(1) + value[match.end() :]
    return expand_parenthetical_spelling(without) | expand_parenthetical_spelling(with_letters)

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

def select_phrase_source(word: str, index: dict[str, list[dict[str, Any]]]) -> tuple[dict[str, Any], str] | None:
    words = word.lower().split()
    if len(words) < 2:
        return None
    base_candidates = select_articles(words[0], index)
    tail = " ".join(words[1:])
    pattern = re.compile(rf"~\s+{re.escape(tail)}\b", re.IGNORECASE)
    for article in base_candidates:
        match = pattern.search(strip_markup(article["body"]).lower())
        if match:
            marked = re.search(rf"~\s+{re.escape(tail)}\b", article["body"], re.IGNORECASE)
            if marked:
                return article, article["body"][marked.start() :]
    return None

def parse_phrase_source(article: dict[str, Any], text: str, word: str, vocab: set[str]) -> list[dict[str, Any]]:
    base_word = word.split()[0]
    tail = " ".join(word.split()[1:])

    if word.lower() == "next to":
        return [
            meaning
            for meaning in parse_article(article, base_word, vocab)
            if meaning["partOfSpeech"] == "preposition"
        ]

    if re.match(rf"^~\s+{re.escape(tail)}\s+[A-Za-z]", strip_markup(text), re.IGNORECASE):
        full = parse_article(article, base_word, vocab)
        target = word.lower()
        matching = [
            meaning
            for meaning in full
            if any(target in example["en"].lower() for example in meaning["examples"])
        ]
        if matching:
            return matching

    end_match = re.search(r"[¬♦]|\s\d+\)", text[1:])
    if end_match:
        text = text[: end_match.start() + 1]
    section_pos = major_sections(article["body"])[0][0] or "other"
    lowered = strip_markup(text[:120]).lower()
    if "как prep" in lowered:
        section_pos = "preposition"
    elif "как cj" in lowered:
        section_pos = "conjunction"
    meaning = parse_phrasal_block(text, base_word, section_pos, [], vocab)
    meaning["translation"] = re.sub(
        rf"^{re.escape(base_word)}\s+{re.escape(tail)}",
        word,
        meaning["translation"],
        flags=re.IGNORECASE,
    )
    if " — " in meaning["translation"]:
        meaning["translation"] = meaning["translation"].split(" — ", 1)[1]
    return [meaning]

def resolve_entry_articles(
    word: str, index: dict[str, list[dict[str, Any]]]
) -> tuple[list[dict[str, Any]], tuple[dict[str, Any], str] | None, str]:
    selected = select_articles(word, index)
    if selected:
        return selected, None, "exact"
    for variant in spelling_variants(word.lower()):
        selected = select_articles(variant, index)
        if selected:
            return selected, None, f"spelling:{variant}"
    source_form = SOURCE_FORM_EQUIVALENTS.get(word.lower())
    if source_form:
        selected = select_articles(source_form, index)
        if selected:
            return selected, None, f"source_form:{source_form}"
    phrase = select_phrase_source(word, index)
    if phrase:
        return [], phrase, "phrase"
    return [], None, "missing"

def main():
    print("Loading Russian vocabulary...")
    vocab = set()
    if os.path.exists(RUSSIAN_VOCAB_PATH):
        with open(RUSSIAN_VOCAB_PATH, 'r', encoding='utf-8') as f:
            vocab.update(json.load(f))

    with open(PDF2_ARTICLES_PATH, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    for art in articles:
        plain = strip_markup(art.get("body", ""))
        for w in re.findall(r"[А-Яа-яЁё]+", plain):
            if len(w) >= 2:
                vocab.add(w.lower())

    vocab.update(['мощения', 'пенициллина', 'подозрений'])
    print(f"Total vocabulary size: {len(vocab)} words.")

    with open(OXFORD_PATH, 'r', encoding='utf-8') as f:
        original = json.load(f)

    index = build_article_index(articles)
    rebuilt = []
    unresolved = []

    for entry in original:
        word = entry["word"]
        selected, phrase, resolution = resolve_entry_articles(word, index)
        meanings: list[dict[str, Any]] = []

        if selected:
            for article in selected:
                meanings.extend(parse_article(article, word, vocab))
            if resolution.startswith("source_form:"):
                hints = {
                    m.get("partOfSpeech")
                    for m in entry.get("meanings", [])
                    if m.get("partOfSpeech")
                }
                filtered = [m for m in meanings if m["partOfSpeech"] in hints]
                if filtered:
                    meanings = filtered
        elif phrase:
            meanings = parse_phrase_source(phrase[0], phrase[1], word, vocab)
        else:
            unresolved.append(word)
            for m in entry.get("meanings", []):
                cleaned_m = {
                    "id": m.get("id", 1),
                    "partOfSpeech": m.get("partOfSpeech", "noun"),
                    "translation": deep_clean_russian(m.get("translation", ""), vocab),
                    "examples": [
                        {
                            "en": ex.get("en", "").strip(),
                            "ru": deep_clean_russian(ex.get("ru", ""), vocab)
                        }
                        for ex in m.get("examples", [])
                        if ex.get("en") or ex.get("ru")
                    ]
                }
                meanings.append(cleaned_m)

        # Standardize meanings schema: id, partOfSpeech, translation, examples (optional register)
        # Strictly strip 'primary' and 'synonyms'
        clean_meanings = []
        for meaning_id, m in enumerate(meanings, start=1):
            trans = m.get("translation", "").strip()
            exs = m.get("examples", [])
            pos = m.get("partOfSpeech", "other")
            reg = m.get("register", [])
            
            clean_item = {
                "id": meaning_id,
                "partOfSpeech": pos,
                "translation": trans,
                "examples": exs
            }
            if reg:
                clean_item["register"] = reg
            clean_meanings.append(clean_item)

        new_entry = {k: v for k, v in entry.items() if k != "meanings"}
        new_entry["meanings"] = clean_meanings
        rebuilt.append(new_entry)

    print(f"Rebuilt {len(rebuilt)} entries. Unresolved direct words: {len(unresolved)}")

    # Validation
    forbidden = {"primary", "synonyms"}
    validation_errors = []
    for entry in rebuilt:
        for idx, m in enumerate(entry["meanings"], 1):
            for k in forbidden:
                if k in m:
                    validation_errors.append(f"{entry['word']}: forbidden key {k}")
            if m["id"] != idx:
                validation_errors.append(f"{entry['word']}: id mismatch {m['id']} != {idx}")
            if not m["translation"] and not m["examples"]:
                validation_errors.append(f"{entry['word']}: empty translation and examples")

    print(f"Validation errors: {len(validation_errors)}")
    if validation_errors:
        print("First 10 errors:", validation_errors[:10])
        raise SystemExit("Validation failed!")

    # Write to target files
    with open(OXFORD_PATH, 'w', encoding='utf-8') as f:
        json.dump(rebuilt, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Saved to {OXFORD_PATH}")

    with open(SRC_OXFORD_PATH, 'w', encoding='utf-8') as f:
        json.dump(rebuilt, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Saved to {SRC_OXFORD_PATH}")

    with open(REBUILT_OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(rebuilt, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Saved to {REBUILT_OUT_PATH}")

if __name__ == '__main__':
    main()
