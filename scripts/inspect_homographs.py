# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

homographs = ['bank1', 'bank2', 'bank3', 'bear1', 'bear2', 'can1', 'can2', 'fly1', 'fly2', 'fly3', 'match1', 'match2', 'mean1', 'mean2', 'mean3', 'mine1', 'mine2', 'row1', 'row2', 'row3', 'sound1', 'sound2', 'sound3', 'sound4', 'tear1', 'tear2', 'well1', 'well2', 'wind1', 'wind2', 'March', 'march', 'May', 'may', 'IT', 'it']

for h in homographs:
    item = next((it for it in data if it['word'] == h), None)
    if item:
        trans = [m['translation'] for m in item.get('meanings', [])[:3]]
        print(f"Word '{h}': {trans}")
