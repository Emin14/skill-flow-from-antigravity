# -*- coding: utf-8 -*-
import json, os, sys

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            if ex.get('ru', '').startswith('ав. '):
                ex['ru'] = ex['ru'][4:].strip()
                if 'авиация' not in ex.get('register', []):
                    ex['register'].append('авиация')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Cleaned climb and contact examples!")
