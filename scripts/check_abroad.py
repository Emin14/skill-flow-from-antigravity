# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/dict_doc2_cache.json', 'r', encoding='utf-8') as f:
    entries = json.load(f)

for e in entries:
    if 'abroad' in e['raw_hw'].lower():
        print(f"raw_hw: {repr(e['raw_hw'])}, base_hw: {repr(e['base_hw'])}, pos: {repr(e['pos'])}")
