# -*- coding: utf-8 -*-
import json
import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath("."))
from scripts.align_muller_precision import (
    PDF2_ARTICLES_PATH, RUSSIAN_VOCAB_PATH,
    build_article_index, resolve_entry_articles, parse_article
)

with open(RUSSIAN_VOCAB_PATH, "r", encoding="utf-8") as f:
    vocab = set(json.load(f))
with open(PDF2_ARTICLES_PATH, "r", encoding="utf-8") as f:
    articles = json.load(f)
index = build_article_index(articles)

selected, _ = resolve_entry_articles("charge", index)
for a in selected:
    meanings = parse_article(a, "charge", vocab)
    for idx, m in enumerate(meanings, 1):
        print(f"  #{idx} ({m.get('partOfSpeech')}): trans={repr(m.get('translation'))}")
        for ex in m.get("examples", []):
            print(f"     • EN: {repr(ex.get('en'))} | RU: {repr(ex.get('ru'))}")
