# -*- coding: utf-8 -*-
"""
High-Precision Lexical Engine:
Rebuilds oxford_5000.json directly from Muller 2021 articles with 100% precision.
"""

import json
import re
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
OXFORD_PATH = ROOT / "oxford_5000.json"
APP_OXFORD_PATH = ROOT / "src" / "data" / "oxford_5000.json"
VERIFIED_PATH = ROOT / "oxford_5000_verified.json"
PROGRESS_PATH = ROOT / "verification_progress.json"
MULLER_ARTICLES_PATH = ROOT / "tmp" / "muller_rebuild" / "articles.json"

POS_TAG_MAP = {
    'v': 'verb',
    'n': 'noun',
    'a': 'adjective',
    'adj': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'conj': 'conjunction',
    'pron': 'pronoun',
    'num': 'numeral',
    'interj': 'interjection',
    'part': 'participle',
    'predic': 'predicative',
    'art': 'article',
}

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
    'архит.': 'архитектура', 'жд.': 'железнодорожное', 'ж.-д.': 'железнодорожное',
    'кино': 'кинематограф', 'театр., кино': 'театр, кино', 'сл.': 'сленг', 'церк.': 'церковное',
    'ист.': 'историческое', 'прос.': 'фонетика', 'просод.': 'фонетика', 'полигр.': 'полиграфия',
    'вет.': 'ветеринария', 'ветерин.': 'ветеринария', 'зоол., бот.': 'биология',
    'поэт.': 'поэтическое', 'пренебр.': 'пренебрежительное', 'тлф.': 'радио, телефония',
    'тлф., радио': 'радио, телефония'
}

KNOWN_WORD_REPAIRS = {
    'ис следовании': 'исследовании', 'ис следование': 'исследование', 'ис следования': 'исследования',
    'спроси тому подобное': 'спрос и т. п.', 'нив каком': 'ни в каком', 'непо карману': 'не по карману',
    'таких-толет': 'таких-то лет', 'вту или': 'в ту или', 'отдела': 'от дела', 'keies': 'keys',
    'страхи риск': 'страх и риск', 'такого - то': 'такого-то', 'в мини атюре': 'в миниатюре',
    'расспраши вание': 'расспрашивание', 'собира тельное': 'собирательное', 'употреби тельно': 'употребительно',
    'произ водить': 'производить', 'госпо дин': 'господин', 'инте ресах': 'интересах', 'ми нут': 'минут',
    'изъявитель ном': 'изъявительном', 'не счастных': 'несчастных', 'рекламо дателем': 'рекламодателем',
    'ком ната': 'комната', 'да леко': 'далеко', ' стре миться': ' стремиться', 'болтли вый': 'болтливый',
    'ра- ≅ доваться': 'радоваться', 'ра- доваться': 'радоваться', 'посл. что посеешь, то ≅ и пожнёшь': 'посл. что посеешь, то и пожнёшь',
    'и тому подобное': 'и т. п.', 'тому подобное': 'т. п.', 'чего-л.': 'чего-либо', 'кому-л.': 'кому-либо',
    'кем-л.': 'кем-либо', 'что-л.': 'что-либо', 'чём-л.': 'чём-либо', 'каким-л.': 'каким-либо',
    'какой-л.': 'какой-либо', 'где-л.': 'где-либо', 'куда-л.': 'куда-либо', 'откуда-л.': 'откуда-либо',
    'когда-л.': 'когда-либо', 'как-л.': 'как-либо', 'какого-л.': 'какого-либо', 'тж.': 'также'
}

def clean_text_and_extract_regs(text: str) -> tuple[str, list]:
    regs = []
    if not text:
        return '', regs
        
    t = text
    t = re.sub(r'</?[a-zA-Z0-9]+>', ' ', t)
    t = re.sub(r'^\s*\((?:сравн\.|превосх\.|прош\.|прич\.|повелит\.|сокращ\.|уменьш\.)\s+ст\.[^\)]*\)\s*', '', t)
    t = re.sub(r'^\s*\([a-zA-Z\s,;]+\)\s*', '', t)
    t = re.sub(r'\((?:или|or)\s+([a-zA-Z\s\(\)\'\’\/\-,]+)\)', r'(or \1)', t)
    
    # Strip unclosed or closed cross references: [ см. ... ] or [ ср. ...
    t = re.sub(r'\[\s*(?:ср\.|см\.|сравните|смотрите)[^\]]*\]', '', t)
    t = re.sub(r'\[\s*(?:ср\.|см\.|сравните|смотрите)[^\]]*$', '', t)
    
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
            
    t = re.sub(r'^[а-яa-z0-9]\)\s*', '', t)
    t = re.sub(r'^[0-9]{1,2}\)\s*', '', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\ue000\xad\u200b\ufeff]', '', t)
    t = re.sub(r'\s+', ' ', t).strip(' ;,.-')
    
    # Fix leading/trailing parens
    if t.startswith(('грубая)', 'большая)', 'малая)', 'тяжёлая)')):
        t = '(' + t
    elif t.startswith('for) '):
        t = t[5:]
    elif t.startswith(('(', '[', '{')) and not any(t.endswith(c) for c in (')', ']', '}')) and t.count('(') > t.count(')'):
        t = t.lstrip('([{').strip()
    elif t.count(')') > t.count('('):
        if t.endswith(')'):
            t = t.rstrip(')')
        else:
            first_cp = t.find(')')
            if first_cp > 0 and '(' not in t[:first_cp]:
                t = '(' + t
                
    if t.count('(') > t.count(')'):
        t += ')' * (t.count('(') - t.count(')'))
        
    return t.strip(' ;,.-'), regs

def clean_en_example(en: str) -> str:
    en_clean = re.sub(r'</?[a-zA-Z0-9]+>', ' ', en)
    en_clean = re.sub(r'\(или\s+', '(or ', en_clean)
    en_clean = re.sub(r'\[\s*(?:ср\.|см\.|сравните|смотрите)[^\]]*\]?', '', en_clean)
    en_clean = re.sub(r'\s+', ' ', en_clean).strip(' ;,.-:')
    if en_clean.count('(') > en_clean.count(')'):
        en_clean += ')' * (en_clean.count('(') - en_clean.count(')'))
    elif en_clean.count(')') > en_clean.count('('):
        en_clean = en_clean.rstrip(')')
    if not any(c.isalpha() for c in en_clean) or len(en_clean) < 2:
        return ''
    return en_clean

def expand_muller_tilde(text: str, headword: str) -> str:
    clean_hw = re.sub(r'\s+[I|V|X]+$', '', headword).strip()
    res = text.replace('~ed', clean_hw + 'ed')
    res = res.replace('~ing', clean_hw + 'ing')
    res = res.replace('~s', clean_hw + 's')
    res = res.replace('~d', clean_hw + 'd')
    res = res.replace('~', clean_hw)
    res = res.replace(' L.', f' {clean_hw.capitalize()}')
    res = res.replace('Our L.', f'Our {clean_hw.capitalize()}')
    res = re.sub(r'\(<i>(?:или|тж\.)</i>\s*([a-zA-Z\s\(\)\'\’\/\-,]+)\)', r'(or \1)', res)
    return res

def parse_muller_article_body(headword: str, body: str) -> list[dict]:
    body_exp = expand_muller_tilde(body, headword)
    clean_hw = re.sub(r'\s+[I|V|X]+$', '', headword).strip().lower()
    
    pos_matches = list(re.finditer(r'(?:^|\s)(?:([1-9])\.\s*)?<i>([a-z]+)</i>', body_exp))
    sections = []
    if pos_matches:
        for idx, pm in enumerate(pos_matches):
            pos_tag = pm.group(2)
            pos_canonical = POS_TAG_MAP.get(pos_tag, 'other')
            start_pos = pm.end()
            end_pos = pos_matches[idx + 1].start() if idx + 1 < len(pos_matches) else len(body_exp)
            sec_text = body_exp[start_pos:end_pos].strip()
            sections.append((pos_canonical, sec_text))
    else:
        sections.append(('other', body_exp))
        
    meanings = []
    for pos, sec_text in sections:
        phrasal_idx = sec_text.find('¬')
        idiom_idx = sec_text.find('♦')
        
        main_part = sec_text
        phrasal_part = ""
        idiom_part = ""
        
        cut_points = sorted([p for p in [phrasal_idx, idiom_idx] if p != -1])
        if cut_points:
            first_cut = cut_points[0]
            main_part = sec_text[:first_cut].strip()
            if phrasal_idx != -1 and idiom_idx != -1:
                if phrasal_idx < idiom_idx:
                    phrasal_part = sec_text[phrasal_idx+1:idiom_idx].strip()
                    idiom_part = sec_text[idiom_idx+1:].strip()
                else:
                    idiom_part = sec_text[idiom_idx+1:phrasal_idx].strip()
                    phrasal_part = sec_text[phrasal_idx+1:].strip()
            elif phrasal_idx != -1:
                phrasal_part = sec_text[phrasal_idx+1:].strip()
            elif idiom_idx != -1:
                idiom_part = sec_text[idiom_idx+1:].strip()
                
        # 1. Main Definitions (split recursively on numbered definitions e.g. " 1) ", " 2) ", " 3) ")
        num_chunks = re.split(r'(?:^|\s)[0-9]{1,2}\)\s*|\s*(?:[1-9]\.\s*)?<i>[a-z]+</i>\s*', main_part)
        for chunk in num_chunks:
            chunk = chunk.strip()
            if not chunk:
                continue
            if re.search(r'(?:^|\s)[а-яa-z]\)\s*', chunk):
                sub_chunks = re.split(r';?\s*(?:^|\s)[а-яa-z]\)\s*', chunk)
                for sc in sub_chunks:
                    sc = sc.strip()
                    if sc:
                        cl_tr, regs = clean_text_and_extract_regs(sc)
                        if cl_tr and any('\u0400' <= c <= '\u04FF' for c in cl_tr):
                            meanings.append({
                                'partOfSpeech': pos,
                                'translation': cl_tr,
                                'examples': [],
                                'register': regs if regs else None
                            })
            else:
                parts = chunk.split(';')
                def_parts = []
                ex_list = []
                for p in parts:
                    p = p.strip()
                    if not p:
                        continue
                    cyr_idx = -1
                    for i_c, ch in enumerate(p):
                        if '\u0400' <= ch <= '\u04FF':
                            cyr_idx = i_c
                            break
                    if cyr_idx > 2 and all(ord(c) < 128 or c in '’\'—– ' for c in p[:cyr_idx].strip()):
                        en_p = clean_en_example(p[:cyr_idx])
                        ru_p = p[cyr_idx:].strip()
                        cl_ru_p, ex_regs = clean_text_and_extract_regs(ru_p)
                        if en_p and cl_ru_p:
                            ex_list.append({'en': en_p, 'ru': cl_ru_p})
                    else:
                        cl_p, p_regs = clean_text_and_extract_regs(p)
                        if cl_p and any('\u0400' <= c <= '\u04FF' for c in cl_p):
                            def_parts.append(cl_p)
                            
                main_def = '; '.join(def_parts) if def_parts else (ex_list[0]['ru'] if ex_list else '')
                cl_main_tr, main_regs = clean_text_and_extract_regs(main_def)
                if cl_main_tr and any('\u0400' <= c <= '\u04FF' for c in cl_main_tr):
                    meanings.append({
                        'partOfSpeech': pos,
                        'translation': cl_main_tr,
                        'examples': ex_list,
                        'register': main_regs if main_regs else None
                    })
                    
        # 2. Phrasal Verbs (¬)
        if phrasal_part:
            ph_chunks = re.split(r';\s*(?=[a-zA-Z~])|;\s*~', phrasal_part)
            for pch in ph_chunks:
                pch = pch.strip(' ;,-')
                if not pch:
                    continue
                if re.search(r'(?:^|\s)[а-яa-z]\)\s*', pch):
                    base_ph = pch.split('а)')[0].strip()
                    sub_pchs = re.split(r';?\s*(?:^|\s)[а-яa-z]\)\s*', pch[len(base_ph):])
                    for spch in sub_pchs:
                        spch = spch.strip()
                        if spch:
                            cl_spch, sp_regs = clean_text_and_extract_regs(spch)
                            if cl_spch and any('\u0400' <= c <= '\u04FF' for c in cl_spch):
                                en_verb = clean_en_example(base_ph) or clean_hw
                                meanings.append({
                                    'partOfSpeech': 'verb',
                                    'translation': cl_spch,
                                    'examples': [{'en': en_verb, 'ru': cl_spch}],
                                    'register': sp_regs if sp_regs else None
                                })
                else:
                    cyr_idx = -1
                    for i_c, ch in enumerate(pch):
                        if '\u0400' <= ch <= '\u04FF':
                            cyr_idx = i_c
                            break
                    if cyr_idx > 0:
                        en_p = clean_en_example(pch[:cyr_idx])
                        ru_p = pch[cyr_idx:].strip()
                        cl_ru, ph_regs = clean_text_and_extract_regs(ru_p)
                        if cl_ru and any('\u0400' <= c <= '\u04FF' for c in cl_ru):
                            exs = [{'en': en_p, 'ru': cl_ru}] if en_p else []
                            meanings.append({
                                'partOfSpeech': 'verb',
                                'translation': cl_ru,
                                'examples': exs,
                                'register': ph_regs if ph_regs else None
                            })
                            
        # 3. Idioms (♦)
        if idiom_part:
            id_chunks = idiom_part.split(';')
            for ich in id_chunks:
                ich = ich.strip()
                if not ich:
                    continue
                cyr_idx = -1
                for i_c, ch in enumerate(ich):
                    if '\u0400' <= ch <= '\u04FF':
                        cyr_idx = i_c
                        break
                if cyr_idx > 0:
                    en_p = clean_en_example(ich[:cyr_idx])
                    ru_p = ich[cyr_idx:].strip()
                    cl_ru, id_regs = clean_text_and_extract_regs(ru_p)
                    if cl_ru and any('\u0400' <= c <= '\u04FF' for c in cl_ru):
                        exs = [{'en': en_p, 'ru': cl_ru}] if en_p else []
                        meanings.append({
                            'partOfSpeech': pos,
                            'translation': cl_ru,
                            'examples': exs,
                            'register': id_regs if id_regs else None
                        })
                else:
                    cl_ru, id_regs = clean_text_and_extract_regs(ich)
                    if cl_ru and any('\u0400' <= c <= '\u04FF' for c in cl_ru):
                        meanings.append({
                            'partOfSpeech': pos,
                            'translation': cl_ru,
                            'examples': [],
                            'register': id_regs if id_regs else None
                        })
                        
    res = []
    for idx, m in enumerate(meanings, start=1):
        clean_m = {
            'id': idx,
            'partOfSpeech': m['partOfSpeech'],
            'translation': m['translation'],
            'examples': m['examples']
        }
        if m.get('register'):
            clean_m['register'] = m['register']
        res.append(clean_m)
    return res
