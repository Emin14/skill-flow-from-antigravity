# -*- coding: utf-8 -*-
"""
Clean all unextracted abbreviations and multi-register combinations from translations/phrases
and append proper register tags.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

MULTI_ABBREV_RULES = [
    (r'^(?:радио\s*,\s*тлв\.|тлв\.\s*,\s*радио)\s*', ['радио', 'телевидение']),
    (r'^(?:тлв\.\s*,\s*картинформ\.|тлв\.\s*,\s*информ\.)\s*', ['телевидение', 'информатика']),
    (r'^(?:ав\.\s*,\s*авто|авто\s*,\s*ав\.)\s*', ['авиация', 'автомобильный термин']),
    (r'^(?:мор\.\s*,\s*воен\.|воен\.\s*,\s*мор\.)\s*', ['морской термин', 'военное']),
    (r'^(?:ком\.\s*,\s*юр\.|юр\.\s*,\s*ком\.)\s*', ['коммерческое', 'юридическое']),
    (r'^(?:биол\.\s*,\s*мед\.|мед\.\s*,\s*биол\.)\s*', ['биология', 'медицинское']),
    (r'^(?:физ\.\s*,\s*мат\.|мат\.\s*,\s*физ\.)\s*', ['физика', 'математика']),
    (r'^(?:астр\.\s*,\s*геология|астр\.\s*,)\s*', ['астрономия']),
    (r'^(?:шотл\.\s*,\s*\.?)\s*', ['шотландский диалект']),
    
    # Single abbreviations at start
    (r'^тлв\.\s*', ['телевидение']),
    (r'^радио\s+(?!станция|приёмник|передача|вещание)', ['радио']),
    (r'^кино\s+(?!театр|фильм|искусство|картина)', ['кинематография']),
    (r'^фото\s+(?!снимок|аппарат|графия)', ['фотография']),
    (r'^астр\.\s*', ['астрономия']),
    (r'^шотл\.\s*', ['шотландский диалект']),
    (r'^австрал\.\s*', ['австралийский английский']),
    (r'^ирл\.\s*', ['ирландский диалект']),
    (r'^жарг\.\s*', ['жаргон']),
    (r'^пренебр\.\s*', ['пренебрежительное']),
    (r'^геод\.\s*', ['геодезия']),
    (r'^опт\.\s*', ['оптика']),
    (r'^миф\.\s*', ['мифология']),
    (r'^ист\.\s*', ['историческое']),
    (r'^юрид\.\s*', ['юридическое']),
    (r'^библийск\.\s*', ['библейское']),
    (r'^амер\.\s*ист\.\s*', ['американский английский', 'историческое']),
    (r'^амер\.\s*сл\.\s*', ['американский английский', 'жаргон']),
    (r'^амер\.\s*разг\.\s*', ['американский английский', 'разговорное']),
    (r'^амер\.\s*', ['американский английский'])
]

fixed_count = 0

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        old_t = t
        
        changed = True
        while changed:
            changed = False
            for pat, regs in MULTI_ABBREV_RULES:
                match = re.search(pat, t)
                if match:
                    for r in regs:
                        if r not in m['register']:
                            m['register'].append(r)
                    t = t[match.end():].strip(' ,;:-')
                    changed = True
                    
        # Clean specific OCR residue like "shout down перекричать" inside shout
        if w == 'shout' and 'shout down' in t:
            t = t.split('shout down')[0].strip(' ,;:-')
            
        t = re.sub(r'\s+', ' ', t).strip(' ,;:-')
        if t != old_t:
            m['translation'] = t
            fixed_count += 1

    for p in item.get('phrases', []):
        t = p.get('translation', '')
        old_t = t
        
        changed = True
        while changed:
            changed = False
            for pat, regs in MULTI_ABBREV_RULES:
                match = re.search(pat, t)
                if match:
                    for r in regs:
                        if r not in p['register']:
                            p['register'].append(r)
                    t = t[match.end():].strip(' ,;:-')
                    changed = True
                    
        if t.startswith('= '):
            t = t[2:].strip()
            
        t = re.sub(r'\s+', ' ', t).strip(' ,;:-')
        if t != old_t:
            p['translation'] = t
            fixed_count += 1

print(f"Cleaned {fixed_count} multi-register prefixes!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Synced with src/data/oxford_5000.json!")
