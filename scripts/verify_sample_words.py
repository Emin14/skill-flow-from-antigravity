# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}

for w in ['accessible', 'able', 'about', 'area', 'adjustment', 'admission']:
    item = by_word[w]
    print(f"=== Word: '{w}' ===")
    print(f"  Meanings ({len(item['meanings'])}):")
    for m in item['meanings']:
        ex_list = [e['en'] for e in m.get('examples', [])]
        print(f"    [{m['id']}] {m['translation']} | exs: {ex_list}")
    phr_list = [p['phrase'] for p in item.get('phrases', [])]
    print(f"  Phrases ({len(phr_list)}): {phr_list}\n")
