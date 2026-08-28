# -*- coding: utf-8 -*-
"""
Standardize valency/government notes in translations (like in 'offend').
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        if w == 'offend' and m['id'] == 3:
            m['translation'] = 'погрешить (against — против чего-либо); совершить проступок; нарушить (against — закон)'
            
        # Invert awkward patterns like '(закон; against)' -> '(against — закон)'
        # Pattern: (Russian; prep) -> (prep — Russian)
        m['translation'] = re.sub(
            r'\(([\u0400-\u04FF\s,-]+);\s*([a-zA-Z\s,/-]+)\)',
            r'(\2 — \1)',
            m['translation']
        )

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Standardized valency notes successfully!")
