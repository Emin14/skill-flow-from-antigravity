# -*- coding: utf-8 -*-
"""
Deep Full Audit across all 4980 words in oxford_5000_2026-08-27.json.
"""
import json, re, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

errors = []
CANONICAL_POS = {"noun", "verb", "adjective", "adverb", "preposition", "conjunction", "pronoun", "numeral", "interjection", "article"}

# 1. Total entry count
if len(oxford_data) != 4980:
    errors.append(f"Invariant 1 Failed: Expected 4980 entries, got {len(oxford_data)}")

# 2. Iterate through all words
for item_idx, item in enumerate(oxford_data):
    w = item.get('word', '')
    if not w:
        errors.append(f"Invariant 2 Failed: Item at index {item_idx} has empty 'word'")
        continue
        
    cefr = item.get('cefr')
    if cefr not in {"a1", "a2", "b1", "b2", "c1"}:
        errors.append(f"Invariant 2 Failed: Word '{w}' has invalid CEFR '{cefr}'")
        
    rank = item.get('frequency_rank')
    if not isinstance(rank, int) or rank <= 0:
        errors.append(f"Invariant 2 Failed: Word '{w}' has invalid frequency rank {rank}")
        
    meanings = item.get('meanings', [])
    if not meanings:
        errors.append(f"Invariant 3 Failed: Word '{w}' has empty meanings array")
        
    # Check meanings
    for m_idx, m in enumerate(meanings, start=1):
        mid = m.get('id')
        if mid != m_idx:
            errors.append(f"Invariant 4 Failed: Word '{w}' meaning id {mid} does not match expected index {m_idx}")
            
        pos = m.get('partOfSpeech')
        if pos not in CANONICAL_POS:
            errors.append(f"Invariant 3 Failed: Word '{w}' meaning {m_idx} has invalid POS '{pos}'")
            
        tr = m.get('translation', '')
        if not tr or not tr.strip():
            errors.append(f"Invariant 5 Failed: Word '{w}' meaning {m_idx} has empty translation")
            
        if '~' in tr:
            errors.append(f"Invariant 6 Failed: Word '{w}' meaning {m_idx} has unexpanded tilde: '{tr}'")
            
        if re.search(r'\bpl\b', tr) and 'при англ. мн. ч.' not in tr:
            errors.append(f"Invariant 7 Failed: Word '{w}' meaning {m_idx} has raw 'pl': '{tr}'")
            
        # Check detached lettered markers: e.g. "; б) воздать..." (not within parentheses like "(— в)", "(453,6 г)")
        if re.search(r';\s*[бвгдежзик]\)\s+[А-Яа-я]', tr) and not re.search(r'указывает на|служит для|обозначает', tr, re.I):
            errors.append(f"Invariant 8 Failed: Word '{w}' meaning {m_idx} has detached lettered marker: '{tr}'")
            
        # Check OCR artifacts
        if re.search(r'<i>|</i>|♦|¬|≅|\(cid:\d+\)|\ue000|\u00ad', tr):
            errors.append(f"Invariant 14 Failed: Word '{w}' meaning {m_idx} contains OCR/formatting artifacts: '{tr}'")
            
        regs = m.get('register')
        if not isinstance(regs, list):
            errors.append(f"Invariant 13 Failed: Word '{w}' meaning {m_idx} register is not a list")
            
        # Check examples in meaning
        for e_idx, ex in enumerate(m.get('examples', [])):
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            if not en or not en.strip():
                errors.append(f"Invariant 11 Failed: Word '{w}' meaning {m_idx} example {e_idx} has empty 'en'")
            if not ru or not ru.strip():
                errors.append(f"Invariant 11 Failed: Word '{w}' meaning {m_idx} example {e_idx} has empty 'ru'")
            if '~' in en:
                errors.append(f"Invariant 6 Failed: Word '{w}' meaning {m_idx} example {e_idx} has unexpanded tilde in en: '{en}'")
            if re.search(r'^(?:ком|воен|мор|ав|ж\.-д|тех|физ|разг|сл|спорт|эл|уст)\.\s+', ru, re.I):
                errors.append(f"Invariant 9 Failed: Word '{w}' meaning {m_idx} example {e_idx} has unextracted register abbreviation in ru: '{ru}'")
            if 'register' in ex and not isinstance(ex['register'], list):
                errors.append(f"Invariant 13 Failed: Word '{w}' meaning {m_idx} example {e_idx} register is not a list")

    # Check phrases
    for p_idx, p in enumerate(item.get('phrases', []), start=1):
        pid = p.get('id')
        if pid != p_idx:
            errors.append(f"Invariant 4 Failed: Word '{w}' phrase id {pid} does not match expected index {p_idx}")
            
        phrase = p.get('phrase', '')
        if not phrase or not phrase.strip():
            errors.append(f"Invariant 12 Failed: Word '{w}' phrase {p_idx} has empty 'phrase'")
            
        ptr = p.get('translation', '')
        if not ptr or not ptr.strip():
            errors.append(f"Invariant 12 Failed: Word '{w}' phrase {p_idx} has empty translation")
            
        ppos = p.get('partOfSpeech')
        if ppos not in CANONICAL_POS:
            errors.append(f"Invariant 3 Failed: Word '{w}' phrase {p_idx} has invalid POS '{ppos}'")
            
        if '~' in ptr:
            errors.append(f"Invariant 6 Failed: Word '{w}' phrase {p_idx} has unexpanded tilde in translation: '{ptr}'")
            
        if 'register' in p and not isinstance(p['register'], list):
            errors.append(f"Invariant 13 Failed: Word '{w}' phrase {p_idx} register is not a list")

print(f"=== DEEP AUDIT RESULTS ===")
print(f"Total Words Audited: {len(oxford_data)}")
print(f"Total Errors Found: {len(errors)}")
if errors:
    for e in errors[:50]:
        print(f"  [ERROR] {e}")
else:
    print(">>> 100% INVARIANTS PASSED! ZERO ERRORS DETECTED! <<<")
