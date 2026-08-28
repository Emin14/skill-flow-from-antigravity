# -*- coding: utf-8 -*-
"""
Deep investigation of all three error classes:
1. Slang/money definitions check (monkey, pony, etc.)
2. Hidden chopped word stems (e.g., 'ежка' -> 'тележка', 'ефон', etc.)
3. Concatenated Russian words / missing spaces (e.g., 'последождичка' -> 'после дождичка')
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

print("=" * 80)
print("CLASS 1: CHECKING 'monkey' AND MONEY/SLANG TERMS")
print("=" * 80)

for item in data:
    if item['word'] in ['monkey', 'pony', 'grand', 'quid', 'buck', 'dime', 'nickel']:
        print(f"\nWord: {item['word']}")
        for m in item.get('meanings', []):
            print(f"  Meaning {m['id']}: '{m['translation']}' (reg: {m['register']})")

print("\n" + "=" * 80)
print("CLASS 2: SEARCHING FOR HIDDEN CHOPPED STEMS (e.g., 'ежка' -> 'тележка', etc.)")
print("=" * 80)

# Search for suspicious truncated words across all translations
chopped_candidates = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        # Check words starting with suspicious suffixes/stems
        words = re.findall(r'[а-яёА-ЯЁ]+', t)
        for wd in words:
            wd_l = wd.lower()
            # Words that are not valid standalone Russian words
            if wd_l in ['ежка', 'ежки', 'ежке', 'ежку', 'ежками', 'ефон', 'ефона', 'ефону', 'ефоном', 'евидение', 'евидения', 'еграф', 'ескоп', 'ескопный', 'еграм', 'еграмма', 'еграммы', 'ескоп', 'еграф']:
                chopped_candidates.append((w, 'meaning', m['id'], t, m['register'], wd, 'тел.'))
            elif re.match(r'^(?:ежка|ефон|еграф|ескоп|евидени)\b', wd_l):
                chopped_candidates.append((w, 'meaning', m['id'], t, m['register'], wd, 'тел.'))
                
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        words = re.findall(r'[а-яёА-ЯЁ]+', t)
        for wd in words:
            wd_l = wd.lower()
            if wd_l in ['ежка', 'ежки', 'ежке', 'ежку', 'ежками', 'ефон', 'ефона', 'ефону', 'ефоном', 'евидение', 'евидения', 'еграф', 'ескоп', 'ескопный', 'еграм', 'еграмма', 'еграммы', 'ескоп', 'еграф']:
                chopped_candidates.append((w, 'phrase', p['id'], t, p['register'], wd, 'тел.'))
            elif re.match(r'^(?:ежка|ефон|еграф|ескоп|евидени)\b', wd_l):
                chopped_candidates.append((w, 'phrase', p['id'], t, p['register'], wd, 'тел.'))

print(f"Found {len(chopped_candidates)} chopped stem candidates:")
for c in chopped_candidates:
    print(f"  [{c[0]}] ({c[1]} {c[2]}): word='{c[5]}' in '{c[3]}'")

print("\n" + "=" * 80)
print("CLASS 3: SEARCHING FOR CONCATENATED RUSSIAN WORDS / MISSING SPACES")
print("=" * 80)

# Known glued patterns like 'последождичка', 'досвидания', 'помне', 'втечение', etc.
concatenated_candidates = []

PREPOSITIONS = ['после', 'до', 'без', 'для', 'ради', 'из', 'от', 'под', 'над', 'перед', 'при', 'через', 'сквозь', 'около', 'возле', 'вкруг', 'вокруг', 'мимо', 'навстречу', 'вдоль', 'вместо', 'кроме', 'сверх']

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        words = re.findall(r'[а-яёА-ЯЁ]+', t)
        for wd in words:
            wd_l = wd.lower()
            if wd_l == 'последождичка':
                concatenated_candidates.append((w, 'meaning', m['id'], t, wd, 'после дождичка'))
            elif wd_l.startswith('после') and len(wd_l) > 7 and wd_l not in ['последовать', 'последовал', 'последовали', 'последует', 'последуют', 'последующий', 'последующая', 'последующее', 'последующие', 'последующих', 'последующим', 'последующими', 'последовательный', 'последовательная', 'последовательное', 'последовательные', 'последовательно', 'последовательность', 'последователя', 'последователи', 'последователей', 'последыш', 'последствие', 'последствия', 'последствий', 'последний', 'последняя', 'последнее', 'последние', 'последних', 'последним', 'последними', 'послесловие', 'послесловием', 'послесловии', 'послесловиях', 'послезавтра']:
                concatenated_candidates.append((w, 'meaning', m['id'], t, wd, f"после {wd_l[5:]}"))
            elif wd_l.startswith('втечение') and wd_l not in ['втечение']:
                concatenated_candidates.append((w, 'meaning', m['id'], t, wd, 'в течение'))
            elif wd_l == 'втечение':
                concatenated_candidates.append((w, 'meaning', m['id'], t, wd, 'в течение'))
            elif wd_l == 'досвидания' or wd_l == 'досвиданья':
                concatenated_candidates.append((w, 'meaning', m['id'], t, wd, 'до свидания'))
            elif wd_l == 'изподтишка':
                concatenated_candidates.append((w, 'meaning', m['id'], t, wd, 'исподтишка'))
            elif wd_l == 'нето' and 'не то' in t:
                pass
                
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        words = re.findall(r'[а-яёА-ЯЁ]+', t)
        for wd in words:
            wd_l = wd.lower()
            if wd_l == 'последождичка':
                concatenated_candidates.append((w, 'phrase', p['id'], t, wd, 'после дождичка'))
            elif wd_l.startswith('после') and len(wd_l) > 7 and wd_l not in ['последовать', 'последовал', 'последовали', 'последует', 'последуют', 'последующий', 'последующая', 'последующее', 'последующие', 'последующих', 'последующим', 'последующими', 'последовательный', 'последовательная', 'последовательное', 'последовательные', 'последовательно', 'последовательность', 'последователя', 'последователи', 'последователей', 'последыш', 'последствие', 'последствия', 'последствий', 'последний', 'последняя', 'последнее', 'последние', 'последних', 'последним', 'последними', 'послесловие', 'послесловием', 'послесловии', 'послесловиях', 'послезавтра']:
                concatenated_candidates.append((w, 'phrase', p['id'], t, wd, f"после {wd_l[5:]}"))
            elif wd_l == 'втечение':
                concatenated_candidates.append((w, 'phrase', p['id'], t, wd, 'в течение'))

print(f"Found {len(concatenated_candidates)} concatenated word candidates:")
for c in concatenated_candidates:
    print(f"  [{c[0]}] ({c[1]} {c[2]}): word='{c[4]}' in '{c[3]}' -> fix='{c[5]}'")

