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

test_words = ["light", "advice", "agree", "application", "array", "asylum", "auction", "bail", "barrier", "ability", "about", "absence", "account", "crush", "argue"]

for target in test_words:
    selected, _ = resolve_entry_articles(target, index)
    if selected:
        print("====================================")
        print("WORD:", target)
        meanings = []
        for art in selected:
            meanings.extend(parse_article(art, target, vocab))
        for idx, m in enumerate(meanings, 1):
            print(f"  #{idx} ({m.get('partOfSpeech')}): {repr(m.get('translation'))}")
            for ex in m.get("examples", []):
                print(f"     • EN: {repr(ex.get('en'))} | RU: {repr(ex.get('ru'))}")
