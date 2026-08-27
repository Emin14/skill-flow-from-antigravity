# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

check_words = ['a', 'abandon', 'ability', 'able', 'abortion', 'absent', 'absolutely', 'abstract', 'account', 'can', 'can1', 'bird', 'about']

for w in check_words:
    if w in by_word:
        item = by_word[w]
        print(f"=== Current '{w}' in JSON ===")
        print('Meanings count:', len(item['meanings']))
        for m in item['meanings']:
            print(f"  [{m['id']}] ({m['partOfSpeech']}) tr: \"{m['translation']}\" | exs: {len(m.get('examples', []))}")
        if 'phrases' in item:
            print('Phrases count:', len(item['phrases']))
            for p in item['phrases'][:3]:
                print(f"  phr [{p['id']}] {p['phrase']}: \"{p['translation'][:50]}\"")
        print()
