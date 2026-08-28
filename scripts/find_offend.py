# -*- coding: utf-8 -*-
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for it in data:
    for m in it.get('meanings', []):
        if 'погрешить' in m.get('translation', ''):
            print(f"Word: '{it['word']}', meaning {m['id']}: '{m['translation']}'")
