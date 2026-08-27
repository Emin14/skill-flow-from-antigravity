# -*- coding: utf-8 -*-
"""
Fix raw pl markers in design and die.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'design':
        for m in item['meanings']:
            if m['id'] == 6:
                m['translation'] = 'обыкн. при англ. мн. ч.: злой умысел, коварные замыслы'
    elif item['word'] == 'die':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'игральная кость; при англ. мн. ч. dice: кости'
            elif m['id'] == 4:
                m['translation'] = 'цоколь колонны; при англ. мн. ч. dice: цоколи'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed pl markers in design and die successfully!")
