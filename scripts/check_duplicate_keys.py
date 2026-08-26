# -*- coding: utf-8 -*-
import sys
import re

content = open('scripts/grammar_reference_fixes.py', encoding='utf-8').read()
keys = re.findall(r"^\s*'([a-zA-Z0-9_-]+)':\s*\{", content, re.MULTILINE)

seen = set()
dups = []
for k in keys:
    if k in seen:
        dups.append(k)
    seen.add(k)

print("Duplicate keys in grammar_reference_fixes.py:", dups)
