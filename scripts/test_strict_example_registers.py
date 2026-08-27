# -*- coding: utf-8 -*-
"""
Precise Example-Level Register Extractor with Strict Word-Boundary Detection.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

from parse_utils import REGISTER_MAP

# Strict abbreviations ending with dot or enclosed
STRICT_REGISTER_PATTERNS = []
for k, v in REGISTER_MAP.items():
    # e.g. "воен." -> r'(?:\bвоен\.|\(воен\.\))'
    esc_k = re.escape(k)
    STRICT_REGISTER_PATTERNS.append((re.compile(rf'(?:^|\s|\()({esc_k})(?:\s|\)|$)'), v, k))

def extract_example_registers(item):
    w = item['word']
    meanings = item.get('meanings', [])
    
    modified = False
    for m in meanings:
        m_regs = list(m.get('register', []))
        exs = m.get('examples', [])
        
        for ex in exs:
            ru_text = ex.get('ru', '')
            ex_regs = list(ex.get('register', []))
            
            for pat, reg_name, reg_abbr in STRICT_REGISTER_PATTERNS:
                if pat.search(ru_text):
                    if reg_name not in ex_regs:
                        ex_regs.append(reg_name)
                    # Clean the abbreviation from ru_text
                    ru_text = re.sub(rf'(?:^|\s|\()({re.escape(reg_abbr)})(?:\s|\)|$)', ' ', ru_text)
                    ru_text = re.sub(r'\s+', ' ', ru_text).strip(' ;,:')
                    ex['ru'] = ru_text
                    modified = True
                    
            if ex_regs:
                ex['register'] = ex_regs
                
        # Specific manual cases:
        if w == 'about' and m['id'] == 4:
            # about face (or turn)! -> military
            for ex in exs:
                if 'about face' in ex['en'] or 'face (or turn)' in ex['en']:
                    ex['register'] = ['военное']
            m['register'] = []
            modified = True
            
        if w == 'academy' and m['id'] == 1:
            for ex in exs:
                if 'Military' in ex['en']:
                    ex['register'] = ['военное']
                if 'music' in ex['en']:
                    ex['register'] = ['музыка']
            m['register'] = []
            modified = True
            
        if w == 'angle' and m['id'] == 1:
            for ex in exs:
                if 'attack' in ex['en']:
                    ex['register'] = ['авиация']
                if 'roll' in ex['en']:
                    ex['register'] = ['морской термин']
                if 'sight' in ex['en']:
                    ex['register'] = ['военное']
            m['register'] = []
            modified = True
            
    return item, modified

print("Testing strict example register extraction...")
total_modified_words = 0
total_examples_with_reg = 0

for item in oxford_data:
    it, mod = extract_example_registers(item)
    if mod:
        total_modified_words += 1
    for m in it.get('meanings', []):
        for ex in m.get('examples', []):
            if ex.get('register'):
                total_examples_with_reg += 1

print(f"Total modified words: {total_modified_words}")
print(f"Total examples with their own register: {total_examples_with_reg}")

# Check about, academy, angle
by_word = {x['word']: x for x in oxford_data}
print("\n=== Word: about (meaning 4) ===")
print(json.dumps(by_word['about']['meanings'][3], ensure_ascii=False, indent=2))

print("\n=== Word: academy ===")
print(json.dumps(by_word['academy']['meanings'][0], ensure_ascii=False, indent=2))
