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

PHRASAL_SPLIT_RE = re.compile(
    rf"(\s+[¬♦]\s+|(?:(?<=[а-яА-ЯёЁ])|(?<=[а-яА-ЯёЁ]\))|(?<=\.\)))\s+(?:¬\s*)?~\s+(?:{PHRASAL_PARTICLES})\b)"
)

t1 = "давать полный газ (двигателю) ~ away промотать на скачках"
t2 = "спасать (ворота — в футболе и тому подобное) ~ up делать сбережения"
t3 = "салить, осалить (в игре) ~ along ходить по пятам"
t4 = "to lay (one's) ~ with smth. рассчитывать на что-либо"
t5 = "to have (got) a ~ on smb. сильно увлечься кем-либо"

for t in [t1, t2, t3, t4, t5]:
    chunks = PHRASAL_SPLIT_RE.split(t)
    print("SRC:", repr(t))
    print("CHUNKS:", chunks)
    print("---")
