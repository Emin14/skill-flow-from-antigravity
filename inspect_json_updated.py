# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('primary_evaluation_1000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(json.dumps(data[1], ensure_ascii=False, indent=2))
