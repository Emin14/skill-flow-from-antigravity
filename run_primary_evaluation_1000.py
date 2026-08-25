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

print("=== Step 1: Loading Oxford 5000, CLD, and Indexing Sam ===")
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

# Index SamPolnAnglRysSlovar.pdf
t0 = time.time()
sam_doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')
sam_entries = {}
current_hw = None
current_text = []

for p in range(10, 510):
    page = sam_doc[p]
    d = page.get_text('dict')
    page_h = page.rect.height
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            if y0 < 35 or y1 > page_h - 25: continue
            line_text = ''.join(s['text'] for s in l['spans']).strip()
            if not l['spans'] or not line_text: continue
            first_span = l['spans'][0]
            is_bold = bool(re.search(r'PragmaticaBoldA-Reg|Pragmatica-Bold', first_span['font'], re.I)) and first_span['size'] >= 7.5
            txt = first_span['text'].strip()
            if is_bold and re.match(r'^[a-zA-Z][a-zA-Z\s\-\.]*(\s+[I|V|X]+|\s+\d+)?$', txt):
                if current_hw and current_text:
                    hw_base = re.sub(r'(\s+[ivx]+|\s+\d+)$', '', current_hw.lower().strip())
                    if hw_base not in sam_entries: sam_entries[hw_base] = []
                    sam_entries[hw_base].append(' '.join(current_text))
                current_hw = txt
                current_text = [line_text]
            else:
                if current_hw: current_text.append(line_text)

if current_hw and current_text:
    hw_base = re.sub(r'(\s+[ivx]+|\s+\d+)$', '', current_hw.lower().strip())
    if hw_base not in sam_entries: sam_entries[hw_base] = []
    sam_entries[hw_base].append(' '.join(current_text))
sam_doc.close()
print(f"Indexed SamPolnAnglRysSlovar: {len(sam_entries)} entries in {time.time()-t0:.2f}s")

print("=== Step 2: Stemming and Semantic Matching Logic ===")

def clean_ru(text):
    text = unicodedata.normalize('NFKD', text)
    text = re.sub(r'[\x01-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', text)
    text = text.replace('ﬂ', 'fl').replace('ﬁ', 'fi').replace('ﬃ', 'ffi').replace('ﬀ', 'ff')
    text = re.sub(r'([а-яёА-ЯЁ])\?([а-яёА-ЯЁ]*)', r'\1\2', text)
    text = re.sub(r'([а-яёА-ЯЁa-zA-Z])\-\s+([а-яёА-ЯЁa-zA-Z])', r'\1\2', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def get_russian_stems(text):
    text_clean = clean_ru(text).lower()
    # remove parenthesized parts
    text_clean = re.sub(r'\([^)]*\)', '', text_clean)
    words = re.findall(r'[а-яё]{3,}', text_clean)
    stems = set()
    for w in words:
        # simple suffix stripping for Russian
        w_stem = re.sub(r'(?:ами|ями|ов|ев|ей|ия|ие|ий|ый|ая|ое|ые|ую|яя|ее|ть|ся|ти|ет|ут|ят|ил|ал|ла|ли|ом|ем|ам|ям|ах|ях|ы|и|а|у|е|о)$', '', w)
        if len(w_stem) >= 3:
            stems.add(w_stem)
        else:
            stems.add(w)
    return stems

def meanings_match(ox_text, ref_text, ox_pos='', ref_pos=''):
    stems_ox = get_russian_stems(ox_text)
    stems_ref = get_russian_stems(ref_text)
    if not stems_ox or not stems_ref:
        return False
    
    # Check POS alignment if specified
    if ox_pos and ref_pos and ox_pos != ref_pos and ox_pos not in ['other', 'general'] and ref_pos not in ['other', 'general']:
        # if POS is strictly conflicting (e.g. verb vs noun), don't match unless strong overlap
        overlap = stems_ox.intersection(stems_ref)
        return len(overlap) >= 2
        
    overlap = stems_ox.intersection(stems_ref)
    if overlap:
        return True
    # Substring check for short exact Russian terms (e.g. "суд", "еда", "бег", "дом")
    words_ox = set(re.findall(r'[а-яё]{2,}', clean_ru(ox_text).lower()))
    words_ref = set(re.findall(r'[а-яё]{2,}', clean_ru(ref_text).lower()))
    if words_ox.intersection(words_ref):
        return True
    return False

# Extract Sam's top senses
def extract_sam_top_senses(raw_entries):
    if not raw_entries:
        return []
    combined = clean_ru(' || '.join(raw_entries))
    combined = re.sub(r'\[[^\]]*\]', '', combined)
    raw_senses = re.split(r'(?:(?<=[;.\s])(?:\d+\)|\d+\.|\b\d+\b)\s*|\b[I|V|X]+\b|\b\d+\s+(?:n|v|adj|adv|a)\b)', combined)
    senses = []
    for rs in raw_senses:
        rs_no_en = re.sub(r'\b(?:to|in|at|on|for|with|by|of|a|an|the)\s+[a-zA-Z\s\']+', '', rs)
        ru_matches = re.findall(r'[а-яёА-ЯЁ\s\,\;\-\(\)\/]{2,}', rs_no_en)
        for rm in ru_matches:
            rm_clean = re.sub(r'\b(?:разг|спорт|мед|юр|уст|грам|мор|тех|бот|биол|амер|брит|pl|тж|преим|особ|букв|перен|воен|ав|см|редк)\b\.?', '', rm, flags=re.I)
            parts = [p.strip() for p in re.split(r'[\;\n]', rm_clean) if p.strip()]
            for p in parts:
                p_trim = re.sub(r'^[,\s\-\(\)\.]+|[,\s\-\(\)\.]+$', '', p)
                if len(p_trim) >= 2 and p_trim not in senses and not re.match(r'^[ivx0-9\s]+$', p_trim, re.I):
                    if re.search(r'[а-яёА-ЯЁ]', p_trim):
                        senses.append(p_trim)
    return senses[:5] # top 5 senses

def extract_cld_top_senses(word_str):
    entries = cld_index.get(word_str.lower(), [])
    senses = []
    for ce in entries:
        for s in ce.get('senses', []):
            tr = s.get('translation_ru', '').strip()
            if tr and tr not in senses:
                senses.append(tr)
    return senses[:5] # top 5 senses

print("=== Step 3: Determining Gold Standard Ideal Primary Meanings ===")

def determine_ideal_primaries(word_obj, cld_senses, sam_senses):
    meanings = word_obj.get('meanings', [])
    if not meanings:
        return []
    
    if len(meanings) <= 2:
        # All meanings are essential
        return [m['id'] for m in meanings]
    
    # Collect parts of speech present in word
    pos_map = {}
    for m in meanings:
        p = m.get('partOfSpeech', 'other').lower()
        if p not in pos_map:
            pos_map[p] = []
        pos_map[p].append(m)
        
    ideal_ids = set()
    
    # Rule 1: For each major POS (noun, verb, adj), the top 1 dominant meaning is ALWAYS primary
    for p, p_meanings in pos_map.items():
        # Find best meaning for this POS that matches CLD/Sam or is position 0
        best_m = p_meanings[0]
        # Check if first meaning has obscure markers; if so, pick next clean one
        for pm in p_meanings:
            tr = pm.get('translation', '').lower()
            if not any(om in tr for om in ['уст', 'архаич', 'спец', 'диал', 'редк', 'устар', 'бот', 'зоол']):
                best_m = pm
                break
        ideal_ids.add(best_m['id'])
        
    # Rule 2: Secondary meanings that match top-2 CLD or top-2 Sam senses and are not obscure
    ref_top2 = set(cld_senses[:2] + sam_senses[:2])
    for m in meanings:
        if m['id'] in ideal_ids:
            continue
        tr = m.get('translation', '').lower()
        if any(om in tr for om in ['уст', 'архаич', 'спец', 'диал', 'редк', 'устар', 'бот', 'зоол', 'мат.', 'физ.']):
            continue
        # check overlap with ref_top2
        for ref in ref_top2:
            if meanings_match(tr, ref):
                # Don't let ideal set exceed 3-4 meanings per word unless highly polysemous
                if len(ideal_ids) < 4:
                    ideal_ids.add(m['id'])
                break
                
    return sorted(list(ideal_ids))

print("=== Step 4: Evaluating 1,000 Words Across All Strategies ===")

random.seed(42)
valid_oxford = [w for w in oxford_raw if w.get('word') and re.match(r'^[a-zA-Z][a-zA-Z\s\-]*$', w['word'])]
sampled_1000 = random.sample(valid_oxford, 1000)

results = []

# Metrics accumulators
metrics = {
    'cld_only': {'tp': 0, 'fp': 0, 'fn': 0, 'exact': 0, 'total_marked': 0, 'zero_cnt': 0},
    'sam_only': {'tp': 0, 'fp': 0, 'fn': 0, 'exact': 0, 'total_marked': 0, 'zero_cnt': 0},
    'union': {'tp': 0, 'fp': 0, 'fn': 0, 'exact': 0, 'total_marked': 0, 'zero_cnt': 0},
    'intersection': {'tp': 0, 'fp': 0, 'fn': 0, 'exact': 0, 'total_marked': 0, 'zero_cnt': 0},
    'smart_hybrid': {'tp': 0, 'fp': 0, 'fn': 0, 'exact': 0, 'total_marked': 0, 'zero_cnt': 0}
}

for idx, word_obj in enumerate(sampled_1000):
    word = word_obj['word'].strip().lower()
    ox_meanings = word_obj.get('meanings', [])
    
    cld_senses = extract_cld_top_senses(word)
    raw_sam = sam_entries.get(word, [])
    sam_senses = extract_sam_top_senses(raw_sam)
    
    # 1. Gold Standard Ideal Primaries
    ideal_ids = set(determine_ideal_primaries(word_obj, cld_senses, sam_senses))
    
    # 2. Strategy 1: CLD Only
    cld_marked_ids = set()
    for m in ox_meanings:
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        for cs in cld_senses:
            if meanings_match(tr, cs, pos):
                cld_marked_ids.add(m['id'])
                break
    # If CLD has word but matched nothing, take Oxford #1 if clean
    if not cld_marked_ids and ox_meanings and cld_senses:
        cld_marked_ids.add(ox_meanings[0]['id'])
        
    # 3. Strategy 2: Sam Only
    sam_marked_ids = set()
    for m in ox_meanings:
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        for ss in sam_senses:
            if meanings_match(tr, ss, pos):
                sam_marked_ids.add(m['id'])
                break
    if not sam_marked_ids and ox_meanings and sam_senses:
        sam_marked_ids.add(ox_meanings[0]['id'])
        
    # 4. Strategy 3: Union (CLD OR Sam)
    union_marked_ids = cld_marked_ids.union(sam_marked_ids)
    
    # 5. Strategy 4: Intersection (CLD AND Sam)
    intersection_marked_ids = cld_marked_ids.intersection(sam_marked_ids)
    
    # 6. Strategy 5: Smart Hybrid
    # Foundation = CLD marked. If a major POS from Oxford is missing in CLD, backfill from Sam.
    smart_marked_ids = set(cld_marked_ids)
    pos_in_ox = set(m.get('partOfSpeech', '').lower() for m in ox_meanings if m.get('partOfSpeech'))
    pos_covered = set()
    for mid in smart_marked_ids:
        for m in ox_meanings:
            if m['id'] == mid:
                pos_covered.add(m.get('partOfSpeech', '').lower())
                
    missing_pos = pos_in_ox - pos_covered
    if missing_pos:
        for m in ox_meanings:
            if m.get('partOfSpeech', '').lower() in missing_pos and m['id'] in sam_marked_ids:
                smart_marked_ids.add(m['id'])
                pos_covered.add(m.get('partOfSpeech', '').lower())
                
    # If still empty (word not in CLD or Sam), mark #1 Oxford meaning
    if not smart_marked_ids and ox_meanings:
        smart_marked_ids.add(ox_meanings[0]['id'])
        
    # Helper to build formatted list with bold tags
    def format_meanings(meanings_list, marked_set):
        res = []
        for m in meanings_list:
            tr = m.get('translation', '').strip()
            if not tr: continue
            if m['id'] in marked_set:
                res.append(f"**{tr}**")
            else:
                res.append(tr)
        return res
        
    strategies_dict = {
        'cld_only': cld_marked_ids,
        'sam_only': sam_marked_ids,
        'union': union_marked_ids,
        'intersection': intersection_marked_ids,
        'smart_hybrid': smart_marked_ids
    }
    
    # Update metrics
    for strat_key, marked_set in strategies_dict.items():
        tp = len(marked_set.intersection(ideal_ids))
        fp = len(marked_set - ideal_ids)
        fn = len(ideal_ids - marked_set)
        metrics[strat_key]['tp'] += tp
        metrics[strat_key]['fp'] += fp
        metrics[strat_key]['fn'] += fn
        metrics[strat_key]['total_marked'] += len(marked_set)
        if marked_set == ideal_ids:
            metrics[strat_key]['exact'] += 1
        if len(marked_set) == 0:
            metrics[strat_key]['zero_cnt'] += 1
            
    # Record entry
    rec = {
        'id': idx + 1,
        'word': word,
        'pos': ', '.join(set(m.get('partOfSpeech', '') for m in ox_meanings if m.get('partOfSpeech'))),
        'ideal_meanings': [m.get('translation', '') for m in ox_meanings if m['id'] in ideal_ids],
        'oxford_all_meanings': [m.get('translation', '') for m in ox_meanings],
        'cld_formatted': format_meanings(ox_meanings, cld_marked_ids),
        'sam_formatted': format_meanings(ox_meanings, sam_marked_ids),
        'union_formatted': format_meanings(ox_meanings, union_marked_ids),
        'intersection_formatted': format_meanings(ox_meanings, intersection_marked_ids),
        'smart_hybrid_formatted': format_meanings(ox_meanings, smart_marked_ids),
        'ideal_ids': list(ideal_ids),
        'cld_ids': list(cld_marked_ids),
        'sam_ids': list(sam_marked_ids),
        'union_ids': list(union_marked_ids),
        'intersection_ids': list(intersection_marked_ids),
        'smart_hybrid_ids': list(smart_marked_ids)
    }
    results.append(rec)

print(f"Finished evaluating all {len(results)} words.")

# Save JSON
with open('primary_evaluation_1000.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Saved primary_evaluation_1000.json")

# Save CSV
with open('primary_evaluation_1000.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([
        'ID', 'Word', 'POS',
        'Ideal Primary Meanings',
        'Oxford with CLD Primary',
        'Oxford with Sam Primary',
        'Oxford with Union (CLD OR Sam)',
        'Oxford with Intersection (CLD AND Sam)',
        'Oxford with Smart Hybrid'
    ])
    for r in results:
        writer.writerow([
            r['id'], r['word'], r['pos'],
            ' | '.join(r['ideal_meanings']),
            ' | '.join(r['cld_formatted']),
            ' | '.join(r['sam_formatted']),
            ' | '.join(r['union_formatted']),
            ' | '.join(r['intersection_formatted']),
            ' | '.join(r['smart_hybrid_formatted'])
        ])
print("Saved primary_evaluation_1000.csv")

print("\n==========================================================================")
print("             СРАВНИТЕЛЬНЫЙ АНАЛИЗ СТРАТЕГИЙ РАЗМЕТКИ PRIMARY (1000 СЛОВ)")
print("==========================================================================")

strat_names = {
    'cld_only': '1. Только Cambridge Learner (CLD)',
    'sam_only': '2. Только SamPolnAnglRysSlovar (Sam)',
    'union': '3. Объединение (CLD OR Sam — значение есть хотя бы в одном)',
    'intersection': '4. Пересечение (CLD AND Sam — значение строго в обоих)',
    'smart_hybrid': '5. Smart Hybrid (CLD как основа + дополнение POS из Sam)'
}

for k, name in strat_names.items():
    m = metrics[k]
    prec = m['tp'] / (m['tp'] + m['fp']) if (m['tp'] + m['fp']) > 0 else 0
    rec = m['tp'] / (m['tp'] + m['fn']) if (m['tp'] + m['fn']) > 0 else 0
    f1 = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0
    avg_marked = m['total_marked'] / len(results)
    exact_pct = m['exact'] / len(results) * 100
    zero_pct = m['zero_cnt'] / len(results) * 100
    
    print(f"\n{name}:")
    print(f"   - F1-Score (Общая точность и полнота): {f1*100:.2f}%")
    print(f"   - Точность (Precision): {prec*100:.2f}% (насколько мало лишних мусорных значений)")
    print(f"   - Полнота (Recall): {rec*100:.2f}% (насколько полно захвачены все нужные значения)")
    print(f"   - Идеальное совпадение со списком (Exact Match): {exact_pct:.1f}% слов")
    print(f"   - Среднее кол-во primary значений на слово: {avg_marked:.2f}")
    print(f"   - Слов без единого primary (Zero-primary): {zero_pct:.1f}%")

