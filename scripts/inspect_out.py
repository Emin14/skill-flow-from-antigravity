# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}
out_item = by_word.get('out')
for m in out_item['meanings']:
    if m['id'] in [19, 24]:
        print(f"out [{m['id']}]: {json.dumps(m, ensure_ascii=False)}")
