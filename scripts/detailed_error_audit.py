# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total entries: {len(data)}")

# 1. Check broken syllable splits in Russian text (e.g., "инте рес", "трудоём кую")
# Russian letter + space + Russian letters where the word was hyphenated across lines
# We need to detect patterns like "[а-яёА-ЯЁ]{2,}\s+[а-яё]{2,}" that form single words in standard Russian
syllable_split_examples = []

# 2. Check dangling parentheses or unclosed brackets
dangling_parens = []

# 3. Check trailing single letters like " s" at the end of example
trailing_single_chars = []

# 4. Check translations that are short English prepositions/fragments
english_fragments = []

# 5. Check meanings with empty translations
empty_trans = []

# 6. Check words with 0 valid Russian translations
no_russian_words = []

for entry in data:
    word = entry.get('word', '')
    has_any_ru = False
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        
        if tr:
            if any('\u0400' <= c <= '\u04FF' for c in tr):
                has_any_ru = True
            elif re.match(r'^[a-zA-Z\s\(\)\,\.\-\'\=]+$', tr):
                english_fragments.append((word, m.get('id'), tr))
                
            # Check dangling parens in tr
            if tr.count('(') != tr.count(')') or tr.count('[') != tr.count(']'):
                dangling_parens.append((word, 'tr', tr))
                
            # Check syllable splits
            for m_split in re.finditer(r'[а-яёА-ЯЁ]{2,}\s+[а-яё]{2,}', tr):
                syllable_split_examples.append((word, 'tr', m_split.group(0), tr))
        else:
            empty_trans.append((word, m.get('id'), exs))
            
        for ex in exs:
            en_ex = ex.get('en', '')
            ru_ex = ex.get('ru', '')
            if ru_ex:
                if any('\u0400' <= c <= '\u04FF' for c in ru_ex):
                    has_any_ru = True
                if ru_ex.count('(') != ru_ex.count(')'):
                    dangling_parens.append((word, 'ru_ex', ru_ex))
                if re.search(r'\s+[a-zA-Z]\s*$', ru_ex):
                    trailing_single_chars.append((word, ru_ex))
                for m_split in re.finditer(r'[а-яёА-ЯЁ]{2,}\s+[а-яё]{2,}', ru_ex):
                    syllable_split_examples.append((word, 'ru_ex', m_split.group(0), ru_ex))
                    
    if not has_any_ru:
        no_russian_words.append(word)

print(f"Empty translations: {len(empty_trans)}")
print(f"English-only fragment translations: {len(english_fragments)}")
print(f"Dangling parens: {len(dangling_parens)}")
print(f"Trailing single chars (OCR noise): {len(trailing_single_chars)}")
print(f"Potential syllable splits: {len(syllable_split_examples)}")
print(f"Words with NO Russian translations at all: {len(no_russian_words)} -> {no_russian_words}")

print("\nSample dangling parens:")
for w, loc, txt in dangling_parens[:10]:
    print(f"  [{w}] ({loc}): {repr(txt)}")

print("\nSample trailing single chars:")
for w, txt in trailing_single_chars[:10]:
    print(f"  [{w}]: {repr(txt)}")

print("\nSample English fragments:")
for w, mid, txt in english_fragments[:15]:
    print(f"  [{w}] id={mid}: {repr(txt)}")
