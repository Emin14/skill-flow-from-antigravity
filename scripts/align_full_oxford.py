import sys, os, pypdf, re, json, time
from collections import defaultdict

sys.path.insert(0, os.path.abspath('.'))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("=" * 70)
print("ACCURATE AUDIT & ALIGNMENT: OXFORD 5000 -> MULLER 2021")
print("=" * 70)

t0 = time.time()

# 1. LOAD OXFORD 5000 DATASET
print("\n[1/6] Loading existing oxford_5000.json...")
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)
print(f"Loaded {len(oxford_data)} words.")

# 2. EXTRACT & CLEAN ALL PAGES FROM MULLER PDF
print("\n[2/6] Extracting lines from Muller 2021 PDF...")
pdf_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
reader = pypdf.PdfReader(pdf_path)
print(f"Total PDF pages: {len(reader.pages)}")

def clean_typography(txt):
    if not txt:
        return ''
    # Remove /accent inside words
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*/\s*accent\s*([а-яА-Яa-zA-Z])', r'\1\2', txt)
    t = re.sub(r'/\s*accent', '', t)
    # Fix hyphenation at line breaks
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*Ч\s*\n\s*([а-яА-Яa-zA-Z])', r'\1\2', t)
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*\-\s*\n\s*([а-яА-Яa-zA-Z])', r'\1\2', t)
    # Fix inline Cyrillic hyphenations (что-л., кого-л., где-то, из-за, по-английски)
    t = re.sub(r'([а-яА-Яa-zA-Z])\s*Ч\s*([а-яА-Яa-zA-Z])', r'\1-\2', t)
    return t

all_lines = []
for p_idx, page in enumerate(reader.pages[10:], 11):
    raw_txt = page.extract_text()
    if not raw_txt:
        continue
    lines = raw_txt.split('\n')
    # Filter running header on line 0
    if lines and re.match(r'^\s*[a-zA-Z\-\s\']+\s+\d+\s+[a-zA-Z\-\s\']+\s*$', lines[0].strip()):
        lines = lines[1:]
    for l in lines:
        l_str = l.strip()
        if l_str:
            all_lines.append(l_str)

print(f"Extracted {len(all_lines):,} lines in {time.time() - t0:.2f}s.")

# 3. INDEX ENTRIES
print("\n[3/6] Indexing dictionary entries and continuations...")

NON_HEADWORDS = {
    'pl', 'sing', 'p. p.', 'p.p.', 'pres. p.', 'v', 'n', 'a', 'adv', 'attr.',
    'predic.', 'int', 'cj', 'prep', 'etc.', 'smth.', 'smb.', 'уст.', 'разг.',
    'мор.', 'тех.', 'спорт.', 'книжн.', 'мед.', 'анат.', 'бот.', 'воен.',
    'юр.', 'ком.', 'амер.', 'брит.', 'past', 'part.', 'cp.', 'pass.', 'perf.',
    'pres.', 'fut.', 'imper.', 'conj.', 'inter.', 'indef.', 'pers.', 'refl.'
}

def match_headword_line(line):
    # Pattern 1: word [transcription] rest
    m = re.match(r'^([a-zA-Z][a-zA-Z\-\'\s]*?(?:\s+(?:I{1,3}|IV|V|\d+)(?:,\s*\d+)?)?)\s*\[([^\]]*)\]\s*(.*)$', line)
    if m:
        raw_hw = m.group(1).strip()
        first_tok = raw_hw.split()[0].lower()
        if first_tok not in NON_HEADWORDS and not re.search(r'[а-яА-Я]', raw_hw) and len(raw_hw) >= 2:
            return raw_hw, m.group(2).strip(), m.group(3).strip()
            
    # Pattern 2: word continuation without transcription: e.g. 'break I, 2  2. n ...'
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

# 4. PARSER LOGIC
POS_MAP = {
    'n': 'noun',
    'v': 'verb',
    'vi': 'verb',
    'vt': 'verb',
    'a': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'cj': 'conjunction',
    'int': 'interjection',
    'pron': 'pronoun',
    'num': 'numeral',
    'predic': 'adjective',
    'p. p.': 'verb'
}

REGISTER_MAP = {
    'тех.': 'техническое',
    'разг.': 'разговорное',
    'уст.': 'устаревшее',
    'спорт.': 'спорт',
    'мор.': 'морской термин',
    'книжн.': 'книжное',
    'мед.': 'медицина',
    'анат.': 'анатомия',
    'бот.': 'ботаника',
    'зоол.': 'зоология',
    'воен.': 'военное',
    'муз.': 'музыка',
    'юр.': 'юридическое',
    'ком.': 'коммерческое',
    'финанс.': 'финансы',
    'амер.': 'американизм',
    'брит.': 'британизм',
    'ирон.': 'ироническое',
    'шутл.': 'шутливое',
    'бран.': 'бранное',
    'груб.': 'грубое',
    'детск.': 'детское',
    'поэт.': 'поэтическое',
    'театр.': 'театр',
    'жарг.': 'жаргон',
    'ав.': 'авиация',
    'авто': 'автомобильное',
    'ист.': 'историческое',
    'парл.': 'парламентское'
}

def extract_definition_and_examples(headword, sense_text):
    clauses = [c.strip() for c in sense_text.split(';') if c.strip()]
    def_clauses = []
    examples = []
    
    for c in clauses:
        m = re.match(r'^([a-zA-Z~\s\-\,\'\"\(\)\/\.\!\?]+)\s+([а-яА-Я].*)$', c)
        if m:
            en_raw = m.group(1).strip()
            ru_raw = m.group(2).strip()
            if en_raw.lower() in ('refl.', 'pl', 'sing', 'attr.', 'predic.', 'cj', 'prep', 'part.', 'pass.', 'perf.', 'pres. p.', 'p. p.'):
                def_clauses.append(c)
                continue
            en_clean = en_raw.replace('~', headword).strip()
            en_clean = re.sub(r'[\s;:,]+$', '', en_clean)
            ru_clean = re.sub(r'[\s;:,]+$', '', ru_raw)
            if len(en_clean) >= 2 and len(ru_clean) >= 2:
                examples.append({'en': en_clean, 'ru': ru_clean})
            else:
                def_clauses.append(c)
        else:
            m_embedded = re.search(r'(\b(?:to\s+[a-zA-Z~]|that\s+is|the\s+[a-zA-Z~]|in\s+[a-zA-Z~]|with\s+[a-zA-Z~]|[a-zA-Z~]+\s+[a-zA-Z~]+)[a-zA-Z~\s\-\,\'\"\(\)\/\.\!\?]*)\s+([а-яА-Я].*)', c)
            if m_embedded:
                prefix = c[:m_embedded.start()].strip(' ;,')
                if prefix:
                    def_clauses.append(prefix)
                en_clean = m_embedded.group(1).strip().replace('~', headword)
                en_clean = re.sub(r'[\s;:,]+$', '', en_clean)
                ru_clean = m_embedded.group(2).strip()
                ru_clean = re.sub(r'[\s;:,]+$', '', ru_clean)
                if en_clean and ru_clean:
                    examples.append({'en': en_clean, 'ru': ru_clean})
            else:
                def_clauses.append(c)
                
    main_def = '; '.join(def_clauses)
    if not main_def and examples:
        main_def = examples[0]['ru']
        
    return main_def, examples

def parse_muller_body(headword, body_text):
    meanings = []
    
    # POS split: e.g. "1. n ... 2. v (caught) ..."
    pos_split_pattern = r'(?:^|\s)(\d+\.\s*(?:n|v|vi|vt|a|adv|prep|cj|int|pron|num|predic\.|p\.\s*p\.)(?:\s*\([^\)]*\))?)'
    pos_matches = list(re.finditer(pos_split_pattern, body_text))
    
    pos_sections = []
    if pos_matches:
        for idx, pm in enumerate(pos_matches):
            s_start = pm.start()
            s_end = pos_matches[idx + 1].start() if idx + 1 < len(pos_matches) else len(body_text)
            chunk = body_text[s_start:s_end].strip()
            
            hdr = re.match(r'^\d+\.\s*([a-zA-Z\.\s]+(?:\s*\([^\)]*\))?)', chunk)
            if hdr:
                raw_pos = hdr.group(1).strip()
                content = chunk[hdr.end():].strip()
                pos_sections.append((raw_pos, content))
    else:
        single_m = re.search(r'\b(n|v|vi|vt|a|adv|prep|cj|int|pron|num|predic\.|p\.\s*p\.)(?:\s*\([^\)]*\))?\s+', body_text)
        if single_m:
            raw_pos = single_m.group(1).strip()
            content = body_text[single_m.end():].strip()
            pos_sections.append((raw_pos, content))
        else:
            pos_sections.append(('n', body_text.strip()))
            
    meaning_id = 1
    for raw_pos, content in pos_sections:
        clean_pos_token = raw_pos.split()[0].lower().strip('.')
        clean_pos = POS_MAP.get(clean_pos_token, 'noun')
        
        # Clean section-level phrasals / idioms
        sec_content = content
        if '¬' in sec_content:
            sec_content = sec_content.split('¬', 1)[0]
        if '♦' in sec_content:
            sec_content = sec_content.split('♦', 1)[0]
            
        # Check for numbered senses 1), 2), 3)
        sense_splits = list(re.finditer(r'(?:^|\s)(\d+\))\s*', sec_content))
        if sense_splits:
            for s_idx, sm in enumerate(sense_splits):
                s_start = sm.end()
                s_end = sense_splits[s_idx + 1].start() if s_idx + 1 < len(sense_splits) else len(sec_content)
                sense_raw = sec_content[s_start:s_end].strip()
                
                registers = []
                cleaned_sense = sense_raw
                for reg_abbr, reg_full in REGISTER_MAP.items():
                    if reg_abbr in cleaned_sense:
                        registers.append(reg_full)
                        cleaned_sense = cleaned_sense.replace(reg_abbr, '').strip()
                        
                def_text, examples = extract_definition_and_examples(headword, cleaned_sense)
                def_text = re.sub(r'^[,\s;:]+', '', def_text).strip()
                def_text = re.sub(r'[,\s;:]+$', '', def_text).strip()
                
                if def_text and len(def_text) >= 2:
                    meanings.append({
                        "id": meaning_id,
                        "partOfSpeech": clean_pos,
                        "translation": def_text,
                        "examples": examples,
                        "primary": False,
                        "register": registers
                    })
                    meaning_id += 1
        else:
            registers = []
            cleaned_sense = sec_content
            for reg_abbr, reg_full in REGISTER_MAP.items():
                if reg_abbr in cleaned_sense:
                    registers.append(reg_full)
                    cleaned_sense = cleaned_sense.replace(reg_abbr, '').strip()
                    
            def_text, examples = extract_definition_and_examples(headword, cleaned_sense)
            def_text = re.sub(r'^[,\s;:]+', '', def_text).strip()
            def_text = re.sub(r'[,\s;:]+$', '', def_text).strip()
            
            if def_text and len(def_text) >= 2:
                meanings.append({
                    "id": meaning_id,
                    "partOfSpeech": clean_pos,
                    "translation": def_text,
                    "examples": examples,
                    "primary": False,
                    "register": registers
                })
                meaning_id += 1
                
    return meanings

# 5. ALIGN ALL OXFORD 5000 ENTRIES
print("\n[4/6] Aligning all 4,982 Oxford words...")

matched_count = 0
fallback_count = 0
updated_oxford = []

for item in oxford_data:
    w = item.get('word', '').strip()
    w_lower = w.lower()
    
    muller_entries = entry_index.get(w_lower, [])
    
    if muller_entries:
        all_parsed_meanings = []
        for m_entry in muller_entries:
            all_parsed_meanings.extend(parse_muller_body(w, m_entry['body']))
            
        if all_parsed_meanings:
            for idx, m in enumerate(all_parsed_meanings, 1):
                m['id'] = idx
                m['primary'] = (idx == 1)
            item['meanings'] = all_parsed_meanings
            matched_count += 1
        else:
            fallback_count += 1
    else:
        # Fallback cleanup
        existing_meanings = item.get('meanings', [])
        cleaned_existing = []
        for idx, em in enumerate(existing_meanings, 1):
            tr = em.get('translation', '')
            tr = clean_typography(tr)
            tr = re.sub(r'^[,\s;:]+', '', tr).strip()
            tr = re.sub(r'[,\s;:]+$', '', tr).strip()
            em['id'] = idx
            em['translation'] = tr
            em['primary'] = (idx == 1)
            cleaned_existing.append(em)
        item['meanings'] = cleaned_existing
        fallback_count += 1
        
    updated_oxford.append(item)

print(f"Matched with Muller: {matched_count} words ({matched_count/len(oxford_data)*100:.1f}%)")
print(f"Preserved & Cleaned: {fallback_count} words ({fallback_count/len(oxford_data)*100:.1f}%)")

# 6. QUALITY VERIFICATION
print("\n[5/6] Running Quality Checks...")

# Benchmark words verification
benchmark_words = ['catch', 'deal', 'press', 'break', 'board', 'table', 'water', 'run', 'set', 'fall']
for bw in benchmark_words:
    e = next((w for w in updated_oxford if w['word'].lower() == bw), None)
    if e:
        print(f"\nWord '{bw}' ({len(e['meanings'])} meanings):")
        for m in e['meanings'][:4]:
            ex_len = len(m['examples'])
            print(f"  #{m['id']} [{m['partOfSpeech']}] {m['translation']} (examples: {ex_len})")

# Artifact check across all entries
art_count = 0
for w in updated_oxford:
    for m in w.get('meanings', []):
        tr = m.get('translation', '')
        if '/accent' in tr or '¬' in tr or '♦' in tr:
            art_count += 1
            print(f"Error in {w['word']}: {tr}")

if art_count == 0:
    print("\n✓ 100% CLEAN: Zero /accent, ¬, or ♦ artifacts across all 4,982 words!")

# 7. SAVE DATASETS
print("\n[6/6] Writing updated oxford_5000.json and src/data/oxford_5000.json...")

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(updated_oxford, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(updated_oxford, f, ensure_ascii=False, indent=2)

print(f"Completed in {time.time() - t0:.2f}s total.")
print("=" * 70)
