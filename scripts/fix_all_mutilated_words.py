# -*- coding: utf-8 -*-
"""
Deep Fix for Mutilated Russian Words caused by historical abbreviation stripping.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

def fix_mutilated_russian_text(t):
    if not t:
        return ""
    # 1. из уст в уста (уст. stripped)
    t = re.sub(r'\bиз\s+в\s+а\b', 'из уст в уста', t)
    t = re.sub(r'\bиз\s+в\s+уста\b', 'из уст в уста', t)
    t = re.sub(r'\bиз\s+уст\s+в\s+а\b', 'из уст в уста', t)
    
    # 2. собираться (собир. stripped)
    t = re.sub(r'\bаться\s+сделать\s+что(?:-|\s*)?л(?:ибо|\b|\.)', 'собираться сделать что-либо', t)
    t = re.sub(r'^\s*аться\s*\(', 'собираться (', t)
    t = re.sub(r'\bаться\s+уходить\b', 'собираться уходить', t)
    t = re.sub(r'\bаться\s+уйти\b', 'собираться уйти', t)
    
    # 3. моря / в море (мор. stripped)
    t = re.sub(r'\bизбороздить\s+все\s+я\s+и\s+океаны\b', 'избороздить все моря и океаны', t)
    t = re.sub(r'\bвсе\s+я\s+и\s+океаны\b', 'все моря и океаны', t)
    t = re.sub(r'\bвыходить\s+в\s+е\b', 'выходить в море', t)
    t = re.sub(r'\bв\s+е\b', 'в банке', t) # or в море context
    
    # 4. Clean trailing garbage and numbers inside translations
    t = re.sub(r'\[ср\.\s*тж\.\s*\d+\)\]\s*\d+\)\s*.*$', '', t)
    
    # 5. Clean punctuation
    t = re.sub(r'\s+', ' ', t).strip()
    return t

fixed_items = 0
for item in oxford_data:
    for m in item['meanings']:
        old_tr = m.get('translation', '')
        new_tr = fix_mutilated_russian_text(old_tr)
        if new_tr != old_tr:
            fixed_items += 1
            m['translation'] = new_tr
            
    for p in item.get('phrases', []):
        old_tr = p.get('translation', '')
        new_tr = fix_mutilated_russian_text(old_tr)
        if new_tr != old_tr:
            fixed_items += 1
            p['translation'] = new_tr

print(f"Fixed {fixed_items} mutilated entries!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

# Verify round
by_word = {x['word']: x for x in oxford_data}
print("\n=== ROUND ===")
for p in by_word['round'].get('phrases', []):
    if 'to go the round' in p['phrase']:
        print(f"  [{p['id']}] {p['phrase']}: '{p['translation']}'")

print("\n=== SWEEP ===")
for p in by_word['sweep'].get('phrases', []):
    if 'все моря' in p['translation'] or 'океаны' in p['translation']:
        print(f"  [{p['id']}] {p['phrase']}: '{p['translation']}'")

print("\n=== BE ===")
for p in by_word['be'].get('phrases', []):
    if 'собираться' in p['translation']:
        print(f"  [{p['id']}] {p['phrase']}: '{p['translation']}'")
