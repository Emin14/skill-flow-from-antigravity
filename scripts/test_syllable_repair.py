# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

vocab = set()
for a in articles:
    body = a.get('body', '')
    # Extract Russian words
    for w in re.findall(r'[а-яА-ЯёЁ]{3,}', body):
        vocab.add(w.lower())

print(f"Extracted {len(vocab)} unique authentic Russian words from Muller articles.")
print(f"Sample words: {list(vocab)[:20]}")

# Test fixing some syllable splits
test_cases = [
    "инте ресах",
    "ми нут",
    "изъявитель ном",
    "трудоём кую",
    "ребячить ся",
    "страхи риск" # Note: "страх и риск" - "и" is a word! We must NOT join "страхи" if "и" is separate
]

def fix_syllable_split(text, vocab_set):
    # Match two cyrillic parts separated by a space
    def repl(m):
        p1 = m.group(1)
        p2 = m.group(2)
        combined = (p1 + p2).lower()
        if combined in vocab_set and (len(p1) > 1 or p1.lower() in ('по', 'во', 'из', 'на', 'до')) and len(p2) > 1:
            # Preserve case of p1
            if p1.isupper() and p2.isupper():
                return combined.upper()
            elif p1[0].isupper():
                return combined.capitalize()
            return combined
        return m.group(0)
    
    # Run replacement
    return re.sub(r'\b([а-яА-ЯёЁ]{2,})\s+([а-яА-ЯёЁ]{2,})\b', repl, text)

for tc in test_cases:
    print(f"'{tc}' -> '{fix_syllable_split(tc, vocab)}'")
