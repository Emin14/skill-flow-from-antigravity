# -*- coding: utf-8 -*-
"""
Scan for multiple / comma-separated registers left inside translation strings across all words.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Find target word with "астр., геол."
target_word = None
for item in oxford_data:
    for m in item.get('meanings', []):
        if "неровность поверхности, складка" in m.get('translation', ''):
            target_word = (item['word'], m)

print("Target word with 'астр., геол.':", target_word[0] if target_word else "Not found")
if target_word:
    print(json.dumps(target_word[1], ensure_ascii=False, indent=2))

# Find ALL meanings and phrases across all 4982 words where translation starts with or contains register abbreviations
abbr_patterns = [
    r'астр\.', r'геол\.', r'воен\.', r'мор\.', r'амер\.', r'разг\.', r'прост\.', 
    r'книжн\.', r'поэт\.', r'посл\.', r'уст\.', r'редк\.', r'перен\.', r'шутл\.', 
    r'ирон\.', r'сл\.', r'брит\.', r'тех\.', r'юр\.', r'мед\.', r'биол\.', 
    r'бот\.', r'зоол\.', r'анат\.', r'эл\.', r'вчт\.', r'мат\.', r'физ\.', 
    r'хим\.', r'экон\.', r'фин\.', r'комм\.', r'ком\.', r'ав\.', r'муз\.', 
    r'спорт\.', r'кул\.', r'архит\.', r'грам\.', r'лингв\.', r'церк\.', r'бухг\.', r'театр\.'
]
combined_regex = re.compile(rf'(?:^|[\s,;])(?:' + '|'.join(abbr_patterns) + r')')

unextracted = []
for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        # Check if translation has any register abbreviation
        # But exclude false positive words like 'уста', 'моря', 'собираться'
        m_matches = re.findall(rf'\b(?:' + '|'.join(abbr_patterns) + r')', tr)
        if m_matches:
            unextracted.append((w, 'meaning', m['id'], tr, m_matches))
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        p_matches = re.findall(rf'\b(?:' + '|'.join(abbr_patterns) + r')', tr)
        if p_matches:
            unextracted.append((w, 'phrase', p['id'], tr, p_matches))

print(f"\nTotal unextracted register occurrences across all 4982 words: {len(unextracted)}")
for u in unextracted[:20]:
    print(f"Word '{u[0]}' [{u[1]} {u[2]}]: '{u[3]}' -> found: {u[4]}")
