# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

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
    
    # Pure python token-based register extraction (O(1) dictionary lookups)
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

def process_single_entry(entry: dict) -> dict:
    w = entry['word']
    old_meanings = entry.get('meanings', [])
    unpacked_meanings = []
    
    for m in old_meanings:
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', 'other')
        if pos == 'other':
            if w in ('good', 'bad', 'ill', 'well2'):
                pos = 'adjective'
            elif w in ('a', 'an', 'the'):
                pos = 'article'
            elif tr.startswith(('быть', 'делать', 'идти', 'покидать', 'отказываться', 'предаваться')):
                pos = 'verb'
            elif any(tr.endswith(x) for x in ('ый', 'ий', 'ой', 'ая', 'яя', 'ое', 'ее')):
                pos = 'adjective'
            elif any(tr.endswith(x) for x in ('ость', 'ение', 'ание', 'тель', 'ник', 'ство')):
                pos = 'noun'
                
        exs = m.get('examples', [])
        regs = list(m.get('register', []))
        
        full_text = tr
        if exs and len(exs) == 1 and len(exs[0].get('ru', '')) > len(tr) + 15:
            full_text = exs[0].get('ru', '')
            
        if '; to ' in full_text or '; in ' in full_text or '; on ' in full_text or '; at ' in full_text or '; get ' in full_text or '; three ' in full_text or '; high ' in full_text or ' ♦ ' in full_text:
            chunks = re.split(r';\s*|\s*♦\s*', full_text)
            for chunk in chunks:
                chunk = chunk.strip()
                if not chunk:
                    continue
                pair = split_en_ru_pair(chunk)
                if pair:
                    en_part, ru_part = pair
                    cl_ru, sub_regs = clean_and_extract_registers(ru_part, regs)
                    if cl_ru:
                        unpacked_meanings.append({
                            'partOfSpeech': pos,
                            'translation': cl_ru,
                            'examples': [{'en': en_part, 'ru': cl_ru}],
                            'register': sub_regs if sub_regs else None
                        })
                else:
                    cl_ru, sub_regs = clean_and_extract_registers(chunk, regs)
                    if cl_ru:
                        unpacked_meanings.append({
                            'partOfSpeech': pos,
                            'translation': cl_ru,
                            'examples': [],
                            'register': sub_regs if sub_regs else None
                        })
        else:
            cl_tr, sub_regs = clean_and_extract_registers(tr, regs)
            cleaned_exs = []
            for ex in exs:
                en_ex = ex.get('en', '').strip()
                ru_ex = ex.get('ru', '').strip()
                if w == 'high' and en_ex == 'sea(s)':
                    en_ex = 'high sea(s)'
                elif w == 'shape' and en_ex == 'to put into shape':
                    en_ex = 'to put (or lick) into shape'
                elif w == 'key' and en_ex == 'key of the street':
                    en_ex = 'to have (or get) the key of the street'
                elif w == 'key' and en_ex == 'the power of the keies':
                    en_ex = 'the power of the keys'
                elif w == 'ground' and en_ex == 'on the grounds of':
                    ru_ex = 'по причине, на основании'
                    
                cl_ru_ex, ex_regs = clean_and_extract_registers(ru_ex, sub_regs)
                sub_regs.extend(ex_regs)
                if en_ex or cl_ru_ex:
                    cleaned_exs.append({'en': en_ex, 'ru': cl_ru_ex})
                    
            sub_regs = list(set(sub_regs))
            item = {
                'partOfSpeech': pos,
                'translation': cl_tr,
                'examples': cleaned_exs
            }
            if sub_regs:
                item['register'] = sub_regs
            unpacked_meanings.append(item)
            
    res_meanings = []
    for idx, item in enumerate(unpacked_meanings, start=1):
        clean_item = {
            'id': idx,
            'partOfSpeech': item['partOfSpeech'],
            'translation': item['translation'],
            'examples': item['examples']
        }
        if item.get('register'):
            clean_item['register'] = item['register']
        res_meanings.append(clean_item)
        
    return {
        'word': entry['word'],
        'frequency_rank': entry.get('frequency_rank'),
        'cefr': entry.get('cefr'),
        'phon_br': entry.get('phon_br'),
        'phon_n_am': entry.get('phon_n_am'),
        'lists': entry.get('lists', {}),
        'meanings': res_meanings
    }

words_to_test = ['get', 'give', 'go', 'have', 'make', 'take', 'set', 'run', 'put', 'come']
data_map = {x['word']: x for x in data}

t_total = time.time()
for w in words_to_test:
    if w in data_map:
        t0 = time.time()
        res = process_single_entry(data_map[w])
        print(f"'{w}': {len(res['meanings'])} meanings in {time.time() - t0:.4f}s")

print(f"All 10 heavy words processed in {time.time() - t_total:.4f}s!")
