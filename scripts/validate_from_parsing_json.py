# -*- coding: utf-8 -*-
import sys
import json
import random
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

print("Loading fromParsing.json...")
with open("fromParsing.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total entries: {len(data):,}")

# Field statistics
has_phon = 0
has_forms = 0
total_meanings = 0
total_examples = 0
total_phrases = 0
pos_counter = Counter()
register_counter = Counter()
empty_meanings = 0

for item in data:
    if item.get("phon_br"):
        has_phon += 1
    if item.get("forms"):
        has_forms += 1
    meanings = item.get("meanings", [])
    if not meanings:
        empty_meanings += 1
    total_meanings += len(meanings)
    for m in meanings:
        pos_counter[m.get("partOfSpeech", "other")] += 1
        total_examples += len(m.get("examples", []))
        for r in m.get("register", []):
            register_counter[r] += 1
    total_phrases += len(item.get("phrases", []))

print("\n=== STATISTICS ===")
print(f"Total words (articles): {len(data):,}")
print(f"Entries with phonetics: {has_phon:,} ({has_phon/len(data)*100:.1f}%)")
print(f"Entries with forms:     {has_forms:,}")
print(f"Total meanings (senses):{total_meanings:,}")
print(f"Total examples:         {total_examples:,}")
print(f"Total phrases/idioms:   {total_phrases:,}")
print(f"Entries with 0 meanings:{empty_meanings:,}")

print("\nTop 10 Parts of Speech:")
for pos, cnt in pos_counter.most_common(10):
    print(f"  {pos:<15}: {cnt:,}")

print("\nTop 15 Registers/Domains:")
for reg, cnt in register_counter.most_common(15):
    print(f"  {reg:<20}: {cnt:,}")

print("\n=== SAMPLE ENTRIES FROM DIVERSE LETTERS ===")
# Pick specific words
check_words = ["abandon", "ability", "accept", "break", "cat", "dog", "eagle", "flight", "house", "iron", "jump", "king", "look", "man", "night", "order", "play", "question", "run", "sun", "take", "under", "voice", "water", "yellow", "zoo"]

for w in check_words:
    found = [x for x in data if x["word"].lower() == w or x["word"].lower().startswith(w + " ")]
    if found:
        sample = found[0]
        print(f"\n--- Word: {sample['word']} ---")
        print(f"Phonetics: {sample.get('phon_br')}")
        print(f"Meanings count: {len(sample.get('meanings', []))}")
        for m in sample.get("meanings", [])[:3]:
            ex_str = f" (examples: {len(m.get('examples', []))})" if m.get('examples') else ""
            reg_str = f" [{', '.join(m.get('register', []))}]" if m.get('register') else ""
            print(f"  [{m.get('partOfSpeech')}] {m.get('translation')[:80]}{reg_str}{ex_str}")
        if sample.get("phrases"):
            print(f"  Phrases ({len(sample['phrases'])}): {sample['phrases'][0]['en']} -> {sample['phrases'][0]['ru']}")

