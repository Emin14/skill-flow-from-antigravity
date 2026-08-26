# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_articles = json.load(f)

vocab = set()
for a in muller_articles:
    body = a.get('body', '')
    for w in re.findall(r'[а-яА-ЯёЁ]{3,}', body):
        vocab.add(w.lower())

with open('tmp/muller_vocab.json', 'w', encoding='utf-8') as f:
    json.dump(list(vocab), f, ensure_ascii=False)

print(f"Saved {len(vocab)} vocab words to tmp/muller_vocab.json.")
