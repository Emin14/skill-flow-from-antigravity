# -*- coding: utf-8 -*-
import json
import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath("."))
from scripts.align_muller_precision import (
    PDF2_ARTICLES_PATH, build_article_index, resolve_entry_articles
)

with open(PDF2_ARTICLES_PATH, "r", encoding="utf-8") as f:
    articles = json.load(f)
index = build_article_index(articles)

selected, _ = resolve_entry_articles("charge", index)
for a in selected:
    print("BODY:", repr(a["body"]))
