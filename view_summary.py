# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('comparison_analysis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Summary:', json.dumps(data['summary'], ensure_ascii=False, indent=2))
print()
print('Issues found:')
for i in data['issues']:
    w = i['word']
    t = i['issue_type']
    print(f'  - {w}: {t}')
