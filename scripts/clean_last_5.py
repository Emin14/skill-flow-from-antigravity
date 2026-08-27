# -*- coding: utf-8 -*-
"""
Clean the last 5 specific entries.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'coverage':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'зона действия; радиус слышимости (радиостанции и т. п.)'
    elif item['word'] == 'feather':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'перо (птичье); собир. или при англ. мн. ч.: оперение'
    elif item['word'] == 'glass':
        for m in item['meanings']:
            if m['id'] == 5:
                m['translation'] = 'песочные часы; обыкн. при англ. мн. ч.: (получасовая) склянка'
                if 'морской термин' not in m.get('register', []):
                    m['register'].append('морской термин')
    elif item['word'] == 'sand':
        for m in item['meanings']:
            if m['id'] == 6:
                m['translation'] = 'песок в песочных часах; перен. обыкн. при англ. мн. ч.: время; дни жизни'
    elif item['word'] == 'road':
        for m in item['meanings']:
            if m['id'] == 4:
                m['translation'] = 'обыкн. при англ. мн. ч.: рейд (стоянка судов)'
                if 'морской термин' not in m.get('register', []):
                    m['register'].append('морской термин')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("All 5 specific entries cleaned perfectly!")
