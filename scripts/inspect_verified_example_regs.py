# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}

for w in ['about', 'frequency', 'indoor', 'academy', 'chain', 'disc']:
    item = by_word[w]
    print(f"=== Word: '{w}' ===")
    for m in item['meanings']:
        for ex in m.get('examples', []):
            if ex.get('register'):
                print(f"  [meaning {m['id']}: \"{m['translation'][:35]}\"] ex: \"{ex['en']}\" -> \"{ex['ru']}\" | reg: {ex['register']}")
