# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/dict_doc2_cache.json', 'r', encoding='utf-8') as f:
    dict_cache = json.load(f)

words = ['accountant', 'beer', 'depart', 'sue']
for w in words:
    entries = [e for e in dict_cache if e.get('base_hw') == w]
    print(f"\n==================== Cache entries for {w} ({len(entries)}) ====================")
    for e in entries:
        print(f"RAW: {e.get('raw_hw')} | POS: {e.get('pos')}")
        print(f"TEXT:\n{e.get('article_text')}")
