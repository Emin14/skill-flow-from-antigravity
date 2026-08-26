# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_data = json.load(f)

print(f"Total articles: {len(muller_data)}")
art = muller_data[100]
print("Keys:", art.keys())
print("Sample article:\n", json.dumps(art, ensure_ascii=False, indent=2))
