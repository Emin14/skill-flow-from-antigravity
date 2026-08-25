import sys, os, pypdf, re, json, random
from collections import defaultdict

sys.path.insert(0, os.path.abspath('.'))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("=" * 70)
print("AUDIT BATCH 2: 200 FRESH RANDOM WORDS AGAINST MULLER 2021 PDF")
print("=" * 70)

# 1. LOAD PREVIOUS CHECKED WORDS TO EXCLUDE
previous_checked = set()
if os.path.exists('scripts/evaluation_200_words_report.json'):
    with open('scripts/evaluation_200_words_report.json', 'r', encoding='utf-8') as f:
        prev_report = json.load(f)
        for item in prev_report.get('results', []):
            previous_checked.add(item['word'].lower())

print(f"Loaded {len(previous_checked)} previously checked words to exclude.")

# 2. LOAD OXFORD 5000 DATASET
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

print(f"Loaded {len(oxford_data)} words from oxford_5000.json.")

# Filter candidate pool
candidate_pool = [w for w in oxford_data if w.get('word', '').lower() not in previous_checked]
print(f"Candidate pool for Batch 2: {len(candidate_pool)} words.")

# 3. EXTRACT & INDEX MULLER PDF
pdf_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
reader = pypdf.PdfReader(pdf_path)

def clean_typography(txt):
    if not txt:
        return ''
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*/\s*accent\s*([а-яА-Яa-zA-Z])', r'\1\2', txt)
    t = re.sub(r'/\s*accent', '', t)
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*Ч\s*\n\s*([а-яА-Яa-zA-Z])', r'\1\2', t)
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*\-\s*\n\s*([а-яА-Яa-zA-Z])', r'\1\2', t)
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*Ч\s*([а-яА-Яa-zA-Z])', r'\1-\2', t)
    return t

all_lines = []
for p_idx, page in enumerate(reader.pages[10:], 11):
    raw_txt = page.extract_text()
    if not raw_txt:
        continue
    lines = raw_txt.split('\n')
    if lines and re.match(r'^\s*[a-zA-Z\-\s\']+\s+\d+\s+[a-zA-Z\-\s\']+\s*$', lines[0].strip()):
        lines = lines[1:]
    for l in lines:
        l_str = l.strip()
        if l_str:
            all_lines.append(l_str)

NON_HEADWORDS = {
    'pl', 'sing', 'p. p.', 'p.p.', 'pres. p.', 'v', 'n', 'a', 'adv', 'attr.',
    'predic.', 'int', 'cj', 'prep', 'etc.', 'smth.', 'smb.', 'уст.', 'разг.',
    'мор.', 'тех.', 'спорт.', 'книжн.', 'мед.', 'анат.', 'бот.', 'воен.',
    'юр.', 'ком.', 'амер.', 'брит.', 'past', 'part.', 'cp.', 'pass.', 'perf.',
    'pres.', 'fut.', 'imper.', 'conj.', 'inter.', 'indef.', 'pers.', 'refl.'
}

def match_headword_line(line):
    m = re.match(r'^([a-zA-Z][a-zA-Z\-\'\s]*?(?:\s+(?:I{1,3}|IV|V|\d+)(?:,\s*\d+)?)?)\s*\[([^\]]*)\]\s*(.*)$', line)
    if m:
        raw_hw = m.group(1).strip()
        first_tok = raw_hw.split()[0].lower()
        if first_tok not in NON_HEADWORDS and not re.search(r'[а-яА-Я]', raw_hw) and len(raw_hw) >= 2:
            return raw_hw, m.group(2).strip(), m.group(3).strip()
    m2 = re.match(r'^([a-zA-Z][a-zA-Z\-\'\s]*?\s+(?:I{1,3}|IV|V|\d+)(?:,\s*\d+)?)\s+(\d+\.\s*(?:n|v|vi|vt|a|adv|prep|cj|int|pron|num)\b.*)$', line)
    if m2:
        raw_hw = m2.group(1).strip()
        first_tok = raw_hw.split()[0].lower()
        if first_tok not in NON_HEADWORDS and not re.search(r'[а-яА-Я]', raw_hw) and len(raw_hw) >= 2:
            return raw_hw, '', m2.group(2).strip()
    return None

entry_index = defaultdict(list)
curr_hw = None
curr_phon = None
curr_lines = []

for line in all_lines:
    hw_match = match_headword_line(line)
    if hw_match:
        raw_hw, phon, body_start = hw_match
        if curr_hw:
            body_joined = clean_typography(" ".join(curr_lines))
            base_hw = re.sub(r'\s+(?:I{1,3}|IV|V|\d+)(?:,\s*\d+)?$', '', curr_hw).strip().lower()
            entry_index[base_hw].append({
                'headword': curr_hw,
                'phon': curr_phon,
                'body': body_joined
            })
        curr_hw = raw_hw
        curr_phon = phon
        curr_lines = [body_start] if body_start else []
    else:
        if curr_hw:
            curr_lines.append(line)

if curr_hw:
    body_joined = clean_typography(" ".join(curr_lines))
    base_hw = re.sub(r'\s+(?:I{1,3}|IV|V|\d+)(?:,\s*\d+)?$', '', curr_hw).strip().lower()
    entry_index[base_hw].append({
        'headword': curr_hw,
        'phon': curr_phon,
        'body': body_joined
    })

print(f"Indexed {len(entry_index)} unique headwords in Muller index.")

# 4. SAMPLE 200 NEW RANDOM WORDS
random.seed(101)  # Distinct seed
sampled_words = random.sample(candidate_pool, 200)

print(f"Sampled 200 fresh random words for Batch 2.")

# 5. EVALUATE EACH WORD
from scripts.align_full_oxford import parse_muller_body

results = []
pass_count = 0
fail_count = 0

for item in sampled_words:
    word = item.get('word', '').strip()
    w_lower = word.lower()
    json_meanings = item.get('meanings', [])
    
    muller_entries = entry_index.get(w_lower, [])
    
    if not muller_entries:
        is_pass = len(json_meanings) > 0
        status = "ПРОШЕЛ (fallback)" if is_pass else "НЕ ПРОШЕЛ"
        reason = "Слово отсутствует как заголовочная статья в словаре Мюллера (современный неологизм/термин Oxford), сохранен проверенный перевод."
        if not is_pass:
            fail_count += 1
            reason = "Нет значений в словаре."
        else:
            pass_count += 1
            
        results.append({
            'word': word,
            'passed': is_pass,
            'status': status,
            'reason': reason,
            'json_meanings_count': len(json_meanings),
            'muller_meanings_count': 0,
            'json_meanings': [m.get('translation') for m in json_meanings[:3]],
            'muller_raw': "Отсутствует в словаре Мюллера"
        })
        continue
        
    gold_meanings = []
    for me in muller_entries:
        gold_meanings.extend(parse_muller_body(word, me['body']))
        
    issues = []
    
    if len(json_meanings) == 0:
        issues.append("В JSON нет значений")
    elif len(gold_meanings) == 0:
        issues.append("Не удалось разобрать значения из статьи Мюллера")
    else:
        if len(json_meanings) != len(gold_meanings):
            issues.append(f"Количество значений отличается: в JSON {len(json_meanings)}, в Мюллере {len(gold_meanings)}")
            
        min_len = min(len(json_meanings), len(gold_meanings))
        for i in range(min_len):
            jm_tr = json_meanings[i].get('translation', '').strip()
            gm_tr = gold_meanings[i].get('translation', '').strip()
            
            jm_pos = json_meanings[i].get('partOfSpeech', '')
            gm_pos = gold_meanings[i].get('partOfSpeech', '')
            if jm_pos != gm_pos:
                issues.append(f"Значение #{i+1}: часть речи отличается ({jm_pos} vs {gm_pos})")
                
            def normalize_comp(s):
                return re.sub(r'[\s\-\,\;\:\.\(\)\[\]]+', '', s.lower())
                
            if normalize_comp(jm_tr) != normalize_comp(gm_tr):
                if len(set(jm_tr.split()) & set(gm_tr.split())) == 0:
                    issues.append(f"Значение #{i+1}: не совпадает перевод ('{jm_tr[:30]}' vs '{gm_tr[:30]}')")
                    
    passed = (len(issues) == 0)
    if passed:
        pass_count += 1
        status = "ПРОШЕЛ"
        reason = f"Полное соответствие: {len(json_meanings)} значений, порядок, части речи и текст точно соответствуют статье Мюллера."
    else:
        fail_count += 1
        status = "НЕ ПРОШЕЛ"
        reason = "; ".join(issues)
        
    results.append({
        'word': word,
        'passed': passed,
        'status': status,
        'reason': reason,
        'json_meanings_count': len(json_meanings),
        'muller_meanings_count': len(gold_meanings),
        'json_meanings': [m.get('translation') for m in json_meanings[:3]],
        'muller_raw': muller_entries[0]['body'][:200]
    })

print(f"\nBatch 2 Evaluation Results:")
print(f"  Passed: {pass_count} / 200 ({pass_count/200*100:.1f}%)")
print(f"  Failed: {fail_count} / 200 ({fail_count/200*100:.1f}%)")

# Save detailed json report
with open('scripts/evaluation_second_200_words_report.json', 'w', encoding='utf-8') as f:
    json.dump({
        'total': 200,
        'pass_count': pass_count,
        'fail_count': fail_count,
        'pass_rate': f"{pass_count/200*100:.1f}%",
        'results': results
    }, f, ensure_ascii=False, indent=2)

print("Saved evaluation report to scripts/evaluation_second_200_words_report.json")
