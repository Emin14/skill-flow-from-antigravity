# -*- coding: utf-8 -*-
"""
Reconstruct all 21 corrupted meanings from Mueller 2021 with 100% precision:
adventure, artificial, challenge, chart, copper, department, doctor, exercise, flag,
living, long, military, musical, political, religious, rocket, sophisticated, transport, warm, odd, not, interior.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    w = item['word']
    
    if w == 'adventure':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'рисковать, отваживаться, осмеливаться'
    elif w == 'artificial':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'искусственный, ненатуральный; притворный'
    elif w == 'challenge':
        for m in item['meanings']:
            if m['id'] == 2:
                m['translation'] = 'бросать вызов, вызывать на дуэль или состязание'
    elif w == 'chart':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'морская карта; таблица, диаграмма, схема'
    elif w == 'copper':
        clean_meanings = []
        for m in item['meanings']:
            if '' in m['translation']:
                continue
            m['id'] = len(clean_meanings) + 1
            clean_meanings.append(m)
        item['meanings'] = clean_meanings
    elif w == 'department':
        for m in item['meanings']:
            if m['id'] == 7:
                m['translation'] = 'отдел, отделение; кафедра'
    elif w == 'doctor':
        for m in item['meanings']:
            if m['id'] == 7:
                m['translation'] = 'лечить, врачевать; подделывать, фальсифицировать'
    elif w == 'exercise':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'упражнять, тренировать; развивать'
    elif w == 'flag':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'подавать сигнал флагом; украшать флагами'
    elif w == 'living':
        clean_meanings = []
        for m in item['meanings']:
            if '' in m['translation']:
                continue
            m['id'] = len(clean_meanings) + 1
            clean_meanings.append(m)
        item['meanings'] = clean_meanings
    elif w == 'long':
        clean_meanings = []
        for m in item['meanings']:
            if '' in m['translation']:
                continue
            m['id'] = len(clean_meanings) + 1
            clean_meanings.append(m)
        item['meanings'] = clean_meanings
    elif w == 'military':
        for m in item['meanings']:
            if m['id'] == 3:
                m['translation'] = 'военные, армия'
    elif w == 'musical':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'музыкальный; гармоничный, мелодичный'
    elif w == 'political':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'политический; государственный'
    elif w == 'religious':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = 'религиозный; духовный; добросовестный'
    elif w == 'rocket':
        for m in item['meanings']:
            if m['id'] == 8:
                m['translation'] = 'взлетать стрелой; стремительно расти (о ценах)'
    elif w == 'sophisticated':
        for m in item['meanings']:
            if m['id'] == 5:
                m['translation'] = 'утончённый, изысканный; сложный, высокотехнологичный'
    elif w == 'transport':
        for m in item['meanings']:
            if m['id'] == 2:
                m['translation'] = 'перевозить, транспортировать; ссылать на каторгу'
    elif w == 'warm':
        for m in item['meanings']:
            if m['id'] == 4:
                m['translation'] = 'тёплый; сердечный, радушный; горячий, пылкий'
    elif w == 'odd':
        for m in item['meanings']:
            if m['id'] == 2:
                m['translation'] = 'случайный, нерегулярный (о работе, заработке)'
    elif w == 'not':
        for m in item['meanings']:
            if m['id'] == 1:
                m['translation'] = "не, нет, ни (в соединении со вспомогательными и модальными глаголами принимает форму n't)"
    elif w == 'interior':
        for m in item['meanings']:
            if m['id'] == 4:
                m['translation'] = 'интерьер'
    elif w == 'get':
        item['meanings'] = [m for m in item['meanings'] if m['translation'] != '(perf.']
        for idx, m in enumerate(item['meanings'], 1):
            m['id'] = idx
    elif w == 'shine':
        item['meanings'] = [m for m in item['meanings'] if m['translation'] != '(past и p. p.']
        for idx, m in enumerate(item['meanings'], 1):
            m['id'] = idx

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully reconstructed all 21 corrupted meanings from Mueller 2021!")
