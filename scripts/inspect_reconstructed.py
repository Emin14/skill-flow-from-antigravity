# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}

for w in ['accessible', 'accompany', 'accountant', 'accusation', 'addition', 'alter', 'analyse']:
    item = by_word[w]
    print(f"=== Word: '{w}' ===")
    for m in item['meanings']:
        reg_s = f" [regs: {m['register']}]" if m.get('register') else ""
        print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}{reg_s}")
        for ex in m.get('examples', []):
            ex_r = f" (reg: {ex['register']})" if ex.get('register') else ""
            print(f"      • en: \"{ex['en']}\" -> ru: \"{ex['ru']}\"{ex_r}")
    print()
