# -*- coding: utf-8 -*-
"""
Comprehensive Russian Hyphenation & Punctuation Restoration Pipeline.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

PRONOUN_BASES = [
    'кто', 'кого', 'кому', 'кем', 'ком',
    'что', 'чего', 'чему', 'чем', 'чём',
    'какой', 'какого', 'какому', 'каким', 'каком', 'какая', 'какую', 'какой', 'какие', 'каких', 'какими', 'каком-то', 'каким-то',
    'чей', 'чьего', 'чьему', 'чьим', 'чьём', 'чья', 'чью', 'чьей', 'чье', 'чьё', 'чьи', 'чьих', 'чьими',
    'где', 'куда', 'откуда', 'когда', 'как', 'почему', 'зачем', 'сколь'
]

def clean_russian_hyphens(text):
    if not text:
        return ""
    
    # 1. Restore -либо
    for base in PRONOUN_BASES:
        pat = rf'\b({re.escape(base)})(?:-|\s*)?либо(?:\.|\b)'
        text = re.sub(pat, rf'\1-либо', text, flags=re.I)
        
    # 2. Restore -то
    for base in PRONOUN_BASES:
        if base in ['кто', 'кого', 'кому', 'кем', 'ком', 'что', 'чего', 'чему', 'чем', 'чём', 'где', 'куда', 'откуда', 'когда', 'как', 'почему', 'зачем', 'какой', 'какая', 'какое', 'какие', 'каким', 'каком', 'каких']:
            text = re.sub(rf'\b({re.escape(base)})то\b', rf'\1-то', text, flags=re.I)
            text = re.sub(rf'\b({re.escape(base)})-то\.', rf'\1-то', text, flags=re.I)
            
    # 3. Restore -нибудь
    for base in PRONOUN_BASES:
        pat = rf'\b({re.escape(base)})(?:-|\s*)?нибудь(?:\.|\b)'
        text = re.sub(pat, rf'\1-нибудь', text, flags=re.I)
        
    # 4. Clean trailing dot after compound pronouns
    text = re.sub(r'(-либо|-то|-нибудь)\.(?=\s*[\)\,\;\:\-]|\s+[а-яА-Яa-zA-Z]|\s*$)', r'\1', text)
    
    # 5. Fix common hyphenated adverbs
    text = re.sub(r'\bпосвоему\b', 'по-своему', text, flags=re.I)
    text = re.sub(r'\bпомоему\b', 'по-моему', text, flags=re.I)
    text = re.sub(r'\bпотвоему\b', 'по-твоему', text, flags=re.I)
    text = re.sub(r'\bпопрежнему\b', 'по-прежнему', text, flags=re.I)
    text = re.sub(r'\bповидимому\b', 'по-видимому', text, flags=re.I)
    text = re.sub(r'\bизза\b', 'из-за', text, flags=re.I)
    text = re.sub(r'\bизпод\b', 'из-под', text, flags=re.I)
    text = re.sub(r'\bпроявлятьневнимание\b', 'проявлять невнимание', text, flags=re.I)
    
    # 6. Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

print("Restoring hyphens across all words...")
fixed_count = 0
for item in oxford_data:
    for m in item['meanings']:
        old_tr = m.get('translation', '')
        new_tr = clean_russian_hyphens(old_tr)
        if new_tr != old_tr:
            fixed_count += 1
            m['translation'] = new_tr
        for ex in m.get('examples', []):
            ex['ru'] = clean_russian_hyphens(ex.get('ru', ''))
            
    for p in item.get('phrases', []):
        old_tr = p.get('translation', '')
        new_tr = clean_russian_hyphens(old_tr)
        if new_tr != old_tr:
            fixed_count += 1
            p['translation'] = new_tr
        for ex in p.get('examples', []):
            ex['ru'] = clean_russian_hyphens(ex.get('ru', ''))

print(f"Total translations fixed: {fixed_count}")

# Verify 0 missing hyphens remain
missing_hyphens = []
for item in oxford_data:
    for m in item['meanings']:
        tr = m.get('translation', '')
        if re.search(r'(?:кемлибо|чемлибо|комулибо|чемулибо|коголибо|чтолибо|гделибо|когдалибо|каклибо)', tr, re.I):
            missing_hyphens.append((item['word'], m['id'], tr))
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if re.search(r'(?:кемлибо|чемлибо|комулибо|чемулибо|коголибо|чтолибо|гделибо|когдалибо|каклибо)', tr, re.I):
            missing_hyphens.append((item['word'], f"phr:{p['id']}", tr))

print(f"Remaining missing hyphens: {len(missing_hyphens)}")
if missing_hyphens:
    for w, mid, tr in missing_hyphens:
        print(f"  {w} [{mid}]: '{tr}'")
else:
    print("SUCCESS: 0 missing hyphens across entire dataset!")
    with open(oxford_path, 'w', encoding='utf-8') as f:
        json.dump(oxford_data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"Updated {oxford_path} successfully!")
