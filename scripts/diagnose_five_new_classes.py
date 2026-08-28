# -*- coding: utf-8 -*-
"""
Deep scan for the 5 newly identified error classes:
1. Glued 'посуду' (по суду) and other false homonyms / missing spaces
2. Dialect/frequency notes like '(преим. сев.)', '(преим. амер.)' in translations
3. Embedded phrasals in 'talk' and broken '-л.' / 'о -л.' abbreviations
4. Investigation of 'стлаться, виться'
5. Chopped 'сл-' prefix (e.g. 'аболетучий' -> 'слаболетучий', 'або-' -> 'слабо-')
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

print("=" * 80)
print("1. FINDING THE 5 EXACT WORDS")
print("=" * 80)

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if 'посуду' in t or 'разработанный участок' in t or 'talk at' in t or 'стлаться' in t or 'аболетучий' in t:
            print(f"Meaning match: [{w}] (id {m['id']}): '{t}'")
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if 'посуду' in ru or 'разработанный участок' in ru or 'talk at' in ru or 'стлаться' in ru or 'аболетучий' in ru:
                print(f"Example match: [{w}] (meaning {m['id']} ex): en='{ex.get('en')}' -> ru='{ru}'")
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if 'посуду' in t or 'разработанный участок' in t or 'talk at' in t or 'стлаться' in t or 'аболетучий' in t:
            print(f"Phrase match: [{w}] (phrase {p['id']}): '{t}'")

print("\n" + "=" * 80)
print("2. SCANNING CLASS 1: GLUED WORDS / FALSE HOMONYMS (e.g. 'посуду', 'впору', etc.)")
print("=" * 80)

glued_matches = []
GLUED_PATTERNS = [
    (r'\bубийство\s+посуду\b', 'убийство по суду'),
    (r'\bпосуду\b(?=.*(?:приговор|смертн|казн|суд|закон))', 'по суду'),
    (r'\bпоправу\b', 'по праву'),
    (r'\bзаграницу\b(?=.*(?:ехать|отправлять|поехать))', 'за границу'),
    (r'\bзаграницей\b(?=.*(?:жить|находиться|быть))', 'за границей')
]

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for pat, repl in GLUED_PATTERNS:
            if re.search(pat, t, re.I):
                glued_matches.append((w, 'meaning', m['id'], t, pat))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in GLUED_PATTERNS:
                if re.search(pat, ru, re.I):
                    glued_matches.append((w, 'meaning_ex', m['id'], ru, pat))

print(f"Found {len(glued_matches)} glued matches:")
for g in glued_matches:
    print(f"  [{g[0]}] ({g[1]} {g[2]}): '{g[3]}'")

print("\n" + "=" * 80)
print("3. SCANNING CLASS 2: UNEXTRACTED DIALECT/FREQ NOTES (e.g. '(преим. сев.)')")
print("=" * 80)

dialect_matches = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\((?:преим\.\s*)?(?:сев|южн|вост|зап|шотл|амер|брит|австрал)\.\)', t):
            dialect_matches.append((w, 'meaning', m['id'], t))

print(f"Found {len(dialect_matches)} dialect matches:")
for d in dialect_matches:
    print(f"  [{d[0]}] (id {d[2]}): '{d[3]}'")

print("\n" + "=" * 80)
print("4. SCANNING CLASS 3: UNEXPANDED '-л.' / 'о -л.' OR EMBEDDED PHRASALS")
print("=" * 80)

short_matches = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if re.search(r'\b(?:о\s+-л|-л|кого\s+-л|кому\s+-л|чем\s+-л|что\s+-л|кем\s+-л)\b', t):
            short_matches.append((w, 'meaning', m['id'], t))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            if re.search(r'\b(?:о\s+-л|-л|кого\s+-л|кому\s+-л|чем\s+-л|что\s+-л|кем\s+-л)\b', ru):
                short_matches.append((w, 'meaning_ex', m['id'], ru))

print(f"Found {len(short_matches)} broken '-л.' matches:")
for s in short_matches[:25]:
    print(f"  [{s[0]}] (id {s[2]}): '{s[3]}'")

print("\n" + "=" * 80)
print("5. SCANNING CLASS 5: CHOPPED 'сл-' PREFIXES (e.g. 'або-', 'аболетучий', etc.)")
print("=" * 80)

chopped_sl_matches = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        # Check words starting with 'або' or other chopped 'сл-' roots
        for wd in re.findall(r'[а-яёА-ЯЁ]+', t):
            wd_l = wd.lower()
            if wd_l in ['аболетучий', 'абокислый', 'абосоленый', 'абосолёный', 'аборазвитый', 'аботочный', 'абоалкогольный', 'абослышащий', 'абый', 'абость', 'едующий', 'едующая', 'едующее', 'едующие']:
                chopped_sl_matches.append((w, 'meaning', m['id'], t, wd))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for wd in re.findall(r'[а-яёА-ЯЁ]+', ru):
                wd_l = wd.lower()
                if wd_l in ['аболетучий', 'абокислый', 'абосоленый', 'абосолёный', 'аборазвитый', 'аботочный', 'абоалкогольный', 'абослышащий', 'абый', 'абость', 'едующий', 'едующая', 'едующее', 'едующие']:
                    chopped_sl_matches.append((w, 'meaning_ex', m['id'], ru, wd))

print(f"Found {len(chopped_sl_matches)} chopped 'сл-' matches:")
for c in chopped_sl_matches:
    print(f"  [{c[0]}] (id {c[2]}): word='{c[4]}' in '{c[3]}'")
