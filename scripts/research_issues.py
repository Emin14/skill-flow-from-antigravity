# -*- coding: utf-8 -*-
"""
Research script:
1. Inspect the 7 duplicate words in oxford_5000_updated.json & oxford_5000_verified.json.
2. Inspect born, boom, more, most.
3. Identify all words that inherited meanings from base words due to stemming/fallback.
4. Check exact POS and CEFR requirements for each of these words from Oxford 5000.
"""
import json
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. DUPLICATE WORDS RESEARCH ===")
word_indices = defaultdict(list)
for idx, item in enumerate(data):
    word_indices[item['word']].append(idx)

dups = {w: idxs for w, idxs in word_indices.items() if len(idxs) > 1}
for w, idxs in dups.items():
    print(f"\nWord: '{w}' appears {len(idxs)} times at indices {idxs}:")
    for i in idxs:
        it = data[i]
        pos_list = [m['partOfSpeech'] for m in it.get('meanings', [])]
        print(f"  Index {i}: rank={it.get('frequency_rank')}, cefr={it.get('cefr')}, topics={it.get('topics')}, POS in meanings={set(pos_list)}")

print("\n=== 2. SPECIFIC ERRORS RESEARCH ===")
for target in ['born', 'boom', 'more', 'most']:
    for it in data:
        if it['word'] == target:
            print(f"\nTarget word: '{target}'")
            print(json.dumps(it, ensure_ascii=False, indent=2))

print("\n=== 3. COPIED ARTICLES / STEM FALLBACK RESEARCH ===")
meanings_hashes = defaultdict(list)
for idx, it in enumerate(data):
    # Serialize meanings ignoring IDs
    m_clean = []
    for m in it.get('meanings', []):
        m_clean.append({
            'pos': m.get('partOfSpeech'),
            'trans': m.get('translation'),
            'ex_count': len(m.get('examples', []))
        })
    m_str = json.dumps(m_clean, ensure_ascii=False)
    meanings_hashes[m_str].append((it['word'], idx, it.get('cefr')))

identical_groups = [group for group in meanings_hashes.values() if len(group) > 1]
print(f"Found {len(identical_groups)} groups of words with identical meanings structure.")
for g in identical_groups:
    words = [w for w, idx, cefr in g]
    if len(words) <= 10:
        print(f"  Group: {', '.join(words)}")
