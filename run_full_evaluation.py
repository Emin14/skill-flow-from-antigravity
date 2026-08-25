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

print("=== 1. Loading Oxford 5000 & Cambridge Learner (CLD) ===")
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

print(f"Oxford 5000: {len(oxford_raw)} words loaded.")
print(f"CLD: {len(cld_index)} headwords indexed.")

print("=== 2. Indexing 5 PDF Dictionaries ===")
pdf_configs = {
    'sam': {
        'name': 'SamPolnAnglRysSlovar',
        'path': 'SamPolnAnglRysSlovar.pdf',
        'start_p': 10, 'end_p': 509, 'font': r'PragmaticaBoldA-Reg|Pragmatica-Bold', 'top_m': 35, 'min_size': 7.5
    },
    'muller_ast': {
        'name': 'Мюллер (Полный курс АСТ 2021)',
        'path': 'Мюллер В. К. - Полный англо-русский русско-английский словарь - (Полный курс (АСТ)) - 2021.pdf',
        'start_p': 7, 'end_p': 177, 'font': r'OfficinaSerifITC-Bold', 'top_m': 40, 'min_size': 8.0
    },
    'muller_a4': {
        'name': 'Мюллер и др. (2021 a4)',
        'path': 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf',
        'start_p': 12, 'end_p': 958, 'font': r'PragmaticaC-Bold', 'top_m': 40, 'min_size': 7.5
    },
    'muller_300k': {
        'name': 'Мюллер (300 000)',
        'path': 'Мюллер_В_К_Полный_англо_русский_русско_английский_словарь_300000.pdf',
        'start_p': 11, 'end_p': 912, 'font': r'KudrashovC-Bold', 'top_m': 35, 'min_size': 7.5
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
                
                # Headword regex match
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
    print(f"Indexed {cfg['name']}: {len(entries)} entries in {time.time()-t0:.2f}s")

print("=== 3. Meaning Extraction & POS-aware Evaluation ===")

def clean_ru_text(text):
    text = unicodedata.normalize('NFKD', text)
    text = re.sub(r'[\x01-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', text)
    text = text.replace('ﬂ', 'fl').replace('ﬁ', 'fi').replace('ﬃ', 'ffi').replace('ﬀ', 'ff')
    text = re.sub(r'([а-яёА-ЯЁ])\?([а-яёА-ЯЁ]*)', r'\1\2', text)
    text = re.sub(r'([а-яёА-ЯЁa-zA-Z])\-\s+([а-яёА-ЯЁa-zA-Z])', r'\1\2', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_meanings_pos_aware(raw_entries, target_pos_list=None):
    if not raw_entries:
        return {'all': [], 'noun': [], 'verb': [], 'adj': [], 'other': []}
    
    combined_text = ' || '.join(raw_entries)
    combined_text = clean_ru_text(combined_text)
    text_clean = re.sub(r'\[[^\]]*\]', '', combined_text)
    text_clean = re.sub(r'\bsyn\.\s+[^;.\)]+', '', text_clean, flags=re.I)
    
    res = {'all': [], 'noun': [], 'verb': [], 'adj': [], 'other': []}
    
    # Split text into sections by POS markers or Roman numerals
    # POS markers: 1. n, 2. v, 1 n, 2 v, I n, II v, etc.
    sections = re.split(r'(?=\b(?:1\.\s*n|2\.\s*v|1\s*n|2\s*v|I\s*n|II\s*v|\bn\b|\bv\b|\badj\b|\ba\b|\badv\b)\b)', text_clean)
    
    for sec in sections:
        current_cat = 'other'
        sec_lower = sec.lower()
        if re.search(r'\b(?:1\.\s*n|1\s*n|I\s*n|\bn\b)', sec_lower):
            current_cat = 'noun'
        elif re.search(r'\b(?:2\.\s*v|2\s*v|II\s*v|\bv\b)', sec_lower):
            current_cat = 'verb'
        elif re.search(r'\b(?:adj|a)\b', sec_lower):
            current_cat = 'adj'
            
        raw_senses = re.split(r'(?:(?<=[;.\s])(?:\d+\)|\d+\.|\b\d+\b)\s*|\b[I|V|X]+\b)', sec)
        for rs in raw_senses:
            rs_no_en = re.sub(r'\b(?:to|in|at|on|for|with|by|of|a|an|the)\s+[a-zA-Z\s\']+', '', rs)
            ru_matches = re.findall(r'[а-яёА-ЯЁ\s\,\;\-\(\)\/]{2,}', rs_no_en)
            for rm in ru_matches:
                rm_clean = re.sub(r'\b(?:разг|спорт|мед|юр|уст|грам|мор|тех|бот|биол|амер|брит|pl|тж|преим|особ|букв|перен|воен|ав|см|редк)\b\.?', '', rm, flags=re.I)
                parts = [p.strip() for p in re.split(r'[\;\n]', rm_clean) if p.strip()]
                for p in parts:
                    p_trim = re.sub(r'^[,\s\-\(\)\.]+|[,\s\-\(\)\.]+$', '', p)
                    if len(p_trim) >= 2 and p_trim not in res['all'] and not re.match(r'^[ivx0-9\s]+$', p_trim, re.I):
                        if re.search(r'[а-яёА-ЯЁ]', p_trim):
                            res['all'].append(p_trim)
                            if current_cat in res and p_trim not in res[current_cat]:
                                res[current_cat].append(p_trim)
                                
    return res

def get_cld_meanings_pos_aware(word_str):
    entries = cld_index.get(word_str.lower(), [])
    res = {'all': [], 'noun': [], 'verb': [], 'adj': [], 'other': []}
    for ce in entries:
        for s in ce.get('senses', []):
            tr = s.get('translation_ru', '').strip()
            pos = ce.get('partOfSpeech', '').lower()
            if tr and tr not in res['all']:
                res['all'].append(tr)
                if 'noun' in pos:
                    res['noun'].append(tr)
                elif 'verb' in pos:
                    res['verb'].append(tr)
                elif 'adj' in pos:
                    res['adj'].append(tr)
                else:
                    res['other'].append(tr)
    return res

def get_oxford_meanings_pos_aware(ox_entry):
    res = {'all': [], 'noun': [], 'verb': [], 'adj': [], 'other': []}
    for m in ox_entry.get('meanings', []):
        tr = m.get('translation', '').strip()
        pos = m.get('partOfSpeech', '').lower()
        if tr and tr not in res['all']:
            res['all'].append(tr)
            if 'noun' in pos:
                res['noun'].append(tr)
            elif 'verb' in pos:
                res['verb'].append(tr)
            elif 'adj' in pos:
                res['adj'].append(tr)
            else:
                res['other'].append(tr)
    return res

def score_pos_block(dict_meanings, gold_meanings, max_pts=5.0):
    if not dict_meanings:
        return 0.0
    
    score = 0.0
    m1 = dict_meanings[0].lower() if len(dict_meanings) > 0 else ''
    gold_text = ' '.join(gold_meanings).lower()
    
    obscure_markers = ['уст', 'архаич', 'спец', 'диал', 'редк', 'устар', 'бот', 'зоол', 'всадник']
    has_obscure = any(om in m1 for om in obscure_markers)
    
    m1_tokens = set(re.findall(r'[а-яё]{3,}', m1))
    gold_tokens = set(re.findall(r'[а-яё]{3,}', gold_text))
    
    # 1st meaning match
    if m1_tokens.intersection(gold_tokens) and not has_obscure:
        score += max_pts * 0.50 # 50% for 1st meaning
    elif len(m1) > 2 and not has_obscure:
        score += max_pts * 0.35
    elif has_obscure:
        score += max_pts * 0.10
    else:
        score += max_pts * 0.20
        
    # 2nd & 3rd meanings
    if len(dict_meanings) >= 2:
        m2 = dict_meanings[1].lower()
        m2_toks = set(re.findall(r'[а-яё]{3,}', m2))
        if m2_toks.intersection(gold_tokens):
            score += max_pts * 0.25
        else:
            score += max_pts * 0.15
    elif len(gold_meanings) <= 1:
        score += max_pts * 0.25
        
    if len(dict_meanings) >= 3:
        m3 = dict_meanings[2].lower()
        m3_toks = set(re.findall(r'[а-яё]{3,}', m3))
        if m3_toks.intersection(gold_tokens):
            score += max_pts * 0.25
        else:
            score += max_pts * 0.15
    elif len(gold_meanings) <= 2:
        score += max_pts * 0.25
        
    return min(max_pts, round(score, 1))

def evaluate_dictionary_entry(pos_dict, gold_dict, has_noun, has_verb, total_meanings_count):
    if not pos_dict['all']:
        return 0.0, 'Отсутствует в словаре', []
    
    # Prepare top 6 selected meanings:
    # If both noun & verb are present: 3 for noun + 3 for verb
    top6 = []
    if has_noun and has_verb:
        top_noun = pos_dict['noun'][:3] if pos_dict['noun'] else pos_dict['all'][:3]
        top_verb = pos_dict['verb'][:3] if pos_dict['verb'] else [m for m in pos_dict['all'] if m not in top_noun][:3]
        top6 = top_noun + top_verb
        # If still < 6, fill from all
        for m in pos_dict['all']:
            if len(top6) >= 6: break
            if m not in top6: top6.append(m)
            
        score_n = score_pos_block(top_noun, gold_dict['noun'] or gold_dict['all'], max_pts=5.0)
        score_v = score_pos_block(top_verb, gold_dict['verb'] or gold_dict['all'], max_pts=5.0)
        total_score = round(score_n + score_v, 1)
    else:
        top6 = pos_dict['all'][:6]
        total_score = score_pos_block(top6, gold_dict['all'], max_pts=10.0)
        
    total_score = min(10.0, max(0.0, total_score))
    
    # Evaluate completeness / redundancy
    raw_cnt = total_meanings_count
    if raw_cnt > 16:
        status = 'Избыточен (сильно перегружен)'
    elif raw_cnt >= 4 and total_score >= 8.5:
        status = 'Сбалансирован (идеальный порядок)'
    elif raw_cnt >= 2 and total_score >= 6.5:
        status = 'Сбалансирован (хороший)'
    elif has_noun and has_verb and (not pos_dict['noun'] or not pos_dict['verb']):
        status = 'Недостаточен (пропущена часть речи)'
    elif raw_cnt == 1 and len(gold_dict['all']) > 2:
        status = 'Недостаточен (только 1 значение)'
    else:
        status = 'Удовлетворительный'
        
    return total_score, status, top6

# 4. Sampling 500 words
random.seed(42)
valid_oxford = [w for w in oxford_raw if w.get('word') and re.match(r'^[a-zA-Z][a-zA-Z\s\-]*$', w['word'])]
sampled_words = random.sample(valid_oxford, 500)
print(f"Selected {len(sampled_words)} words for 500-word evaluation.")

results = []

for idx, word_obj in enumerate(sampled_words):
    word = word_obj['word'].strip().lower()
    
    # Determine POS
    pos_list = []
    for m in word_obj.get('meanings', []):
        p = m.get('partOfSpeech', '').lower()
        if p and p not in pos_list:
            pos_list.append(p)
    has_noun = any('noun' in p for p in pos_list)
    has_verb = any('verb' in p for p in pos_list)
    pos_str = ', '.join(pos_list) if pos_list else 'general'
    
    # 1. Oxford & CLD data
    ox_pos = get_oxford_meanings_pos_aware(word_obj)
    cld_pos = get_cld_meanings_pos_aware(word)
    
    # Gold standard composite
    gold_pos = {
        'all': (cld_pos['all'][:4] + ox_pos['all'][:4]),
        'noun': (cld_pos['noun'][:3] + ox_pos['noun'][:3]),
        'verb': (cld_pos['verb'][:3] + ox_pos['verb'][:3]),
        'adj': (cld_pos['adj'][:3] + ox_pos['adj'][:3])
    }
    
    ox_score, ox_status, ox_top = evaluate_dictionary_entry(ox_pos, gold_pos, has_noun, has_verb, len(ox_pos['all']))
    cld_score, cld_status, cld_top = evaluate_dictionary_entry(cld_pos, gold_pos, has_noun, has_verb, len(cld_pos['all']))
    
    # PDF Dictionaries
    pdf_evals = {}
    for dict_key, cfg in pdf_configs.items():
        raw_e = pdf_indices[dict_key].get(word, [])
        m_pos = extract_meanings_pos_aware(raw_e, pos_list)
        score, status, top6 = evaluate_dictionary_entry(m_pos, gold_pos, has_noun, has_verb, len(m_pos['all']))
        pdf_evals[dict_key] = {
            'name': cfg['name'],
            'meanings': top6,
            'score': score,
            'status': status,
            'raw_count': len(m_pos['all'])
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
        'sam': pdf_evals['sam'],
        'muller_ast': pdf_evals['muller_ast'],
        'muller_a4': pdf_evals['muller_a4'],
        'muller_300k': pdf_evals['muller_300k'],
        'shkolnik': pdf_evals['shkolnik']
    }
    results.append(entry_record)

print(f"Processed all {len(results)} words.")

# Save JSON
with open('dictionary_evaluation_500.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Saved dictionary_evaluation_500.json")

# Save CSV
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
print("Saved dictionary_evaluation_500.csv")

dict_keys = ['oxford_5000', 'cld', 'sam', 'muller_ast', 'muller_a4', 'muller_300k', 'shkolnik']
names = {
    'oxford_5000': 'Oxford 5000 (текущий в JSON)',
    'cld': 'Cambridge Learner (CLD)',
    'sam': 'SamPolnAnglRysSlovar',
    'muller_ast': 'Мюллер (Полный курс АСТ 2021)',
    'muller_a4': 'Мюллер и др. (2021 a4)',
    'muller_300k': 'Мюллер (300 000 слов)',
    'shkolnik': 'Новый словарь для школьников'
}

stats = {}
for k in dict_keys:
    scores = [r[k]['score'] for r in results]
    avg = sum(scores) / len(scores)
    present_cnt = sum(1 for s in scores if s > 0)
    ideal_cnt = sum(1 for r in results if 'идеальный' in r[k]['status'] or r[k]['score'] >= 8.5)
    balanced_cnt = sum(1 for r in results if 'Сбалансирован' in r[k]['status'])
    overloaded_cnt = sum(1 for r in results if 'Избыточен' in r[k]['status'])
    insufficient_cnt = sum(1 for r in results if 'Недостаточен' in r[k]['status'])
    stats[k] = {
        'name': names[k],
        'avg_score': round(avg, 2),
        'coverage_pct': round(present_cnt / len(results) * 100, 1),
        'ideal_order_pct': round(ideal_cnt / len(results) * 100, 1),
        'balanced_pct': round(balanced_cnt / len(results) * 100, 1),
        'overloaded_pct': round(overloaded_cnt / len(results) * 100, 1),
        'insufficient_pct': round(insufficient_cnt / len(results) * 100, 1),
    }

print("\n=======================================================")
print("             ИТОГОВЫЙ РЕЙТИНГ СЛОВАРЕЙ")
print("=======================================================")
sorted_stats = sorted(stats.items(), key=lambda x: x[1]['avg_score'], reverse=True)
for rank, (k, st) in enumerate(sorted_stats, 1):
    print(f"{rank}. {st['name']}:")
    print(f"   - Средняя оценка порядка и качества: {st['avg_score']} / 10.0")
    print(f"   - Покрытие слов из Oxford 5000: {st['coverage_pct']}%")
    print(f"   - Доля идеально структурированных статей: {st['ideal_order_pct']}%")
    print(f"   - Сбалансированность: {st['balanced_pct']}% | Избыточность: {st['overloaded_pct']}% | Недостаточность: {st['insufficient_pct']}%\n")

