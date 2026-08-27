# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

leaks_in_phrases = []

for item in oxford:
    w = item['word']
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        # Check if there is "to ..." or English phrase inside translation string
        m = re.search(r'(?:^|\d+\)\s*)(to\s+[a-zA-Z\s\~\-\'\.]+?)\s+([а-яА-Я].*)', tr)
        if m:
            leaks_in_phrases.append({
                'word': w,
                'phrase': p['phrase'],
                'tr': tr,
                'en_match': m.group(1),
                'ru_match': m.group(2)
            })

print(f"Total phrases with embedded English 'to ...' expressions in translation: {len(leaks_in_phrases)}")
for lk in leaks_in_phrases[:15]:
    print(f"Word '{lk['word']}' -> Phrase '{lk['phrase']}':")
    print(f"  Current translation: {lk['tr']}")
    print(f"  Found English sub-example: en='{lk['en_match']}' -> ru='{lk['ru_match']}'")
    print()
