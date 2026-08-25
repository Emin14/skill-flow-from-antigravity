# -*- coding: utf-8 -*-
import os
import sys
import json
import re
import random
import unicodedata
import csv
import time
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

print("=== 1. Loading Oxford 5000 & CLD ===")
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_raw = json.load(f)

with open('cld_english_russian.json', 'r', encoding='utf-8') as f:
    cld_raw = json.load(f)

cld_index = {}
for item in cld_raw:
    w = item.get('word', '').strip().lower()
    w_clean = re.sub(r'[^a-z\- ]', '', w).strip()
    if w_clean:
        if w_clean not in cld_index:
            cld_index[w_clean] = []
        cld_index[w_clean].append(item)

print(f"Loaded Oxford 5000: {len(oxford_raw)} words, CLD: {len(cld_index)} words.")

print("=== 2. Indexing All 5 PDF Dictionaries ===")
pdf_configs = {
    'sam': {
        'name': 'SamPolnAnglRysSlovar',
        'path': 'SamPolnAnglRysSlovar.pdf',
        'start_p': 10, 'end_p': 509, 'font': r'PragmaticaBoldA-Reg|Pragmatica-Bold', 'top_m': 35, 'min_size': 7.5
    },
    'muller_a4': {
        'name': 'Мюллер (2021 a4)',
        'path': 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf',
        'start_p': 12, 'end_p': 958, 'font': r'PragmaticaC-Bold', 'top_m': 40, 'min_size': 7.5
    },
    'muller_300k': {
        'name': 'Мюллер (300 000)',
        'path': 'Мюллер_В_К_Полный_англо_русский_русско_английский_словарь_300000.pdf',
        'start_p': 11, 'end_p': 912, 'font': r'KudrashovC-Bold', 'top_m': 35, 'min_size': 7.5
    },
    'muller_ast': {
        'name': 'Мюллер (АСТ 2021)',
        'path': 'Мюллер В. К. - Полный англо-русский русско-английский словарь - (Полный курс (АСТ)) - 2021.pdf',
        'start_p': 7, 'end_p': 177, 'font': r'OfficinaSerifITC-Bold', 'top_m': 40, 'min_size': 8.0
    },
    'shkolnik': {
        'name': 'Словарь для школьников',
        'path': 'Новый_англо_русский_и_русско_английский_словарь_для_школьников_Свыше.pdf',
        'start_p': 8, 'end_p': 280, 'font': r'PragmaticaC-Bold', 'top_m': 40, 'min_size': 8.0
    }
}

pdf_indices = {}
for key, cfg in pdf_configs.items():
    t0 = time.time()
    doc = pymupdf.open(cfg['path'])
    entries = {}
    current_hw = None
    current_text = []
    
    for p in range(cfg['start_p'], cfg['end_p'] + 1):
        page = doc[p]
        d = page.get_text('dict')
        page_h = page.rect.height
        for b in d['blocks']:
            if 'lines' not in b: continue
            for l in b['lines']:
                y0, y1 = l['bbox'][1], l['bbox'][3]
                if y0 < cfg['top_m'] or y1 > page_h - 25: continue
                line_text = ''.join(s['text'] for s in l['spans']).strip()
                if not l['spans'] or not line_text: continue
                first_span = l['spans'][0]
                is_bold = bool(re.search(cfg['font'], first_span['font'], re.I)) and first_span['size'] >= cfg['min_size']
                txt = first_span['text'].strip()
                if is_bold and re.match(r'^[a-zA-Z][a-zA-Z\s\-\.]*(\s+[I|V|X]+|\s+\d+)?$', txt):
                    if current_hw and current_text:
                        hw_base = re.sub(r'(\s+[ivx]+|\s+\d+)$', '', current_hw.lower().strip())
                        if hw_base not in entries: entries[hw_base] = []
                        entries[hw_base].append(' '.join(current_text))
                    current_hw = txt
                    current_text = [line_text]
                else:
                    if current_hw: current_text.append(line_text)
                    
    if current_hw and current_text:
        hw_base = re.sub(r'(\s+[ivx]+|\s+\d+)$', '', current_hw.lower().strip())
        if hw_base not in entries: entries[hw_base] = []
        entries[hw_base].append(' '.join(current_text))
    doc.close()
    pdf_indices[key] = entries
    print(f"Indexed {cfg['name']}: {len(entries)} entries in {time.time()-t0:.2f}s")

print("=== 3. Cleaning & Parsing Functions ===")

def clean_syllables_safe(text):
    text = re.sub(r'([а-яёА-ЯЁ]{1,4})\s+([а-яё]{1,4}\b)', r'\1\2', text)
    text = re.sub(r'([а-яёА-ЯЁ]{1,4})\s+([а-яё]{1,4}\b)', r'\1\2', text)
    text = re.sub(r'([а-яёА-ЯЁ]{1,4})\s+([а-яё]{1,4}\b)', r'\1\2', text)
    return text

def clean_ru(text):
    text = unicodedata.normalize('NFKD', text)
    text = re.sub(r'[\x01-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', text)
    text = text.replace('ﬂ', 'fl').replace('ﬁ', 'fi').replace('ﬃ', 'ffi').replace('ﬀ', 'ff')
    text = re.sub(r'([а-яёА-ЯЁ])\?([а-яёА-ЯЁ]*)', r'\1\2', text)
    text = re.sub(r'([а-яёА-ЯЁa-zA-Z])\-\s+([а-яёА-ЯЁa-zA-Z])', r'\1\2', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_pdf_data(raw_entries, is_muller_300k=False):
    if not raw_entries:
        return []
    combined = clean_ru(' || '.join(raw_entries))
    combined = re.sub(r'\[[^\]]*\]', '', combined)
    combined = re.sub(r'\bsyn\.\s+[^;.\)]+', '', combined, flags=re.I)
    
    raw_senses = re.split(r'(?:(?<=[;.\s])(?:\d+\)|\d+\.|\b\d+\b)\s*|\b[I|V|X]+\b|\b\d+\s+(?:n|v|adj|adv|a)\b)', combined)
    senses = []
    for rs in raw_senses:
        rs_no_en = re.sub(r'\b(?:to|in|at|on|for|with|by|of|a|an|the)\s+[a-zA-Z\s\']+', '', rs)
        ru_matches = re.findall(r'[а-яёА-ЯЁ\s\,\;\-\(\)\/]{2,}', rs_no_en)
        for rm in ru_matches:
            rm_clean = re.sub(r'\b(?:разг|спорт|мед|юр|уст|грам|мор|тех|бот|биол|амер|брит|pl|тж|преим|особ|букв|перен|воен|ав|см|редк)\b\.?', '', rm, flags=re.I)
            parts = [p.strip() for p in re.split(r'[\;\n]', rm_clean) if p.strip()]
            for p in parts:
                p_clean = clean_syllables_safe(p) if is_muller_300k else p
                p_trim = re.sub(r'^[,\s\-\(\)\.]+|[,\s\-\(\)\.]+$', '', p_clean)
                if len(p_trim) >= 2 and p_trim not in senses and not re.match(r'^[ivx0-9\s]+$', p_trim, re.I):
                    if re.search(r'[а-яёА-ЯЁ]', p_trim):
                        senses.append(p_trim)
    return senses[:6]

def extract_cld_data(word_str):
    entries = cld_index.get(word_str.lower(), [])
    senses = []
    for ce in entries:
        for s in ce.get('senses', []):
            tr = clean_ru(s.get('translation_ru', '')).strip()
            if tr and tr not in senses:
                senses.append(tr)
    return senses[:6]

def extract_oxford_data(word_obj):
    senses = []
    for m in word_obj.get('meanings', []):
        tr = clean_ru(m.get('translation', '')).strip()
        if tr and tr not in senses:
            senses.append(tr)
    return senses[:6]

def get_russian_stems(text):
    text_clean = clean_ru(text).lower()
    text_clean = clean_syllables_safe(text_clean)
    text_clean = re.sub(r'\([^)]*\)', '', text_clean)
    words = re.findall(r'[а-яё]{3,}', text_clean)
    stems = set()
    for w in words:
        w_stem = re.sub(r'(?:ами|ями|ов|ев|ей|ия|ие|ий|ый|ая|ое|ые|ую|яя|ее|ть|ся|ти|ет|ут|ят|ил|ал|ла|ли|ом|ем|ам|ям|ах|ях|ы|и|а|у|е|о)$', '', w)
        if len(w_stem) >= 3: stems.add(w_stem)
        else: stems.add(w)
    return stems

def meanings_match(ox_text, ref_text):
    stems_ox = get_russian_stems(ox_text)
    stems_ref = get_russian_stems(ref_text)
    if not stems_ox or not stems_ref: return False
    if stems_ox.intersection(stems_ref): return True
    words_ox = set(re.findall(r'[а-яё]{2,}', clean_syllables_safe(clean_ru(ox_text)).lower()))
    words_ref = set(re.findall(r'[а-яё]{2,}', clean_syllables_safe(clean_ru(ref_text)).lower()))
    return bool(words_ox.intersection(words_ref))

print("=== 4. Advanced Coincidence Scoring Logic ===")

def calculate_coincidence_score(dict_meanings, ideal_meanings):
    if not dict_meanings:
        return 0.0, "Отсутствует в словаре", 0
    
    if not ideal_meanings:
        return 50.0, "Базовое значение", 0
        
    num_ideal = len(ideal_meanings)
    i1 = ideal_meanings[0]
    d1 = dict_meanings[0]
    
    w1_score = 0.0
    d1_matches_i1 = meanings_match(d1, i1)
    d1_matches_any_ideal = any(meanings_match(d1, im) for im in ideal_meanings)
    
    i1_pos_in_dict = -1
    for idx_d, dm in enumerate(dict_meanings):
        if meanings_match(dm, i1):
            i1_pos_in_dict = idx_d
            break
            
    if d1_matches_i1:
        w1_score = 45.0
    elif d1_matches_any_ideal:
        w1_score = 25.0
        if i1_pos_in_dict == 1:
            w1_score += 15.0
        elif i1_pos_in_dict > 1:
            w1_score += 10.0
    elif i1_pos_in_dict == 1:
        w1_score = 22.0
    elif i1_pos_in_dict > 1:
        w1_score = 15.0
    else:
        w1_score = 5.0 if d1_matches_any_ideal else 0.0
        
    matched_ideals = set()
    for im in ideal_meanings:
        for dm in dict_meanings:
            if meanings_match(dm, im):
                matched_ideals.add(im)
                break
                
    coverage_ratio = len(matched_ideals) / num_ideal
    w2_score = 40.0 * coverage_ratio
    
    w3_score = 0.0
    if len(dict_meanings) <= num_ideal + 1 and coverage_ratio >= 0.8:
        w3_score += 8.0
    elif len(dict_meanings) <= num_ideal + 3:
        w3_score += 4.0
        
    if d1_matches_i1 and coverage_ratio >= 0.8:
        w3_score += 7.0
    elif coverage_ratio == 1.0:
        w3_score += 5.0
    else:
        w3_score += 2.0
        
    total_coincidence = round(min(100.0, max(0.0, w1_score + w2_score + w3_score)), 1)
    
    if total_coincidence >= 90.0:
        status = "Идеальное совпадение"
    elif total_coincidence >= 75.0:
        status = "Высокое совпадение"
    elif total_coincidence >= 55.0:
        status = "Хорошее совпадение"
    elif total_coincidence >= 35.0:
        status = "Частичное совпадение"
    else:
        status = "Низкое совпадение"
        
    return total_coincidence, status, len(matched_ideals)

print("=== 5. Running 1,000-Word Evaluation & Building Updated JSON ===")

random.seed(42)
valid_oxford = [w for w in oxford_raw if w.get('word') and re.match(r'^[a-zA-Z][a-zA-Z\s\-]*$', w['word'])]
sampled_1000 = random.sample(valid_oxford, 1000)

results = []
dict_scores_sum = {
    'oxford_5000': 0.0,
    'cld': 0.0,
    'sam': 0.0,
    'muller_a4': 0.0,
    'muller_300k': 0.0,
    'shkolnik': 0.0,
    'muller_ast': 0.0
}

for idx, word_obj in enumerate(sampled_1000):
    word = word_obj['word'].strip().lower()
    pos_list = [m.get('partOfSpeech', '') for m in word_obj.get('meanings', []) if m.get('partOfSpeech')]
    pos_str = ', '.join(sorted(list(set(pos_list)))) if pos_list else 'general'
    
    ox_data = extract_oxford_data(word_obj)
    cld_data = extract_cld_data(word)
    sam_data = extract_pdf_data(pdf_indices['sam'].get(word, []))
    muller_a4_data = extract_pdf_data(pdf_indices['muller_a4'].get(word, []))
    muller_300k_data = extract_pdf_data(pdf_indices['muller_300k'].get(word, []), is_muller_300k=True)
    muller_ast_data = extract_pdf_data(pdf_indices['muller_ast'].get(word, []))
    shkolnik_data = extract_pdf_data(pdf_indices['shkolnik'].get(word, []))
    
    ideal_list = []
    if cld_data:
        ideal_list.append(cld_data[0])
    elif ox_data:
        ideal_list.append(ox_data[0])
        
    for d_src in [cld_data[1:3], ox_data[1:3], sam_data[:2]]:
        for item in d_src:
            if item and not any(meanings_match(item, ex) for ex in ideal_list):
                if not any(om in item.lower() for om in ['уст', 'архаич', 'спец', 'диал', 'редк', 'устар', 'бот', 'зоол']):
                    if len(ideal_list) < 4:
                        ideal_list.append(item)
                        
    ox_score, ox_stat, ox_cnt = calculate_coincidence_score(ox_data, ideal_list)
    cld_score, cld_stat, cld_cnt = calculate_coincidence_score(cld_data, ideal_list)
    sam_score, sam_stat, sam_cnt = calculate_coincidence_score(sam_data, ideal_list)
    muller_a4_score, muller_a4_stat, muller_a4_cnt = calculate_coincidence_score(muller_a4_data, ideal_list)
    muller_300k_score, muller_300k_stat, muller_300k_cnt = calculate_coincidence_score(muller_300k_data, ideal_list)
    muller_ast_score, muller_ast_stat, muller_ast_cnt = calculate_coincidence_score(muller_ast_data, ideal_list)
    shkolnik_score, shkolnik_stat, shkolnik_cnt = calculate_coincidence_score(shkolnik_data, ideal_list)
    
    dict_scores_sum['oxford_5000'] += ox_score
    dict_scores_sum['cld'] += cld_score
    dict_scores_sum['sam'] += sam_score
    dict_scores_sum['muller_a4'] += muller_a4_score
    dict_scores_sum['muller_300k'] += muller_300k_score
    dict_scores_sum['shkolnik'] += shkolnik_score
    dict_scores_sum['muller_ast'] += muller_ast_score
    
    entry = {
        "id": idx + 1,
        "word": word,
        "pos": pos_str,
        "ideal_meanings": ideal_list,
        "oxford_5000": {
            "data": ox_data,
            "coincidence": ox_score,
            "status": ox_stat,
            "matched_ideal_count": ox_cnt
        },
        "cld": {
            "data": cld_data,
            "coincidence": cld_score,
            "status": cld_stat,
            "matched_ideal_count": cld_cnt
        },
        "sam": {
            "data": sam_data,
            "coincidence": sam_score,
            "status": sam_stat,
            "matched_ideal_count": sam_cnt
        },
        "muller_a4": {
            "data": muller_a4_data,
            "coincidence": muller_a4_score,
            "status": muller_a4_stat,
            "matched_ideal_count": muller_a4_cnt
        },
        "muller_300k": {
            "data": muller_300k_data,
            "coincidence": muller_300k_score,
            "status": muller_300k_stat,
            "matched_ideal_count": muller_300k_cnt
        },
        "shkolnik": {
            "data": shkolnik_data,
            "coincidence": shkolnik_score,
            "status": shkolnik_stat,
            "matched_ideal_count": shkolnik_cnt
        },
        "muller_ast": {
            "data": muller_ast_data,
            "coincidence": muller_ast_score,
            "status": muller_ast_stat,
            "matched_ideal_count": muller_ast_cnt
        }
    }
    results.append(entry)

print(f"Processed all {len(results)} words.")

# Save Updated JSON
with open('primary_evaluation_1000.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Successfully saved updated primary_evaluation_1000.json!")

# Save Updated CSV
with open('primary_evaluation_1000.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([
        'ID', 'Word', 'POS', 'Ideal Meanings',
        'Oxford Data', 'Oxford Coincidence (%)', 'Oxford Status',
        'CLD Data', 'CLD Coincidence (%)', 'CLD Status',
        'Sam Data', 'Sam Coincidence (%)', 'Sam Status',
        'Muller A4 Data', 'Muller A4 Coincidence (%)', 'Muller A4 Status',
        'Muller 300k Data', 'Muller 300k Coincidence (%)', 'Muller 300k Status',
        'Shkolnik Data', 'Shkolnik Coincidence (%)', 'Shkolnik Status',
        'Muller AST Data', 'Muller AST Coincidence (%)', 'Muller AST Status'
    ])
    for r in results:
        writer.writerow([
            r['id'], r['word'], r['pos'], ' | '.join(r['ideal_meanings']),
            ' | '.join(r['oxford_5000']['data']), r['oxford_5000']['coincidence'], r['oxford_5000']['status'],
            ' | '.join(r['cld']['data']), r['cld']['coincidence'], r['cld']['status'],
            ' | '.join(r['sam']['data']), r['sam']['coincidence'], r['sam']['status'],
            ' | '.join(r['muller_a4']['data']), r['muller_a4']['coincidence'], r['muller_a4']['status'],
            ' | '.join(r['muller_300k']['data']), r['muller_300k']['coincidence'], r['muller_300k']['status'],
            ' | '.join(r['shkolnik']['data']), r['shkolnik']['coincidence'], r['shkolnik']['status'],
            ' | '.join(r['muller_ast']['data']), r['muller_ast']['coincidence'], r['muller_ast']['status'],
        ])
print("Successfully saved updated primary_evaluation_1000.csv!")

print("\n==========================================================================")
print("             ИТОГОВЫЙ СРЕДНИЙ ПРОЦЕНТ СОВПАДЕНИЯ (COINCIDENCE %)")
print("==========================================================================")
dict_display_names = {
    'oxford_5000': 'Oxford 5000 (Текущий в JSON)',
    'sam': 'SamPolnAnglRysSlovar (Самый полный)',
    'cld': 'Cambridge Learner (CLD)',
    'muller_a4': 'Мюллер В.К. и др. (2021 A4 Просвещение)',
    'muller_300k': 'Мюллер В.К. (300 000 слов)',
    'shkolnik': 'Новый словарь для школьников',
    'muller_ast': 'Мюллер В.К. (АСТ 2021)'
}

for k, dname in sorted(dict_display_names.items(), key=lambda x: dict_scores_sum[x[0]], reverse=True):
    avg_coin = dict_scores_sum[k] / len(results)
    print(f"- {dname}: {avg_coin:.2f}%")

