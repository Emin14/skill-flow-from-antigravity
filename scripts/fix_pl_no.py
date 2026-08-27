# -*- coding: utf-8 -*-
"""
Fix raw pl in no meaning 4.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'no':
        for m in item['meanings']:
            if m['id'] == 4:
                m['translation'] = 'отрицание, отказ, ответ «нет»; при англ. мн. ч. noes: голоса против'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed no meaning 4 successfully!")
