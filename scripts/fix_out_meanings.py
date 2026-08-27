# -*- coding: utf-8 -*-
"""
Clean out entry: move verb idioms from preposition meanings into phrases.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'out':
        new_meanings = []
        for m in item['meanings']:
            if m['id'] == 19:
                if 'phrases' not in item:
                    item['phrases'] = []
                item['phrases'].append({
                    "id": len(item['phrases']) + 1,
                    "phrase": "to be out of smth.",
                    "partOfSpeech": "verb",
                    "translation": "быть лишённым чего-либо (обманным путём)",
                    "examples": [],
                    "register": []
                })
            elif m['id'] == 24:
                if 'phrases' not in item:
                    item['phrases'] = []
                item['phrases'].append({
                    "id": len(item['phrases']) + 1,
                    "phrase": "to be out of one's senses",
                    "partOfSpeech": "verb",
                    "translation": "быть не в своём уме",
                    "examples": [],
                    "register": ["разговорное", "американский английский"]
                })
            else:
                new_meanings.append(m)
                
        for idx, m in enumerate(new_meanings, start=1):
            m['id'] = idx
        item['meanings'] = new_meanings
        
        for p_idx, p in enumerate(item.get('phrases', []), start=1):
            p['id'] = p_idx

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed out entry successfully!")
