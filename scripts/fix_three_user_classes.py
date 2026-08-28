# -*- coding: utf-8 -*-
"""
Fix all items across the three classes:
1. 'monkey' - retain £500 / $500 meaning with proper slang register, fix 'тележка подъёмного крана' in meaning 5
2. 'car', 'collect', 'telephone', 'wire' - fix chopped 'тел-' stems ('тележка', 'телеграмма', 'телефон', 'телеграф') and remove false 'телевидение' register
3. 'month' - fix 'последождичка в четверг' -> 'после дождичка в четверг'
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    
    if w == 'monkey':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                # 500 pounds / 500 dollars is 100% authentic British/US slang
                m['translation'] = '500 фунтов стерлингов; 500 долларов'
                m['register'] = ['британский английский', 'американский английский', 'жаргон']
            elif m['id'] == 5:
                # Fix 'ежка подъёмного крана' -> 'тележка подъёмного крана'
                m['translation'] = 'тележка подъёмного крана'
                m['register'] = ['техническое']
                
    elif w == 'car':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                m['translation'] = 'тележка; повозка; вагонетка'
                if 'телевидение' in m.get('register', []):
                    m['register'].remove('телевидение')
                    
    elif w == 'collect':
        for m in item.get('meanings', []):
            if m['id'] == 10:
                m['translation'] = 'телеграмма должна быть оплачена получателем'
                if 'телевидение' in m.get('register', []):
                    m['register'].remove('телевидение')
                    
    elif w == 'telephone':
        for m in item.get('meanings', []):
            if m['id'] == 1:
                m['translation'] = 'телефон'
                if 'телевидение' in m.get('register', []):
                    m['register'].remove('телевидение')
                    
    elif w == 'wire':
        for m in item.get('meanings', []):
            if m['id'] == 2:
                m['translation'] = 'телеграф'
                if 'телевидение' in m.get('register', []):
                    m['register'].remove('телевидение')
                    
    elif w == 'month':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                m['translation'] = 'после дождичка в четверг; когда рак на горе свистнет (a month of Sundays)'
                
    # General safety check across all entries for glued phrase
    for m in item.get('meanings', []):
        if 'последождичка' in m.get('translation', ''):
            m['translation'] = m['translation'].replace('последождичка', 'после дождичка')
        if 'оплаченаполучателем' in m.get('translation', ''):
            m['translation'] = m['translation'].replace('оплаченаполучателем', 'оплачена получателем')
            
    for p in item.get('phrases', []):
        if 'последождичка' in p.get('translation', ''):
            p['translation'] = p['translation'].replace('последождичка', 'после дождичка')
        if 'оплаченаполучателем' in p.get('translation', ''):
            p['translation'] = p['translation'].replace('оплаченаполучателем', 'оплачена получателем')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully fixed all three classes and synced files!")
