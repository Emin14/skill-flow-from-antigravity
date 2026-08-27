# -*- coding: utf-8 -*-
"""
Scan for occurrences of ≈ (U+2248), ≅ (U+2245), ≃ (U+2243), ∼ (U+223C), ~ (U+007E) across the dataset and raw parsed index.
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

symbols_to_check = {
    '≈': 'U+2248 (ALMOST EQUAL TO)',
    '≅': 'U+2245 (APPROXIMATELY EQUAL TO)',
    '≃': 'U+2243 (ASYMPTOTICALLY EQUAL TO)',
    '∼': 'U+223C (TILDE OPERATOR)',
    '~': 'U+007E (ASCII TILDE)'
}

print("1. Scanning oxford_5000_2026-08-27.json...")
oxford_counts = {k: 0 for k in symbols_to_check}
oxford_examples = {k: [] for k in symbols_to_check}

for item in oxford_data:
    w = item['word']
    dump_str = json.dumps(item, ensure_ascii=False)
    for sym in symbols_to_check:
        if sym in dump_str:
            oxford_counts[sym] += dump_str.count(sym)
            if len(oxford_examples[sym]) < 3:
                oxford_examples[sym].append(w)

for sym, count in oxford_counts.items():
    print(f"  Symbol '{sym}' ({symbols_to_check[sym]}): {count} occurrences. Sample words: {oxford_examples[sym]}")

print("\n2. Scanning raw parsed_index.json...")
parsed_counts = {k: 0 for k in symbols_to_check}
parsed_examples = {k: [] for k in symbols_to_check}

for k, entries in parsed_index.items():
    for it in entries:
        txt = it.get('text', '')
        for sym in symbols_to_check:
            if sym in txt:
                parsed_counts[sym] += txt.count(sym)
                if len(parsed_examples[sym]) < 3:
                    parsed_examples[sym].append(k)

for sym, count in parsed_counts.items():
    print(f"  Symbol '{sym}' ({symbols_to_check[sym]}): {count} occurrences. Sample words: {parsed_examples[sym]}")
