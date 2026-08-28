# -*- coding: utf-8 -*-
"""
Deep scan for:
1. 'fair' idioms check ('to speak smb. fair', etc.)
2. Grammatical case abbreviations: 'тв. падежом', 'род. падежом', 'дат. падежом', 'вин. падежом', etc.
3. Inline English examples embedded after colons in translations (e.g. '...: by plane самолётом')
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 80)
print("1. INSPECTING 'fair' ENTRY")
print("=" * 80)

for item in data:
    if item['word'] == 'fair':
        for m in item.get('meanings', []):
            for ex in m.get('examples', []):
                if 'to speak smb. fair' in ex.get('en', ''):
                    print(f"Fair meaning {m['id']} ex: {ex}")
        for p in item.get('phrases', []):
            print(f"Fair phrase {p['id']}: {p}")

print("\n" + "=" * 80)
print("2. SCANNING GRAMMATICAL CASE ABBREVIATIONS ('тв. пад.', 'род. пад.', etc.)")
print("=" * 80)

case_abbrev_matches = []
CASE_PATTERNS = [
    r'\b(?:тв|род|дат|вин|предл|им)\.\s*(?:пад(?:еж(?:ом|а|у|е)?)?\.?)',
    r'\bпередаётся\s+[а-яё]+\.\s*падежом\b'
]

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for pat in CASE_PATTERNS:
            if re.search(pat, t):
                case_abbrev_matches.append((w, 'meaning', m['id'], t))
                break
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat in CASE_PATTERNS:
                if re.search(pat, ru):
                    case_abbrev_matches.append((w, 'meaning_ex', m['id'], ru))
                    break

print(f"Found {len(case_abbrev_matches)} grammatical case abbreviation matches:")
for c in case_abbrev_matches:
    print(f"  [{c[0]}] ({c[1]} id {c[2]}): '{c[3]}'")

print("\n" + "=" * 80)
print("3. SCANNING INLINE EXAMPLES AFTER COLONS IN TRANSLATIONS")
print("=" * 80)

colon_matches = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        # Pattern: colon followed by English words and Russian translation
        if ':' in t:
            m_colon = re.search(r':\s*([a-zA-Z\s\',/()-]{2,})\s+([\u0400-\u04FF].*)$', t)
            if m_colon:
                colon_matches.append((w, 'meaning', m['id'], t, m_colon.group(1), m_colon.group(2)))

print(f"Found {len(colon_matches)} inline example matches after colon:")
for c in colon_matches[:30]:
    print(f"  [{c[0]}] (id {c[2]}): en='{c[4]}' -> ru='{c[5]}'")
    print(f"     full: '{c[3]}'")
