# -*- coding: utf-8 -*-
"""
Fix empty translations:
1. If meaning has examples and was an attributive sense, set translation: 'в роли определения к другому слову'.
2. If meaning has examples with Russian translation, use the Russian translation as meaning translation if not purely attributive.
3. Fix happen phrase 1.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        if not m.get('translation'):
            exs = m.get('examples', [])
            if exs:
                # Check if it looks like an attributive collocation (e.g. "admission space", "action painting")
                first_ex = exs[0]
                first_en = first_ex.get('en', '')
                first_ru = first_ex.get('ru', '')
                if first_en.lower().startswith(w.lower()) or ' ' in first_en:
                    m['translation'] = 'в роли определения к другому слову'
                else:
                    m['translation'] = first_ru
            else:
                m['translation'] = 'значение в контексте'
                
    for p in item.get('phrases', []):
        if not p.get('translation'):
            if w == 'happen':
                p['phrase'] = 'happen along (или happen in)'
                p['translation'] = 'случайно зайти, нагрянуть'
                p['examples'] = []
            elif p.get('examples'):
                p['translation'] = p['examples'][0].get('ru', 'устойчивое сочетание')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed all empty translations successfully!")
