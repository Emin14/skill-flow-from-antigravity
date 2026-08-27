# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

dup_ex_count = 0
sample_dups = []

for item in oxford:
    w = item['word']
    for m in item['meanings']:
        tr = m['translation']
        for ex in m.get('examples', []):
            if ex.get('ru') == tr:
                dup_ex_count += 1
                if len(sample_dups) < 20:
                    sample_dups.append((w, m['id'], ex['en'], tr[:60]))

print(f"Total meanings where example is a 100% duplicate of translation: {dup_ex_count}")
for w, mid, en, tr in sample_dups:
    print(f"Word '{w}' [id:{mid}]: en=\"{en}\" | tr=\"{tr}\"")
