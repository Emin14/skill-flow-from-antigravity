# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total entries: {len(data)}")

empty_meanings_entries = []
empty_translation_count = 0
entries_with_empty_translations = set()
words_with_all_empty = []
duplicate_words = {}
special_chars_in_translations = set()
very_short_translations = []

for idx, entry in enumerate(data):
    w = entry.get('word', '')
    if w in duplicate_words:
        duplicate_words[w].append(idx)
    else:
        duplicate_words[w] = [idx]
    
    meanings = entry.get('meanings', [])
    if not meanings:
        empty_meanings_entries.append((idx, w))
        continue
    
    all_empty = True
    for m_idx, m in enumerate(meanings):
        tr = m.get('translation', '')
        if not tr or not tr.strip():
            empty_translation_count += 1
            entries_with_empty_translations.add(w)
        else:
            all_empty = False
            # Check suspicious chars
            for char in tr:
                if ord(char) < 32 and char not in ('\n', '\r', '\t'):
                    special_chars_in_translations.add((w, hex(ord(char))))
            if len(tr.strip()) < 2:
                very_short_translations.append((w, m.get('partOfSpeech'), tr))

    if all_empty:
        words_with_all_empty.append(w)

print(f"Empty translation count: {empty_translation_count}")
print(f"Entries with at least one empty translation: {len(entries_with_empty_translations)}")
print(f"Words with ALL translations empty: {len(words_with_all_empty)} -> {words_with_all_empty[:20]}")
print(f"Special/control chars in translations: {len(special_chars_in_translations)} -> {list(special_chars_in_translations)[:10]}")
print(f"Very short translations (<2 chars): {len(very_short_translations)} -> {very_short_translations[:10]}")
dups = {k: v for k, v in duplicate_words.items() if len(v) > 1}
print(f"Duplicate word entries in JSON: {len(dups)} -> {list(dups.keys())[:10]}")

# Let's inspect some words with empty translations:
print("\nSample entries with empty translations:")
for w in list(entries_with_empty_translations)[:15]:
    for entry in data:
        if entry.get('word') == w:
            print(f"\nWord: {w}, CEFR: {entry.get('cefr')}")
            for m in entry.get('meanings', []):
                print(f"  [{m.get('id')}] POS: {m.get('partOfSpeech')}, tr: {repr(m.get('translation'))}, ex: {len(m.get('examples', []))}")
            break
