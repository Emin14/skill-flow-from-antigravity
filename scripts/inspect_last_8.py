# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

from audit_defect_patterns import audit_entry

for entry in data:
    iss = audit_entry(entry)
    if iss:
        print(f"\nWord: {entry['word']}")
        for x in iss:
            print(f"  {x}")
