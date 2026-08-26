# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for entry in data:
    w = entry['word']
    if w == 'league':
        for m in entry['meanings']:
            if 'league' in m['translation']:
                m['translation'] = 'класс «А» (высшая лига)'
                m['examples'] = [{'en': 'A league', 'ru': 'класс «А» (высшая лига)'}]
    elif w == 'penny':
        for m in entry['meanings']:
            if 'twopence' in m['translation']:
                m['translation'] = 'о денежной сумме (от двух до одиннадцати пенсов)'
                m['examples'] = []

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('oxford_5000_verified.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved clean league and penny.")
