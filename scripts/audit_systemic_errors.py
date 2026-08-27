# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

pos_in_tr = []
hyphen_break = []
broken_ellipsis = []
leading_dot = []

for item in oxford:
    w = item['word']
    for m in item['meanings']:
        tr = m.get('translation', '')
        if re.search(r'\b\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b', tr):
            pos_in_tr.append((w, m['id'], tr))
        if re.search(r'[А-Яа-яA-Za-z]-\s*≅?\s*[А-Яа-яA-Za-z]', tr):
            hyphen_break.append((w, m['id'], tr))
        if re.search(r'\.\s+\.\s+\.', tr):
            broken_ellipsis.append((w, m['id'], tr))
        if tr.startswith('.'):
            leading_dot.append((w, m['id'], tr))
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if re.search(r'[А-Яа-яA-Za-z]-\s*≅?\s*[А-Яа-яA-Za-z]', tr):
            hyphen_break.append((w, f"phr:{p['id']}", tr))
        if re.search(r'\.\s+\.\s+\.', tr):
            broken_ellipsis.append((w, f"phr:{p['id']}", tr))
        if tr.startswith('.'):
            leading_dot.append((w, f"phr:{p['id']}", tr))

print(f"1. Embedded POS in translation (e.g. '2. v'): {len(pos_in_tr)}")
print(f"2. Broken hyphenation with ≅ or space: {len(hyphen_break)}")
print(f"3. Broken ellipsis (e.g. '. . .'): {len(broken_ellipsis)}")
print(f"4. Leading dot in translation: {len(leading_dot)}")

print("\nSamples of Embedded POS in translation:")
for w, mid, tr in pos_in_tr[:10]:
    print(f"  {w} [{mid}]: '{tr}'")

print("\nSamples of Broken hyphenation:")
for w, mid, tr in hyphen_break[:10]:
    print(f"  {w} [{mid}]: '{tr}'")
