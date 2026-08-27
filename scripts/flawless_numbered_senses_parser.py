# -*- coding: utf-8 -*-
"""
Flawless OCR Glue & Register Extractor.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

REGISTER_LIST = [
    ('разг.', 'разговорное'),
    ('прост.', 'просторечное'),
    ('книжн.', 'книжное'),
    ('поэт.', 'поэтическое'),
    ('посл.', 'пословица'),
    ('уст.', 'устаревшее'),
    ('редк.', 'редкое'),
    ('перен.', 'переносное'),
    ('шутл.', 'шутливое'),
    ('ирон.', 'ироническое'),
    ('сл.', 'сленг'),
    ('амер.', 'американизм'),
    ('брит.', 'британское'),
    ('тех.', 'техническое'),
    ('воен.', 'военное'),
    ('мор.', 'морской термин'),
    ('юр.', 'юридическое'),
    ('мед.', 'медицинское'),
    ('биол.', 'биологическое'),
    ('бот.', 'ботаника'),
    ('зоол.', 'зоология'),
    ('анат.', 'анатомия'),
    ('эл.', 'электротехника'),
    ('вчт.', 'вычислительная техника'),
    ('мат.', 'математика'),
    ('физ.', 'физика'),
    ('хим.', 'химия'),
    ('геол.', 'геология'),
    ('экон.', 'экономика'),
    ('фин.', 'финансы'),
    ('комм.', 'коммерческое'),
    ('ком.', 'коммерческое'),
    ('ав.', 'авиация'),
    ('радио', 'радио'),
    ('муз.', 'музыка'),
    ('спорт.', 'спортивное'),
    ('кул.', 'кулинария'),
    ('архит.', 'архитектура'),
    ('грам.', 'грамматика'),
    ('лингв.', 'лингвистика'),
    ('церк.', 'церковное'),
    ('фото', 'фотография'),
    ('бухг.', 'бухгалтерия'),
    ('театр.', 'театр')
]

def clean_ocr(t):
    if not t: return ""
    # Glue hyphenated word across lines (handles -, \xad, \u00ad, ≅)
    t = re.sub(r'([А-Яа-яёЁA-Za-z])[\-\xad\u00ad≅]\s*([а-яёЁa-z])', r'\1\2', t)
    t = t.replace('≅', '').replace('\xad', '').replace('\u00ad', '').replace('\ue000', '')
    t = re.sub(r'\.\s+\.\s+\.', '...', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def expand_tilde(text, base_word):
    stem = re.sub(r'[1-9]$', '', base_word).strip()
    y_stem = stem[:-1] if stem.endswith('y') and len(stem) > 1 and stem[-2] not in 'aeiou' else stem
    e_stem = stem[:-1] if stem.endswith('e') else stem
    replacements = [
        ('~est', stem + 'est'),
        ('~er', stem + 'er'),
        ('~ies', y_stem + 'ies'),
        ('~ied', y_stem + 'ied'),
        ('~ing', e_stem + 'ing'),
        ('~ed', e_stem + 'ed'),
        ('~d', e_stem + 'd'),
        ('~s', y_stem + 'ies' if stem.endswith('y') and len(stem) > 1 and stem[-2] not in 'aeiou' else stem + 's'),
        ("~'s", stem + "'s"),
        ('~', stem),
    ]
    for pattern, repl in replacements:
        text = text.replace(pattern, repl)
    return text

def parse_single_numbered_section(text, base_word, default_pos):
    text = clean_ocr(text)
    sense_splits = list(re.finditer(r'(?:^|\s)(\d+)\)\s*', text))
    if not sense_splits:
        return [parse_raw_meaning_content(text, base_word, default_pos, 1)]
        
    meanings = []
    for i, match in enumerate(sense_splits):
        start_idx = match.end()
        end_idx = sense_splits[i+1].start() if i + 1 < len(sense_splits) else len(text)
        chunk = text[start_idx:end_idx].strip(' ;,')
        
        m_entry = parse_raw_meaning_content(chunk, base_word, default_pos, len(meanings) + 1)
        meanings.append(m_entry)
        
    return meanings

def parse_raw_meaning_content(chunk, base_word, default_pos, sense_id):
    regs = []
    # Strip leading POS if present
    chunk = re.sub(r'^(?:n|v|vi|vt|a|adj|adv|prep|cj|conj|int|pron|num)\b\s*', '', chunk)
    
    # Extract register strictly from start with exact token match
    for reg_abbr, reg_name in REGISTER_LIST:
        if reg_abbr == 'радио' or reg_abbr == 'фото':
            pat = rf'^{reg_abbr}\b\s*'
        else:
            pat = rf'^{re.escape(reg_abbr)}\s*'
            
        if re.match(pat, chunk):
            if reg_name not in regs:
                regs.append(reg_name)
            chunk = re.sub(pat, '', chunk).strip(' ;,')
            
    items = [x.strip() for x in chunk.split(';') if x.strip()]
    main_def = items[0] if items else ""
    examples = []
    
    m_emb = re.search(r'([~a-zA-Z\s\-\'\,\.\!\?]+?)\s+([а-яА-Я].*)$', main_def)
    if m_emb and not main_def.startswith('('):
        en_cand = m_emb.group(1).strip()
        ru_cand = m_emb.group(2).strip()
        if '~' in en_cand or re.search(r'\b[a-zA-Z]{3,}\b', en_cand):
            def_part = main_def[:m_emb.start()].strip(' ;,')
            if def_part:
                main_def = def_part
                examples.append({
                    'en': expand_tilde(en_cand, base_word),
                    'ru': ru_cand
                })
                
    for it in items[1:]:
        m_ex = re.match(r'^([~a-zA-Z\s\-\'\,\.\!\?]+?)\s+([а-яА-Я].*)$', it)
        if m_ex:
            en_p = m_ex.group(1).strip()
            ru_p = m_ex.group(2).strip()
            ex_regs = []
            for reg_abbr, reg_name in REGISTER_LIST:
                if reg_abbr in ['радио', 'фото']:
                    pat = rf'^{reg_abbr}\b\s*'
                else:
                    pat = rf'^{re.escape(reg_abbr)}\s*'
                if re.match(pat, ru_p):
                    ex_regs.append(reg_name)
                    ru_p = re.sub(pat, '', ru_p).strip(' ;,')
            ex_obj = {
                'en': expand_tilde(en_p, base_word),
                'ru': ru_p
            }
            if ex_regs:
                ex_obj['register'] = ex_regs
            examples.append(ex_obj)
        else:
            main_def += "; " + it
            
    # Clean leading dots, semicolons, hyphens
    main_def = re.sub(r'^[.;,\-\s]+', '', main_def).strip()
    main_def = re.sub(r'[.;,\-\s]+$', '', main_def).strip()
    
    return {
        'id': sense_id,
        'partOfSpeech': default_pos,
        'translation': main_def,
        'examples': examples,
        'register': regs
    }

for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
    if not raw_text:
        continue
        
    if w in ['about', 'round', 'act', 'out', 'air', 'ice']:
        continue
        
    pre_diamond = raw_text.split('♦')[0] if '♦' in raw_text else raw_text
    nums_in_raw = [int(n) for n in re.findall(r'\b(\d+)\)', pre_diamond)]
    
    if nums_in_raw and max(nums_in_raw) > len(item['meanings']) and len(item['meanings']) == 1:
        pos = item['meanings'][0]['partOfSpeech']
        new_meanings = parse_single_numbered_section(pre_diamond, w, pos)
        if len(new_meanings) > 1:
            item['meanings'] = new_meanings

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Flawless OCR Glue & Register Extractor executed successfully!")
