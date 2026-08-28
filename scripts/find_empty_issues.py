# -*- coding: utf-8 -*-
import json, os, sys

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

empty_issues = []
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if not t or not t.strip():
            empty_issues.append((w, 'meaning', m['id']))
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if not t or not t.strip():
            empty_issues.append((w, 'phrase', p['id'], p.get('phrase')))

print(f"Found {len(empty_issues)} empty translation issues:")
for e in empty_issues[:30]:
    print(f"  {e}")
