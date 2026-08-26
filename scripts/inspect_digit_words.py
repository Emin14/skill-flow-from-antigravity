# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

digit_words = [item for item in oxford_data if re.search(r'\d', item['word'])]

for item in digit_words:
    print(f"\n==================== Word: {item['word']} (POS from CEFR: {item.get('cefr')}) ====================")
    for m in item.get('meanings', [])[:4]:
        print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")
        for ex in m.get('examples', [])[:1]:
            print(f"      • ex: {ex['en']} -> {ex['ru']}")
