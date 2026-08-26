# -*- coding: utf-8 -*-
import sys
import re

sys.path.append('scripts')
from build_from_parsing_json import (
    POS_MAP, REGISTER_MAP, extract_registers, clean_final_text
)

sec_text = "<i>зоол.</i> африканский муравьед, трубкозуб"
sense_chunks = re.split(r"(?:^|\s)[0-9]{1,2}\)\s*", sec_text)
print("sense_chunks:", sense_chunks)

for chunk in sense_chunks:
    regs, sub_clean = extract_registers(chunk)
    print("regs:", regs, "sub_clean:", repr(sub_clean))
    parts = sub_clean.split(";")
    def_parts = []
    examples = []
    for p in parts:
        p = p.strip()
        print("p:", repr(p))
        cyr_match = re.search(r"[А-Яа-яЁё]", p)
        print("cyr_match:", cyr_match)
        if cyr_match and cyr_match.start() > 2:
            pass
        else:
            cl_def = clean_final_text(p)
            print("cl_def:", repr(cl_def), "has_cyr:", any("\u0400" <= c <= "\u04FF" for c in cl_def))
            if cl_def and any("\u0400" <= c <= "\u04FF" for c in cl_def):
                def_parts.append(cl_def)
    translation = "; ".join(def_parts)
    print("translation:", repr(translation))
