# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for entry in data:
    w = entry['word']
    cleaned_m = []
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        
        # Word-specific fixes
        if w == 'eat' and 'humble pie' in tr + str(exs):
            tr = 'смириться, проглотить обиду, покориться'
            exs = [{'en': 'to eat dirt (or humble pie, crow)', 'ru': tr}]
        elif w == 'mark' and 'soft' in tr + str(exs):
            tr = 'лёгкая добыча'
            exs = [{'en': 'easy (or soft) mark', 'ru': tr}]
        elif w == 'patch' and 'purple patch' in str(exs):
            tr = 'яркое место (в литературном произведении)'
            exs = [{'en': 'a purple patch', 'ru': tr}]
        elif w == 'piece' and 'of a' in tr + str(exs):
            tr = 'одного и того же качества с'
            exs = [{'en': 'of a (or of one) piece with', 'ru': tr}]
        elif w == 'empty' and 'пустая бочка' in tr + str(exs):
            tr = 'посл. пустая бочка пуще гремит'
            exs = [{'en': 'empty vessels make the greatest (or the most) sound', 'ru': tr}]
        elif w == 'little' and 'он и не думал' in tr + str(exs):
            tr = 'он и не думал, что...'
            exs = [{'en': 'little did he think that (or he little thought that)', 'ru': tr}]
        elif w == 'commercial' and 'радио- или телепередача' in str(exs):
            exs = [{'en': 'commercial broadcast (or telecast)', 'ru': 'коммерческая радио- или телепередача'}]
        elif w == 'yours':
            exs = [{'en': 'yours sincerely (or sincerely yours)', 'ru': 'с искренним уважением (в письме)'}]
        elif w == 'quarter' and 'поселиться' in tr + str(exs):
            tr = 'поселиться у кого-либо'
            exs = [{'en': "to take up one's quarters with smb.", 'ru': tr}]
        elif w == 'map' and 'map out' in tr:
            tr = 'наносить на карту, чертить карту; производить съёмку местности'
            m_sub = {
                'id': m['id'] + 1,
                'partOfSpeech': 'verb',
                'translation': 'составлять план, планировать',
                'examples': [{'en': 'map out', 'ru': 'составлять план, планировать'}]
            }
        elif w == 'afford' and 'часто can' in tr:
            tr = '(быть в состоянии) позволить себе'
        elif w == 'bean' and 'kidney' in tr:
            tr = 'боб; фасоль'
        elif w == 'function' and 'public' in tr:
            tr = 'вечер, приём'
        elif w == 'headquarters':
            tr = 'штаб-квартира; штаб; главное управление'
            exs = []
        elif w == 'that' and '[æt' in tr:
            tr = 'тот; та; то'
        elif w == 'throat' and 'см. также' in tr:
            tr = 'горло, глотка, гортань'
        elif w == 'must' and 'редуцированная' in str(exs):
            exs = []
        elif w == 'upon' and 'редуцированная' in str(exs):
            exs = []
        elif w == 'thought' and '(а thought)' in tr:
            tr = 'чуточка, малость'
            exs = [{'en': 'a thought', 'ru': 'чуточку, немного'}]
        elif w == 'never' and 'подразумевается' in str(exs):
            exs = [{'en': 'well, I never!, I never did!', 'ru': 'никогда ничего подобного не видел или не слышал!'}]
        elif w == 'stock' and 'из хорошей семьи' in tr + str(exs):
            tr = 'из хорошей семьи'
            exs = [{'en': 'of good stock', 'ru': 'из хорошей семьи'}]
        elif w == 'superior' and 'элита' in tr + str(exs):
            tr = 'элита'
            exs = [{'en': 'superior persons', 'ru': 'элита'}]
        elif w == 'in' and 'существительные в сочетании' in tr:
            tr = 'в(о) (часть суток, время года, месяц и т. п.)'
            exs = [
                {'en': 'in the evening', 'ru': 'вечером'},
                {'en': 'in January', 'ru': 'в январе'},
                {'en': 'in spring', 'ru': 'весной'},
                {'en': 'in 1995', 'ru': 'в 1995 году'}
            ]
            
        m['translation'] = tr
        m['examples'] = exs
        cleaned_m.append(m)
        
    for idx, m in enumerate(cleaned_m, start=1):
        m['id'] = idx
    entry['meanings'] = cleaned_m

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('oxford_5000_verified.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved polished dataset.")
