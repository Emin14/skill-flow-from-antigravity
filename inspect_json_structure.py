# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('primary_evaluation_1000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Inspect word 1 and word 2
for entry in data[:3]:
    print(json.dumps(entry, ensure_ascii=False, indent=2))
