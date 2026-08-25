# -*- coding: utf-8 -*-
import json
import sys
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import os
sys.path.insert(0, os.path.abspath("."))
from scripts.align_muller_precision import REGISTER_MAP

def clean_english_phrase(en: str, word: str) -> tuple[str, list[str]]:
    en = en.strip()
    if not en:
        return "", []

    # 1. Expand single-letter headword abbreviation: e.g. 'Holy A.' -> 'Holy Alliance'
    if word:
        cap_initial = word[0].upper()
        en = re.sub(rf"\b{cap_initial}\.(?!\w)", word, en)

    # 2. Extract and strip Russian register tags from English phrase
    found_regs = []
    for tag, reg_val in sorted(REGISTER_MAP.items(), key=lambda x: len(x[0]), reverse=True):
        pattern = rf"(?<!\w){re.escape(tag)}(?!\w)"
        if re.search(pattern, en, flags=re.IGNORECASE):
            found_regs.append(reg_val)
            en = re.sub(pattern, "", en, flags=re.IGNORECASE)

    # 3. Clean Russian editorial annotations inside English phrase:
    en = re.sub(r"\bили\b", "or", en, flags=re.IGNORECASE)
    en = re.sub(r"\(с\s+inf\.?\)", "(+ inf.)", en, flags=re.IGNORECASE)
    en = re.sub(r"\bpl\s+собир\.?", "pl", en, flags=re.IGNORECASE)
    en = re.sub(r"\bсобир\.?", "", en, flags=re.IGNORECASE)
    en = re.sub(r"\[(?:см\.|сравн\.)[^\]]*\]", "", en, flags=re.IGNORECASE)
    en = re.sub(r"\((?:употр\.|обыкн\.|часто)[^)]*\)", "", en, flags=re.IGNORECASE)
    en = re.sub(r"\[[^\]]*\]", "", en)  # strip leftover phonetic brackets
    en = re.sub(r"^[=\s]+", "", en)  # strip leading =
    en = re.sub(r"\s+[=]\s*$", "", en)  # strip trailing =

    # 4. Standard English abbreviations expansion
    en = re.sub(r"\bsmb\.'s\b", "somebody's", en, flags=re.IGNORECASE)
    en = re.sub(r"\bsmb\.\b", "somebody", en, flags=re.IGNORECASE)
    en = re.sub(r"\bsmth\.'s\b", "something's", en, flags=re.IGNORECASE)
    en = re.sub(r"\bsmth\.\b", "something", en, flags=re.IGNORECASE)
    en = re.sub(r"\bsb\b\.?", "somebody", en, flags=re.IGNORECASE)
    en = re.sub(r"\bsth\b\.?", "something", en, flags=re.IGNORECASE)

    # Replace tildes
    en = en.replace("~", word)

    # Clean whitespace and trailing punctuation
    en = re.sub(r"\s+", " ", en).strip(" ,:;=")
    return en, found_regs

test_cases = [
    ("a good (или great) many days (books)", "good"),
    ("ability to pay ком.", "ability"),
    ("to be able (с inf.)", "able"),
    ("about face (или turn)! воен.", "about"),
    ("actions speak louder than words посл. =", "action"),
    ("Holy A. ист.", "alliance"),
    ("along of диал.", "along"),
    ("alongside of (употр. как prep)", "alongside"),
    ("apparent noon астр.", "apparent"),
    ("= active voice [см. 1, 5)]", "active"),
    ("['eid3id] (the aged) pl собир.", "aged"),
    ("to bring (или to enter, to lay) an action against somebody", "action"),
]

for tc, w in test_cases:
    clean_en, regs = clean_english_phrase(tc, w)
    print(f"SRC: {repr(tc)}")
    print(f"  EN: {repr(clean_en)}")
    print(f"  REGISTERS: {regs}")
    print("---")
