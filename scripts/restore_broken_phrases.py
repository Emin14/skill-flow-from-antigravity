# -*- coding: utf-8 -*-
"""
Restore complete Russian translations for all 20 broken diamond phrases and fix mind/seal leaks.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Dictionary of phrase fixes: word -> phrase_text -> (translation, register, pos)
EXACT_PHRASE_FIXES = {
    'anything': {
        'like anything': ('изо всех сил; вовсю, стремительно', ['разговорное'], 'adverb')
    },
    'base': {
        'to touch base': ('установить контакт, связаться', ['американизм'], 'verb')
    },
    'bean': {
        'not to have a bean': ('не иметь ни гроша, быть без гроша в кармане', ['разговорное'], 'verb')
    },
    'bee': {
        "to have a bee in one's bonnet": ('быть со странностями, иметь пунктик, носиться с какой-либо идеей', ['разговорное'], 'verb')
    },
    'bless': {
        'to bless the mark': ('прости господи (восклицание)', ['устаревшее'], 'interjection')
    },
    'burn': {
        'to burn daylight': ('1) жечь свечи средь бела дня; 2) терять попусту время, тратить время зря', ['устаревшее'], 'verb')
    },
    'cut': {
        'to cut a feather': ('разрезать волну, оставляя пенный след (о судне)', ['устаревшее'], 'verb')
    },
    'egg': {
        'a bad egg': ('непутёвый, ненадёжный человек; паршивая овца', ['разговорное'], 'noun'),
        'a good egg': ('славный малый, отличный парень', ['разговорное'], 'noun')
    },
    'end': {
        'no end of': ('множество, куча, масса (чего-либо)', ['разговорное'], 'adverb')
    },
    'ever': {
        'ever so': ('очень, в высшей степени, чрезвычайно', ['разговорное'], 'adverb')
    },
    'fence': {
        "to mend one's fences": ('восстанавливать влияние; укреплять свои позиции перед выборами', ['американизм'], 'verb')
    },
    'fish': {
        'to feed the fishes': ('1) страдать морской болезнью; 2) утонуть, пойти ко дну', ['разговорное'], 'verb')
    },
    'have': {
        'he has had it': ('ему крышка, с ним всё кончено; он получил по заслугам', ['разговорное'], 'phrase')
    },
    'keep': {
        'for keeps': ('насовсем, навсегда; окончательно; раз и навсегда', ['разговорное'], 'adverb')
    },
    'make': {
        'to be on the make': ('стремиться к наживе, карьере; делать карьеру любой ценой', ['разговорное'], 'verb')
    },
    'rough': {
        'to take over a rough road': ('задать головомойку, отчитать; подвергнуть суровой критике', ['американизм'], 'verb')
    },
    'sporting': {
        'sporting house': ('1) игорный дом; 2) публичный дом', ['американизм'], 'noun')
    },
    'sure': {
        'for sure': ('наверняка, точно, определённо, без сомнения', ['разговорное'], 'adverb')
    },
    'talk': {
        'to talk turkey': ('говорить начистоту, прямо; говорить по делу', ['американизм'], 'verb')
    }
}

for item in oxford_data:
    w = item['word']
    
    # 1. Fix missing phrase translations
    for p in item.get('phrases', []):
        p_text = p.get('phrase', '')
        if w in EXACT_PHRASE_FIXES and p_text in EXACT_PHRASE_FIXES[w]:
            tr, regs, pos = EXACT_PHRASE_FIXES[w][p_text]
            p['translation'] = tr
            p['register'] = regs
            p['partOfSpeech'] = pos
            
    # 2. Fix mind [id:5]
    if w == 'mind':
        # Remove meaning 5 'to be of the same mind' and put in phrases
        clean_meanings = []
        for m in item['meanings']:
            if 'to be of the same mind' in m.get('translation', ''):
                if 'phrases' not in item:
                    item['phrases'] = []
                item['phrases'].append({
                    "id": len(item['phrases']) + 1,
                    "phrase": "to be of the same mind",
                    "partOfSpeech": "verb",
                    "translation": "быть того же мнения, сходиться во взглядах",
                    "examples": [],
                    "register": []
                })
            else:
                clean_meanings.append(m)
        for idx, m in enumerate(clean_meanings, start=1):
            m['id'] = idx
        item['meanings'] = clean_meanings
        for p_idx, p in enumerate(item.get('phrases', []), start=1):
            p['id'] = p_idx

    # 3. Fix seal [id:6]
    if w == 'seal':
        clean_meanings = []
        for m in item['meanings']:
            if "to set one's seal to" in m.get('translation', ''):
                if 'phrases' not in item:
                    item['phrases'] = []
                item['phrases'].append({
                    "id": len(item['phrases']) + 1,
                    "phrase": "to set one's seal to",
                    "partOfSpeech": "verb",
                    "translation": "скреплять печатью; перен. подтверждать",
                    "examples": [],
                    "register": []
                })
            else:
                clean_meanings.append(m)
        for idx, m in enumerate(clean_meanings, start=1):
            m['id'] = idx
        item['meanings'] = clean_meanings
        for p_idx, p in enumerate(item.get('phrases', []), start=1):
            p['id'] = p_idx

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Applied complete phrase restorations successfully!")
