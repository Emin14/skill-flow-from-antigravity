# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

from test_comprehensive_clean import fix_false_phrases

for item in oxford:
    it = fix_false_phrases(item)
    if 'phrases' in it:
        w = it['word']
        clean_w = re.sub(r'[1-9]$', '', w.lower())
        raw_text = ""
        for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
            if k in parsed_index and parsed_index[k]:
                raw_text = parsed_index[k][0].get('text', '')
                break
        if '♦' not in raw_text and '¬' not in raw_text and '­ ~' not in raw_text:
            print(f"Word: '{w}' -> {len(it['phrases'])} phrases:")
            for p in it['phrases']:
                print(f"  phr: '{p['phrase']}' -> '{p['translation']}'")
