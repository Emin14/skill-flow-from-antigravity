# -*- coding: utf-8 -*-
import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

sys.path.append('scripts')
from build_from_parsing_json import (
    POS_MAP, REGISTER_MAP, extract_registers, clean_final_text, parse_entry_meanings_and_phrases
)

headword = "aardvark"
body = "<i>n</i> <i>зоол.</i> африканский муравьед, трубкозуб"

print("Parsing aardvark body:", repr(body))
pos_matches = list(re.finditer(r"(?:^|\s)(?:([1-9])\.\s*)?<i>([a-z\.\s]+)</i>", body))
print("pos_matches:", [(m.group(0), m.group(1), m.group(2)) for m in pos_matches])

meanings, phrases = parse_entry_meanings_and_phrases(headword, body)
print("Result meanings:", meanings)
