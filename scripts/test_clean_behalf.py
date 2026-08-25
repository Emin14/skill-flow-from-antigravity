# -*- coding: utf-8 -*-
import json
import sys
import os
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath("."))
from scripts.align_muller_precision import clean_english_phrase

raw_en = "on (<i>амер.</i> in) ~ of"
phrase, regs = clean_english_phrase(raw_en, "behalf")
print("CLEANED EN:", repr(phrase), "REGS:", regs)
