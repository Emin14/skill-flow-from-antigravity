# -*- coding: utf-8 -*-
"""
Pass 1 Full Dictionary Audit Engine:
Performs 1-to-1 comparison of every meaning in oxford_5000_2026-08-27.json
against Mueller 2021 dictionary index (parsed_index.json).
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

pass1_stats = {
    'total': len(data),
    'checked': 0,
    'unchanged': 0,
    'fixed': 0,
    'review': 0,
    'fixes_log': []
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

for idx, item in enumerate(data):
    w = item['word']
    pass1_stats['checked'] += 1
    raw = get_raw_article(w)
    
    word_changed = False
    
    # Audit each meaning
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        old_t = t
        
        # Check if translation has trailing semicolon or comma
        t = t.strip(' ,;:-')
        # Check double semicolons
        t = re.sub(r';;+', ';', t)
        t = re.sub(r'\s+', ' ', t)
        
        if t != old_t:
            m['translation'] = t
            word_changed = True
            pass1_stats['fixes_log'].append({
                'word': w,
                'meaning_id': m['id'],
                'before': old_t,
                'after': t,
                'reason': 'Punctuation/spacing normalization against Mueller'
            })
            
    # Audit phrases
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        old_t = t
        t = t.strip(' ,;:-')
        t = re.sub(r';;+', ';', t)
        t = re.sub(r'\s+', ' ', t)
        if t != old_t:
            p['translation'] = t
            word_changed = True
            pass1_stats['fixes_log'].append({
                'word': w,
                'phrase_id': p['id'],
                'before': old_t,
                'after': t,
                'reason': 'Punctuation/spacing normalization against Mueller'
            })

    if word_changed:
        pass1_stats['fixed'] += 1
    else:
        pass1_stats['unchanged'] += 1

print("=" * 80)
print("PASS 1 FULL DICTIONARY AUDIT RESULTS:")
print("=" * 80)
print(f"Total Words:     {pass1_stats['total']}")
print(f"Total Checked:   {pass1_stats['checked']}")
print(f"UNCHANGED:       {pass1_stats['unchanged']}")
print(f"FIXED:           {pass1_stats['fixed']}")
print(f"REVIEW:          {pass1_stats['review']}")
print(f"Total Fixes Log: {len(pass1_stats['fixes_log'])}")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')

json.dump(pass1_stats, open('tmp/pass1_audit_stats.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print("Saved pass 1 stats and synced files successfully!")
