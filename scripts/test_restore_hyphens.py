# -*- coding: utf-8 -*-
"""
Fix missing hyphens in all Russian compound pronouns and clean trailing abbreviation dots (либо. -> либо).
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

PRONOUN_BASES = [
    'кто', 'кого', 'кому', 'кем', 'ком',
    'что', 'чего', 'чему', 'чем',
    'какой', 'какого', 'какому', 'каким', 'каком', 'какая', 'какую', 'какой', 'какие', 'каких', 'какими',
    'чей', 'чьего', 'чьему', 'чьим', 'чьём', 'чья', 'чью', 'чьей', 'чье', 'чьё', 'чьи', 'чьих', 'чьими',
    'где', 'куда', 'откуда', 'когда', 'как', 'почему', 'зачем', 'сколь'
]

def restore_hyphens(text):
    if not text:
        return ""
    
    # 1. Restore -либо
    for base in PRONOUN_BASES:
        # Match e.g. кемлибо or кем-либо. or кемлибо.
        pat = rf'\b({re.escape(base)})(?:-|\s*)?либо(?:\.|\b)'
        text = re.sub(pat, rf'\1-либо', text, flags=re.I)
        
    # 2. Restore -то
    for base in PRONOUN_BASES:
        pat = rf'\b({re.escape(base)})(?:-|\s*)?то(?:\.|\b)'
        # exclude words like 'компот', 'лото', 'плато'
        if base in ['кто', 'кого', 'кому', 'кем', 'ком', 'что', 'чего', 'чему', 'чем', 'где', 'куда', 'откуда', 'когда', 'как', 'почему', 'зачем']:
            text = re.sub(rf'\b({re.escape(base)})то\b', rf'\1-то', text, flags=re.I)
            text = re.sub(rf'\b({re.escape(base)})-то\.', rf'\1-то', text, flags=re.I)
            
    # 3. Restore -нибудь
    for base in PRONOUN_BASES:
        pat = rf'\b({re.escape(base)})(?:-|\s*)?нибудь(?:\.|\b)'
        text = re.sub(pat, rf'\1-нибудь', text, flags=re.I)
        
    # 4. Clean trailing dots after hyphenated pronouns: 'кем-либо.' -> 'кем-либо' (except end of sentence)
    text = re.sub(r'(-либо|-то|-нибудь)\.(?=\s*[\)\,\;\:\-]|\s+[а-яА-Яa-zA-Z])', r'\1', text)
    text = re.sub(r'(-либо|-то|-нибудь)\.\s*$', r'\1', text)
    
    # 5. Fix изза -> из-за, изпод -> из-под
    text = re.sub(r'\bизза\b', 'из-за', text, flags=re.I)
    text = re.sub(r'\bизпод\b', 'из-под', text, flags=re.I)
    
    return text

# Test on accountable and others
fixed_count = 0
for item in oxford_data:
    for m in item['meanings']:
        old_tr = m.get('translation', '')
        new_tr = restore_hyphens(old_tr)
        if new_tr != old_tr:
            fixed_count += 1
            m['translation'] = new_tr
    for p in item.get('phrases', []):
        old_tr = p.get('translation', '')
        new_tr = restore_hyphens(old_tr)
        if new_tr != old_tr:
            fixed_count += 1
            p['translation'] = new_tr

print(f"Total entries where hyphens/dots restored: {fixed_count}")

# Check remaining missing hyphens
remaining = 0
for item in oxford_data:
    for m in item['meanings']:
        tr = m.get('translation', '')
        if re.search(r'(?:кемлибо|чемлибо|комулибо|чемулибо|коголибо|чтолибо|гделибо|когдалибо|каклибо)', tr, re.I):
            remaining += 1

print(f"Remaining missing hyphens: {remaining}")

# Check accountable
for item in oxford_data:
    if item['word'] == 'accountable':
        print("=== ACCOUNTABLE ===")
        for m in item['meanings']:
            print(f"  [{m['id']}] {m['translation']}")
