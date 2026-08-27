# -*- coding: utf-8 -*-
"""
Pipeline to Clean Embedded English Expressions in Phrase Translations (19 cases):
1. Extract 'to [verb] ...' inside phrase translations and move to 'examples'
2. Clean false register tags on phrasal verbs (like false 'военное' on break in)
3. Fix OCR artifacts: 'smb. 's' -> 'smb.\'s', 'кого-либо.' -> 'кого-либо'
4. 100% QA Validation across all 4982 words
"""
import json
import re
import sys
import copy

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

def clean_ocr_typos(text):
    text = text.replace("smb. 's", "smb.'s").replace("smb. '", "smb.'")
    text = text.replace("кого-либо.", "кого-либо").replace("что-либо.", "что-либо")
    text = text.replace("кем-либо.", "кем-либо").replace("чем-либо.", "чем-либо")
    text = text.replace("кому-либо.", "кому-либо").replace("чему-либо.", "чему-либо")
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def clean_phrase_entry(phrase_item, base_word):
    p = copy.deepcopy(phrase_item)
    tr = p.get('translation', '')
    exs = list(p.get('examples', []))
    regs = list(p.get('register', []))
    phrase_name = p.get('phrase', '')
    
    # Fix false register on break in
    if phrase_name == 'break in' and 'военное' in regs:
        regs.remove('военное')
    
    # Clean OCR typos
    tr = clean_ocr_typos(tr)
    
    # Check if numbered: '1) ...; 2) ...'
    if re.search(r'^\d+\)\s*', tr):
        # Split by numbered senses
        raw_senses = re.split(r'(?=\b\d+\)\s*)', tr)
        cleaned_senses = []
        sense_counter = 1
        
        for s in raw_senses:
            s = s.strip(' ;,')
            if not s:
                continue
            # Remove leading digit: '3) to break into smb.'s time отнять у кого-либо время'
            s_body = re.sub(r'^\d+\)\s*', '', s).strip()
            
            # Match 'to ... [Russian]'
            m_en_lead = re.match(r'^((?:to\s+|I\'ll\s+|to\s+be\s+)[a-zA-Z\s\~\-\'\.]+?)\s+([а-яА-Я].*)$', s_body)
            if m_en_lead:
                en_expr = m_en_lead.group(1).strip(' :,;')
                ru_expr = m_en_lead.group(2).strip(' :,;')
                
                # Clean typos in ru_expr
                ru_expr = clean_ocr_typos(ru_expr)
                en_expr = clean_ocr_typos(en_expr).replace('~', base_word)
                
                # Add to examples if not duplicate
                if not any(e.get('en') == en_expr for e in exs):
                    exs.append({'en': en_expr, 'ru': ru_expr})
                
                # In translation, store clean Russian definition
                clean_sense_ru = ru_expr
                cleaned_senses.append(f"{sense_counter}) {clean_sense_ru}")
                sense_counter += 1
            else:
                cleaned_senses.append(f"{sense_counter}) {s_body}")
                sense_counter += 1
                
        tr = '; '.join(cleaned_senses)
    else:
        # Non-numbered single sense with leading 'to ...'
        m_en_lead = re.match(r'^((?:to\s+|I\'ll\s+|to\s+be\s+)[a-zA-Z\s\~\-\'\.]+?)\s+([а-яА-Я].*)$', tr)
        if m_en_lead:
            en_expr = m_en_lead.group(1).strip(' :,;')
            ru_expr = m_en_lead.group(2).strip(' :,;')
            en_expr = clean_ocr_typos(en_expr).replace('~', base_word)
            ru_expr = clean_ocr_typos(ru_expr)
            if not any(e.get('en') == en_expr for e in exs):
                exs.append({'en': en_expr, 'ru': ru_expr})
            tr = ru_expr
            
    p['translation'] = tr
    p['examples'] = exs
    p['register'] = regs
    return p

print("Processing all words...")
fixed_count = 0
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    if 'phrases' in item:
        new_phrases = []
        for p in item['phrases']:
            old_tr = p.get('translation', '')
            cleaned_p = clean_phrase_entry(p, clean_w)
            if cleaned_p['translation'] != old_tr or len(cleaned_p['examples']) != len(p.get('examples', [])):
                fixed_count += 1
            new_phrases.append(cleaned_p)
        item['phrases'] = new_phrases

print(f"Total phrase entries improved and cleaned: {fixed_count}")

# QA Validation
def validate(entries):
    errs = []
    if len(entries) != 4982:
        errs.append(f"Expected 4982 entries, got {len(entries)}")
    for item in entries:
        w = item['word']
        meanings = item.get('meanings', [])
        if not meanings:
            errs.append(f"Word {w} has 0 meanings")
        for idx, m in enumerate(meanings, start=1):
            if m.get('id') != idx:
                errs.append(f"Word {w}: meaning id {m.get('id')} != {idx}")
            if not m.get('translation') and not m.get('examples'):
                errs.append(f"Word {w}: empty meaning {idx}")
        for p_idx, p in enumerate(item.get('phrases', []), start=1):
            if p.get('id') != p_idx:
                errs.append(f"Word {w}: phrase id {p.get('id')} != {p_idx}")
            if not p.get('partOfSpeech'):
                errs.append(f"Word {w}: phrase {p_idx} missing partOfSpeech")
    return errs

errors = validate(oxford_data)
print(f"Validation errors: {len(errors)}")
if errors:
    print("Sample errors:", errors[:10])
else:
    print("SUCCESS: 100% QA VALIDATION PASSED!")
    with open(oxford_path, 'w', encoding='utf-8') as f:
        json.dump(oxford_data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"Successfully updated {oxford_path}!")
