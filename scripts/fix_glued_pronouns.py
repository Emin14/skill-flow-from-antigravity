# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    for m in item['meanings']:
        tr = m.get('translation', '')
        tr = re.sub(r'([а-яА-ЯёЁ])комулибо', r'\1 кому-либо', tr)
        tr = re.sub(r'([а-яА-ЯёЁ])коголибо', r'\1 кого-либо', tr)
        tr = re.sub(r'([а-яА-ЯёЁ])кемлибо', r'\1 кем-либо', tr)
        tr = re.sub(r'([а-яА-ЯёЁ])чтолибо', r'\1 что-либо', tr)
        tr = re.sub(r'([а-яА-ЯёЁ])чемлибо', r'\1 чем-либо', tr)
        m['translation'] = tr

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed glued space issues!")
