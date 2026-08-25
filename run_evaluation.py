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

print('=== 1. Loading Oxford 5000 and CLD ===')
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

print('Oxford 5000: ' + str(len(oxford_raw)) + ' words')
print('CLD: ' + str(len(cld_index)) + ' entries')

print('=== 2. Indexing 5 PDF Dictionaries ===')
pdf_configs = {
    'muller_ast': {
        'name': 'Мюллер (АСТ 2021)',
        'path': 'Мюллер В. К. - Полный англо-русский русско-английский словарь - (Полный курс (АСТ)) - 2021.pdf',
        'start_p': 7, 'end_p': 177, 'font': r'OfficinaSerifITC-Bold', 'top_m': 40, 'min_size': 8.0
    },
    'shkolnik': {
        'name': 'Словарь для школьников',
        'path': 'Новый_англо_русский_и_русско_английский_словарь_для_школьников_Свыше.pdf',
        'start_p': 8, 'end_p': 280, 'font': r'PragmaticaC-Bold', 'top_m': 40, 'min_size': 8.0
    },
    'sam': {
        'name': 'SamPolnAnglRysSlovar',
        'path': 'SamPolnAnglRysSlovar.pdf',
        'start_p': 10, 'end_p': 509, 'font': r'PragmaticaBoldA-Reg|Pragmatica-Bold', 'top_m': 35, 'min_size': 7.5
    },
    'muller_300k': {
        'name': 'Мюллер (300 000)',
        'path': 'Мюллер_В_К_Полный_англо_русский_русско_английский_словарь_300000.pdf',
        'start_p': 11, 'end_p': 912, 'font': r'KudrashovC-Bold', 'top_m': 35, 'min_size': 7.5
    },
    'muller_a4': {
        'name': 'Мюллер и др. (2021 a4)',
        'path': 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf',
        'start_p': 12, 'end_p': 958, 'font': r'PragmaticaC-Bold', 'top_m': 40, 'min_size': 7.5
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
            if 'lines' not in b:
                continue
            for l in b['lines']:
                y0 = l['bbox'][1]
                y1 = l['bbox'][3]
                if y0 < cfg['top_m'] or y1 > page_h - 25:
                    continue
                line_text = ''.join(s['text'] for s in l['spans']).strip()
                if not l['spans'] or not line_text:
                    continue
                first_span = l['spans'][0]
                is_bold = bool(re.search(cfg['font'], first_span['font'], re.I)) and first_span['size'] >= cfg['min_size']
                txt = first_span['text'].strip()
                
                # Check for headword
                if is_bold and re.match(r'^[a-zA-Z][a-zA-Z\s\-\.]*(\s+[I|V|X]+|\s+\d+)?$', txt):
                    if current_hw and current_text:
                        hw_base = re.sub(r'(\s+[ivx]+|\s+\d+)$', '', current_hw.lower().strip())
                        if hw_base not in entries:
                            entries[hw_base] = []
                        entries[hw_base].append(' '.join(current_text))
                    current_hw = txt
                    current_text = [line_text]
                else:
                    if current_hw:
                        current_text.append(line_text)
                        
    if current_hw and current_text:
        hw_base = re.sub(r'(\s+[ivx]+|\s+\d+)$', '', current_hw.lower().strip())
        if hw_base not in entries:
            entries[hw_base] = []
        entries[hw_base].append(' '.join(current_text))
    doc.close()
    pdf_indices[key] = entries
    print('Indexed %s: %d words in %.2fs' % (cfg['name'], len(entries), time.time()-t0))

print('=== 3. Meaning Extraction & Evaluation Pipeline ===')

def clean_ru_text(text):
    text = unicodedata.normalize('NFKD', text)
    text = re.sub(r'[---­﻿]', '', text)
    text = text.replace('ﬂ', 'fl').replace('ﬁ', 'fi').replace('ﬃ', 'ffi').replace('ﬀ', 'ff')
    text = re.sub(r'([а-яёА-ЯЁ])\?([а-яёА-ЯЁ]*)', r'', text)
    text = re.sub(r'([а-яёА-ЯЁa-zA-Z])\-\s+([а-яёА-ЯЁa-zA-Z])', r'', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_meanings_from_pdf(raw_entries, target_pos_list=None):
    if not raw_entries:
        return []
    
    combined_text = ' || '.join(raw_entries)
    combined_text = clean_ru_text(combined_text)
    text_clean = re.sub(r'\[[^\]]*\]', '', combined_text)
    text_clean = re.sub(r'syn\.\s+[^;.\)]+', '', text_clean, flags=re.I)
    
    senses = []
    raw_senses = re.split(r'(?:(?<=[;.\s])(?:\d+\)|\d+\.|\d+)\s*|[I|V|X]+|\d+\s+(?:n|v|adj|adv|a))', text_clean)
    
    for rs in raw_senses:
        rs_no_en = re.sub(r'(?:to|in|at|on|for|with|by|of|a|an|the)\s+[a-zA-Z\s']+', '', rs)
        ru_matches = re.findall(r'[а-яёА-ЯЁ\s\,\;\-\(\)\/]{2,}', rs_no_en)
        for rm in ru_matches:
            rm_clean = re.sub(r'(?:разг|спорт|мед|юр|уст|грам|мор|тех|бот|биол|амер|брит|pl|тж|преим|особ|букв|перен|воен|ав|см|редк)\.?', '', rm, flags=re.I)
            parts = [p.strip() for p in re.split(r'[\;
]', rm_clean) if p.strip()]
            for p in parts:
                p_trim = re.sub(r'^[,\s\-\(\)\.]+|[,\s\-\(\)\.]+$', '', p)
                if len(p_trim) >= 2 and p_trim not in senses and not re.match(r'^[ivx0-9\s]+$', p_trim, re.I):
                    if re.search(r'[а-яёА-ЯЁ]', p_trim):
                        senses.append(p_trim)
    return senses

def get_cld_meanings(word_str):
    entries = cld_index.get(word_str.lower(), [])
    senses = []
    for ce in entries:
        for s in ce.get('senses', []):
            tr = s.get('translation_ru', '').strip()
            if tr and tr not in senses:
                senses.append(tr)
    return senses

def get_oxford_meanings(ox_entry):
    senses = []
    for m in ox_entry.get('meanings', []):
        tr = m.get('translation', '').strip()
        if tr and tr not in senses:
            senses.append(tr)
    return senses

def evaluate_order_and_quality(word, pos_info, extracted_meanings, cld_meanings, ox_meanings):
    if not extracted_meanings:
        return 0.0, 'Отсутствует в словаре', []
    
    top_meanings = extracted_meanings[:6]
    
    reference_pool = []
    if cld_meanings:
        reference_pool.extend(cld_meanings[:3])
    if ox_meanings:
        reference_pool.extend(ox_meanings[:3])
    
    ref_text = ' '.join(reference_pool).lower()
    
    m1 = top_meanings[0].lower() if top_meanings else ''
    m1_score = 0.0
    
    obscure_markers = ['уст', 'архаич', 'спец', 'диал', 'редк', 'устар', 'бот', 'зоол', 'всадник', 'рыцарь']
    has_obscure = any(om in m1 for om in obscure_markers)
    
    m1_tokens = set(re.findall(r'[а-яё]{3,}', m1))
    ref_tokens = set(re.findall(r'[а-яё]{3,}', ref_text))
    
    overlap = m1_tokens.intersection(ref_tokens)
    
    if overlap and not has_obscure:
        m1_score = 5.0
    elif not has_obscure and len(m1) > 2:
        m1_score = 4.0
    elif has_obscure:
        m1_score = 1.0
    else:
        m1_score = 2.5
        
    m23_score = 0.0
    if len(top_meanings) >= 2:
        m23_score += 1.5
    if len(top_meanings) >= 3:
        m23_score += 1.5
    elif len(top_meanings) == 1:
        if len(pos_info) > 1 or len(reference_pool) > 2:
            m23_score = 0.5
        else:
            m23_score = 2.5
            
    m46_score = 0.0
    if len(top_meanings) >= 4:
        m46_score += 1.0
    if len(top_meanings) >= 5:
        m46_score += 0.5
    if len(top_meanings) >= 6:
        m46_score += 0.5
    elif len(top_meanings) < 4:
        if len(pos_info) > 1 and len(reference_pool) >= 4:
            m46_score = 0.5
        else:
            m46_score = 1.5
            
    total_score = min(10.0, round(m1_score + m23_score + m46_score, 1))
    
    if len(extracted_meanings) > 15:
        status = 'Избыточен (сильно перегружен)'
    elif len(extracted_meanings) >= 4 and total_score >= 8.0:
        status = 'Сбалансирован (идеальный порядок)'
    elif len(extracted_meanings) >= 2 and total_score >= 6.5:
        status = 'Сбалансирован (хороший)'
    elif len(extracted_meanings) <= 2 and len(pos_info) > 1:
        status = 'Недостаточен (пропущены части речи)'
    elif len(extracted_meanings) == 1 and len(reference_pool) > 2:
        status = 'Недостаточен (только 1 значение)'
    elif has_obscure:
        status = 'Избыточен (архаичные/редкие значения в начале)'
    else:
        status = 'Удовлетворительный'
        
    return total_score, status, top_meanings

# 4. Sampling 500 words
random.seed(42)
valid_oxford = [w for w in oxford_raw if w.get('word') and re.match(r'^[a-zA-Z][a-zA-Z\s\-]*$', w['word'])]
sampled_words = random.sample(valid_oxford, 500)
print('Selected ' + str(len(sampled_words)) + ' words for 500-word evaluation')

results = []

for idx, word_obj in enumerate(sampled_words):
    word = word_obj['word'].strip().lower()
    
    pos_list = []
    for m in word_obj.get('meanings', []):
        p = m.get('partOfSpeech', '')
        if p and p not in pos_list:
            pos_list.append(p)
    pos_str = ', '.join(pos_list) if pos_list else 'general'
    
    ox_meanings = get_oxford_meanings(word_obj)
    cld_meanings = get_cld_meanings(word)
    
    ox_score, ox_status, ox_top = evaluate_order_and_quality(word, pos_list, ox_meanings, cld_meanings, ox_meanings)
    cld_score, cld_status, cld_top = evaluate_order_and_quality(word, pos_list, cld_meanings, cld_meanings, ox_meanings)
    
    pdf_results = {}
    for dict_key, cfg in pdf_configs.items():
        raw_e = pdf_indices[dict_key].get(word, [])
        m_list = extract_meanings_from_pdf(raw_e, pos_list)
        score, status, top_m = evaluate_order_and_quality(word, pos_list, m_list, cld_meanings, ox_meanings)
        pdf_results[dict_key] = {
            'name': cfg['name'],
            'meanings': top_m,
            'score': score,
            'status': status,
            'raw_count': len(m_list)
        }
        
    entry_record = {
        'id': idx + 1,
        'word': word,
        'pos': pos_str,
        'oxford_5000': {
            'meanings': ox_top[:6],
            'score': ox_score,
            'status': ox_status
        },
        'cld': {
            'meanings': cld_top[:6],
            'score': cld_score,
            'status': cld_status
        },
        'sam': pdf_results['sam'],
        'muller_ast': pdf_results['muller_ast'],
        'muller_a4': pdf_results['muller_a4'],
        'muller_300k': pdf_results['muller_300k'],
        'shkolnik': pdf_results['shkolnik']
    }
    results.append(entry_record)

print('Evaluation finished for all ' + str(len(results)) + ' words!')

with open('dictionary_evaluation_500.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print('Saved dictionary_evaluation_500.json')

with open('dictionary_evaluation_500.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([
        'ID', 'Word', 'POS',
        'Oxford 5000 Meanings', 'Oxford Score', 'Oxford Status',
        'CLD Meanings', 'CLD Score', 'CLD Status',
        'Sam Meanings', 'Sam Score', 'Sam Status',
        'Muller AST Meanings', 'Muller AST Score', 'Muller AST Status',
        'Muller A4 Meanings', 'Muller A4 Score', 'Muller A4 Status',
        'Muller 300k Meanings', 'Muller 300k Score', 'Muller 300k Status',
        'Shkolnik Meanings', 'Shkolnik Score', 'Shkolnik Status'
    ])
    for r in results:
        writer.writerow([
            r['id'], r['word'], r['pos'],
            ' | '.join(r['oxford_5000']['meanings']), r['oxford_5000']['score'], r['oxford_5000']['status'],
            ' | '.join(r['cld']['meanings']), r['cld']['score'], r['cld']['status'],
            ' | '.join(r['sam']['meanings']), r['sam']['score'], r['sam']['status'],
            ' | '.join(r['muller_ast']['meanings']), r['muller_ast']['score'], r['muller_ast']['status'],
            ' | '.join(r['muller_a4']['meanings']), r['muller_a4']['score'], r['muller_a4']['status'],
            ' | '.join(r['muller_300k']['meanings']), r['muller_300k']['score'], r['muller_300k']['status'],
            ' | '.join(r['shkolnik']['meanings']), r['shkolnik']['score'], r['shkolnik']['status'],
        ])
print('Saved dictionary_evaluation_500.csv')

dict_keys = ['oxford_5000', 'cld', 'sam', 'muller_ast', 'muller_a4', 'muller_300k', 'shkolnik']
names = {
    'oxford_5000': 'Oxford 5000 (текущий)',
    'cld': 'Cambridge Learner (CLD)',
    'sam': 'SamPolnAnglRysSlovar',
    'muller_ast': 'Мюллер (Полный курс АСТ 2021)',
    'muller_a4': 'Мюллер и др. (2021 a4)',
    'muller_300k': 'Мюллер (300 000 слов)',
    'shkolnik': 'Словарь для школьников'
}

stats = {}
for k in dict_keys:
    scores = [r[k]['score'] for r in results]
    avg = sum(scores) / len(scores)
    present_cnt = sum(1 for s in scores if s > 0)
    ideal_cnt = sum(1 for r in results if 'идеальный' in r[k]['status'] or r[k]['score'] >= 8.5)
    stats[k] = {
        'name': names[k],
        'avg_score': round(avg, 2),
        'coverage_pct': round(present_cnt / len(results) * 100, 1),
        'ideal_order_pct': round(ideal_cnt / len(results) * 100, 1)
    }

print('
=== SUMMARY RANKING ===')
sorted_stats = sorted(stats.items(), key=lambda x: x[1]['avg_score'], reverse=True)
for rank, (k, st) in enumerate(sorted_stats, 1):
    print(str(rank) + '. ' + st['name'] + ': Средний балл = ' + str(st['avg_score']) + '/10 | Покрытие: ' + str(st['coverage_pct']) + '% | Идеальный порядок: ' + str(st['ideal_order_pct']) + '%')