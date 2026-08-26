# -*- coding: utf-8 -*-
"""
Test example register extraction.
"""

import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

from test_register_extraction import extract_registers_from_translation

def clean_example_ru(ru_text, existing_register=None):
    clean_ru, regs = extract_registers_from_translation(ru_text, [existing_register] if existing_register else [])
    reg_val = regs[0] if regs else (existing_register if existing_register else None)
    return clean_ru, reg_val

ex_samples = [
    ("hi, John!", "разг. здорово, Джон!"),
    ("one cent", "амер. монета в 1 цент"),
    ("cross interests", "противоположные интересы")
]

for en, ru in ex_samples:
    c_ru, reg = clean_example_ru(ru)
    print(f"en: {en} | ru: {repr(c_ru)} | register: {reg}")
