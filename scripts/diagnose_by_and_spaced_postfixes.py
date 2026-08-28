# -*- coding: utf-8 -*-
"""
Deep scan for:
1. 'by' meaning 6 and remaining unextracted colon examples
2. Remaining 'тж.' abbreviations
3. Spaced reflexive verb postfixes: e.g. 'портить (-ся)' -> 'портить(ся)'
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 80)
print("1. INSPECTING 'by' ENTRY")
print("=" * 80)

for item in data:
    if item['word'] == 'by':
        for m in item['meanings']:
            print(f"By meaning {m['id']}: '{m['translation']}'")
            if m.get('examples'):
                print(f"   examples: {m['examples']}")

print("\n" + "=" * 80)
print("2. SCANNING SPACED REFLEXIVE POSTFIXES (' (-ся)', ' (-сь)', etc.)")
print("=" * 80)

spaced_postfix_matches = []
POSTFIX_PATTERNS = [
    r'[а-яёА-ЯЁ]+\s+\(-ся\)',
    r'[а-яёА-ЯЁ]+\s+\(-сь\)',
    r'[а-яёА-ЯЁ]+\s+\(-тся\)',
    r'[а-яёА-ЯЁ]+\s+\(-ться\)'
]

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for pat in POSTFIX_PATTERNS:
            if re.search(pat, t):
                spaced_postfix_matches.append((w, 'meaning', m['id'], t))
                break
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat in POSTFIX_PATTERNS:
                if re.search(pat, ru):
                    spaced_postfix_matches.append((w, 'meaning_ex', m['id'], ru))
                    break
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for pat in POSTFIX_PATTERNS:
            if re.search(pat, t):
                spaced_postfix_matches.append((w, 'phrase', p['id'], t))
                break

print(f"Found {len(spaced_postfix_matches)} spaced reflexive postfix matches:")
for s in spaced_postfix_matches[:30]:
    print(f"  [{s[0]}] ({s[1]} id {s[2]}): '{s[3]}'")

print("\n" + "=" * 80)
print("3. SCANNING 'тж.' ABBREVIATIONS IN TRANSLATIONS")
print("=" * 80)

tzh_matches = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\bтж\.\s*', t):
            tzh_matches.append((w, 'meaning', m['id'], t))

print(f"Found {len(tzh_matches)} 'тж.' matches in translations:")
for t in tzh_matches[:25]:
    print(f"  [{t[0]}] (id {t[2]}): '{t[3]}'")
