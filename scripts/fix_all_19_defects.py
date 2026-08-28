# -*- coding: utf-8 -*-
"""
Fix all 19 identified defects in oxford_5000_2026-08-27.json.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    
    if w == 'hook':
        for p in item.get('phrases', []):
            if p['id'] == 1:
                p['translation'] = p['translation'].replace('≅', '≈')
                
    elif w == 'judgement':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                for ex in m.get('examples', []):
                    if not ex.get('en'):
                        ex['en'] = 'rule of court'
                        
    elif w == 'of':
        for m in item.get('meanings', []):
            if m['id'] == 15:
                for ex in m.get('examples', []):
                    if not ex.get('en'):
                        ex['en'] = 'a farm of 100 acres'
                        
    elif w == 'assumption':
        for m in item.get('meanings', []):
            if m['id'] == 6:
                m['translation'] = 'Успение'
                if 'религиозное' not in m['register']:
                    m['register'].append('религиозное')
                    
    elif w == 'carry':
        for m in item.get('meanings', []):
            if m['id'] == 23:
                m['translation'] = 'положение «на плечо»'
                if 'военное' not in m['register']:
                    m['register'].append('военное')
                    
    elif w == 'democracy':
        for m in item.get('meanings', []):
            if m['id'] == 4:
                m['translation'] = 'демократическая партия'
                if 'американский английский' not in m['register']:
                    m['register'].append('американский английский')
                    
    elif w == 'detailed':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                m['translation'] = 'назначенный; выделенный'
                if 'военное' not in m['register']:
                    m['register'].append('военное')
                    
    elif w == 'double':
        for m in item.get('meanings', []):
            if m['id'] == 12:
                m['translation'] = 'беглый шаг'
                if 'военное' not in m['register']:
                    m['register'].append('военное')
                    
    elif w == 'elephant':
        for m in item.get('meanings', []):
            if m['id'] == 2:
                m['translation'] = 'слон (эмблема республиканской партии)'
                if 'американский английский' not in m['register']:
                    m['register'].append('американский английский')
                    
    elif w == 'frog':
        for m in item.get('meanings', []):
            if m['id'] == 2:
                m['translation'] = 'француз'
                if 'пренебрежительное' not in m['register']:
                    m['register'].append('пренебрежительное')
                    
    elif w == 'matter':
        for m in item.get('meanings', []):
            if m['id'] == 9:
                m['translation'] = 'рукопись; оригинал'
                if 'полиграфия' not in m['register']:
                    m['register'].append('полиграфия')
                    
    elif w == 'metal':
        for m in item.get('meanings', []):
            if m['id'] == 6:
                m['translation'] = 'гарт'
                if 'полиграфия' not in m['register']:
                    m['register'].append('полиграфия')
                    
    elif w == 'plate':
        for m in item.get('meanings', []):
            if m['id'] == 17:
                m['translation'] = 'изготовлять гальваноклише или стереотип'
                if 'полиграфия' not in m['register']:
                    m['register'].append('полиграфия')
                    
    elif w == 'reach':
        for m in item.get('meanings', []):
            if m['id'] == 18:
                m['translation'] = 'сделать галс'
                if 'морской термин' not in m['register']:
                    m['register'].append('морской термин')
                    
    elif w == 'reconstruction':
        for m in item.get('meanings', []):
            if m['id'] == 3:
                m['translation'] = 'Реконструкция Юга (после Гражданской войны)'
                for reg in ['американский английский', 'историческое']:
                    if reg not in m['register']:
                        m['register'].append(reg)
                        
    elif w == 'star':
        for m in item.get('meanings', []):
            if m['id'] == 8:
                m['translation'] = 'труппа с одним, двумя первоклассными актёрами и слабым ансамблем'
                if 'театр' not in m['register']:
                    m['register'].append('театр')
                    
    elif w == 'street':
        for m in item.get('meanings', []):
            if m['id'] == 2:
                m['translation'] = 'деловой или финансовый центр (обыкн. Уоллстрит)'
                for reg in ['американский английский', 'жаргон']:
                    if reg not in m['register']:
                        m['register'].append(reg)
                        
    elif w == 'superior':
        for m in item.get('meanings', []):
            if m['id'] == 11:
                m['translation'] = 'надстрочный знак'
                if 'полиграфия' not in m['register']:
                    m['register'].append('полиграфия')
                    
    elif w == 'toll':
        for m in item.get('meanings', []):
            if m['id'] == 6:
                m['translation'] = 'потери'
                if 'военное' not in m['register']:
                    m['register'].append('военное')

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("All 19 defects fixed cleanly!")
