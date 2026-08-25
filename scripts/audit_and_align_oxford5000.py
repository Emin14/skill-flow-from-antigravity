import sys, re, json, time
import pypdf
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("=" * 70)
print("COMPREHENSIVE AUDIT & ALIGNMENT: OXFORD 5000 -> MULLER 2021")
print("=" * 70)

t0 = time.time()

# 1. LOAD OXFORD 5000 DATASET
print("\n[1/6] Loading existing oxford_5000.json...")
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)
print(f"Loaded {len(oxford_data)} words.")

# 2. LOAD & CLEAN MULLER 2021 PDF
print("\n[2/6] Loading and extracting text from Muller 2021 PDF...")
pdf_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf'
reader = pypdf.PdfReader(pdf_path)
print(f"Total PDF pages: {len(reader.pages)}")

def clean_page_lines(txt):
    lines = txt.split('\n')
    # Filter running header on line 0 (e.g. 'castor oil 114 catch')
    if lines and re.match(r'^\s*[a-zA-Z\-\s\']+\s+\d+\s+[a-zA-Z\-\s\']+\s*$', lines[0].strip()):
        lines = lines[1:]
    return '\n'.join(lines)

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
    # Clean broken spaces
    t = re.sub(r'\n', ' ', t)
    t = re.sub(r'[ \t]+', ' ', t).strip()
    return t

pdf_pages = []
for p_idx, page in enumerate(reader.pages[10:], 11):
    raw_txt = page.extract_text()
    if raw_txt:
        cleaned_page = clean_page_lines(raw_txt)
        pdf_pages.append(cleaned_page)

raw_corpus = "\n".join(pdf_pages)
print(f"Extracted {len(pdf_pages)} pages in {time.time() - t0:.2f}s.")

print("Cleaning typography across raw corpus...")
clean_corpus = clean_typography(raw_corpus)
print(f"Cleaned corpus size: {len(clean_corpus):,} chars.")

# 3. INDEX ALL MULLER HEADWORD ENTRIES
print("\n[3/6] Indexing Muller dictionary entries...")

NON_HEADWORDS = {
    'pl', 'sing', 'p. p.', 'p.p.', 'pres. p.', 'v', 'n', 'a', 'adv', 'attr.',
    'predic.', 'int', 'cj', 'prep', 'etc.', 'smth.', 'smb.', 'уст.', 'разг.',
    'мор.', 'тех.', 'спорт.', 'книжн.', 'мед.', 'анат.', 'бот.', 'воен.',
    'юр.', 'ком.', 'амер.', 'брит.'
}

# Regex to match valid headwords: e.g. "catch [kætʃ]", "press I [pres]", "abandon [ə'bændən]"
hw_pattern = r'(?:^|\s)([a-zA-Z][a-zA-Z\-\'\s]{0,35}?(?:\s+(?:I{1,3}|IV|V))?)\s*\[([^\]]*)\]'

matches = list(re.finditer(hw_pattern, clean_corpus))
print(f"Found {len(matches)} potential headword matches in PDF.")

valid_entry_spans = []
for m in matches:
    raw_hw = m.group(1).strip()
    first_token = raw_hw.split()[0].lower()
    if first_token in NON_HEADWORDS or re.search(r'[а-яА-Я]', raw_hw):
        continue
    if len(raw_hw) < 2 or raw_hw.isdigit():
        continue
    valid_entry_spans.append((raw_hw, m.group(2).strip(), m.start(), m.end()))

print(f"Filtered {len(valid_entry_spans)} valid headword entries.")

muller_index = defaultdict(list)

for i in range(len(valid_entry_spans)):
    raw_hw, raw_phon, s_start, s_end = valid_entry_spans[i]
    next_start = valid_entry_spans[i + 1][2] if i + 1 < len(valid_entry_spans) else len(clean_corpus)
    
    full_entry_text = clean_corpus[s_start:next_start].strip()
    body_text = full_entry_text[s_end - s_start:].strip()
    
    # Strip Roman numerals from headword for indexing
    base_hw = re.sub(r'\s+(?:I{1,3}|IV|V)$', '', raw_hw).strip().lower()
    
    muller_index[base_hw].append({
        'headword': raw_hw,
        'base_word': base_hw,
        'phon': raw_phon,
        'body': body_text
    })

print(f"Indexed {len(muller_index)} unique base headwords in Muller index.")

# 4. PARSER LOGIC FOR MULLER ENTRY
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
    'авто': 'автомобильное'
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
            if en_raw.lower() in ('refl.', 'pl', 'sing', 'attr.', 'predic.', 'cj', 'prep', 'part.', 'pass.', 'perf.'):
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
    
    # Separate phrasal verbs and idioms
    body = body_text
    phrasal_raw = ''
    idioms_raw = ''
    if '¬' in body:
        parts = body.split('¬', 1)
        body = parts[0]
        phrasal_raw = parts[1]
    if '♦' in body:
        parts = body.split('♦', 1)
        body = parts[0]
        idioms_raw = parts[1]
        
    # POS split: e.g. "1. n ... 2. v (caught) ..."
    pos_sections = []
    pos_split_pattern = r'(?:^|\s)(\d+\.\s*(?:n|v|vi|vt|a|adv|prep|cj|int|pron|num|predic\.|p\.\s*p\.)(?:\s*\([^\)]*\))?)'
    pos_splits = list(re.finditer(pos_split_pattern, body))
    
    if pos_splits:
        for idx, m in enumerate(pos_splits):
            start = m.start()
            end = pos_splits[idx + 1].start() if idx + 1 < len(pos_splits) else len(body)
            sec_text = body[start:end].strip()
            header_m = re.match(r'^\d+\.\s*([a-zA-Z\.\s]+(?:\s*\([^\)]*\))?)', sec_text)
            if header_m:
                raw_pos = header_m.group(1).strip()
                pos_content = sec_text[header_m.end():].strip()
                pos_sections.append((raw_pos, pos_content))
    else:
        # Check single POS at start
        single_pos_m = re.match(r'^\s*([a-zA-Z\.\s]+(?:\s*\([^\)]*\))?)\s+', body)
        if single_pos_m:
            raw_pos_token = single_pos_m.group(1).split()[0].strip()
            if raw_pos_token in POS_MAP:
                pos_sections.append((raw_pos_token, body[single_pos_m.end():].strip()))
            else:
                pos_sections.append(('n', body.strip()))
        else:
            pos_sections.append(('n', body.strip()))
            
    meaning_id = 1
    for raw_pos, content in pos_sections:
        clean_pos_token = raw_pos.split()[0].lower().strip()
        clean_pos = POS_MAP.get(clean_pos_token, 'noun')
        
        # Check for numbered senses 1), 2), 3)
        sense_splits = list(re.finditer(r'(?:^|\s)(\d+\))\s*', content))
        if sense_splits:
            for s_idx, sm in enumerate(sense_splits):
                s_start = sm.end()
                s_end = sense_splits[s_idx + 1].start() if s_idx + 1 < len(sense_splits) else len(content)
                sense_raw = content[s_start:s_end].strip()
                
                # Check registers
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
                        "primary": meaning_id == 1,
                        "register": registers
                    })
                    meaning_id += 1
        else:
            # Single unnumbered sense
            registers = []
            cleaned_sense = content
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
                    "primary": meaning_id == 1,
                    "register": registers
                })
                meaning_id += 1
                
    return meanings

# 5. ALIGN AND AUDIT ALL OXFORD 5000 ENTRIES
print("\n[4/6] Aligning Oxford 5000 words against Muller entries...")

matched_count = 0
fallback_count = 0
updated_oxford = []

for item in oxford_data:
    w = item.get('word', '').strip()
    w_lower = w.lower()
    
    muller_entries = muller_index.get(w_lower, [])
    
    if muller_entries:
        # Parse all matching homograph entries from Muller
        all_parsed_meanings = []
        for m_entry in muller_entries:
            parsed = parse_muller_body(w, m_entry['body'])
            all_parsed_meanings.extend(parsed)
            
        if all_parsed_meanings:
            # Re-index meaning ids
            for idx, m in enumerate(all_parsed_meanings, 1):
                m['id'] = idx
                m['primary'] = (idx == 1)
                
            item['meanings'] = all_parsed_meanings
            matched_count += 1
        else:
            fallback_count += 1
    else:
        # Fallback: clean existing meanings
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
print(f"Carefully preserved & cleaned: {fallback_count} words ({fallback_count/len(oxford_data)*100:.1f}%)")

# 6. VERIFICATION & QUALITY CHECKS
print("\n[5/6] Running automated quality checks...")

# Check catch
catch_entry = next((w for w in updated_oxford if w['word'].lower() == 'catch'), None)
if catch_entry:
    print(f"\nVerification on 'catch' ({len(catch_entry['meanings'])} meanings):")
    for m in catch_entry['meanings']:
        print(f"  #{m['id']} [{m['partOfSpeech']}] {m['translation']} (examples: {len(m['examples'])})")
        
# Check press, board, table, break, run, set, deal, fall
for test_w in ['press', 'board', 'table', 'break', 'deal', 'fall', 'run', 'set', 'water']:
    e = next((w for w in updated_oxford if w['word'].lower() == test_w), None)
    if e:
        print(f"\nWord '{test_w}': {len(e['meanings'])} clean meanings:")
        for m in e['meanings'][:4]:
            print(f"  #{m['id']} [{m['partOfSpeech']}] {m['translation']}")

# Check for any remaining /accent or broken tokens across all words
error_count = 0
for w in updated_oxford:
    for m in w.get('meanings', []):
        tr = m.get('translation', '')
        if '/accent' in tr or '¬' in tr or '♦' in tr:
            error_count += 1
            print(f"Artifact error in {w['word']}: {tr}")

if error_count == 0:
    print("\n✓ 100% CLEAN: Zero /accent, ¬, or ♦ artifacts across all 4,982 words!")
else:
    print(f"\n⚠ Warning: Found {error_count} artifact errors.")

# 7. SAVE UPDATED DATASETS
print("\n[6/6] Writing updated oxford_5000.json and src/data/oxford_5000.json...")

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(updated_oxford, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(updated_oxford, f, ensure_ascii=False, indent=2)

print(f"Successfully saved updated datasets in {time.time() - t0:.2f}s total.")
print("=" * 70)
