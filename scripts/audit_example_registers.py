# -*- coding: utf-8 -*-
"""
Audit register placement: Sense-level vs Example-level registers.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

from parse_utils import REGISTER_MAP

# Let's inspect how many meanings have multiple examples where register was inside an example in raw text
example_level_registers = []

for item in oxford_data:
    w = item['word']
    for m in item['meanings']:
        regs = m.get('register', [])
        exs = m.get('examples', [])
        tr = m.get('translation', '')
        if regs and exs:
            # Check if raw article had the register after a semicolon or inside an example
            # For instance, if translation does not look like domain-specific, but an example does
            for ex in exs:
                for reg_k in REGISTER_MAP:
                    if reg_k in ex.get('ru', ''):
                        example_level_registers.append((w, m['id'], regs, ex))

print(f"Total examples with embedded register abbreviation in ru: {len(example_level_registers)}")
for w, mid, regs, ex in example_level_registers[:15]:
    print(f"  {w} [id:{mid}] regs={regs} -> ex: {ex['en']} : {ex['ru']}")
