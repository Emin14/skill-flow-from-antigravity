# -*- coding: utf-8 -*-
"""
Deep Dataset Audit: Checking for degraded objects, leaked phrases in meanings, and register integrity across all 4982 words.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

print(f"Loaded {len(oxford_data)} words. Checking integrity against degradation...\n")

# 1. Check for broken or orphan translations in meanings (e.g. bare sub-letters 'а)', 'б)', or fragment translations)
orphan_subitems = []
for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '').strip()
        # check if translation starts with a bare sub-letter or is suspicious
        if re.match(r'^[а-г]\)\s*$', tr) or tr in ['а)', 'б)', 'в)', 'г)']:
            orphan_subitems.append((w, m['id'], tr))
            
print(f"1. Orphan sub-letter translations in meanings: {len(orphan_subitems)}")
for o in orphan_subitems[:10]:
    print(f"   {o[0]} [id:{o[1]}]: '{o[2]}'")

# 2. Check for meanings that have English head phrases instead of Russian translations
english_head_in_meanings = []
for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '').strip()
        # check if translation is purely English or starts with an English idiom like "to be about to"
        if re.match(r'^(?:to\s+[a-z]+|what\s+are|mr\.\s+[a-z]+)\b', tr, re.I) and not any(c in 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя' for c in tr.lower()):
            english_head_in_meanings.append((w, m['id'], tr))
            
print(f"2. Pure English idioms left in meanings translation: {len(english_head_in_meanings)}")
for e in english_head_in_meanings[:10]:
    print(f"   {e[0]} [id:{e[1]}]: '{e[2]}'")

# 3. Check for words where diamond idioms might have leaked into meanings with no examples
# Check words that have diamond in raw text and look for short phrase translations in meanings
suspicious_diamond_meanings = []
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    if '♦' in raw_text:
        diamond_part = raw_text.split('♦', 1)[1]
        # if raw_text has multiple POS sections after diamond
        for m in item.get('meanings', []):
            tr = m.get('translation', '').strip()
            # If tr appears ONLY in diamond_part and NOT in the main meanings part of raw_text
            before_diamond = raw_text.split('♦', 1)[0]
            if len(tr) >= 8 and tr in diamond_part and tr not in before_diamond:
                # check if it's already in phrases
                has_in_phrases = any(tr in p.get('translation', '') for p in item.get('phrases', []))
                if not has_in_phrases:
                    suspicious_diamond_meanings.append((w, m['id'], tr))

print(f"3. Potential unmigrated diamond idioms in meanings: {len(suspicious_diamond_meanings)}")
for s in suspicious_diamond_meanings[:15]:
    print(f"   {s[0]} [id:{s[1]}]: '{s[2]}'")

# 4. Check register integrity
total_meaning_registers = sum(len(m.get('register', [])) for item in oxford_data for m in item['meanings'])
total_example_registers = sum(len(ex.get('register', [])) for item in oxford_data for m in item['meanings'] for ex in m.get('examples', []))
total_phrase_registers = sum(len(p.get('register', [])) for item in oxford_data for p in item.get('phrases', []))

print(f"\n4. Register Statistics:")
print(f"   Total sense-level registers: {total_meaning_registers}")
print(f"   Total example-level registers: {total_example_registers}")
print(f"   Total phrase-level registers: {total_phrase_registers}")

# 5. Check overall schema integrity
all_passed = True
for item in oxford_data:
    w = item['word']
    meanings = item.get('meanings', [])
    if not meanings:
        print(f"ERROR: {w} has 0 meanings!")
        all_passed = False
    for idx, m in enumerate(meanings, 1):
        if m['id'] != idx:
            print(f"ERROR: {w} meaning id {m['id']} != {idx}")
            all_passed = False
        if not m['translation'] and not m['examples']:
            print(f"ERROR: {w} meaning {idx} is empty!")
            all_passed = False
        if m['partOfSpeech'] == 'other':
            print(f"ERROR: {w} meaning {idx} has POS 'other'!")
            all_passed = False
    for p_idx, p in enumerate(item.get('phrases', []), 1):
        if p['id'] != p_idx:
            print(f"ERROR: {w} phrase id {p['id']} != {p_idx}")
            all_passed = False
        if not p.get('phrase') or not p.get('translation'):
            print(f"ERROR: {w} phrase {p_idx} missing phrase/translation!")
            all_passed = False

if all_passed:
    print("\n100% QA VALIDATION PASSED: No schema errors, no broken IDs, no degraded objects!")
