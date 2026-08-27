# -*- coding: utf-8 -*-
"""
Clean duplicated idioms from meanings in 'act' and 'round'.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    # 1. Clean act
    if item['word'] == 'act':
        clean_meanings = []
        for m in item['meanings']:
            tr = m['translation']
            if tr in [
                'притворяться, разыграть сцену',
                'паясничать',
                'скандалить',
                'плохо себя вести'
            ]:
                continue
            clean_meanings.append(m)
        for idx, m in enumerate(clean_meanings, start=1):
            m['id'] = idx
        item['meanings'] = clean_meanings

    # 2. Clean round
    if item['word'] == 'round':
        clean_meanings = []
        for m in item['meanings']:
            tr = m['translation']
            if tr in [
                'передаваться из уст в уста (о новостях и т. п.)',
                'закончить вечер танцами',
                'см. round on',
                'заходите ко мне'
            ]:
                continue
            clean_meanings.append(m)
        for idx, m in enumerate(clean_meanings, start=1):
            m['id'] = idx
        item['meanings'] = clean_meanings

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Cleaned 'act' and 'round' meanings successfully!")
