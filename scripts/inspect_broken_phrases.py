# -*- coding: utf-8 -*-
"""
Inspect the 20 phrases with missing phrase or translation.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

for item in oxford:
    w = item['word']
    for p in item.get('phrases', []):
        if not p.get('phrase') or not p.get('translation'):
            print(f"Word: '{w}' -> phrase: {json.dumps(p, ensure_ascii=False)}")
            # check raw text
            for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii"]:
                if k in parsed_index:
                    print(f"   Raw text snippet: {parsed_index[k][0].get('text')[:200]}...")
                    break
