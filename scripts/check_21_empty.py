# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('src/data/oxford_5000.json', encoding='utf-8'))
for item in data:
    w = item['word']
    for m in item['meanings']:
        if not m.get('translation'):
            print("WORD: %s | M_ID: %s | POS: %s | EXAMPLES: %s" % (w, m.get('id'), m.get('partOfSpeech'), m.get('examples')))
