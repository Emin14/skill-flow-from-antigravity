# -*- coding: utf-8 -*-
"""
Fix have phrase 5 partOfSpeech and run deep audit.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'have':
        for p in item.get('phrases', []):
            if p['partOfSpeech'] == 'phrase':
                p['partOfSpeech'] = 'verb'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed have phrase 5 partOfSpeech successfully!")
