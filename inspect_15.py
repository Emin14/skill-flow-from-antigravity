# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('primary_evaluation_1000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Let's inspect first 15 words in data
for s in data[:12]:
    print('='*75)
    print(f"ID {s['id']}. СЛОВО: {s['word'].upper()} [{s['pos']}]")
    print(f"  [ИДЕАЛ]: {', '.join(s['ideal_meanings'])}")
    print(f"  [1. CLD only]: {', '.join(s['cld_formatted'][:4])}")
    print(f"  [2. Sam only]: {', '.join(s['sam_formatted'][:4])}")
    print(f"  [3. Union (CLD OR Sam)]: {', '.join(s['union_formatted'][:4])}")
    print(f"  [4. Inter (CLD AND Sam)]: {', '.join(s['intersection_formatted'][:4])}")
    print(f"  [5. Smart Hybrid]: {', '.join(s['smart_hybrid_formatted'][:4])}")

