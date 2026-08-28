# -*- coding: utf-8 -*-
"""
Fix warm meaning 15 and watch phrase 5.
"""
import json, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    w = item['word']
    if w == 'warm':
        # Filter out empty meaning 15 and re-index
        clean_meanings = [m for m in item['meanings'] if m.get('translation', '').strip()]
        for idx, m in enumerate(clean_meanings, 1):
            m['id'] = idx
        item['meanings'] = clean_meanings
    elif w == 'watch':
        for p in item.get('phrases', []):
            if p.get('phrase') == 'watch for':
                p['translation'] = 'ждать, поджидать, выжидать (кого-либо, чего-либо)'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Fixed warm and watch successfully!")
