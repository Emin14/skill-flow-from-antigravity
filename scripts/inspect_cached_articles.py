# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

print(f"Total articles in articles.json: {len(articles)}")
print("Sample item 0:", json.dumps(articles[0], ensure_ascii=False, indent=2))
print("Sample item 100:", json.dumps(articles[100], ensure_ascii=False, indent=2))

# Find 'give'
for a in articles:
    if a.get('headword') == 'give' or a.get('word') == 'give':
        print("\nArticle for 'give':", json.dumps(a, ensure_ascii=False, indent=2)[:1000])
        break
