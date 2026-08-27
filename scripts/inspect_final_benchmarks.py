# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}

for w in ['about', 'account', 'ice', 'air', 'act', 'out', 'round']:
    item = by_word[w]
    print(f"=== {w.upper()} ===")
    print(f"Meanings count: {len(item['meanings'])}")
    for m in item['meanings']:
        reg = f" {m['register']}" if m.get('register') else ""
        print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}{reg}")
    print(f"Phrases count: {len(item.get('phrases', []))}")
    for p in item.get('phrases', []):
        print(f"  phr [{p['id']}] {p['phrase']} ({p['partOfSpeech']}): {p['translation']}")
    print()
