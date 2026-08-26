# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data_map = {x['word']: x for x in data}
get_entry = data_map['get']

REGISTER_MAP = {
    'жив.': 'живопись', 'лог.': 'логика', 'карт.': 'карточный термин', 'мор.': 'морской термин',
    'юр.': 'юриспруденция', 'тех.': 'техника', 'библ.': 'библеизм', 'разг.': 'разговорное',
    'муз.': 'музыка', 'авт.': 'автомобильное', 'ав.': 'авиация', 'горн.': 'горное дело',
    'с.-х.': 'сельское хозяйство', 'с-х.': 'сельское хозяйство', 'анат.': 'анатомия',
    'биол.': 'биология', 'бот.': 'ботаника', 'грам.': 'грамматика', 'зоол.': 'зоология',
    'лингв.': 'лингвистика', 'мат.': 'математика', 'мед.': 'медицина', 'мин.': 'минералогия',
    'полит.': 'политика', 'психол.': 'психология', 'рад.': 'радио', 'спорт.': 'спорт',
    'строит.': 'строительство', 'театр.': 'театр', 'физ.': 'физика', 'филос.': 'философия',
    'фин.': 'финансы', 'фото.': 'фотография', 'хим.': 'химия', 'шахм.': 'шахматы',
    'экон.': 'экономика', 'эл.': 'электротехника', 'воен.': 'военное дело', 'книжн.': 'книжное',
    'шутл.': 'шутливое', 'ирон.': 'ироническое', 'бран.': 'бранное', 'редк.': 'редкое',
    'уст.': 'устаревшее', 'амер.': 'американский английский', 'австрал.': 'австралийский английский',
    'шотл.': 'шотландский английский', 'комм.': 'коммерческое', 'коммерч.': 'коммерческое',
    'архит.': 'архитектура', 'жд.': 'железнодорожное', 'ж.-д.': 'железнодорожное'
}

GRAMMAR_FORM_PATTERN = re.compile(r'^\s*\((?:better;\s*best|worse;\s*worst|more;\s*most|[a-zA-Z\s,;]+)\)\s*')
ORPHAN_MARKER_PATTERN = re.compile(r'^[а-яa-z0-9]\)\s*')
CROSS_REF_PATTERN = re.compile(r'\[сравните\s+также[^\]]+\]')
CONTROL_CHARS_PATTERN = re.compile(r'[\x00-\x08\x0b\x0c\x0e-\x1f\ue000\xad\u200b\ufeff]')
HTML_TAG_PATTERN = re.compile(r'</?[a-zA-Z0-9]+>')

KNOWN_WORD_REPAIRS = {
    'ис следовании': 'исследовании', 'ис следование': 'исследование', 'ис следования': 'исследования',
    'спроси тому подобное': 'спрос и тому подобное', 'нив каком': 'ни в каком', 'непо карману': 'не по карману',
    'таких-толет': 'таких-то лет', 'вту или': 'в ту или', 'отдела': 'от дела', 'keies': 'keys',
    'страхи риск': 'страх и риск', 'такого - то': 'такого-то', 'в мини атюре': 'в миниатюре',
    'расспраши вание': 'расспрашивание', 'собира тельное': 'собирательное', 'употреби тельно': 'употребительно',
    'произ водить': 'производить', 'госпо дин': 'господин', 'инте ресах': 'интересах', 'ми нут': 'минут',
    'изъявитель ном': 'изъявительном', 'не счастных': 'несчастных', 'рекламо дателем': 'рекламодателем',
    'ком ната': 'комната', 'да леко': 'далеко',
}

def split_en_ru_pair(chunk: str) -> tuple:
    cyr_idx = -1
    for idx, ch in enumerate(chunk):
        if '\u0400' <= ch <= '\u04FF':
            cyr_idx = idx
            break
    if cyr_idx <= 0:
        return None
        
    en_part = chunk[:cyr_idx].strip()
    ru_part = chunk[cyr_idx:].strip()
    
    if en_part and len(en_part) >= 2 and all(ord(c) < 128 or c in '’\'—– ' for c in en_part):
        return en_part, ru_part
    return None

def clean_and_extract_registers(text: str, initial_regs: list = None) -> tuple[str, list]:
    regs = list(initial_regs) if initial_regs else []
    if not text:
        return '', regs
        
    t = text
    t = GRAMMAR_FORM_PATTERN.sub('', t)
    
    if '.' in t:
        tokens = t.split()
        cleaned_tokens = []
        for tok in tokens:
            stripped = tok.strip('()[]{},;')
            if stripped in REGISTER_MAP:
                full = REGISTER_MAP[stripped]
                if full not in regs:
                    regs.append(full)
            else:
                cleaned_tokens.append(tok)
        t = ' '.join(cleaned_tokens)
                
    for bad, good in KNOWN_WORD_REPAIRS.items():
        if bad in t:
            t = t.replace(bad, good)
        
    t = ORPHAN_MARKER_PATTERN.sub('', t)
    t = CROSS_REF_PATTERN.sub('', t)
    t = CONTROL_CHARS_PATTERN.sub('', t)
    t = HTML_TAG_PATTERN.sub('', t)
    t = re.sub(r'\s+', ' ', t)
    
    if t.count('(') > t.count(')'):
        t += ')' * (t.count('(') - t.count(')'))
    elif t.count(')') > t.count('('):
        t = t.rstrip(')')
        
    if t.count('[') > t.count(']'):
        t += ']' * (t.count('[') - t.count(']'))
    elif t.count(']') > t.count('['):
        t = t.rstrip(']')
        
    return t.strip(' ;,.-'), regs

print("Processing meanings of get...")
for m in get_entry['meanings']:
    mid = m['id']
    t0 = time.time()
    tr = m.get('translation', '')
    cl_tr, regs = clean_and_extract_registers(tr)
    for ex in m.get('examples', []):
        cl_en = ex.get('en', '')
        cl_ru, ex_regs = clean_and_extract_registers(ex.get('ru', ''))
    dt = time.time() - t0
    if dt > 0.005 or mid == 24:
        print(f"Meaning [{mid}] took {dt:.4f}s")

print("Finished all meanings of get!")
