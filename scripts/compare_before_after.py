# -*- coding: utf-8 -*-
"""
Before vs After Comparison on Benchmark Words for Systemic Grammar Rules.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

by_word = {x['word']: x for x in oxford_data}

benchmark_words = ['about', 'account', 'air', 'ice', 'act', 'round', 'out']

for w in benchmark_words:
    print(f"==================================================")
    print(f"WORD: '{w}'")
    print(f"==================================================")
    item = by_word.get(w)
    if not item:
        print(f"Not found in oxford dataset")
        continue
        
    print(f"--- MEANINGS ({len(item['meanings'])}) ---")
    for m in item['meanings']:
        reg_str = f" [regs: {m['register']}]" if m.get('register') else ""
        ex_regs = [ex['register'] for ex in m.get('examples', []) if ex.get('register')]
        ex_reg_str = f" [ex_regs: {ex_regs}]" if ex_regs else ""
        print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}{reg_str}{ex_reg_str}")
        for ex in m.get('examples', []):
            ex_r = f" (reg: {ex['register']})" if ex.get('register') else ""
            print(f"      • en: \"{ex['en']}\" -> ru: \"{ex['ru']}\"{ex_r}")
            
    print(f"\n--- PHRASES ({len(item.get('phrases', []))}) ---")
    for p in item.get('phrases', []):
        p_reg = f" [regs: {p['register']}]" if p.get('register') else ""
        print(f"  phr [{p['id']}] '{p['phrase']}' ({p['partOfSpeech']}): {p['translation']}{p_reg}")
    print("\n")
