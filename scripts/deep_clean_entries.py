# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def deep_clean_string(s: str) -> str:
    if not s:
        return ''
    t = s
    # Strip any residual number markers e.g. " 4) ", " 5) ", "2) "
    t = re.sub(r'(?:^|\s|\;)[0-9]{1,2}\)\s*', ' ', t)
    # Strip sub-enumerations e.g. "; б) ", "; в) "
    t = re.sub(r';\s*[а-яa-z]\)\s*', '; ', t)
    t = re.sub(r'^[а-яa-z0-9]\)\s*', '', t)
    # Strip cross-references and brackets
    t = re.sub(r'\[\s*(?:ср\.|см\.|сравните|смотрите)[^\]]*\]?', '', t)
    # Clean leading lone parens
    t = re.sub(r'^[^\(\[]*[\)\]]', '', t)
    # Strip English parenthetical notes from Russian e.g. "(часто can или able to afford)"
    t = re.sub(r'\((?:часто|обыкн\.|тж\.|также|редк\.|сл\.|разг\.|ирон\.)\s+[a-zA-Z\s,;]+\)', '', t)
    t = re.sub(r'\s+', ' ', t).strip(' ;,.-')
    
    if t.startswith(('грубая)', 'большая)', 'малая)', 'тяжёлая)')):
        t = '(' + t
    elif t.count(')') > t.count('('):
        if t.endswith(')'):
            t = t.rstrip(')')
        else:
            first_cp = t.find(')')
            if first_cp > 0 and '(' not in t[:first_cp]:
                t = '(' + t
    if t.count('(') > t.count(')'):
        t += ')' * (t.count('(') - t.count(')'))
        
    return t.strip(' ;,.-')

for entry in data:
    clean_meanings = []
    for m in entry.get('meanings', []):
        tr = deep_clean_string(m.get('translation', ''))
        if not tr or not any('\u0400' <= c <= '\u04FF' for c in tr):
            continue
        cleaned_exs = []
        for ex in m.get('examples', []):
            en = ex.get('en', '').strip()
            ru = deep_clean_string(ex.get('ru', ''))
            if en or ru:
                cleaned_exs.append({'en': en, 'ru': ru})
        m['translation'] = tr
        m['examples'] = cleaned_exs
        clean_meanings.append(m)
        
    for idx, m in enumerate(clean_meanings, start=1):
        m['id'] = idx
    entry['meanings'] = clean_meanings

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('oxford_5000_verified.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved deep cleaned entries.")
