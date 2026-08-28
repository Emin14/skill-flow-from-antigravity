# -*- coding: utf-8 -*-
"""
Inspect and fix phrases in root and rope.
"""
import json, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
data = json.load(open(oxford_path, 'r', encoding='utf-8'))

for item in data:
    if item['word'] in ['root', 'rope']:
        print(f"\nWord: {item['word']}")
        print("Phrases:")
        for p in item.get('phrases', []):
            print(f"  Phrase {p['id']}: '{p.get('phrase')}' -> trans='{p.get('translation')}'")
