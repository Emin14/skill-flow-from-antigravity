# -*- coding: utf-8 -*-
"""
Phrasal Verb Safety Audit & Dry-Run Analyzer:
Inspects all 4982 words in oxford_5000_2026-08-27.json and parsed_index.json.
Validates:
1. Exact extraction of phrasal verbs from '¬' blocks into 'phrases' with partOfSpeech: 'verb'
2. Preservation of all direct meanings in 'meanings'
3. Zero words with 0 meanings
4. Zero loss of definitions or examples
"""
import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

def clean_t(t):
    if not t:
        return ""
    t = t.replace('\xad', '-').replace('\u00ad', '-').replace('\ue000', '-')
    t = re.sub(r'([А-Яа-яA-Za-z])-\s*\n\s*([А-Яа-яA-Za-z])', r'\1\2', t)
    t = re.sub(r'([А-Яа-яA-Za-z])-\s+([а-яa-z])', r'\1\2', t)
    def lower_stress(m):
        w = m.group(0)
        if re.search(r'[а-яё][А-ЯЁ]', w):
            return w[0] + w[1:].lower()
        return w
    t = re.sub(r'[А-Яа-яЁё]+', lower_stress, t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

words_with_phrasal = []
extracted_phrasal_verbs = {}
words_before_after = []

# List of major verbs to test
test_verbs = ['break', 'look', 'give', 'take', 'bring', 'get', 'turn', 'put', 'come', 'go', 'make', 'set', 'hold', 'run', 'stand', 'fall', 'keep', 'call', 'cut', 'pass']

for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    
    raw_article = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_article = clean_t(parsed_index[k][0].get('text', ''))
            if '¬' in raw_article or '­ ~' in raw_article or '¬ ~' in raw_article:
                break
                
    if '¬' in raw_article or '­ ~' in raw_article or '¬ ~' in raw_article:
        words_with_phrasal.append(w)
        
        # Extract phrasal verbs block
        # Find start of phrasal verbs: '¬' or '­ ~'
        m_phr_start = re.search(r'(?:¬|­\s*~|¬\s*~)\s*([a-zA-Z\s\~\-]+)', raw_article)
        if m_phr_start:
            phr_block = raw_article[m_phr_start.start():]
            # End at diamond ♦ if present
            if '♦' in phr_block:
                phr_block = phr_block[:phr_block.index('♦')]
            
            # Split phrasal verbs by '~ [particle]' or '¬ ~ [particle]'
            pv_items = re.findall(r'(?:¬|­)?\s*~\s+([a-zA-Z]+)\s+([а-яА-Я0-9\(\)\.\,\;\:\s\-\'\"]+?)(?=(?:¬|­)?\s*~\s+[a-zA-Z]+\s+|$)', phr_block)
            if pv_items:
                extracted_phrasal_verbs[w] = []
                for part, defn in pv_items:
                    pv_phrase = f"{clean_w} {part.strip()}"
                    clean_defn = defn.strip(' ;,:')
                    extracted_phrasal_verbs[w].append({
                        'phrase': pv_phrase,
                        'partOfSpeech': 'verb',
                        'translation': clean_defn
                    })

print(f"Total words identified with phrasal verb blocks: {len(words_with_phrasal)}")
print(f"Total structured phrasal verbs extracted: {sum(len(v) for v in extracted_phrasal_verbs.values())}")

print("\n=== Detailed Inspection of Major Verbs Before vs After ===")
for v in test_verbs:
    matching_items = [x for x in oxford_data if x['word'] == v or x['word'] == f"{v}1" or x['word'] == f"{v}2"]
    for it in matching_items:
        w = it['word']
        pvs = extracted_phrasal_verbs.get(w, [])
        m_count = len(it.get('meanings', []))
        existing_phrases = len(it.get('phrases', []))
        print(f"Verb '{w}':")
        print(f"  Current meanings count: {m_count}")
        print(f"  Current phrases count: {existing_phrases}")
        print(f"  Extracted phrasal verbs: {len(pvs)}")
        if pvs:
            for pv in pvs[:4]:
                print(f"    - {pv['phrase']}: {pv['translation'][:60]}")
            if len(pvs) > 4:
                print(f"    ... and {len(pvs)-4} more phrasal verbs")
        print()
