# -*- coding: utf-8 -*-
"""
Comprehensive Deep Audit of oxford_5000_2026-08-27.json:
1. False phrases scanner (words where phrases were created without ♦ or ¬ in source text)
2. English leaks in translation
3. Missing hyphens / compound pronoun glitches
4. POS anomalies ('other' or misplaced POS)
5. Multi-POS transition sanity
6. High-frequency word sampling & manual inspection
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

print(f"Loaded {len(oxford_data)} words. Running deep checks...")

# 1. Check for false phrases (where word in raw dictionary has neither ♦ nor ¬)
false_phrases_words = []
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    if item.get('phrases'):
        # Check if raw_text has diamond or ¬
        if '♦' not in raw_text and '¬' not in raw_text and '­ ~' not in raw_text:
            # Let's inspect what phrases exist
            false_phrases_words.append((w, item['phrases']))

print(f"\n1. Words with phrases but NO diamond or ¬ in raw text: {len(false_phrases_words)}")
for w, phrs in false_phrases_words[:10]:
    print(f"  Word '{w}': {len(phrs)} phrases (e.g. '{phrs[0]['phrase']}': '{phrs[0]['translation'][:50]}')")

# 2. Check for POS == 'other'
other_pos_items = []
for item in oxford_data:
    for m in item['meanings']:
        if m.get('partOfSpeech') == 'other':
            other_pos_items.append((item['word'], m['id'], m['translation']))

print(f"\n2. Meanings with partOfSpeech == 'other': {len(other_pos_items)}")
for w, mid, tr in other_pos_items[:10]:
    print(f"  {w} [{mid}]: '{tr}'")

# 3. Check for English phrase leaks in meanings translations (e.g. 'to [verb]')
english_leaks = []
for item in oxford_data:
    w = item['word']
    for m in item['meanings']:
        tr = m.get('translation', '')
        # Detect leading or trailing English phrases like "to do smth" or "acid test"
        if re.search(r'\bto\s+[a-z]{3,}\s+[a-z]{3,}', tr, re.I):
            english_leaks.append((w, m['id'], tr))

print(f"\n3. English phrase leaks in meanings translations: {len(english_leaks)}")
for w, mid, tr in english_leaks[:10]:
    print(f"  {w} [{mid}]: '{tr}'")

# 4. Check for broken hyphens (-либо, -то, -нибудь)
broken_hyphens = []
for item in oxford_data:
    w = item['word']
    for m in item['meanings']:
        tr = m.get('translation', '')
        if re.search(r'(?:кемлибо|чемлибо|комулибо|чемулибо|коголибо|чтолибо|гделибо|когдалибо|каклибо)', tr, re.I):
            broken_hyphens.append((w, m['id'], tr))
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if re.search(r'(?:кемлибо|чемлибо|комулибо|чемулибо|коголибо|чтолибо|гделибо|когдалибо|каклибо)', tr, re.I):
            broken_hyphens.append((w, f"phr:{p['id']}", tr))

print(f"\n4. Missing hyphens in compound pronouns: {len(broken_hyphens)}")

# 5. Check for empty meanings or invalid IDs
empty_meanings = []
id_errors = []
for item in oxford_data:
    w = item['word']
    meanings = item.get('meanings', [])
    if not meanings:
        empty_meanings.append(w)
    for idx, m in enumerate(meanings, start=1):
        if m.get('id') != idx:
            id_errors.append((w, m.get('id'), idx))
        if not m.get('translation') and not m.get('examples'):
            empty_meanings.append((w, idx))

print(f"\n5. Empty meanings: {len(empty_meanings)}, ID sequence errors: {len(id_errors)}")

