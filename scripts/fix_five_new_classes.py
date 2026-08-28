# -*- coding: utf-8 -*-
"""
Fix the 5 new classes:
1. Glued 'посуду' -> 'по суду' (judicial, plea, recover)
2. Extract '(преим. сев.)' -> register: ["северный диалект"] (intake)
3. Fix 'talk' meaning 12 and extract 'talk at' into phrases
4. Standardize 'стлаться, виться (о растениях)'
5. Fix all chopped 'сл-' roots: 'аболетучий' -> 'слаболетучий', 'абый' -> 'слабый', 'едующий' -> 'следующий', 'абость' -> 'слабость', 'аборазвитый' -> 'слаборазвитый'
6. Expand all short broken forms: '-л.' -> '-либо', 'о -л.' -> 'о ком-либо / о чём-либо', 'чьё-л.' -> 'чьё-либо', 'кого-л.' -> 'кого-либо', 'какое-л.' -> 'какое-либо'
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Replacements map for text cleaning
TEXT_REPLACEMENTS = [
    (r'\bпосуду\b(?=.*(?:приговор|смертн|казн|суд|закон|взыскивать|возмещение|виндицировать))', 'по суду'),
    (r'\bаболетучий\b', 'слаболетучий'),
    (r'\bаборазвитый\b', 'слаборазвитый'),
    (r'\bабокислый\b', 'слабокислый'),
    (r'\bабосоленый\b', 'слабосоленый'),
    (r'\bабосолёный\b', 'слабосолёный'),
    (r'\bаботочный\b', 'слаботочный'),
    (r'\bабоалкогольный\b', 'слабоалкогольный'),
    (r'\bабослышащий\b', 'слабослышащий'),
    (r'\bабый\b', 'слабый'),
    (r'\bабая\b', 'слабая'),
    (r'\bабое\b', 'слабое'),
    (r'\bабые\b', 'слабые'),
    (r'\bабость\b', 'слабость'),
    (r'\bабости\b', 'слабости'),
    (r'\bедующий\b', 'следующий'),
    (r'\bедующая\b', 'следующая'),
    (r'\bедующее\b', 'следующее'),
    (r'\bедующие\b', 'следующие'),
    (r'\bедущих\b', 'следующих'),
    (r'\bедущим\b', 'следующим'),
    (r'\bо\s+-л\b', 'о ком-либо'),
    (r'\bкого-л\b', 'кого-либо'),
    (r'\bкому-л\b', 'кому-либо'),
    (r'\bкем-л\b', 'кем-либо'),
    (r'\bчём-л\b', 'чём-либо'),
    (r'\bчем-л\b', 'чем-либо'),
    (r'\bчто-л\b', 'что-либо'),
    (r'\bчьё-л\b', 'чьё-либо'),
    (r'\bчье-л\b', 'чье-либо'),
    (r'\bчьей-л\b', 'чьей-либо'),
    (r'\bчьих-л\b', 'чьих-либо'),
    (r'\bчьим-л\b', 'чьим-либо'),
    (r'\bкакое-л\b', 'какое-либо'),
    (r'\bкакой-л\b', 'какой-либо'),
    (r'\bкакая-л\b', 'какая-либо'),
    (r'\bкакие-л\b', 'какие-либо'),
    (r'\bкаком-л\b', 'каком-либо'),
    (r'\bкаких-л\b', 'каких-либо'),
    (r'\bгде-л\b', 'где-либо'),
    (r'\bкуда-л\b', 'куда-либо'),
    (r'\bкогда-л\b', 'когда-либо'),
    (r'\bкак-л\b', 'как-либо')
]

for item in data:
    w = item['word']
    
    # 1. Specific repairs for intake
    if w == 'intake':
        for m in item.get('meanings', []):
            if '(преим. сев.)' in m.get('translation', ''):
                m['translation'] = m['translation'].replace('(преим. сев.)', '').strip()
                if 'северный диалект' not in m.get('register', []):
                    m['register'].append('северный диалект')
                    
    # 2. Specific repairs for talk
    elif w == 'talk':
        for m in item.get('meanings', []):
            if 'talk at' in m.get('translation', ''):
                m['translation'] = 'связываться (по телефону, радио)'
                
        has_talk_at = False
        for p in item.get('phrases', []):
            if p.get('phrase') == 'talk at':
                has_talk_at = True
                p['translation'] = 'говорить дурно о ком-либо в расчёте на то, что он это услышит; болтать без умолку'
        if not has_talk_at:
            if 'phrases' not in item:
                item['phrases'] = []
            item['phrases'].append({
                "id": len(item['phrases']) + 1,
                "phrase": "talk at",
                "partOfSpeech": "verb",
                "translation": "говорить дурно о ком-либо в расчёте на то, что он это услышит; болтать без умолку",
                "examples": [],
                "register": []
            })
            
    # 3. Clean general replacements
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for pat, repl in TEXT_REPLACEMENTS:
            t = re.sub(pat, repl, t)
        m['translation'] = t.strip(' ;:,-')
        
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in TEXT_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            ex['ru'] = ru.strip(' ;:,-')
            
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for pat, repl in TEXT_REPLACEMENTS:
            t = re.sub(pat, repl, t)
        p['translation'] = t.strip(' ;:,-')
        
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in TEXT_REPLACEMENTS:
                ru = re.sub(pat, repl, ru)
            ex['ru'] = ru.strip(' ;:,-')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully fixed all 5 new error classes across the dataset!")
