# -*- coding: utf-8 -*-
"""
Ultra-Comprehensive Audit and Deep Verification Suite for Oxford 5000 dataset.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')

print("=" * 80)
print("STARTING ULTRA-COMPREHENSIVE DATASET VERIFICATION")
print("=" * 80)

# Check 1: File size and JSON load
try:
    with open(oxford_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"[CHECK 1: JSON PARSE] SUCCESS. Loaded {len(data)} word entries.")
except Exception as e:
    print(f"[CHECK 1: JSON PARSE] FAILED: {e}")
    sys.exit(1)

CANONICAL_POS = {
    "noun", "verb", "adjective", "adverb", "preposition",
    "conjunction", "pronoun", "numeral", "interjection",
    "article", "modal verb", "other"
}

VALID_CEFR = {"a1", "a2", "b1", "b2", "c1"}

# Known abbreviations that must NOT appear in translations
RAW_ABBREVIATIONS = [
    r'\bмор\.', r'\bвоен\.', r'\bюр\.', r'\bком\.', r'\bмед\.', r'\bбиол\.',
    r'\bтех\.', r'\bразг\.', r'\bсл\.', r'\bамер\.', r'\bав\.', r'\bспорт\.',
    r'\bмуз\.', r'\bтеатр\.', r'\bрел\.', r'\bцерк\.', r'\bгеом\.', r'\bмат\.',
    r'\bхим\.', r'\bфиз\.', r'\bбот\.', r'\bзоол\.', r'\bпоэт\.', r'\bуст\.',
    r'\bшутл\.', r'\bбран\.', r'\bирон\.', r'\bпрезр\.', r'\bкнижн\.', r'\bофиц\.',
    r'\bпрос\.', r'\bстихосл\.', r'\bполигр\.', r'\bдип\.', r'\bж\.-д\.'
]

# Prohibited OCR glitch symbols
PROHIBITED_SYMBOLS = ['≅', '¬', '♦', '¿', '\xad', '\u00ad']

# Missing hyphen check in Russian compounds
BROKEN_HYPHENS = [
    (r'\bинженермеханик\b', 'инженер-механик'),
    (r'\bпремьерминистр\b', 'премьер-министр'),
    (r'\bпорусски\b', 'по-русски'),
    (r'\bпоанглийски\b', 'по-английски'),
    (r'\bктото\b', 'кто-то'),
    (r'\bчтото\b', 'что-то'),
    (r'\bгдето\b', 'где-то'),
    (r'\bкогдато\b', 'когда-то'),
    (r'\bкакойто\b', 'какой-то'),
    (r'\bчейто\b', 'чей-то'),
    (r'\bкакнибудь\b', 'как-нибудь'),
    (r'\bчтонибудь\b', 'что-нибудь'),
    (r'\bктонибудь\b', 'кто-нибудь'),
    (r'\bгденибудь\b', 'где-нибудь'),
    (r'\bизза\b', 'из-за'),
    (r'\bизпод\b', 'из-под')
]

errors = []
warnings = []

total_meanings = 0
total_phrases = 0
total_examples = 0
pos_distribution = {}
cefr_distribution = {}

for idx, entry in enumerate(data):
    w = entry.get('word', f'<entry_{idx}>')
    
    # 1. Required top-level fields
    for field in ['word', 'frequency_rank', 'cefr', 'phon_br', 'phon_n_am', 'lists', 'meanings']:
        if field not in entry:
            errors.append(f"Word '{w}': missing required field '{field}'")
            
    # 2. CEFR validity
    cefr = entry.get('cefr')
    if cefr not in VALID_CEFR:
        errors.append(f"Word '{w}': invalid CEFR level '{cefr}'")
    cefr_distribution[cefr] = cefr_distribution.get(cefr, 0) + 1
    
    # 3. Meanings array checks
    meanings = entry.get('meanings', [])
    if not isinstance(meanings, list) or len(meanings) == 0:
        errors.append(f"Word '{w}': meanings must be a non-empty list")
        
    for m_idx, m in enumerate(meanings):
        total_meanings += 1
        expected_id = m_idx + 1
        if m.get('id') != expected_id:
            errors.append(f"Word '{w}': meaning {m_idx} has id {m.get('id')}, expected {expected_id}")
            
        pos = m.get('partOfSpeech')
        if pos not in CANONICAL_POS:
            errors.append(f"Word '{w}' meaning {expected_id}: invalid POS '{pos}'")
        pos_distribution[pos] = pos_distribution.get(pos, 0) + 1
        
        t = m.get('translation', '')
        if not t or not t.strip():
            errors.append(f"Word '{w}' meaning {expected_id}: translation is empty")
            
        # Tilde check
        if '~' in t:
            errors.append(f"Word '{w}' meaning {expected_id}: unexpanded tilde '~' in translation: '{t}'")
            
        # Prohibited symbol check
        for sym in PROHIBITED_SYMBOLS:
            if sym in t:
                errors.append(f"Word '{w}' meaning {expected_id}: prohibited symbol '{sym}' in translation: '{t}'")
                
        # Raw 'pl' check
        if re.search(r'(?<![а-яА-Яa-zA-Z])pl(?![а-яА-Яa-zA-Z])', t) and 'при англ. мн. ч.' not in t:
            errors.append(f"Word '{w}' meaning {expected_id}: raw 'pl' in translation: '{t}'")
            
        # Raw abbreviation prefix check at start of translation
        for ab in RAW_ABBREVIATIONS:
            if re.match(r'^\s*' + ab, t):
                errors.append(f"Word '{w}' meaning {expected_id}: raw register abbreviation at start of translation: '{t}'")
                
        # Broken hyphen check
        for pat, fix in BROKEN_HYPHENS:
            if re.search(pat, t, flags=re.IGNORECASE):
                errors.append(f"Word '{w}' meaning {expected_id}: missing hyphen in '{t}' (expected '{fix}')")
                
        # Examples check
        for ex_idx, ex in enumerate(m.get('examples', [])):
            total_examples += 1
            if not ex.get('en') or not ex.get('ru'):
                errors.append(f"Word '{w}' meaning {expected_id} example {ex_idx}: missing 'en' or 'ru'")
            if '~' in ex.get('en', '') or '~' in ex.get('ru', ''):
                errors.append(f"Word '{w}' meaning {expected_id} example {ex_idx}: unexpanded tilde in example")

    # 4. Phrases array checks
    phrases = entry.get('phrases', [])
    for p_idx, p in enumerate(phrases):
        total_phrases += 1
        expected_p_id = p_idx + 1
        if p.get('id') != expected_p_id:
            errors.append(f"Word '{w}': phrase {p_idx} has id {p.get('id')}, expected {expected_p_id}")
            
        p_text = p.get('phrase', '')
        if not p_text or not p_text.strip():
            errors.append(f"Word '{w}' phrase {expected_p_id}: phrase text is empty")
            
        p_trans = p.get('translation', '')
        if not p_trans or not p_trans.strip():
            errors.append(f"Word '{w}' phrase {expected_p_id}: translation is empty")
            
        if '~' in p_text or '~' in p_trans:
            errors.append(f"Word '{w}' phrase {expected_p_id}: unexpanded tilde in phrase")
            
        for sym in PROHIBITED_SYMBOLS:
            if sym in p_trans or sym in p_text:
                errors.append(f"Word '{w}' phrase {expected_p_id}: prohibited symbol '{sym}' in phrase")

print(f"\n[CHECK 2: DATASET TOTALS]")
print(f"  • Total Words: {len(data)}")
print(f"  • Total Meanings: {total_meanings}")
print(f"  • Total Phrases & Idioms: {total_phrases}")
print(f"  • Total Examples: {total_examples}")

print(f"\n[CHECK 3: CEFR DISTRIBUTION]")
for c, count in sorted(cefr_distribution.items()):
    print(f"  • {c.upper():2s}: {count:4d} words ({count/len(data)*100:.1f}%)")

print(f"\n[CHECK 4: PART OF SPEECH DISTRIBUTION]")
for pos, count in sorted(pos_distribution.items(), key=lambda x: x[1], reverse=True):
    print(f"  • {pos:12s}: {count:5d} meanings ({count/total_meanings*100:.1f}%)")

print(f"\n[CHECK 5: AUDIT ERRORS SUMMARY]")
if len(errors) == 0:
    print("  >>> ZERO ERRORS FOUND! 100% OF VERIFICATIONS PASSED! <<<")
else:
    print(f"  >>> FAILED: {len(errors)} ERRORS FOUND! <<<")
    for e in errors[:20]:
        print(f"    - {e}")

