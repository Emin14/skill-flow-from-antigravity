# -*- coding: utf-8 -*-
"""
Fix accident phrase: remove hallucinated 'посл.' and register, leaving literal dictionary translation.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'accident':
        for p in item.get('phrases', []):
            if 'accidents will happen' in p['phrase']:
                p['translation'] = "в семье не без урода; скандал в благородном семействе"
                p['register'] = []

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed accident phrase translation and register!")
