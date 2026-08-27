# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

no_hyphen_cases = []
for item in oxford:
    w = item['word']
    for m in item['meanings']:
        tr = m.get('translation', '')
        if re.search(r'(?:кемлибо|чемлибо|комулибо|чемулибо|коголибо|чтолибо|гделибо|когдалибо|каклибо)', tr, re.I):
            no_hyphen_cases.append((w, m['id'], tr))
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if re.search(r'(?:кемлибо|чемлибо|комулибо|чемулибо|коголибо|чтолибо|гделибо|когдалибо|каклибо)', tr, re.I):
            no_hyphen_cases.append((w, f'phr:{p["id"]}', tr))

print(f"Total occurrences of hyphenless кемлибо/чтолибо: {len(no_hyphen_cases)}")
for w, mid, tr in no_hyphen_cases[:25]:
    print(f"{w} [{mid}]: \"{tr}\"")
