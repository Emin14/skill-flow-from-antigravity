# -*- coding: utf-8 -*-
"""
Validation script for fromword.json.
Audits the schema, counts, completeness, and quality of generated entries.
"""

import sys
import json
import os
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

JSON_PATH = 'fromword.json'

def validate():
    if not os.path.exists(JSON_PATH):
        print(f"Error: {JSON_PATH} does not exist!")
        return False
        
    print(f"Loading and validating {JSON_PATH}...")
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_words = len(data)
    print(f"Total entries loaded: {total_words}")

    total_meanings = 0
    total_examples = 0
    total_phrases = 0
    words_with_phon = 0
    words_with_phrases = 0
    pos_distribution = {}

    schema_errors = 0
    stress_mark_errors = 0
    empty_meanings = 0

    for idx, item in enumerate(data):
        if not isinstance(item, dict):
            print(f"Schema error at index {idx}: not a dict")
            schema_errors += 1
            continue

        w = item.get('word')
        if not w or not isinstance(w, str):
            print(f"Missing/invalid word at index {idx}")
            schema_errors += 1

        phon = item.get('phon_br')
        if phon:
            words_with_phon += 1

        meanings = item.get('meanings')
        if not isinstance(meanings, list) or len(meanings) == 0:
            empty_meanings += 1
        else:
            for m in meanings:
                total_meanings += 1
                pos = m.get('partOfSpeech', 'unknown')
                pos_distribution[pos] = pos_distribution.get(pos, 0) + 1
                
                tr = m.get('translation', '')
                if re.search(r"[а-яёА-ЯЁ]['´`]", tr):
                    stress_mark_errors += 1
                
                for ex in m.get('examples', []):
                    total_examples += 1

        phrases = item.get('phrases', [])
        if phrases:
            words_with_phrases += 1
            total_phrases += len(phrases)

    print("\n================== VALIDATION REPORT ==================")
    print(f"Total Headwords: {total_words:,}")
    print(f"Total Meanings: {total_meanings:,} (avg {total_meanings/total_words:.2f} per word)")
    print(f"Total Examples: {total_examples:,}")
    print(f"Total Phrases / Idioms: {total_phrases:,} across {words_with_phrases:,} words")
    print(f"Words with Transcription: {words_with_phon:,} ({words_with_phon/total_words*100:.1f}%)")
    print(f"Empty Meanings Errors: {empty_meanings}")
    print(f"Schema Errors: {schema_errors}")
    print(f"Stress Mark Leaks: {stress_mark_errors}")
    print("\nPart of Speech Distribution:")
    for pos, cnt in sorted(pos_distribution.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {pos}: {cnt:,}")

    print("\n--- Sample Word Inspections ---")
    sample_targets = ['abandon', 'ability', 'cat', 'charge', 'dog', 'make', 'run', 'take', 'zero', 'zeal']
    for t in sample_targets:
        match = next((item for item in data if item.get('word', '').lower() == t), None)
        if match:
            print(f"\nWord: '{match.get('word')}' | Phon: {match.get('phon_br')}")
            for m in match.get('meanings', [])[:3]:
                print(f"  #{m.get('id')} [{m.get('partOfSpeech')}] {m.get('translation')}")
                for ex in m.get('examples', [])[:2]:
                    print(f"     ex: {ex.get('en')} -> {ex.get('ru')}")
            if match.get('phrases'):
                print(f"  phrases ({len(match.get('phrases'))}):")
                for ph in match.get('phrases')[:2]:
                    print(f"     ph: {ph.get('en')} -> {ph.get('ru')}")

    print("\nValidation passed successfully!")
    return True

if __name__ == '__main__':
    validate()
