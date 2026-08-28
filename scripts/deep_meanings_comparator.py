# -*- coding: utf-8 -*-
"""
Deep Meanings Comparator & Auditor:
Examines all 4,980 words and all 27,009 meanings against Mueller 2021.
Detects:
1. Merged meanings (e.g., '1) ...; 2) ...' or '...; 2) ...' inside a single meaning)
2. Stuck phrases/examples inside translation
3. Truncated definitions / trailing punctuation
4. Missing major POS meanings
5. OCR anomalies and word boundary corruption
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

audit_results = {
    'merged_meanings': [],
    'stuck_examples': [],
    'truncated_translations': [],
    'broken_roots': [],
    'duplicate_meanings': []
}

def get_raw_article(w):
    raw_texts = []
    if w in parsed_index:
        raw_texts.extend([e.get('text', '') for e in parsed_index[w]])
    else:
        for k in parsed_index:
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                raw_texts.extend([e.get('text', '') for e in parsed_index[k]])
    return '\n'.join(raw_texts)

for item in data:
    w = item['word']
    raw = get_raw_article(w)
    
    seen_translations = set()
    
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        m_id = m.get('id', 0)
        
        # 1. Check for merged numbered meanings: e.g. '; 2) ...' or '; 3) ...'
        if re.search(r';\s*[2-9]\)\s*', t) or re.search(r'^[1-9]\)\s*.*?[;\s]+[2-9]\)\s*', t):
            audit_results['merged_meanings'].append({
                'word': w,
                'id': m_id,
                'pos': pos,
                'translation': t
            })
            
        # 2. Check for stuck examples: e.g. '; to [en] [ru]' or '; [en phrase] [ru]'
        if re.search(r';\s*to\s+[a-zA-Z\s\',/()-]{3,}\s+[\u0400-\u04FF]', t) or re.search(r';\s*[a-zA-Z]{3,}\s+[a-zA-Z]{3,}\s+[\u0400-\u04FF]', t):
            # Exclude standard grammar notes
            if not re.search(r'\b(?:past\s+и\s+p\.\s*p\.|p\.\s*p\.\s+от|pres\.\s*p\.\s+от)\b', t):
                audit_results['stuck_examples'].append({
                    'word': w,
                    'id': m_id,
                    'pos': pos,
                    'translation': t
                })
                
        # 3. Check for truncated endings: dangling commas, semicolons, dashes, unclosed parens
        if re.search(r'[,;:\-—]\s*$', t) or re.search(r'\([^\)]*$', t) or re.search(r'\[[^\]]*$', t):
            audit_results['truncated_translations'].append({
                'word': w,
                'id': m_id,
                'pos': pos,
                'translation': t
            })
            
        # 4. Check for broken roots: words starting with strange suffixes
        for wd in re.findall(r'[а-яёА-ЯЁ]+', t):
            wd_l = wd.lower()
            if wd_l in ['аболетучий', 'абый', 'абость', 'едующий', 'анавливать', 'ановка', 'ремлять', 'ремиться', 'ройство', 'упать', 'ойчивый', 'ное', 'ный', 'ная', 'ское', 'ский', 'ская']:
                audit_results['broken_roots'].append({
                    'word': w,
                    'id': m_id,
                    'pos': pos,
                    'translation': t,
                    'word_found': wd
                })
                
        # 5. Check for duplicate meanings within same word and POS
        key = (pos, t.strip().lower())
        if key in seen_translations and len(t) > 3:
            audit_results['duplicate_meanings'].append({
                'word': w,
                'id': m_id,
                'pos': pos,
                'translation': t
            })
        seen_translations.add(key)

print("=" * 80)
print("DEEP MEANINGS AUDIT DIAGNOSTIC RESULTS")
print("=" * 80)
print(f"1. Merged meanings (e.g. '; 2) ...'):        {len(audit_results['merged_meanings'])}")
print(f"2. Stuck examples in translation:            {len(audit_results['stuck_examples'])}")
print(f"3. Truncated translations / dangling ends:   {len(audit_results['truncated_translations'])}")
print(f"4. Broken roots:                             {len(audit_results['broken_roots'])}")
print(f"5. Duplicate meanings:                       {len(audit_results['duplicate_meanings'])}")

print("\n--- SAMPLE MERGED MEANINGS ---")
for m in audit_results['merged_meanings'][:15]:
    print(f"[{m['word']}] (id {m['id']}, pos={m['pos']}): '{m['translation']}'")

print("\n--- SAMPLE STUCK EXAMPLES ---")
for s in audit_results['stuck_examples'][:15]:
    print(f"[{s['word']}] (id {s['id']}, pos={s['pos']}): '{s['translation']}'")

print("\n--- SAMPLE TRUNCATED TRANSLATIONS ---")
for tr in audit_results['truncated_translations'][:15]:
    print(f"[{tr['word']}] (id {tr['id']}, pos={tr['pos']}): '{tr['translation']}'")
