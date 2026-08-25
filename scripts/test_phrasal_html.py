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

# Allow matching after Cyrillic, closing paren, closing HTML tag '>', dot, or semicolon:
PHRASAL_SPLIT_RE = re.compile(
    rf"(\s+[¬♦]\s+|(?<=[а-яА-ЯёЁ>)\].;])\s+(?:¬\s*)?~\s+(?:{PHRASAL_PARTICLES})\b)"
)

text_race = "5) гнать (лошадь, автомашину); давать полный газ (<i>двигателю</i>) ~ away промотать на скачках (<i>состояние и т. п.</i>) ♦ to ~ the bill through the House"
text_save = "спасать (ворота — в футболе и тому подобное) ~ up делать сбережения"
text_tag = "салить, осалить (в игре) ~ along ходить по пятам"
text_tail = "тянуться длинной лентой (о процессии и тому подобное) ~ away = ~ off"

for t in [text_race, text_save, text_tag, text_tail]:
    chunks = PHRASAL_SPLIT_RE.split(t)
    print("SRC:", repr(t[:40]))
    print("CHUNKS:", chunks)
    print("---")
