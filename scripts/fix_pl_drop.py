# -*- coding: utf-8 -*-
"""
Fix raw pl in drop meaning 5.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'drop':
        for m in item['meanings']:
            if m['id'] == 5:
                m['translation'] = 'обыкн. при англ. мн. ч.: леденцы, карамельки'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed drop meaning 5 successfully!")
