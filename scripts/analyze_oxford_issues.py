# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford = json.load(f)

print(f"Total entries: {len(oxford)}")

categories = {
    'empty_trans_with_examples': [],
    'empty_trans_no_examples': [],
    'partial_or_garbage_trans': [],
    'html_tags_in_trans': [],
    'html_tags_in_examples': [],
    'broken_cyrillic': [],
    'english_only_in_trans': [],
    'control_chars': [],
    'soft_hyphens': []
}

for entry_idx, entry in enumerate(oxford):
    word = entry.get('word', '')
    for m_idx, m in enumerate(entry.get('meanings', [])):
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        
        if not tr or not tr.strip():
            if exs:
                categories['empty_trans_with_examples'].append((word, m.get('partOfSpeech'), exs))
            else:
                categories['empty_trans_no_examples'].append((word, m.get('partOfSpeech'), m.get('id')))
        else:
            if '<' in tr or '>' in tr:
                categories['html_tags_in_trans'].append((word, tr))
            if '\xad' in tr:
                categories['soft_hyphens'].append((word, tr))
            if any(ord(c) < 32 and c not in '\n\r\t' for c in tr):
                categories['control_chars'].append((word, tr))
            # English-only translation or very short fragment
            if not any('\u0400' <= c <= '\u04FF' for c in tr):
                categories['english_only_in_trans'].append((word, m.get('partOfSpeech'), tr))
            elif len(tr.strip()) < 3 and not re.search(r'[а-яА-ЯёЁ]', tr):
                categories['partial_or_garbage_trans'].append((word, tr))

        for ex in exs:
            en_ex = ex.get('en', '')
            ru_ex = ex.get('ru', '')
            if '<' in en_ex or '>' in en_ex or '<' in ru_ex or '>' in ru_ex:
                categories['html_tags_in_examples'].append((word, en_ex, ru_ex))

print("=== ISSUE BREAKDOWN IN oxford_5000.json ===")
for cat, items in categories.items():
    print(f"{cat:30}: {len(items)}")

print("\n--- Sample empty translations with examples (first 10) ---")
for w, pos, exs in categories['empty_trans_with_examples'][:10]:
    print(f"Word: {w} ({pos}) -> exs: {exs}")

print("\n--- Sample empty translations WITHOUT examples (first 15) ---")
for w, pos, mid in categories['empty_trans_no_examples'][:15]:
    print(f"Word: {w} ({pos}) -> meaning id: {mid}")

print("\n--- Sample English-only translations (first 15) ---")
for w, pos, tr in categories['english_only_in_trans'][:15]:
    print(f"Word: {w} ({pos}) -> tr: {repr(tr)}")
