# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

from scan_stemmed_words import no_matches

print(f"No matches count: {len(no_matches)}")
for w in no_matches:
    for it in data:
        if it['word'] == w:
            print(f"{w} (pos={[m['partOfSpeech'] for m in it.get('meanings', [])]}): {[m['translation'] for m in it.get('meanings', [])]}")
