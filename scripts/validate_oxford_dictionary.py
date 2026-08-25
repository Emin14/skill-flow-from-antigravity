# -*- coding: utf-8 -*-
import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

print("=== Running Comprehensive Validation on oxford_5000_updated.json ===")

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total entries: {len(data)}")
assert len(data) == 4982, f"Expected 4982 entries, found {len(data)}"

empty_meanings = []
invalid_ids = []
invalid_pos = []
empty_translations = []
hyphen_errors = []
encoding_errors = []
total_meanings = 0
total_examples = 0
total_phrases = 0
words_with_phrases = 0

for item in data:
    word = item.get('word', '')
    meanings = item.get('meanings', [])
    phrases = item.get('phrases', [])
    
    if not meanings:
        empty_meanings.append(word)
        continue
        
    for idx, m in enumerate(meanings, 1):
        total_meanings += 1
        if m.get('id') != idx:
            invalid_ids.append((word, m.get('id'), idx))
        pos = m.get('partOfSpeech', '')
        if not pos:
            invalid_pos.append((word, idx))
        trans = m.get('translation', '')
        examples = m.get('examples', [])
        if not trans and not examples:
            empty_translations.append((word, idx))
        if re.search(r'[а-яёА-ЯЁa-zA-Z]-\s+[а-яёА-ЯЁa-zA-Z]', trans):
            hyphen_errors.append((word, idx, trans))
        if any(c in trans for c in ['\ufffd', '\x00', '\x07', '\x08']):
            encoding_errors.append((word, idx, trans))
        for ex in examples:
            total_examples += 1
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            if re.search(r'[а-яёА-ЯЁa-zA-Z]-\s+[а-яёА-ЯЁa-zA-Z]', en) or re.search(r'[а-яёА-ЯЁa-zA-Z]-\s+[а-яёА-ЯЁa-zA-Z]', ru):
                hyphen_errors.append((word, idx, f"{en} -> {ru}"))
                
    if phrases:
        words_with_phrases += 1
        for ph in phrases:
            total_phrases += 1
            en = ph.get('en', '')
            ru = ph.get('ru', '')
            if not en or not ru:
                empty_translations.append((word, 'phrase', en, ru))
            if re.search(r'[а-яёА-ЯЁa-zA-Z]-\s+[а-яёА-ЯЁa-zA-Z]', en) or re.search(r'[а-яёА-ЯЁa-zA-Z]-\s+[а-яёА-ЯЁa-zA-Z]', ru):
                hyphen_errors.append((word, 'phrase', f"{en} -> {ru}"))

print(f"\n--- Validation Results ---")
print(f"Total words: {len(data)}")
print(f"Total meanings: {total_meanings}")
print(f"Total examples: {total_examples}")
print(f"Total phrases (idioms): {total_phrases}")
print(f"Words with phrases: {words_with_phrases}")
print(f"Empty meanings list: {len(empty_meanings)}")
print(f"Invalid sequential IDs: {len(invalid_ids)}")
print(f"Invalid POS: {len(invalid_pos)}")
print(f"Empty translations: {len(empty_translations)}")
print(f"Hyphen errors: {len(hyphen_errors)}")
print(f"Encoding errors: {len(encoding_errors)}")

print("\n=== Spot Checking breath and breathe in JSON ===")
for item in data:
    if item['word'] in ['breath', 'breathe']:
        print(f"\nWord: {item['word']}")
        print(f"Meanings ({len(item['meanings'])}):")
        for m in item['meanings']:
            print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")
        print(f"Phrases ({len(item['phrases'])}):")
        for p in item['phrases']:
            print(f"  * {p['en']} — {p['ru']}")
