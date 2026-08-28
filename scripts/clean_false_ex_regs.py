# -*- coding: utf-8 -*-
"""
Clean false example registers resulting from prefix cuts (like 'статистика' from 'ст.').
"""
import json, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            if 'to take the part' in ex.get('en', ''):
                if 'статистика' in ex.get('register', []):
                    ex['register'].remove('статистика')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Cleaned false registers from examples!")
