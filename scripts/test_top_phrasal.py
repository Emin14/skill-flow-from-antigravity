# -*- coding: utf-8 -*-
import json
import sys
import os
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath("."))

def split_top_level_phrasal(text: str) -> list[str]:
    # Find phrasal splits ONLY at parenthesis depth == 0!
    PHRASAL_PARTICLES = (
        r"down|in|out|off|away|up|over|through|back|on|about|along|across|around|"
        r"by|for|from|into|of|to|with|upon|ahead|apart|aside|forth|together|under"
    )
    pattern = re.compile(
        rf"(\s+[¬♦]\s+|(?:(?<=[а-яА-ЯёЁ])|(?<=[а-яА-ЯёЁ]\))|(?<=\.\))|(?<=>))\s+(?:¬\s*)?~\s+(?:{PHRASAL_PARTICLES})\b)"
    )
    
    # We find all matches, but only keep those at parenthesis depth == 0!
    chunks = []
    last_end = 0
    paren_depth = 0
    in_tag = False
    
    # Track parens across text
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
        
        # Check match starting at i
        m = pattern.match(text, i)
        if m and paren_depth == 0:
            chunks.append(text[last_end:i].strip())
            chunks.append(m.group(0))
            last_end = m.end()
            i = m.end()
            continue
        i += 1
    chunks.append(text[last_end:].strip())
    return [c for c in chunks if c]

text_light = "3) сходить (обыкн. ~ off, ~ down) 4) опускаться, садиться (на что-л.); падать"
text_crush = "12) втискивать ~ down а) смять; придавить; б) раздробить"

print("LIGHT:", split_top_level_phrasal(text_light))
print("CRUSH:", split_top_level_phrasal(text_crush))
