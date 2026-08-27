# -*- coding: utf-8 -*-
"""
Fix speculation and clean any empty examples across all words.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'speculation':
        for m in item['meanings']:
            if m['id'] == 3:
                m['examples'] = [
                    {
                        "en": "on speculation",
                        "ru": "на авось, наудачу; в расчёте на выгоду"
                    }
                ]
                
    for m in item.get('meanings', []):
        clean_exs = []
        for ex in m.get('examples', []):
            en = ex.get('en', '').strip()
            ru = ex.get('ru', '').strip()
            if en and ru:
                clean_exs.append(ex)
            elif en and not ru:
                # if ru is empty, drop empty example
                pass
        m['examples'] = clean_exs

    for p in item.get('phrases', []):
        clean_exs = []
        for ex in p.get('examples', []):
            en = ex.get('en', '').strip()
            ru = ex.get('ru', '').strip()
            if en and ru:
                clean_exs.append(ex)
        p['examples'] = clean_exs

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Cleaned empty examples successfully!")
