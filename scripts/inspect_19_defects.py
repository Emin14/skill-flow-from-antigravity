# -*- coding: utf-8 -*-
"""
Inspect the 19 defects and fix them.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

from robust_dictionary_rebuilder import REGISTER_MAP

defect_words = ['assumption', 'carry', 'democracy', 'detailed', 'double', 'elephant', 'frog', 'hook', 'judgement', 'matter', 'metal', 'of', 'plate', 'reach', 'reconstruction', 'star', 'street', 'superior', 'toll']

print("--- Inspecting defects ---")
for item in data:
    w = item['word']
    if w in defect_words:
        print(f"\nWord: {w}")
        for m in item.get('meanings', []):
            t = m.get('translation', '')
            for ab in ['рел.', 'воен.', 'амер.', 'презр.', 'полигр.', 'мор.', 'театр.', 'ист.', 'сл.']:
                if ab in t:
                    print(f"  Meaning {m['id']}: '{t}', reg={m['register']}")
            for ex in m.get('examples', []):
                if not ex.get('en') or not ex.get('ru'):
                    print(f"  Meaning {m['id']} Bad example: {ex}")
        for p in item.get('phrases', []):
            if '≅' in p.get('translation', ''):
                print(f"  Phrase {p['id']}: '{p.get('translation')}'")
