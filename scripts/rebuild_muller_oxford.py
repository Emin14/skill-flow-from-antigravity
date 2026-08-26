# -*- coding: utf-8 -*-
"""Rebuild Oxford 5000 meanings from the Muller 2021 PDF.

The script is intentionally staged.  It first creates a source-only article
index under tmp/, then parses and validates it, and writes the project JSON
only when invoked with --write.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

import pdfplumber


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT / "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf"
FALLBACK_PDF_PATH = ROOT / "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
OXFORD_PATH = ROOT / "oxford_5000.json"
APP_OXFORD_PATH = ROOT / "src" / "data" / "oxford_5000.json"
WORK_DIR = ROOT / "tmp" / "muller_rebuild"
ARTICLE_CACHE = WORK_DIR / "articles.json"
REPORT_PATH = WORK_DIR / "report.json"
REBUILT_PATH = WORK_DIR / "oxford_5000.rebuilt.json"

# The English-Russian dictionary starts on PDF page 15 and ends on page 924.
FIRST_PAGE_INDEX = 14
LAST_PAGE_INDEX_EXCLUSIVE = 924

SOFT_BREAK = "\ue000"
ITALIC_OPEN = "<i>"
ITALIC_CLOSE = "</i>"
ROMAN_TOKEN_PATTERN = r"(?:IX|VIII|VII|VI|IV|V|III|II|I)"

COLUMN_BOUNDS = ((35.0, 205.0), (205.0, 369.0), (369.0, 590.0))


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


def is_headword_font(fontname: str, size: float) -> bool:
    return "PragmaticaC-Bold" in fontname and 7.0 <= float(size) <= 9.0


def is_italic_font(fontname: str) -> bool:
    return "Italic" in fontname


def is_accent_glyph(text: str, fontname: str) -> bool:
    # NewtonC (cid:2) is the zero-width stress mark. At a physical line break
    # the same font emits (cid:2)(cid:4): cid:4 is the printed discretionary
    # hyphen and must survive so the two halves of the word can be rejoined.
    return (
        "NewtonC" in fontname
        and "(cid:4)" not in text
        and bool(re.fullmatch(r"(?:\(cid:\d+\))+", text))
    )


def clean_pdf_token(text: str, fontname: str, *, headword: bool = False) -> str:
    if "NewtonC" in fontname and "(cid:4)" in text:
        return SOFT_BREAK
    if is_accent_glyph(text, fontname):
        return ""

    text = unicodedata.normalize("NFKC", text)
    text = text.replace("’", "'").replace("‘", "'")
    text = text.replace("\u00ad", "-" if headword else SOFT_BREAK)

    if "(cid:" in text:
        if "Petersburg" in fontname or "Pragmatica" in fontname:
            replacement = "-" if headword else SOFT_BREAK
            text = re.sub(r"\(cid:\d+\)", replacement, text)
        else:
            text = re.sub(r"\(cid:\d+\)", "", text)

    text = re.sub(r"(?<=[A-Za-z])п(?=[A-Za-z])", "-", text)
    return text


def column_for_x(x0: float) -> int | None:
    for index, (left, right) in enumerate(COLUMN_BOUNDS):
        if left <= x0 < right:
            return index
    return None


def group_lines(words: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    """Group words by visual baseline, tolerating raised accent/IPA glyphs."""
    words = sorted(words, key=lambda item: (float(item["top"]), float(item["x0"])))
    lines: list[list[dict[str, Any]]] = []
    anchors: list[float] = []

    for word in words:
        top = float(word["top"])
        # The oversized ♦/¬ glyph is drawn higher than the text sharing its
        # baseline.  Align it to that following line; otherwise it is emitted
        # between the two halves of a wrapped word (подо- ♦ нки) and can also
        # move a whole idiom/phrasal marker inside the preceding example.
        # Symbol punctuation is drawn above the text baseline. Shift it down
        # together with an attached closing bracket (♦]) but leave the degree
        # sign alone; 90° belongs to the ordinary line and was previously
        # displaced into the next dictionary sense.
        if "Symbol" in str(word["fontname"]) and str(word["text"]) != "°":
            top += 4.5
        elif "Signs" in str(word["fontname"]) and str(word["text"]) == "¬":
            top += 3.5
        best_index: int | None = None
        best_delta = 99.0
        for index in range(max(0, len(anchors) - 3), len(anchors)):
            delta = abs(anchors[index] - top)
            if delta <= 2.6 and delta < best_delta:
                best_index = index
                best_delta = delta
        if best_index is None:
            lines.append([word])
            anchors.append(top)
        else:
            lines[best_index].append(word)
            regular_tops = [
                float(item["top"])
                for item in lines[best_index]
                if "Newton" not in item["fontname"]
                and "MSTT" not in item["fontname"]
                and "Symbol" not in item["fontname"]
                and "Signs" not in item["fontname"]
            ]
            if regular_tops:
                anchors[best_index] = sum(regular_tops) / len(regular_tops)

    paired = sorted(zip(anchors, lines), key=lambda pair: pair[0])
    return [sorted(line, key=lambda item: float(item["x0"])) for _, line in paired]


def strip_phonetic_tokens(tokens: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Remove bracketed pronunciation blocks but preserve ordinary [см.] notes."""
    output: list[dict[str, Any]] = []
    index = 0
    while index < len(tokens):
        token = tokens[index]
        if "[" not in str(token["text"]):
            output.append(token)
            index += 1
            continue

        end = index
        saw_mstt = "MSTT" in str(token["fontname"])
        bracket_text = str(token["text"])
        while "]" not in bracket_text and end + 1 < len(tokens):
            end += 1
            bracket_text += " " + str(tokens[end]["text"])
            saw_mstt = saw_mstt or "MSTT" in str(tokens[end]["fontname"])

        # A morphology such as [-s] is also a short Latin bracketed block.
        # Only the dedicated MSTT phonetic font is unambiguous at token level;
        # multi-line leading transcriptions are removed after article assembly.
        fallback_leading_phonetics = bool(
            index <= 2
            and not re.search(r"[А-Яа-яЁё]", bracket_text)
            and re.search(r"[A-Za-zɐ-˿]", bracket_text)
        )
        if (saw_mstt or fallback_leading_phonetics) and "]" in bracket_text:
            # A pronunciation inside morphology often ends in the same PDF
            # token as the outer closing parenthesis: z]).  Remove only the
            # bracketed transcription and retain that trailing punctuation.
            end_text = str(tokens[end]["text"])
            suffix = end_text.split("]", 1)[1] if "]" in end_text else ""
            if suffix:
                suffix_token = dict(tokens[end])
                suffix_token["text"] = suffix
                output.append(suffix_token)
            index = end + 1
        else:
            output.append(token)
            index += 1
    return output


def join_tokens(tokens: list[dict[str, Any]]) -> str:
    tokens = strip_phonetic_tokens(tokens)
    pieces: list[str] = []
    italic_open = False
    previous_x1: float | None = None

    for token in tokens:
        raw = clean_pdf_token(str(token["text"]), str(token["fontname"]))
        if not raw:
            continue
        italic = is_italic_font(str(token["fontname"]))

        # The stress mark in the PDF is a zero-width NewtonC glyph.  PDFMiner
        # consequently emits the part after it as a separate word even though
        # both pieces touch at the same x coordinate (дорого + й, ми + лый).
        # Reconstruct spaces from geometry instead of blindly joining every
        # extracted token with a space.
        x0 = float(token["x0"])
        separator = ""
        if previous_x1 is not None and x0 - previous_x1 > 1.0:
            separator = " "

        if italic and not italic_open:
            pieces.append(separator + ITALIC_OPEN + raw)
            italic_open = True
        elif not italic and italic_open:
            pieces.append(ITALIC_CLOSE + separator + raw)
            italic_open = False
        else:
            pieces.append(separator + raw)
        previous_x1 = float(token["x1"])

    if italic_open:
        pieces.append(ITALIC_CLOSE)

    text = "".join(pieces)
    text = re.sub(r"\s+([,.;:!?%)\]])", r"\1", text)
    text = re.sub(r"([([])\s+", r"\1", text)
    text = re.sub(r"\s+([-–—])\s+", r" \1 ", text)
    return normalize_spaces(text)


def line_has_unknown_body_cid(tokens: list[dict[str, Any]]) -> bool:
    """Detect visible A4 glyphs whose embedded font has no Unicode map.

    The OCR-aligned copy is used only for these lines. Pronunciation glyphs are
    deliberately ignored because they are outside the meanings schema.
    """
    square_depth = 0
    for token in tokens:
        text = str(token["text"])
        before = square_depth
        square_depth += text.count("[")
        fontname = str(token["fontname"])
        unknown = (
            "(cid:" in text
            and not any(
                known in fontname
                for known in ("Petersburg", "Pragmatica", "NewtonC")
            )
            and float(token["width"]) > 0.1
        )
        if unknown and before == 0:
            return True
        square_depth = max(0, square_depth - text.count("]"))
    return False


def aligned_fallback_line(
    source_line: list[dict[str, Any]],
    fallback_lines: list[list[dict[str, Any]]],
) -> list[dict[str, Any]] | None:
    if not fallback_lines:
        return None
    source_top = sum(float(token["top"]) for token in source_line) / len(source_line)
    candidate = min(
        fallback_lines,
        key=lambda line: abs(
            source_top - sum(float(token["top"]) for token in line) / len(line)
        ),
    )
    candidate_top = sum(float(token["top"]) for token in candidate) / len(candidate)
    return candidate if abs(source_top - candidate_top) <= 1.8 else None


def detect_headword(line: list[dict[str, Any]]) -> tuple[str, int] | None:
    significant = [item for item in line if not is_accent_glyph(str(item["text"]), str(item["fontname"]))]
    if not significant:
        return None
    if not is_headword_font(str(significant[0]["fontname"]), float(significant[0]["size"])):
        return None

    head_tokens: list[str] = []
    consumed = 0
    for token in significant:
        if not is_headword_font(str(token["fontname"]), float(token["size"])):
            break
        cleaned = clean_pdf_token(str(token["text"]), str(token["fontname"]), headword=True)
        if cleaned:
            head_tokens.append(cleaned)
        consumed += 1

    # Homonym markers (I, II, III...) use the body bold font, not headword font.
    roman_tokens: list[str] = []
    cursor = consumed
    while cursor < len(significant):
        value = str(significant[cursor]["text"]).strip()
        if re.fullmatch(rf"{ROMAN_TOKEN_PATTERN}(?:,)?", value):
            roman_tokens.append(value)
            cursor += 1
            continue
        break

    headword = normalize_headword(" ".join(head_tokens + roman_tokens))
    if not headword:
        return None

    # Return an index in the original line, not the accent-filtered copy.
    last_consumed = significant[cursor - 1] if cursor else significant[consumed - 1]
    original_index = line.index(last_consumed) + 1
    return headword, original_index


def raw_vocabulary(articles: list[dict[str, Any]]) -> Counter[str]:
    vocabulary: Counter[str] = Counter()
    for article in articles:
        plain = re.sub(r"</?i>", "", article["body_raw"])
        plain = plain.replace(SOFT_BREAK, "")
        for word in re.findall(r"[A-Za-zА-Яа-яЁё]+(?:-[A-Za-zА-Яа-яЁё]+)*", plain):
            if len(word) >= 2:
                vocabulary[word.lower()] += 1
    return vocabulary


HYPHEN_LEFT = {
    "англо", "военно", "восточно", "древне", "научно", "нью",
    "общественно", "русско", "северо", "социально", "юго", "южно",
}
HYPHEN_RIGHT: set[str] = set()
CLITIC_HYPHEN_PAIRS = {
    (left, right)
    for left in {
        "где", "какая", "какие", "каким", "какими", "каких", "какого",
        "какое", "какой", "какую", "когда", "кого", "кому", "ком", "кое",
        "кто", "куда", "откуда", "чего", "чей", "чьего", "чьей", "чьём",
        "чьи", "чьим", "чьими", "чьих", "чья", "чьё", "что", "чему", "чем",
    }
    for right in {"либо", "нибудь", "то"}
}
CLITIC_HYPHEN_PAIRS.update(
    {(left, "л") for left in {"кого", "кому", "ком", "чего", "чему", "чем", "что"}}
)
CLITIC_HYPHEN_PAIRS.add(("из", "за"))

# The A4 PDF contains a small number of legacy discretionary-hyphen glyphs
# inside a single visual line. They cannot be distinguished from an intended
# hyphen by geometry alone, so keep this source-verified list deliberately
# narrow. Real compounds and abbreviations (об-ва, на-гора, м-р, etc.) are
# not included.
INLINE_SOFT_JOIN_PAIRS = {
    ("стено", "й"), ("ми", "мо"), ("го", "ды"), ("пролете", "ли"),
    ("подверга", "ться"), ("килево", "й"), ("ка", "чке"),
    ("научно", "го"), ("подверга", "ть"), ("како", "му"),
    ("техни", "ческому"), ("враща", "тельно"),
    ("поступа", "тельное"), ("испыта", "нию"),
    ("устано", "вленный"), ("выступа", "ть"), ("ка", "честве"),
    ("обвини", "теля"), ("ко", "му"), ("восточно", "го"),
    ("строчи", "ть"), ("бо", "йко"), ("за", "дали"),
    ("тру", "дную"), ("обеспе", "чение"), ("проду", "кты"),
    ("основно", "м"), ("сте", "пени"), ("про", "чно"),
    ("а", "нглии"),
}


def resolve_soft_breaks(text: str, vocabulary: Counter[str]) -> str:
    # Each visual line is styled independently.  Rejoin the same italic run
    # before resolving a soft hyphen which happens to fall at a line boundary.
    text = re.sub(
        rf"</i>{re.escape(SOFT_BREAK)}[ \t]*\n[ \t]*<i>",
        SOFT_BREAK + "\n",
        text,
    )
    text = re.sub(r"</i>[ \t]*\n[ \t]*<i>", "\n", text)

    pattern = re.compile(
        rf"([A-Za-zА-Яа-яЁё]+){re.escape(SOFT_BREAK)}\s*\n\s*([A-Za-zА-Яа-яЁё]+)"
    )

    def replace(match: re.Match[str]) -> str:
        left, right = match.group(1), match.group(2)
        joined = (left + right).lower()
        hyphenated = (left + "-" + right).lower()
        left_lower = left.lower()
        right_lower = right.lower().rstrip(".")

        if (left_lower, right_lower) in INLINE_SOFT_JOIN_PAIRS:
            return left + right
        if (
            left_lower in HYPHEN_LEFT
            or right_lower in HYPHEN_RIGHT
            or (left_lower, right_lower) in CLITIC_HYPHEN_PAIRS
        ):
            return left + "-" + right
        if vocabulary[hyphenated] > vocabulary[joined] * 2 and vocabulary[hyphenated] >= 2:
            return left + "-" + right
        return left + right

    previous = None
    while previous != text:
        previous = text
        text = pattern.sub(replace, text)

    # Resolve the verified discretionary marks which appear in the middle of
    # a single extracted line. Leave every other mark intact for the normal
    # hyphen conversion below.
    inline_pattern = re.compile(
        rf"([A-Za-zА-Яа-яЁё]+){re.escape(SOFT_BREAK)}([A-Za-zА-Яа-яЁё]+)"
    )

    def replace_inline(match: re.Match[str]) -> str:
        left, right = match.group(1), match.group(2)
        if (left.lower(), right.lower().rstrip(".")) in INLINE_SOFT_JOIN_PAIRS:
            return left + right
        return match.group(0)

    text = inline_pattern.sub(replace_inline, text)
    text = text.replace(SOFT_BREAK, "-")
    text = re.sub(r"\s*\n\s*", " ", text)
    text = normalize_spaces(text)
    text = text.replace("<i>u</i>", "<i>и</i>")
    # Some inflection lines contain a duplicated invisible closing phonetic
    # bracket (e.g. the source-rendered "pled)" is extracted as "pled])").
    # Remove only closing square brackets which have no matching opener.
    bracket_depth = 0
    balanced: list[str] = []
    for char in text:
        if char == "[":
            bracket_depth += 1
            balanced.append(char)
        elif char == "]":
            if bracket_depth:
                bracket_depth -= 1
                balanced.append(char)
        else:
            balanced.append(char)
    text = "".join(balanced)
    text = re.sub(r"<i>([^<]+)</i>\.", r"<i>\1.</i>", text)
    # Pronunciation is not represented by the meanings schema.  This also
    # catches transcriptions split across visual lines, which token-level
    # removal cannot safely identify.
    text = re.sub(r"^\[[^\]]{1,240}\]\s*(?=(?:\d+[.)]|<i>))", "", text)
    return text


def extract_articles() -> list[dict[str, Any]]:
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    articles: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    started_at = time.time()

    with pdfplumber.open(PDF_PATH) as pdf, pdfplumber.open(FALLBACK_PDF_PATH) as fallback_pdf:
        for page_index in range(FIRST_PAGE_INDEX, LAST_PAGE_INDEX_EXCLUSIVE):
            page = pdf.pages[page_index]
            words = page.extract_words(extra_attrs=["fontname", "size"])
            body_words = [
                word
                for word in words
                if float(word["top"]) >= 55.0 and float(word["bottom"]) <= float(page.height) - 20.0
            ]

            source_lines_by_column: list[list[list[dict[str, Any]]]] = []
            needs_fallback = False
            for left, right in COLUMN_BOUNDS:
                column_words = [
                    word for word in body_words if left <= float(word["x0"]) < right
                ]
                column_lines = group_lines(column_words)
                source_lines_by_column.append(column_lines)
                needs_fallback = needs_fallback or any(
                    line_has_unknown_body_cid(line) for line in column_lines
                )

            fallback_lines_by_column: list[list[list[dict[str, Any]]]] = [[], [], []]
            fallback_page = None
            if needs_fallback:
                fallback_page = fallback_pdf.pages[page_index]
                fallback_words = fallback_page.extract_words(
                    extra_attrs=["fontname", "size"]
                )
                fallback_body_words = [
                    word
                    for word in fallback_words
                    if float(word["top"]) >= 55.0
                    and float(word["bottom"]) <= float(fallback_page.height) - 20.0
                ]
                for column_index, (left, right) in enumerate(COLUMN_BOUNDS):
                    fallback_column_words = [
                        word
                        for word in fallback_body_words
                        if left <= float(word["x0"]) < right
                    ]
                    fallback_lines_by_column[column_index] = group_lines(
                        fallback_column_words
                    )

            for column_index, (left, right) in enumerate(COLUMN_BOUNDS):
                for line in source_lines_by_column[column_index]:
                    headword_match = detect_headword(line)
                    replacement_line = None
                    if line_has_unknown_body_cid(line):
                        replacement_line = aligned_fallback_line(
                            line, fallback_lines_by_column[column_index]
                        )
                    if headword_match:
                        if current is not None:
                            current["body_raw"] = "\n".join(current.pop("lines"))
                            articles.append(current)
                        headword, body_start_index = headword_match
                        current = {
                            "headword": headword,
                            "page": page_index + 1,
                            "column": column_index + 1,
                            "top": round(float(line[0]["top"]), 2),
                            "lines": [],
                        }
                        body_tokens = line[body_start_index:]
                        if replacement_line is not None and body_tokens:
                            body_x0 = float(body_tokens[0]["x0"])
                            body_tokens = [
                                token
                                for token in replacement_line
                                if float(token["x0"]) >= body_x0 - 1.0
                            ]
                        body_line = join_tokens(body_tokens)
                        if body_line:
                            current["lines"].append(body_line)
                    elif current is not None:
                        continuation = join_tokens(replacement_line or line)
                        if continuation:
                            current["lines"].append(continuation)

            # pdfplumber/pdfminer otherwise retains each page layout and all
            # character objects until the whole document is closed.
            page.close()
            if fallback_page is not None:
                fallback_page.close()

            if (page_index + 1) % 100 == 0:
                print(
                    f"Extracted through PDF page {page_index + 1}: "
                    f"{len(articles):,} articles in {time.time() - started_at:.1f}s",
                    flush=True,
                )

    if current is not None:
        current["body_raw"] = "\n".join(current.pop("lines"))
        articles.append(current)

    vocabulary = raw_vocabulary(articles)
    for article in articles:
        article["body"] = resolve_soft_breaks(article.pop("body_raw"), vocabulary)

    with ARTICLE_CACHE.open("w", encoding="utf-8") as stream:
        json.dump(articles, stream, ensure_ascii=False, indent=2)

    print(f"Saved {len(articles):,} articles to {ARTICLE_CACHE}")
    return articles


ROMAN_SUFFIX_RE = re.compile(
    rf"\s+({ROMAN_TOKEN_PATTERN}(?:,\s*{ROMAN_TOKEN_PATTERN})*)$"
)


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

    # A comma normally separates spelling variants.  Homonym markers were
    # already peeled off above.
    variants = [part.strip() for part in re.split(r"\s*,\s*", base) if part.strip()]
    for variant in variants:
        for expanded in expand_parenthetical_spelling(variant):
            normalized = expanded.lower().strip()
            aliases.add(normalized)
            # Prefix/suffix entries such as -man, -proof, auto- and vice-
            # are independent dictionary articles. Their boundary hyphen
            # must never turn them into aliases of man, proof, auto or vice.
            if not normalized.startswith("-") and not normalized.endswith("-"):
                aliases.add(normalized.replace("-", " "))
                aliases.add(normalized.replace(" ", "-"))
                aliases.add(re.sub(r"[- .]", "", normalized))
    return {alias for alias in aliases if alias}


def article_match_rank(word: str, article: dict[str, Any]) -> int:
    """Prefer the source spelling actually printed for the Oxford word."""
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
            identity = (article["page"], article["column"], article["top"], article["headword"])
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
    "прос.": "просодия",
    "фото": "фотография",
    "бухг.": "бухгалтерское",
    "ком.": "коммерческое",
    "горн.": "горное дело",
    "текст.": "текстильное",
    "сл.": "сленг",
    "sl.": "сленг",
    "диал.": "диалектное",
    "груб.": "грубое",
    "лат.": "латинское",
    "фр.": "французское",
    "ирл.": "ирландское",
    "шахм.": "шахматное",
    "архит.": "архитектура",
    "неправ.": "ненормативное",
    # Remaining usage/domain labels from the dictionary's own abbreviation
    # list (PDF pp. X–XII). Grammatical notes such as pl, attr. and predic.
    # deliberately stay in translation text because register is not a grammar
    # field in the target schema.
    "разг": "разговорное",
    "авто": "автомобильное дело",
    "ак.": "акустика",
    "антроп.": "антропология",
    "араб.": "арабское",
    "арт.": "артиллерия",
    "археол.": "археология",
    "астр.": "астрономия",
    "бакт.": "бактериология",
    "банк.": "банковское",
    "библ.": "библеизм",
    "бирж.": "биржевое",
    "венг.": "венгерское",
    "вет.": "ветеринария",
    "возвыш.": "возвышенное",
    "вульг.": "вульгарное",
    "вчт.": "вычислительная техника",
    "геод.": "геодезия",
    "геом.": "геометрия",
    "геральд.": "геральдика",
    "гидр.": "гидротехника",
    "голл.": "голландское",
    "греч.": "греческое",
    "детск.": "детская речь",
    "дип.": "дипломатия",
    "египт.": "египетское",
    "жарг.": "жаргон",
    "жив.": "живопись",
    "инд.": "индийское",
    "информ.": "информатика",
    "иск.": "искусство",
    "исп.": "испанское",
    "ит.": "итальянское",
    "канад.": "канадское",
    "канц.": "канцелярское",
    "кит.": "китайское",
    "косм.": "космонавтика",
    "кул.": "кулинария",
    "ласк.": "ласкательное",
    "лес.": "лесное дело",
    "лит.": "литература",
    "лог.": "логика",
    "малайск.": "малайское",
    "метео": "метеорология",
    "мех.": "механика",
    "мин.": "минералогия",
    "миф.": "мифология",
    "нем.": "немецкое",
    "неол.": "неологизм",
    "норв.": "норвежское",
    "опт.": "оптика",
    "палеонт.": "палеонтология",
    "парл.": "парламентское",
    "перс.": "персидское",
    "полит.": "политическое",
    "полит.-эк.": "политическая экономия",
    "польск.": "польское",
    "португ.": "португальское",
    "презр.": "презрительное",
    "психол.": "психология",
    "реакт.": "реактивная техника",
    "ритор.": "риторическое",
    "русск.": "русское",
    "с.-х.": "сельское хозяйство",
    "c.-х.": "сельское хозяйство",
    "санскр.": "санскрит",
    "сканд.": "скандинавское",
    "спец.": "специальный термин",
    "стат.": "статистика",
    "стил.": "стилистика",
    "стих.": "стихосложение",
    "страх.": "страховое",
    "студ.": "студенческое",
    "тлв.": "телевидение",
    "тлг.": "телеграфия",
    "тлф.": "телефония",
    "топ.": "топография",
    "тур.": "турецкое",
    "унив.": "университетское",
    "фарм.": "фармакология",
    "филос.": "философия",
    "финск.": "финское",
    "хир.": "хирургия",
    "школ.": "школьное",
    "южно-амер.": "южноамериканское",
    "южно-афр.": "южноафриканское",
    "яп.": "японское",
    "эк.": "экономика",
    "элн.": "электроника",
    "этн.": "этнография",
}

@dataclass
class Marker:
    start: int
    end: int
    number: int


def dedupe(values: Iterable[str]) -> list[str]:
    return list(dict.fromkeys(value for value in values if value))


def strip_markup(text: str) -> str:
    return re.sub(r"</?i>", "", text)


def clean_plain(text: str) -> str:
    text = strip_markup(text)
    # The source prints ≈/≅ as a label for an approximate equivalent. It is
    # represented in `register`, not leaked into translation/example strings.
    text = text.replace("≅", " ").replace("≈", " ")
    text = normalize_spaces(text)
    # Repair legacy discretionary hyphens whose glyph was extracted as a
    # regular hyphen. These shapes are unambiguous: an intended Russian
    # compound has no whitespace after its hyphen.
    text = re.sub(r"(?<=[А-Яа-яЁё])-{2,}\s*(?=[А-Яа-яЁё])", "", text)
    text = re.sub(
        r"(?<=[А-Яа-яЁё])-\s+(?=(?!и(?:ли)?\b)[А-Яа-яЁё])",
        "",
        text,
    )
    text = re.sub(r"(?<=[А-Яа-яЁё])-(?=[,;])", "", text)
    text = text.replace("како го-л.", "какого-л.")
    text = text.replace("стихи-", "стихи")
    # One source line wraps "востока" without a printed discretionary
    # hyphen. The corpus-wide joined-word audit finds this as the only selected
    # Russian pair with that signature.
    text = re.sub(r"\bвос\s+тока\b", "востока", text)
    text = text.replace("ЛаМанш", "Ла-Манш")
    text = text.replace("СанктПетербург", "Санкт-Петербург")

    # The aligned OCR layer represents stress by capitalising the stressed
    # Cyrillic vowel inside a word (e.g. лОжное). Stress is not part of the
    # meanings schema; fold internal capitals back to ordinary orthography.
    text = re.sub(
        r"[А-Яа-яЁё]+",
        lambda match: match.group(0)[0] + match.group(0)[1:].lower()
        if re.search(r"[а-яё][А-ЯЁ]", match.group(0))
        else match.group(0),
        text,
    )
    # A ♦/¬ inside [см. ...] is a navigation glyph, not the start of a new
    # idiom/phrasal block. Preserve the human-readable cross-reference while
    # keeping source control glyphs out of the JSON text.
    text = re.sub(r"(?<=\[)([^\]]*?)\s+♦\s+(?=[^\]]+\])", r"\1: ", text)
    text = re.sub(r"♦", "идиомы", text)
    text = re.sub(r"¬\s*", "", text)
    text = re.sub(r"\s+([,.;:!?%)\]])", r"\1", text)
    text = re.sub(r"([([])\s+", r"\1", text)
    text = re.sub(r"\s+([-–—])\s+", r" \1 ", text)
    return text.strip(" ;:")


def normalize_number_markup(text: str) -> str:
    """Move a numbered-sense delimiter out of an accidental italic run.

    In a few source articles the font boundary falls between the digit and its
    closing parenthesis (``3<i>) мед.</i>``).  The typography is not part of
    the delimiter, so normalize it before structural parsing while retaining
    the italic label which follows it.
    """
    return re.sub(
        r"(?<!\d)(\d+)<i>\)\s*([^<]*)</i>",
        lambda match: f"{match.group(1)}) <i>{match.group(2).strip()}</i>",
        text,
    )


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
        text = re.sub(
            rf"(?<!\w){re.escape(key)}(?!\w)",
            "",
            text,
            flags=re.IGNORECASE,
        )
    return text


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
        # Markup changes font only. Parentheses can open outside an italic run
        # and close inside it, so their nesting must be tracked across tags.
        if char == "(":
            paren_depth += 1
        elif char == ")" and paren_depth:
            paren_depth -= 1
        elif char == "[":
            bracket_depth += 1
        elif char == "]" and bracket_depth:
            bracket_depth -= 1
        elif not in_tag and char.isdigit() and paren_depth == 0 and bracket_depth == 0:
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
        if char == "(":
            paren_depth += 1
        elif char == ")" and paren_depth:
            paren_depth -= 1
        elif char == "[":
            bracket_depth += 1
        elif char == "]" and bracket_depth:
            bracket_depth -= 1
        elif (
            not in_tag
            and char == delimiter
            and paren_depth == 0
            and bracket_depth == 0
        ):
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


def pos_prefix(text: str) -> tuple[str | None, list[str], str]:
    """Peel a grammatical abbreviation from the first italic run."""
    text = re.sub(r"^\s*\[[^\]]{1,160}\]\s*", "", text)

    # Inflection notes can precede the POS: (pl -os) n, (pl feet) n, etc.
    morphology_match = re.match(r"^\s*(\([^)]{1,160}\))\s*", text)
    if morphology_match:
        candidate_tail = text[morphology_match.end() :].strip()
        candidate_pos, candidate_registers, candidate_content = pos_prefix(candidate_tail)
        if candidate_pos:
            morphology = morphology_match.group(1)
            content = morphology + (" " + candidate_content if candidate_content else "")
            return candidate_pos, candidate_registers, content

    # PDF font runs sometimes split one label: <i>pres.</i> <i>p. от</i>.
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
        embedded = re.search(
            r"(?:^|\s)(pres\.?\s*p\.|p\.\s*p\.|\u0440\.\s*\u0440\.|adv|adj|pron|prep|conj|pref|suff|art|part|int|num|cj|vi|vt|n|v|a)(?=\s|[,.:]|$)[.,:]?",
            descriptor,
            re.IGNORECASE,
        )
        if embedded:
            token = re.sub(r"\s+", " ", embedded.group(1).lower())
            if re.fullmatch(r"pres\.? p\.", token):
                token = "pres. p."
            elif re.fullmatch(r"\u0440\. \u0440\.", token):
                token = "р. р."
            found.append(POS_MAP.get(token, "other"))
            remaining = (descriptor[: embedded.start()] + descriptor[embedded.end() :]).strip()

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
    candidates = find_top_level_markers(body, ".")

    # A bare ``N.`` is ambiguous: the same shape occurs in clock times,
    # decimals and cross-references (6.30, 11.6, manual 1.).  Real numbered
    # grammar sections form a consecutive sequence beginning at 1, or begin at
    # 2 when the first POS is unnumbered.  Restrict splitting to that structure.
    markers: list[Marker] = []
    plausible_starts: list[Marker] = []
    for marker in candidates:
        if marker.number != 1:
            continue
        prefix = body[: marker.start].strip()
        prefix_pos, _, prefix_tail = pos_prefix(prefix)
        prefix_plain = clean_plain(remove_register_tokens(prefix))
        if not prefix_plain or (prefix_pos and not clean_plain(prefix_tail)):
            plausible_starts.append(marker)

    # A visible grammatical label is conclusive even when the printed section
    # number is duplicated (clip II contains two separate ``2. v`` blocks).
    markers = [marker for marker in candidates if pos_prefix(body[marker.end :])[0]]

    # Some first sections carry morphology or an article-level note before
    # ``1.`` and put their POS after it.  Others omit a repeated POS on a
    # following section whose number is nevertheless consecutive.
    if markers:
        if markers[0].number == 2:
            preceding_one = next(
                (
                    marker
                    for marker in plausible_starts
                    if marker.start < markers[0].start
                ),
                None,
            )
            if preceding_one:
                markers.insert(0, preceding_one)

        last = markers[-1]
        expected = last.number + 1
        trailing = next(
            (
                marker
                for marker in candidates
                if marker.start > last.start and marker.number == expected
            ),
            None,
        )
        if trailing:
            markers.append(trailing)
    elif plausible_starts:
        start_marker = plausible_starts[0]
        if pos_prefix(body[start_marker.end :])[0]:
            markers = [start_marker]

    prefix_registers: list[str] = []
    prefix_part_of_speech: str | None = None
    morphology_prefix = ""
    raw_sections: list[str] = [body.strip()]

    if markers and markers[0].number == 1:
        prefix = body[: markers[0].start].strip()
        # General article-level labels can precede the numbered POS sections:
        # разг. 1. n..., (сокр. от ...) уст. 1. n..., шахм. 1. n...
        prefix_registers = registers_in_text(strip_markup(prefix))
        prefix_without_registers = remove_register_tokens(prefix)
        prefix_pos, _, prefix_tail = pos_prefix(prefix_without_registers)
        if prefix_pos and not clean_plain(prefix_tail):
            prefix_part_of_speech = prefix_pos
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
        # The first POS is sometimes unnumbered: n ... 2. v ... 3. adv ...
        raw_sections = [body[: markers[0].start].strip()]
        for index, marker in enumerate(markers):
            end = markers[index + 1].start if index + 1 < len(markers) else len(body)
            raw_sections.append(body[marker.end:end].strip())

    sections: list[tuple[str | None, list[str], str]] = []
    previous_pos: str | None = None
    for index, raw in enumerate(raw_sections):
        part_of_speech, registers, content = pos_prefix(raw)
        registers = dedupe([*prefix_registers, *registers])
        if index == 0 and part_of_speech is None and prefix_part_of_speech:
            part_of_speech = prefix_part_of_speech
        if index == 0 and morphology_prefix:
            content = morphology_prefix + (" " + content if content else "")
        if part_of_speech is None and len(raw_sections) > 1 and index == 0:
            # Sections such as foot "1. (pl feet) ... 2. v ..." omit n.
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


def extract_example(clause: str, word: str) -> dict[str, str] | None:
    boundary = first_cyrillic_outside_italic(clause)
    if boundary is None:
        return None
    en_raw = clause[:boundary].strip()
    ru_raw = clause[boundary:].strip()

    registers: list[str] = []
    if "≈" in clause or "≅" in clause:
        registers.append("приблизительный перевод")
    for content in re.findall(r"<i>(.*?)</i>", en_raw):
        registers.extend(registers_in_text(content))
    # Composite abbreviations can be split into adjacent font runs, for
    # example <i>ж.</i>-<i>д.</i>. Inspect the joined visible text too.
    registers.extend(registers_in_text(strip_markup(en_raw)))

    # A parenthetical note after the Russian equivalent can scope only this
    # example, e.g. D. Sir ... (офиц. обращение в письме).
    def remove_parenthetical_register(match: re.Match[str]) -> str:
        found = registers_in_text(match.group(1))
        if found:
            registers.extend(found)
            return ""
        return match.group(0)

    ru_raw = re.sub(r"\(\s*<i>(.*?)</i>\s*\)", remove_parenthetical_register, ru_raw)

    # Register-only italic spans between the English phrase and its Russian
    # equivalent are metadata, not part of the example text.
    def drop_register_span(match: re.Match[str]) -> str:
        return "" if registers_in_text(match.group(1)) else match.group(1)

    en_raw = re.sub(r"<i>(.*?)</i>", drop_register_span, en_raw)
    en = clean_plain(en_raw)
    en = clean_plain(remove_register_tokens(en))
    en = expand_tilde(en, word).strip(" ,:;")
    ru = clean_plain(ru_raw).strip(" ,:;")
    if en.endswith("(") and ")" in ru:
        en = en[:-1].rstrip()
        ru = "(" + ru
    if not re.search(r"[A-Za-z~]", en) or not re.search(r"[А-Яа-яЁё]", ru):
        return None
    result = {"en": en, "ru": ru}
    unique_registers = dedupe(registers)
    if unique_registers:
        result["register"] = ", ".join(unique_registers)
    return result


def split_embedded_examples(example: dict[str, str], word: str) -> list[dict[str, str]]:
    """Split a second English/Russian pair printed in the same source clause."""

    def find_separator(text: str) -> tuple[int, int] | None:
        paren_depth = 0
        bracket_depth = 0
        for index, char in enumerate(text):
            if char == "(":
                paren_depth += 1
            elif char == ")" and paren_depth:
                paren_depth -= 1
            elif char == "[":
                bracket_depth += 1
            elif char == "]" and bracket_depth:
                bracket_depth -= 1
            elif char in ",;" and paren_depth == 0 and bracket_depth == 0:
                tail = re.match(r"\s*(?=[A-Za-z~])", text[index + 1 :])
                if tail:
                    return index, index + 1 + tail.end()
        return None

    results = [example]
    while True:
        current = results[-1]
        ru = current["ru"]
        separator = find_separator(ru)
        if not separator:
            break
        separator_start, separator_end = separator
        remainder = ru[separator_end:]
        boundary = re.search(r"[А-Яа-яЁё]", remainder)
        if not boundary:
            break
        en = expand_tilde(remainder[: boundary.start()].strip(), word)
        translated = remainder[boundary.start() :].strip()
        if not re.search(r"[A-Za-z]", en) or not translated:
            break
        current["ru"] = ru[:separator_start].rstrip()
        results.append({"en": en, "ru": translated})
    return results


def parse_sense_text(text: str, word: str) -> tuple[str, list[dict[str, str]], list[str]]:
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
        has_approximation = "≈" in clause or "≅" in clause
        colon = top_level_colon(clause)
        if colon is not None:
            before = clean_plain(clause[:colon])
            if before:
                translations.append(before)
                if has_approximation:
                    meaning_registers = dedupe(
                        [*meaning_registers, "приблизительный перевод"]
                    )
            clause = clause[colon + 1 :].strip()

        if starts_like_example(clause):
            example = extract_example(clause, word)
            if example:
                examples.extend(split_embedded_examples(example, word))
                translation_after_examples = False
                continue

        if has_approximation:
            meaning_registers = dedupe(
                [*meaning_registers, "приблизительный перевод"]
            )
        plain = clean_plain(clause)
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
    return translation, examples, meaning_registers


def split_special_blocks(text: str) -> tuple[str, list[tuple[str, str]]]:
    # ♦ and ¬ also occur inside cross-references such as [см. тж. ♦] and
    # [см. тж. ¬ go after]. Only top-level glyphs open actual special blocks.
    # A handful of source lines print ♦ immediately before the next Arabic
    # sense.  It is a visual separator there, not an idiom block opener.  One
    # article (track) places that separator just outside a cross-reference;
    # restore it to the bracket before removing top-level separators.
    text = re.sub(r"\]\s*♦(?=\s*\d+\))", " ♦]", text)
    text = re.sub(r"♦(?=\s*\d+\))", "", text)
    positions: list[tuple[int, str]] = []
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
        if char == "(":
            paren_depth += 1
        elif char == ")" and paren_depth:
            paren_depth -= 1
        elif char == "[":
            bracket_depth += 1
        elif char == "]" and bracket_depth:
            bracket_depth -= 1
        elif (
            not in_tag
            and char in "¬♦"
            and paren_depth == 0
            and bracket_depth == 0
        ):
                positions.append((index, char))
        index += 1
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


def parse_idiom_block(
    content: str,
    word: str,
    part_of_speech: str,
    section_registers: list[str],
) -> dict[str, Any]:
    examples: list[dict[str, str]] = []
    translations: list[str] = []
    for clause in split_top_level(content):
        example = extract_example(clause, word)
        if example:
            examples.append(example)
            translations.append(example["ru"])
        else:
            plain = expand_tilde(clean_plain(clause), word)
            if plain:
                translations.append(plain)
    return {
        "partOfSpeech": part_of_speech,
        "translation": "; ".join(translations),
        "examples": examples,
        "register": dedupe(section_registers),
    }


def parse_phrasal_block(
    content: str,
    word: str,
    part_of_speech: str,
    section_registers: list[str],
) -> dict[str, Any]:
    # One ¬ block is one source meaning even when it lists several phrasal
    # heads separated by semicolons. Preserve every English/Russian pair in
    # the translation instead of letting later heads collapse into the first.
    translations: list[str] = []
    examples: list[dict[str, str]] = []
    registers: list[str] = []
    for clause in split_top_level(content):
        example = extract_example(clause, word)
        if example:
            expanded_examples = split_embedded_examples(example, word)
            examples.extend(expanded_examples)
            translations.extend(
                f"{item['en']} — {item['ru']}" for item in expanded_examples
            )
            continue
        plain = expand_tilde(clean_plain(clause), word)
        if plain:
            translations.append(plain)
    translation = "; ".join(translations)
    return {
        "partOfSpeech": part_of_speech,
        "translation": translation,
        "examples": examples,
        "register": dedupe([*section_registers, *registers]),
    }


def parse_article(article: dict[str, Any], word: str) -> list[dict[str, Any]]:
    parsed: list[dict[str, Any]] = []
    body = normalize_number_markup(article["body"])
    for section_pos, section_registers, section_text in major_sections(body):
        part_of_speech = section_pos or ("article" if word.lower() == "a" else "other")
        main, blocks = split_special_blocks(section_text)
        for raw_sense in split_senses(main):
            inline_pos, inline_registers, inline_tail = pos_prefix(raw_sense)
            if inline_pos:
                part_of_speech = inline_pos
                section_registers = dedupe([*section_registers, *inline_registers])
                raw_sense = inline_tail
            translation, examples, registers = parse_sense_text(raw_sense, word)
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
                parsed.append(
                    parse_idiom_block(content, word, part_of_speech, section_registers)
                )
            else:
                parsed.append(
                    parse_phrasal_block(
                        content, word, part_of_speech, section_registers
                    )
                )
    return parsed


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


def select_phrase_source(
    word: str, index: dict[str, list[dict[str, Any]]]
) -> tuple[dict[str, Any], str] | None:
    words = word.lower().split()
    if len(words) < 2:
        return None
    base_candidates = select_articles(words[0], index)
    tail = " ".join(words[1:])
    pattern = re.compile(rf"~\s+{re.escape(tail)}\b", re.IGNORECASE)
    for article in base_candidates:
        match = pattern.search(strip_markup(article["body"]).lower())
        if match:
            # Locate the same phrase in marked-up text.  Tags seldom occur
            # inside a phrasal head; whitespace flexibility covers layout.
            marked = re.search(rf"~\s+{re.escape(tail)}\b", article["body"], re.IGNORECASE)
            if marked:
                return article, article["body"][marked.start() :]
    return None


def parse_phrase_source(article: dict[str, Any], text: str, word: str) -> list[dict[str, Any]]:
    base_word = word.split()[0]
    tail = " ".join(word.split()[1:])

    if word.lower() == "next to":
        return [
            meaning
            for meaning in parse_article(article, base_word)
            if meaning["partOfSpeech"] == "preposition"
        ]

    # If the first match is inside an example (I ~ to go), select the complete
    # numbered source sense instead of treating that example as a subentry.
    if re.match(rf"^~\s+{re.escape(tail)}\s+[A-Za-z]", strip_markup(text), re.IGNORECASE):
        full = parse_article(article, base_word)
        target = word.lower()
        matching = [
            meaning
            for meaning in full
            if any(target in example["en"].lower() for example in meaning["examples"])
        ]
        if matching:
            return matching

    # A following special block or numbered source sense ends the scoped
    # phrase.  Tilde-headed examples with the same particle remain included.
    end_match = re.search(r"[¬♦]|\s\d+\)", text[1:])
    if end_match:
        text = text[: end_match.start() + 1]
    section_pos = major_sections(article["body"])[0][0] or "other"
    lowered = strip_markup(text[:120]).lower()
    if "как prep" in lowered:
        section_pos = "preposition"
    elif "как cj" in lowered:
        section_pos = "conjunction"
    meaning = parse_phrasal_block(text, base_word, section_pos, [])
    # The head must be the requested phrase rather than a tilde expanded with
    # only its first component.
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


def narrow_duplicate_articles(
    entry: dict[str, Any], selected: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Use Oxford POS only as a hint when PDF diacritics collapse headwords."""
    if len(selected) < 2:
        return selected
    if any(strip_roman_suffix(article["headword"])[1] for article in selected):
        return selected
    if len({article["headword"].lower() for article in selected}) != 1:
        return selected
    hints = {
        meaning.get("partOfSpeech")
        for meaning in entry.get("meanings", [])
        if meaning.get("partOfSpeech")
    }
    if not hints:
        return selected
    matching: list[dict[str, Any]] = []
    for article in selected:
        source_pos = {
            meaning["partOfSpeech"]
            for meaning in parse_article(article, entry["word"])
            if meaning["partOfSpeech"] != "other"
        }
        if source_pos.intersection(hints):
            matching.append(article)
    return matching or selected


def rebuild_entries(
    articles: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    with OXFORD_PATH.open(encoding="utf-8") as stream:
        original = json.load(stream)
    index = build_article_index(articles)
    rebuilt: list[dict[str, Any]] = []
    resolution_counts: Counter[str] = Counter()
    unresolved: list[str] = []
    zero_meanings: list[str] = []

    for entry in original:
        word = entry["word"]
        selected, phrase, resolution = resolve_entry_articles(word, index)
        selected = narrow_duplicate_articles(entry, selected)
        resolution_counts[resolution.split(":", 1)[0]] += 1
        meanings: list[dict[str, Any]] = []
        if selected:
            for article in selected:
                meanings.extend(parse_article(article, word))
            if resolution.startswith("source_form:"):
                hints = {
                    meaning.get("partOfSpeech")
                    for meaning in entry.get("meanings", [])
                    if meaning.get("partOfSpeech")
                }
                filtered = [
                    meaning for meaning in meanings if meaning["partOfSpeech"] in hints
                ]
                if filtered:
                    meanings = filtered
        elif phrase:
            meanings = parse_phrase_source(phrase[0], phrase[1], word)
        else:
            unresolved.append(word)

        for meaning_id, meaning in enumerate(meanings, start=1):
            meaning["id"] = meaning_id
            # Stable, deliberately minimal key order; primary and synonyms are
            # forbidden by the agreed source model.
            ordered = {
                "id": meaning.pop("id"),
                "partOfSpeech": meaning.pop("partOfSpeech"),
                "translation": meaning.pop("translation"),
                "examples": meaning.pop("examples"),
                "register": meaning.pop("register"),
            }
            meaning.clear()
            meaning.update(ordered)

        if not meanings:
            zero_meanings.append(word)
        new_entry = {key: value for key, value in entry.items() if key != "meanings"}
        new_entry["meanings"] = meanings
        rebuilt.append(new_entry)

    stats = {
        "entries": len(rebuilt),
        "articles": len(articles),
        "resolution": dict(resolution_counts),
        "unresolved_count": len(unresolved),
        "unresolved": unresolved,
        "zero_meanings_count": len(zero_meanings),
        "zero_meanings": zero_meanings,
        "meaning_count": sum(len(entry["meanings"]) for entry in rebuilt),
        "example_count": sum(
            len(meaning["examples"])
            for entry in rebuilt
            for meaning in entry["meanings"]
        ),
        "other_pos_count": sum(
            meaning["partOfSpeech"] == "other"
            for entry in rebuilt
            for meaning in entry["meanings"]
        ),
        "empty_translation_with_examples_count": sum(
            not meaning["translation"] and bool(meaning["examples"])
            for entry in rebuilt
            for meaning in entry["meanings"]
        ),
    }
    return rebuilt, stats


def validate_rebuilt(entries: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    if len(entries) != 4982:
        errors.append(f"expected 4982 entries, got {len(entries)}")
    # The supplied Oxford data intentionally contains separate top-level rows
    # for several homographs (live, house, IT, March, May, minute, use, wind).
    forbidden = {"primary", "synonyms"}
    for entry in entries:
        for expected_id, meaning in enumerate(entry.get("meanings", []), start=1):
            present_forbidden = forbidden.intersection(meaning)
            if present_forbidden:
                errors.append(f"{entry['word']}: forbidden {sorted(present_forbidden)}")
            if meaning.get("id") != expected_id:
                errors.append(f"{entry['word']}: non-sequential meaning IDs")
            if not meaning.get("partOfSpeech"):
                errors.append(f"{entry['word']}: empty partOfSpeech")
            if not meaning.get("translation") and not meaning.get("examples"):
                errors.append(f"{entry['word']}: empty meaning {expected_id}")
            if not isinstance(meaning.get("register"), list):
                errors.append(f"{entry['word']}: register is not a list")
            blob = meaning.get("translation", "") + json.dumps(
                meaning.get("examples", []), ensure_ascii=False
            )
            if re.search(r"</?i>|\(cid:|[¬♦\ue000]", blob):
                errors.append(f"{entry['word']}: source markup leaked")
            if re.search(
                r"(?:^|\s)\d+\.\s*(?:n|v|a|adv|prep|pron|int)\b",
                meaning.get("translation", ""),
            ):
                errors.append(f"{entry['word']}: POS section marker leaked")
            for example in meaning.get("examples", []):
                if re.search(
                    r"^(?:n|v|a|adv|pron|prep|int)$|^\(?\s*(?:pl|past и|pres\. p\.|p\. p\.)\b|^\(?\s*sing[.)]",
                    example.get("en", ""),
                    re.IGNORECASE,
                ):
                    errors.append(f"{entry['word']}: morphology parsed as example")
    return errors


def analyze_coverage(articles: list[dict[str, Any]]) -> dict[str, Any]:
    with OXFORD_PATH.open(encoding="utf-8") as stream:
        oxford = json.load(stream)

    index = build_article_index(articles)
    matched: list[str] = []
    missing: list[str] = []
    ambiguous: dict[str, list[str]] = {}

    for item in oxford:
        selected = select_articles(item["word"], index)
        if selected:
            matched.append(item["word"])
            if len(selected) > 1:
                ambiguous[item["word"]] = [article["headword"] for article in selected]
        else:
            missing.append(item["word"])

    report = {
        "article_count": len(articles),
        "oxford_count": len(oxford),
        "matched_count": len(matched),
        "missing_count": len(missing),
        "ambiguous_count": len(ambiguous),
        "missing": missing,
        "ambiguous": ambiguous,
    }
    with REPORT_PATH.open("w", encoding="utf-8") as stream:
        json.dump(report, stream, ensure_ascii=False, indent=2)

    print(
        f"Coverage: {len(matched):,}/{len(oxford):,} "
        f"({len(matched) / len(oxford):.1%}); missing={len(missing):,}; "
        f"ambiguous={len(ambiguous):,}"
    )
    print("First missing:", ", ".join(missing[:100]))
    return report


def load_articles(force_extract: bool = False) -> list[dict[str, Any]]:
    if force_extract or not ARTICLE_CACHE.exists():
        articles = extract_articles()
    else:
        with ARTICLE_CACHE.open(encoding="utf-8") as stream:
            articles = json.load(stream)
    for article in articles:
        article["body"] = re.sub(
            r"<i>(ж|с|полит)\.</i>-<i>(д|х|эк)\.</i>",
            r"<i>\1.-\2.</i>",
            article["body"],
        )
        # In this one accented headword the final "ège" was emitted in a
        # non-bold font and landed at the start of the article body.
        if article["headword"] == "menege, man" and article["body"].startswith("ège "):
            article["headword"] = "manege, manège"
            article["body"] = article["body"][4:]
        if strip_roman_suffix(article["headword"])[1] is None:
            marker = re.match(rf"^({ROMAN_TOKEN_PATTERN})\s+", article["body"])
            if marker:
                article["headword"] += " " + marker.group(1)
                article["body"] = article["body"][marker.end() :]
                article["body"] = re.sub(
                    r"^\[[^\]]{1,120}\]\s*", "", article["body"]
                )
    return articles


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--extract", action="store_true", help="re-extract article cache")
    parser.add_argument("--write", action="store_true", help="write rebuilt project JSON after validation")
    parser.add_argument("--stage-only", action="store_true", help="with --write, do not replace project files")
    parser.add_argument("--word", action="append", default=[], help="print parsed meanings for one word")
    args = parser.parse_args()

    articles = load_articles(force_extract=args.extract)
    analyze_coverage(articles)

    if args.word:
        index = build_article_index(articles)
        for word in args.word:
            selected, phrase, resolution = resolve_entry_articles(word, index)
            if selected:
                meanings = [
                    meaning
                    for article in selected
                    for meaning in parse_article(article, word)
                ]
                sources = [article["headword"] for article in selected]
            elif phrase:
                meanings = parse_phrase_source(phrase[0], phrase[1], word)
                sources = [phrase[0]["headword"]]
            else:
                meanings = []
                sources = []
            for meaning_id, meaning in enumerate(meanings, start=1):
                meaning["id"] = meaning_id
            print(
                json.dumps(
                    {
                        "word": word,
                        "resolution": resolution,
                        "sources": sources,
                        "meanings": meanings,
                    },
                    ensure_ascii=False,
                    indent=2,
                )
            )

    if args.write:
        rebuilt, stats = rebuild_entries(articles)
        errors = validate_rebuilt(rebuilt)
        stats["validation_errors"] = errors[:100]
        stats["validation_error_count"] = len(errors)
        with REPORT_PATH.open("w", encoding="utf-8") as stream:
            json.dump(stats, stream, ensure_ascii=False, indent=2)
        with REBUILT_PATH.open("w", encoding="utf-8") as stream:
            json.dump(rebuilt, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
        print(json.dumps(stats, ensure_ascii=False, indent=2))
        if errors:
            raise SystemExit(
                f"Validation failed with {len(errors)} error(s); staged file only: {REBUILT_PATH}"
            )
        if args.stage_only:
            print(f"Validated staged file: {REBUILT_PATH}")
            return
        for destination in (OXFORD_PATH, APP_OXFORD_PATH):
            with destination.open("w", encoding="utf-8") as stream:
                json.dump(rebuilt, stream, ensure_ascii=False, indent=2)
                stream.write("\n")
            print(f"Wrote {destination}")


if __name__ == "__main__":
    main()
