# -*- coding: utf-8 -*-
"""
Fix all chopped roots, dangling dashes, and rebuild fasten according to Mueller 2021:
1. Reconstruct all chopped roots:
   - 'анавливать' -> 'устанавливать'
   - 'ановка' -> 'установка'
   - 'ав' -> 'устав'
   - 'ава' -> 'слава'
   - 'ремлять' -> 'устремлять'
   - 'ремиться' -> 'устремиться'
   - 'ройство' -> 'устройство'
   - 'упать' -> 'уступать'
   - 'ойчивый' / 'ойчивые' -> 'устойчивый' / 'устойчивые'
2. Fix all dangling dashes in parentheses (border, care, fasten, fire, hear, measure)
3. Rebuild 'fasten' article with 100% precision.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

ROOT_REPLACEMENTS = [
    (r'\bанавливать\b', 'устанавливать'),
    (r'\bанавливает\b', 'устанавливает'),
    (r'\bанавливают\b', 'устанавливают'),
    (r'\bанавливал\b', 'устанавливал'),
    (r'\bановка\b', 'установка'),
    (r'\bановки\b', 'установки'),
    (r'\bановку\b', 'установку'),
    (r'\bановке\b', 'установке'),
    (r'\bремлять\b', 'устремлять'),
    (r'\bремиться\b', 'устремиться'),
    (r'\bройство\b', 'устройство'),
    (r'\bройства\b', 'устройства'),
    (r'\bройству\b', 'устройству'),
    (r'\bройством\b', 'устройством'),
    (r'\bройстве\b', 'устройстве'),
    (r'\bупать\b', 'уступать'),
    (r'\bупает\b', 'уступает'),
    (r'\bупают\b', 'уступают'),
    (r'\bойчивый\b', 'устойчивый'),
    (r'\bойчивая\b', 'устойчивая'),
    (r'\bойчивое\b', 'устойчивое'),
    (r'\bойчивые\b', 'устойчивые'),
    (r'\bойчивых\b', 'устойчивых'),
    (r'\bойчивым\b', 'устойчивым')
]

DASH_REPLACEMENTS = [
    (r'\(on,\s*upon\s*[—\-]\s*\)', '(on, upon — с чем-либо)'),
    (r'\(for,\s*of,\s*about\s*[—\-]\s*\)', '(for, of, about — о ком-либо, чём-либо)'),
    (r'\(to,\s*upon,\s*on\s*[—\-]\s*\)', '(to, upon, on — к чему-либо)'),
    (r'\(at,\s*into\s*[—\-]\s*\)', '(at, into — по кому-либо, во что-либо)'),
    (r'\(of,\s*about\s*[—\-]\s*\)', '(of, about — о ком-либо, чём-либо)'),
    (r'\(with,\s*against\s*[—\-]\s*\)', '(with, against — с кем-либо)')
]

for item in data:
    w = item['word']
    
    if w == 'fasten':
        item['meanings'] = [
            {
                "id": 1,
                "partOfSpeech": "verb",
                "translation": "прикреплять, привязывать (to, upon, on — к чему-либо)",
                "examples": [
                    {
                        "en": "to fasten a nickname on smb.",
                        "ru": "прицепить кому-либо кличку (прозвище)",
                        "register": []
                    }
                ],
                "register": []
            },
            {
                "id": 2,
                "partOfSpeech": "verb",
                "translation": "связывать (together, up, in); скреплять, укреплять, зажимать, свинчивать",
                "examples": [],
                "register": []
            },
            {
                "id": 3,
                "partOfSpeech": "verb",
                "translation": "устремлять (взгляд, мысли и т. п. — on, upon на кого-либо/что-либо)",
                "examples": [],
                "register": []
            },
            {
                "id": 4,
                "partOfSpeech": "verb",
                "translation": "сжимать, стискивать (руки, зубы)",
                "examples": [],
                "register": []
            },
            {
                "id": 5,
                "partOfSpeech": "verb",
                "translation": "запирать(ся) (на замок, засов)",
                "examples": [],
                "register": []
            }
        ]
        continue
    elif w == 'charter':
        for m in item.get('meanings', []):
            if m['translation'] == 'ав':
                m['translation'] = 'устав, хартия; грамота'
    elif w in ['fame', 'glory']:
        for m in item.get('meanings', []):
            if m['translation'] == 'ава' or m['translation'] == 'ава, известность':
                m['translation'] = 'слава, известность'
    elif w in ['thank', 'thankfully', 'thanks']:
        for m in item.get('meanings', []):
            for ex in m.get('examples', []):
                if 'ава Богу' in ex.get('ru', '') or 'ава богу' in ex.get('ru', ''):
                    ex['ru'] = ex['ru'].replace('ава Богу', 'слава Богу').replace('ава богу', 'слава богу')

    # Clean meanings
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for pat, repl in ROOT_REPLACEMENTS:
            t = re.sub(pat, repl, t)
        for pat, repl in DASH_REPLACEMENTS:
            t = re.sub(pat, repl, t)
        m['translation'] = t
        
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in ROOT_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            for pat, repl in DASH_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            ex['ru'] = ru

    # Clean phrases
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for pat, repl in ROOT_REPLACEMENTS:
            t = re.sub(pat, repl, t)
        for pat, repl in DASH_REPLACEMENTS:
            t = re.sub(pat, repl, t)
        p['translation'] = t
        
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in ROOT_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            for pat, repl in DASH_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            ex['ru'] = ru

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully fixed all chopped roots, dangling dashes, and rebuilt fasten!")
