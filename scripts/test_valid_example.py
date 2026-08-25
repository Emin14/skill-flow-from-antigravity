# -*- coding: utf-8 -*-
import json
import sys
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def is_valid_example(en: str, ru: str) -> bool:
    if not en:
        return False
    # If en contains Cyrillic characters, it's invalid as en!
    if re.search(r"[а-яА-ЯёЁ]", en):
        return False
    en_clean = en.strip().lower()
    # If en is just a single token or dangling preposition/fragment
    if en_clean in ["to", "of", "for", "with", "in", "at", "on", "into", "by", "from", "as", "there is", "with one's", "i have no", "by (or in)"]:
        return False
    # If ru is empty, en must have at least 2 words and not end in a preposition
    if not ru:
        words = en_clean.split()
        if len(words) < 2:
            return False
        if words[-1] in ["to", "of", "for", "with", "in", "at", "on", "into", "by", "from", "as", "is", "a", "an", "the", "one's"]:
            return False
    return True

test_cases = [
    ("open out to", ""),
    ("to", ""),
    ("personal organizer", ""),
    ("with one's", ""),
    ("pack ice", ""),
    ("there is", ""),
    ("crush down", "а) смять"),
    ("сходить", ""),
    ("Holy alliance", "Священный союз"),
]

for en, ru in test_cases:
    print(f"EN: {repr(en)} | RU: {repr(ru)} -> VALID?: {is_valid_example(en, ru)}")
