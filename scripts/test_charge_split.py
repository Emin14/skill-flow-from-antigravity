# -*- coding: utf-8 -*-
import json
import sys
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PHRASAL_PARTICLES = (
    r"down|in|out|off|away|up|over|through|back|on|about|along|across|around|"
    r"by|for|from|into|of|to|with|upon|ahead|apart|aside|forth|together|under"
)

pattern = re.compile(
    rf"(\s+[¬♦]\s+|(?:(?<=[а-яА-ЯёЁ])|(?<=[а-яА-ЯёЁ]\))|(?<=\.\))|(?<=>)|(?<=>\)))\s+(?:¬\s*)?~\s+(?:{PHRASAL_PARTICLES})\b)"
)

text = "9) <i>юр.</i> напутствовать присяжных (<i>о судье</i>) ~ up а) записывать на <i>чей-л.</i> счёт"

print("MATCHES:", pattern.findall(text))
print("SPLIT:", pattern.split(text))
