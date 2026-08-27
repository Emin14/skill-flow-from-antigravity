# -*- coding: utf-8 -*-
"""
Clean leading attr markers and grammar tags from translations.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        # Clean "attr.:; ", "attr.: ", "attr. "
        tr = re.sub(r'^attr\.[:;\s]*', '', tr).strip()
        tr = re.sub(r'^[.;,:,\-\s]+', '', tr).strip()
        # Clean capital stresses: "травматИзма" -> "травматизма", "несчаcтных" -> "несчастных"
        tr = tr.replace('травматИзма', 'травматизма').replace('несчаcтных', 'несчастных')
        m['translation'] = tr
        for ex in m.get('examples', []):
            ex['ru'] = ex['ru'].replace('травматИзма', 'травматизма').replace('несчаcтных', 'несчастных')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Cleaned attr markers successfully!")
