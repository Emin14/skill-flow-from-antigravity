# -*- coding: utf-8 -*-
"""
1. Expand grammatical abbreviations (тв. падежом -> творительным падежом, косв. п. -> косвенный падеж, etc.)
2. Clean and extract inline colon examples from preposition/grammatical definitions (by, for, have, get, etc.)
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Grammar abbreviation expansion rules
GRAMMAR_ABBREV_REPLACEMENTS = [
    (r'\bпередаётся\s+тв\.\s*падежом\b', 'передаётся творительным падежом'),
    (r'\bпередаётся\s+род\.\s*падежом\b', 'передаётся родительным падежом'),
    (r'\bпередаётся\s+дат\.\s*падежом\b', 'передаётся дательным падежом'),
    (r'\bпередаётся\s+вин\.\s*падежом\b', 'передаётся винительным падежом'),
    (r'\bпередаётся\s+предл\.\s*падежом\b', 'передаётся предложным падежом'),
    (r'\bтв\.\s*или\s*род\.\s*падежом\b', 'творительным или родительным падежом'),
    (r'\bтв\.\s*падежом\b', 'творительным падежом'),
    (r'\bрод\.\s*падежом\b', 'родительным падежом'),
    (r'\bдат\.\s*падежом\b', 'дательным падежом'),
    (r'\bвин\.\s*падежом\b', 'винительным падежом'),
    (r'\bпредл\.\s*падежом\b', 'предложным падежом'),
    (r'\bкосв\.\s*п\.\b', 'косвенный падеж'),
    (r'\bв\s+безл\.\s*оборотах\b', 'в безличных оборотах'),
    (r'\bужит\s+для\s+усиления\b', 'служит для усиления')
]

for item in data:
    w = item['word']
    
    # Clean meanings
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # 1. Expand grammar abbrevs
        for pat, repl in GRAMMAR_ABBREV_REPLACEMENTS:
            t = re.sub(pat, repl, t)
            
        # 2. Extract inline colon examples
        # e.g., 'указывает на средство передвижения; передаётся творительным падежом: by plane самолётом; авиапочтой'
        m_colon = re.search(r'^(.*?):\s*([a-zA-Z\s\',/()-]{2,})\s+([\u0400-\u04FF].*)$', t)
        if m_colon:
            pure_t = m_colon.group(1).strip(' ;:,-')
            en_chunk = m_colon.group(2).strip(' ;:,-')
            ru_chunk = m_colon.group(3).strip(' ;:,-')
            
            # Avoid splitting valid non-example colons
            if not re.search(r'\b(?:past|pres|пп|см)\b', en_chunk, re.I) and len(en_chunk) >= 2 and len(ru_chunk) >= 2:
                # If en_chunk is like 'ses)' or 'genii)' (plural forms), keep as grammatical note
                if en_chunk in ['ses)', 'genii)', 'gappy']:
                    pure_t = f"{pure_t} ({en_chunk}"
                else:
                    t = pure_t
                    if 'examples' not in m:
                        m['examples'] = []
                    m['examples'].append({
                        "en": en_chunk,
                        "ru": ru_chunk,
                        "register": []
                    })
                    
        m['translation'] = t.strip(' ;:,-')
        
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in GRAMMAR_ABBREV_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            ex['ru'] = ru.strip(' ;:,-')

    # Clean phrases
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for pat, repl in GRAMMAR_ABBREV_REPLACEMENTS:
            t = re.sub(pat, repl, t)
        p['translation'] = t.strip(' ;:,-')
        
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in GRAMMAR_ABBREV_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            ex['ru'] = ru.strip(' ;:,-')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully fixed grammar abbreviations and colon inline examples!")
