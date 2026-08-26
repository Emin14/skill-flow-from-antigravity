# -*- coding: utf-8 -*-
"""
High-Precision Muller Article Parser.
Parses HTML/raw text of Muller 2021 dictionary articles into structured JSON meanings.
"""

import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

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
    'ветерин.': 'ветеринария', 'зоол., бот.': 'биология', 'поэт.': 'поэтическое', 'пренебр.': 'пренебрежительное'
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
    'и тому подобное': 'и т. п.', 'тому подобное': 'т. п.', 'чего-л.': 'чего-либо', 'кому-л.': 'кому-либо',
    'кем-л.': 'кем-либо', 'что-л.': 'что-либо', 'чём-л.': 'чём-либо', 'каким-л.': 'каким-либо',
    'какой-л.': 'какой-либо', 'где-л.': 'где-либо', 'куда-л.': 'куда-либо', 'откуда-л.': 'откуда-либо',
    'когда-л.': 'когда-либо', 'как-л.': 'как-либо', 'какого-л.': 'какого-либо'
}

def clean_text_and_extract_regs(text: str) -> tuple[str, list]:
    regs = []
    if not text:
        return '', regs
        
    t = text
    # Strip HTML tags
    t = re.sub(r'</?[a-zA-Z0-9]+>', ' ', t)
    
    # Strip grammar glosses e.g. (сравн. ст. от ...) or (превосх. ст. от ...) or (lent) or (lay; lain)
    t = re.sub(r'^\s*\((?:сравн\.|превосх\.|прош\.|прич\.|повелит\.|сокращ\.|уменьш\.)\s+ст\.[^\)]*\)\s*', '', t)
    t = re.sub(r'^\s*\([a-zA-Z\s,;]+\)\s*', '', t)
    
    # Extract registers
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
            
    # Clean orphan leading markers like "а) ", "б) ", "7) "
    t = re.sub(r'^[а-яa-z0-9]\)\s*', '', t)
    t = re.sub(r'^[0-9]{1,2}\)\s*', '', t)
    t = re.sub(r'\[сравните\s+также[^\]]+\]', '', t)
    t = re.sub(r'\[смотрите[^\]]+\]', '', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\ue000\xad\u200b\ufeff]', '', t)
    t = re.sub(r'\s+', ' ', t).strip(' ;,.-')
    
    # Fix broken parens e.g. "грубая) шутка" -> "(грубая) шутка" or strip
    if t.startswith(('грубая)', 'большая)', 'малая)', 'тяжёлая)')):
        t = '(' + t
    elif t.count(')') > t.count('('):
        if t.endswith(')'):
            t = t.rstrip(')')
        else:
            # Check if there is an unclosed paren at start
            first_cp = t.find(')')
            if first_cp > 0 and '(' not in t[:first_cp]:
                t = '(' + t
                
    if t.count('(') > t.count(')'):
        t += ')' * (t.count('(') - t.count(')'))
        
    return t.strip(' ;,.-'), regs

def expand_muller_tilde(text: str, headword: str) -> str:
    clean_hw = re.sub(r'\s+[I|V|X]+$', '', headword).strip()
    res = text.replace('~ed', clean_hw + 'ed')
    res = res.replace('~ing', clean_hw + 'ing')
    res = res.replace('~s', clean_hw + 's')
    res = res.replace('~d', clean_hw + 'd')
    res = res.replace('~', clean_hw)
    res = res.replace(' L.', f' {clean_hw.capitalize()}')
    res = res.replace('Our L.', f'Our {clean_hw.capitalize()}')
    return res

def parse_muller_article_body(headword: str, body: str) -> list[dict]:
    body_exp = expand_muller_tilde(body, headword)
    clean_hw = re.sub(r'\s+[I|V|X]+$', '', headword).strip().lower()
    
    # Split into POS sections: e.g. "1. <i>v</i> ... 2. <i>n</i> ..." or "<i>n</i> ..."
    # Look for patterns like (?:^|\s)([1-9]\.)?\s*<i>([a-z]+)</i>
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
        # Split section into Main, Phrasal (¬), and Idioms (♦)
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
                
        # 1. Parse Main Part (split on numbered meanings "1) ", "2) ", etc.)
        num_chunks = re.split(r'(?:^|\s)[0-9]{1,2}\)\s*', main_part)
        for chunk in num_chunks:
            chunk = chunk.strip()
            if not chunk:
                continue
            # If chunk has sub-enumerations like "а) ...; б) ...; в) ..."
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
                # Check for examples inside chunk
                # English examples start with English words e.g. "to ...", "a ...", "the ...", etc.
                parts = chunk.split(';')
                def_parts = []
                ex_list = []
                for p in parts:
                    p = p.strip()
                    if not p:
                        continue
                    # Check if p is an example (English followed by Russian)
                    # Find boundary
                    cyr_idx = -1
                    for i_c, ch in enumerate(p):
                        if '\u0400' <= ch <= '\u04FF':
                            cyr_idx = i_c
                            break
                    if cyr_idx > 2 and all(ord(c) < 128 or c in '’\'—– ' for c in p[:cyr_idx].strip()):
                        en_p = p[:cyr_idx].strip(' ;,-(')
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
                    
        # 2. Parse Phrasal Part (split on "; " or "¬")
        if phrasal_part:
            ph_chunks = re.split(r';\s*(?=[a-zA-Z~])|;\s*~', phrasal_part)
            for pch in ph_chunks:
                pch = pch.strip(' ;,-')
                if not pch:
                    continue
                # Split sub-enumerations "а) ...; б) ..."
                if re.search(r'(?:^|\s)[а-яa-z]\)\s*', pch):
                    base_ph = pch.split('а)')[0].strip()
                    sub_pchs = re.split(r';?\s*(?:^|\s)[а-яa-z]\)\s*', pch[len(base_ph):])
                    for spch in sub_pchs:
                        spch = spch.strip()
                        if spch:
                            cl_spch, sp_regs = clean_text_and_extract_regs(spch)
                            if cl_spch and any('\u0400' <= c <= '\u04FF' for c in cl_spch):
                                en_verb = base_ph if base_ph else clean_hw
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
                        en_p = pch[:cyr_idx].strip(' ;,-(')
                        ru_p = pch[cyr_idx:].strip()
                        cl_ru, ph_regs = clean_text_and_extract_regs(ru_p)
                        if cl_ru and any('\u0400' <= c <= '\u04FF' for c in cl_ru):
                            meanings.append({
                                'partOfSpeech': 'verb',
                                'translation': cl_ru,
                                'examples': [{'en': en_p, 'ru': cl_ru}],
                                'register': ph_regs if ph_regs else None
                            })
                            
        # 3. Parse Idiom Part (split on "; ")
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
                    en_p = ich[:cyr_idx].strip(' ;,-(')
                    ru_p = ich[cyr_idx:].strip()
                    cl_ru, id_regs = clean_text_and_extract_regs(ru_p)
                    if cl_ru and any('\u0400' <= c <= '\u04FF' for c in cl_ru):
                        meanings.append({
                            'partOfSpeech': pos,
                            'translation': cl_ru,
                            'examples': [{'en': en_p, 'ru': cl_ru}],
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
                        
    # Assign sequential IDs
    res = []
    for idx, m in enumerate(meanings, start=1):
        m['id'] = idx
        res.append(m)
    return res

test_words = ['push', 'lady', 'reckon', 'long', 'lend', 'lie', 'joke', 'latter']

with open('tmp/muller_rebuild/articles.json', 'r', encoding='utf-8') as f:
    muller_data = json.load(f)

muller_dict = {}
for art in muller_data:
    hw = art['headword']
    base = re.sub(r'\s+[I|V|X]+$', '', hw).strip().lower()
    if base not in muller_dict:
        muller_dict[base] = []
    muller_dict[base].append(art)

for tw in test_words:
    print(f"\n{'='*30} PARSED MULLER ARTICLE FOR: {tw} {'='*30}")
    arts = muller_dict.get(tw, [])
    all_parsed = []
    for a in arts:
        all_parsed.extend(parse_muller_article_body(a['headword'], a['body']))
    for idx, m in enumerate(all_parsed, start=1):
        reg = f" | reg: {m['register']}" if m.get('register') else ""
        print(f"  [{idx}] ({m['partOfSpeech']}): {repr(m['translation'])}{reg}")
        if m.get('examples'):
            for ex in m['examples']:
                print(f"       ex: en={repr(ex['en'])}, ru={repr(ex['ru'])}")
