# -*- coding: utf-8 -*-
"""
Prototype for deep idiom unpacker and register extractor.
"""

import json
import re
import sys
import copy

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

REGISTER_MAP = {
    'жив.': 'живопись',
    'лог.': 'логика',
    'карт.': 'карточный термин',
    'мор.': 'морской термин',
    'юр.': 'юриспруденция',
    'тех.': 'техника',
    'библ.': 'библеизм',
    'разг.': 'разговорное',
    'муз.': 'музыка',
    'авт.': 'автомобильное',
    'ав.': 'авиация',
    'горн.': 'горное дело',
    'с.-х.': 'сельское хозяйство',
    'с-х.': 'сельское хозяйство',
    'анат.': 'анатомия',
    'биол.': 'биология',
    'бот.': 'ботаника',
    'грам.': 'грамматика',
    'зоол.': 'зоология',
    'лингв.': 'лингвистика',
    'мат.': 'математика',
    'мед.': 'медицина',
    'мин.': 'минералогия',
    'полит.': 'политика',
    'психол.': 'психология',
    'рад.': 'радио',
    'спорт.': 'спорт',
    'строит.': 'строительство',
    'театр.': 'театр',
    'физ.': 'физика',
    'филос.': 'философия',
    'фин.': 'финансы',
    'фото.': 'фотография',
    'хим.': 'химия',
    'шахм.': 'шахматы',
    'экон.': 'экономика',
    'эл.': 'электротехника',
    'воен.': 'военное дело',
    'книжн.': 'книжное',
    'шутл.': 'шутливое',
    'ирон.': 'ироническое',
    'бран.': 'бранное',
    'редк.': 'редкое',
    'уст.': 'устаревшее',
    'амер.': 'американский английский',
    'австрал.': 'австралийский английский',
    'шотл.': 'шотландский английский',
    'комм.': 'коммерческое',
    'коммерч.': 'коммерческое',
    'архит.': 'архитектура',
    'жд.': 'железнодорожное',
    'ж.-д.': 'железнодорожное'
}

def clean_entry_text(text: str) -> tuple[str, list]:
    regs = []
    if not text:
        return '', regs
    t = text
    # Clean grammar form prefix
    t = re.sub(r'^\s*\((?:better;\s*best|worse;\s*worst|more;\s*most|[a-zA-Z\s,;]+)\)\s*', '', t)
    
    # Extract register prefixes
    for ab, full in REGISTER_MAP.items():
        if t.startswith(ab):
            t = t[len(ab):].strip()
            if full not in regs:
                regs.append(full)
        pat = rf'\b{re.escape(ab)}\b'
        if re.search(pat, t):
            t = re.sub(pat, '', t).strip()
            if full not in regs:
                regs.append(full)
                
    # Clean typos / word glues
    t = t.replace('ис следовании', 'исследовании')
    t = t.replace('спроси тому подобное', 'спрос и тому подобное')
    t = t.replace('нив каком', 'ни в каком')
    t = t.replace('непо карману', 'не по карману')
    t = t.replace('таких-толет', 'таких-то лет')
    t = t.replace('вту или', 'в ту или')
    t = t.replace('отдела', 'от дела')
    t = t.replace('keies', 'keys')
    t = re.sub(r'^[а-яa-z0-9]\)\s*', '', t)
    t = re.sub(r'\[сравните\s+также[^\]]+\]', '', t)
    t = re.sub(r'\s+', ' ', t)
    return t.strip(' ;,.-'), regs

def unpack_meanings(entry: dict) -> dict:
    w = entry['word']
    old_meanings = entry.get('meanings', [])
    unpacked = []
    
    for m in old_meanings:
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', 'other')
        if pos == 'other' and w == 'good':
            pos = 'adjective'
        exs = m.get('examples', [])
        regs = list(m.get('register', []))
        
        full_text = tr
        if exs and len(exs) == 1 and len(exs[0].get('ru', '')) > len(tr):
            full_text = exs[0].get('ru', '')
            
        parts = re.split(r';\s*(?=(?:to\s+|in\s+|on\s+|at\s+|by\s+|with\s+|from\s+|the\s+|a\s+|get\s+|passions\s+|right\s+|three\s+|[a-z\-]+\s+and\s+[a-z\-]+)[a-zA-Z\s\(\)\'\’]+[а-яА-ЯёЁ])', full_text)
        
        if len(parts) > 1:
            for p in parts:
                p = p.strip()
                if not p:
                    continue
                m_match = re.match(r'^([a-zA-Z\s\(\)\'\’\/\-]+?)\s+([а-яА-ЯёЁ].*)$', p)
                if m_match:
                    en_part = m_match.group(1).strip()
                    ru_part = m_match.group(2).strip()
                    cl_ru, sub_regs = clean_entry_text(ru_part)
                    combined_regs = list(set(regs + sub_regs))
                    unpacked.append({
                        'partOfSpeech': pos,
                        'translation': cl_ru,
                        'examples': [{'en': en_part, 'ru': cl_ru}],
                        'register': combined_regs if combined_regs else None
                    })
                else:
                    cl_ru, sub_regs = clean_entry_text(p)
                    combined_regs = list(set(regs + sub_regs))
                    unpacked.append({
                        'partOfSpeech': pos,
                        'translation': cl_ru,
                        'examples': [],
                        'register': combined_regs if combined_regs else None
                    })
        else:
            cl_tr, sub_regs = clean_entry_text(tr)
            combined_regs = list(set(regs + sub_regs))
            cleaned_exs = []
            for ex in exs:
                en_ex = ex.get('en', '').strip()
                ru_ex = ex.get('ru', '').strip()
                if w == 'high' and en_ex == 'sea(s)':
                    en_ex = 'high sea(s)'
                elif w == 'shape' and en_ex == 'to put into shape':
                    en_ex = 'to put (or lick) into shape'
                cl_ru_ex, ex_regs = clean_entry_text(ru_ex)
                combined_regs.extend(ex_regs)
                if en_ex or cl_ru_ex:
                    cleaned_exs.append({'en': en_ex, 'ru': cl_ru_ex})
                    
            combined_regs = list(set(combined_regs))
            item = {
                'partOfSpeech': pos,
                'translation': cl_tr,
                'examples': cleaned_exs
            }
            if combined_regs:
                item['register'] = combined_regs
            unpacked.append(item)
            
    res_meanings = []
    for idx, item in enumerate(unpacked, start=1):
        clean_item = {'id': idx, 'partOfSpeech': item['partOfSpeech'], 'translation': item['translation'], 'examples': item['examples']}
        if item.get('register'):
            clean_item['register'] = item['register']
        res_meanings.append(clean_item)
        
    res_entry = copy.deepcopy(entry)
    res_entry['meanings'] = res_meanings
    return res_entry

test_words = ['high', 'good', 'ground', 'induce', 'shape', 'key', 'air']
data_map = {x['word']: x for x in data}

for tw in test_words:
    if tw in data_map:
        up = unpack_meanings(data_map[tw])
        print(f"\n{'='*35} WORD: {tw} {'='*35}")
        print(f"Old count: {len(data_map[tw]['meanings'])}, New unpacked count: {len(up['meanings'])}")
        for m in up['meanings']:
            regs = f" (Reg: {m.get('register')})" if m.get('register') else ""
            print(f"  [{m['id']}] ({m['partOfSpeech']}): {repr(m['translation'])}{regs}")
            if m.get('examples'):
                print(f"       exs: {m['examples']}")
