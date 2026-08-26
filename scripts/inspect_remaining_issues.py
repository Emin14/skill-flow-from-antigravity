# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

from audit_defect_patterns import audit_entry

issues = []
for entry in data:
    ent_issues = audit_entry(entry)
    if ent_issues:
        issues.append((entry['word'], ent_issues))

print(f"Inspecting {len(issues)} words with issues...")
for w, iss_list in issues[:15]:
    print(f"\nWord: {w}")
    for iss in iss_list:
        print(f"  {iss}")
