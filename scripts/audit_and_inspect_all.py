# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total words: {len(data)}")

# 1. English-only translations
print("\n=== 1. English-only translations ===")
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if tr and not any('\u0400' <= c <= '\u04FF' for c in tr) and not tr.isdigit():
            print(f"  [{w}] id={m.get('id')} POS={m.get('partOfSpeech')}: {repr(tr)}")

# 2. Ligature split artifacts
print("\n=== 2. Ligature split artifacts ===")
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if re.search(r'\b(ffi|ffl|ﬂ|ﬁ)\s+[a-z]', tr):
            print(f"  [{w}] TR: {repr(tr)}")
        for ex in m.get('examples', []):
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            if re.search(r'\b(ffi|ffl|ﬂ|ﬁ)\s+[a-z]', en) or re.search(r'[a-zA-Z]fi\s+[a-z]', en) or re.search(r'[a-zA-Z]fl\s+[a-z]', en):
                print(f"  [{w}] EX_EN: {repr(en)}")
            if re.search(r'\b(ffi|ffl|ﬂ|ﬁ)\s+[a-z]', ru):
                print(f"  [{w}] EX_RU: {repr(ru)}")

# 3. Dangling parens
print("\n=== 3. Dangling parens / brackets ===")
dangling = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if tr.count('(') != tr.count(')') or tr.count('[') != tr.count(']'):
            dangling.append((w, 'tr', tr))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if ru.count('(') != ru.count(')') or ru.count('[') != ru.count(']'):
                dangling.append((w, 'ex_ru', ru))
    for p in item.get('phrases', []):
        ru = p.get('ru', '')
        if ru.count('(') != ru.count(')') or ru.count('[') != ru.count(']'):
            dangling.append((w, 'phrase_ru', ru))

print(f"Total dangling: {len(dangling)}")
for item in dangling[:25]:
    print(f"  [{item[0]}] ({item[1]}): {repr(item[2])}")

# 4. Duplicate examples across meanings
print("\n=== 4. Duplicate examples in same word ===")
dup_count = 0
for item in data:
    w = item['word']
    seen = set()
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            en = ex.get('en', '').lower().strip()
            if en in seen:
                dup_count += 1
                if dup_count <= 15:
                    print(f"  [{w}]: duplicate example {repr(en)}")
            seen.add(en)
print(f"Total duplicate examples in same word: {dup_count}")

# 5. Words with 0 meanings
empty_words = [item['word'] for item in data if not item.get('meanings')]
print(f"\n=== 5. Words with 0 meanings ({len(empty_words)}) ===")
print(empty_words)
