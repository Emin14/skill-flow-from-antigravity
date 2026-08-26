# -*- coding: utf-8 -*-
"""
Research script for Round 2 issues:
1. Scan for partOfSpeech == 'other' across all entries.
2. Scan for hyphenated Russian words (e.g. из-*, по-*, etc.).
3. Scan for fused words (e.g. радиоили).
4. Scan for unbalanced parentheses across translations, examples, phrases.
5. Scan for register labels missing trailing dots (e.g. 'иск ', 'юр ', etc.).
6. Inspect backwards, dual, look, remain, the, a, OK, abstract, nature, I, programme, use, hate.
"""
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. partOfSpeech == 'other' SCAN ===")
other_pos_words = []
for it in data:
    w = it['word']
    other_meanings = [m for m in it.get('meanings', []) if m.get('partOfSpeech') == 'other']
    if other_meanings:
        other_pos_words.append((w, len(other_meanings), len(it.get('meanings', []))))

print(f"Found {len(other_pos_words)} words with partOfSpeech == 'other':")
for w, other_count, total_count in other_pos_words[:25]:
    print(f"  Word: {w:15} | other meanings: {other_count}/{total_count}")

print("\n=== 2. HYPHENATED RUSSIAN SCAN ===")
hyphen_matches = []
for it in data:
    w = it['word']
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        for match in re.finditer(r'\b([а-яёА-ЯЁ]{2,})-([а-яёА-ЯЁ]{2,})\b', t):
            word_part = match.group(0)
            if not word_part.startswith(('кое-', 'что-', 'кто-', 'где-', 'куда-', 'когда-', 'как-', 'чей-', 'по-')):
                hyphen_matches.append((w, m['id'], 'translation', word_part, t))
        for ex_idx, ex in enumerate(m.get('examples', [])):
            ex_ru = ex.get('ru', '')
            for match in re.finditer(r'\b([а-яёА-ЯЁ]{2,})-([а-яёА-ЯЁ]{2,})\b', ex_ru):
                word_part = match.group(0)
                if not word_part.startswith(('кое-', 'что-', 'кто-', 'где-', 'куда-', 'когда-', 'как-', 'чей-', 'по-')):
                    hyphen_matches.append((w, m['id'], f'example[{ex_idx}]', word_part, ex_ru))

print(f"Found {len(hyphen_matches)} non-standard hyphenated Russian words:")
for hm in hyphen_matches:
    print(f"  Word: {hm[0]} ({hm[2]}): '{hm[3]}' in '{hm[4]}'")

print("\n=== 3. FUSED WORDS SCAN (e.g. радиоили) ===")
fused_matches = []
for it in data:
    w = it['word']
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if 'радиоили' in t or 'телеили' in t or 'киноили' in t or 'фотоили' in t or 'видеоили' in t:
            fused_matches.append((w, 'translation', t))
        for ex in m.get('examples', []):
            ex_ru = ex.get('ru', '')
            if 'радиоили' in ex_ru:
                fused_matches.append((w, 'example', ex_ru))

print(f"Found {len(fused_matches)} fused words:")
for fm in fused_matches:
    print(f"  Word: {fm[0]} ({fm[1]}): {fm[2]}")

print("\n=== 4. UNBALANCED PARENTHESES SCAN ===")
unbalanced = []
for it in data:
    w = it['word']
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if t.count('(') != t.count(')'):
            unbalanced.append((w, m['id'], 'translation', t))
        for ex_idx, ex in enumerate(m.get('examples', [])):
            ex_ru = ex.get('ru', '')
            if ex_ru.count('(') != ex_ru.count(')'):
                unbalanced.append((w, m['id'], f'example[{ex_idx}]', ex_ru))

print(f"Found {len(unbalanced)} unbalanced parentheses:")
for ub in unbalanced[:25]:
    print(f"  Word: {ub[0]} ({ub[1]}): {ub[3]}")
