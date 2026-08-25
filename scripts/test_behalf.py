# -*- coding: utf-8 -*-
import json
import sys
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

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
    # Only reject dangling fragments if the ENTIRE phrase is just a bare preposition or 1 word
    words = en_clean.split()
    if len(words) < 2:
        return False
    return True

print("on behalf of:", is_valid_example("on behalf of", "в интересах кого-либо"))
print("on (or in) behalf of:", is_valid_example("on (or in) behalf of", "в интересах кого-либо"))
