# -*- coding: utf-8 -*-
"""
Fix accessible entry and scan for other words with numbered senses swallowed into phrases.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

# Fix accessible
for item in oxford_data:
    if item['word'] == 'accessible':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "adjective",
                "translation": "доступный (to); достижимый",
                "examples": [
                    {
                        "en": "accessible to the public",
                        "ru": "доступный широкой публике"
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "adjective",
                "translation": "поддающийся; податливый",
                "examples": [
                    {
                        "en": "accessible to bribery",
                        "ru": "продажный; взяточник"
                    }
                ],
                "register": []
            }
        ]
        if 'phrases' in item:
            del item['phrases']

# Check how many words have missing numbered senses
swallowed_candidates = []
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
    if not raw_text:
        continue
        
    # Find all numbered senses before diamond: e.g. "1)", "2)", "3)"
    pre_diamond = raw_text.split('♦')[0] if '♦' in raw_text else raw_text
    nums_in_raw = [int(n) for n in re.findall(r'\b(\d+)\)', pre_diamond)]
    if nums_in_raw:
        max_num = max(nums_in_raw)
        if max_num > len(item['meanings']) and len(item['meanings']) == 1:
            swallowed_candidates.append((w, max_num, len(item['meanings']), nums_in_raw))

print(f"Total words with single meaning where raw text had multiple numbered senses (2+): {len(swallowed_candidates)}")
for sc in swallowed_candidates[:15]:
    print(f"Word '{sc[0]}': raw max sense={sc[1]}, dataset meanings={sc[2]}, senses={sc[3]}")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
