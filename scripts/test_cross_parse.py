# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

from test_register_formatting import format_registers_in_text

# Let's inspect how cross is parsed from Doc2 text
doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
txt109 = doc2[109].get_text('text')
doc2.close()

# Clean soft hyphens
txt109 = re.sub(r'([а-яёА-ЯЁa-zA-Z])\xad\n?([а-яёА-ЯЁa-zA-Z])', r'\1\2', txt109).replace('\xad', '')

idx_start = txt109.find('cross I')
idx_end = txt109.find('cross- [')
cross_article = txt109[idx_start:idx_end]

print("=== RAW CROSS ARTICLE ===")
print(cross_article)

# Let's write the parser for cross:
# It has sections:
# cross I [kros] n ...
# cross II [kros] adj ...
# cross III [kros] v ... (with ◊ and ◼)

# Let's parse all sections
sections = re.split(r'(?m)^(cross\s+[IVXLCDM]+\s+\[[^\]]+\]\s+(?:n|adj|v|adv)\b)', cross_article)
print(f"\nSections count: {len(sections)}")
for i, s in enumerate(sections):
    if s.strip():
        print(f"--- Section {i} ---")
        print(repr(s[:100]))
