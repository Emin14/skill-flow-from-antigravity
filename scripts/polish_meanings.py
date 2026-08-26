# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_entry_meanings(entry):
    w = entry['word']
    cleaned_meanings = []
    
    for m in entry.get('meanings', []):
        tr = m.get('translation', '').strip()
        
        # Specific fixes
        if w == 'air':
            if 'into thin air' in tr:
                tr = 'скрыться из виду, бесследно исчезнуть'
                m['examples'] = [{'en': 'to melt (or to vanish, to disappear) into thin air', 'ru': tr}]
            elif 'ног под собой не чуять' in tr:
                tr = 'ног под собой не чуять; ликовать, радоваться'
                m['examples'] = [{'en': 'to tread (or to walk) on air', 'ru': tr}]
                
        if w == 'key':
            if tr in ('the', 'to have (or to get)', '='):
                continue
            if 'key up' in str(m.get('examples', '')):
                tr = 'возбуждать, взвинчивать; придавать решимость; повышать (спрос и т. п.)'
                m['examples'] = [{'en': 'key up', 'ru': tr}]
                
        if not tr or not any('\u0400' <= c <= '\u04FF' for c in tr):
            continue
            
        # Clean orphan letters at start/end
        tr = re.sub(r'^[а-яa-z0-9]\)\s*', '', tr)
        tr = tr.replace('спрос и тому подобное', 'спрос и т. п.').replace('ис следовании', 'исследовании')
        
        m_exs = []
        for ex in m.get('examples', []):
            en = ex.get('en', '').strip()
            ru = ex.get('ru', '').strip()
            if not en and not ru:
                continue
            ru = re.sub(r'^[а-яa-z0-9]\)\s*', '', ru)
            if ru.startswith('into thin air'):
                ru = 'скрыться из виду, бесследно исчезнуть'
                en = 'to melt (or to vanish, to disappear) into thin air'
            elif ru.startswith('on air'):
                ru = 'ног под собой не чуять; ликовать, радоваться'
                en = 'to tread (or to walk) on air'
            m_exs.append({'en': en, 'ru': ru})
            
        m['translation'] = tr
        m['examples'] = m_exs
        cleaned_meanings.append(m)
        
    for idx, m in enumerate(cleaned_meanings, start=1):
        m['id'] = idx
        
    entry['meanings'] = cleaned_meanings
    return entry

for entry in data:
    clean_entry_meanings(entry)

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('oxford_5000_verified.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved cleaned entries!")
