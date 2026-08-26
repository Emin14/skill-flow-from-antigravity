# -*- coding: utf-8 -*-
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== 1. CHECKING 23 WORDS WITH PREVIOUS SYLLABLE BREAKS ===")
words_23 = [
    'attraction', 'band', 'surround', 'block', 'column', 'post',
    'contract', 'cut', 'detention', 'development', 'drawing', 'file',
    'hook', 'lock', 'mark', 'pad', 'portfolio', 'purple', 'reading',
    'rhetoric', 'show', 'spot', 'tackle', 'wood'
]
found_breaks = 0
for w in words_23:
    it = next((x for x in data if x['word'] == w), None)
    if it:
        full_text = json.dumps(it, ensure_ascii=False)
        m = re.findall(r'[а-яёА-ЯЁ]+-[а-яёА-ЯЁ]+', full_text)
        print(f"Word: {w:15} | Hyphenated matches: {m}")
        for word_m in m:
            if word_m.endswith(('ка', 'ка,', 'ка;')) or 'приман-ка' in word_m or 'кром-ка' in word_m or 'игруш-ка' in word_m or 'пур-пур' in word_m or 'красно-байство' in word_m or 'противни-ка' in word_m or 'игро-ка' in word_m:
                found_breaks += 1
                print(f"  [ERROR] Unresolved break found: {word_m}")

print(f"Total unresolved breaks in 23 words: {found_breaks}")

print("\n=== 2. CHECKING LIGATURE SPLITS ACROSS ENTIRE DATASET ===")
lig_count = 0
for it in data:
    for m in it.get('meanings', []):
        for ex in m.get('examples', []):
            en = ex.get('en', '')
            if re.search(r'\b[a-zA-Z]*(?:ffi|ffl|fi|fl)\s+[a-zA-Z]+\b', en):
                print(f"  Word: {it['word']} | Split ligature: {repr(en)}")
                lig_count += 1
print(f"Total split ligatures across whole dataset: {lig_count}")

print("\n=== 3. CHECKING PUNCTUATION ERRORS ACROSS ENTIRE DATASET ===")
punct_count = 0
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if ';;' in t or ',;' in t or ';,' in t or re.search(r'[,;:]\s*$', t):
            punct_count += 1
            if punct_count <= 10:
                print(f"  Word: {it['word']} | Trans punct error: {repr(t)}")
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if ';;' in ru or ',;' in ru or ';,' in ru or re.search(r'[,;:]\s*$', ru):
                punct_count += 1
                if punct_count <= 10:
                    print(f"  Word: {it['word']} | Example punct error: {repr(ru)}")
print(f"Total punctuation errors across whole dataset: {punct_count}")

print("\n=== 4. CHECKING WORDS: abandon, abortion, access, about, attraction, able, flee, worse ===")
for target in ['abandon', 'abortion', 'access', 'about', 'attraction', 'able', 'flee', 'worse']:
    it = next((x for x in data if x['word'] == target), None)
    if it:
        print(f"\n--- Word: {target} ---")
        for m in it.get('meanings', []):
            print(f"  [{m['id']}] POS: {m['partOfSpeech']} | Trans: {m['translation']}")
            for ex in m.get('examples', []):
                print(f"       ex: {ex['en']} -> {ex['ru']}")
        for p in it.get('phrases', []):
            print(f"  ◊ {p['en']} -> {p['ru']}")
