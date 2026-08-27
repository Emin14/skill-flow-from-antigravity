# -*- coding: utf-8 -*-
"""
Auditing and classifying register marks: Sense-level vs Example-level across all entries.
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

from parse_utils import REGISTER_MAP

def analyze_word_registers(item):
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    if not raw_text:
        return []
        
    candidates = []
    for m in item.get('meanings', []):
        m_regs = m.get('register', [])
        m_exs = m.get('examples', [])
        m_tr = m.get('translation', '')
        
        if not m_regs and not m_exs:
            continue
            
        # Check if any example has an explicit register abbreviation in raw text or in ru
        for ex in m_exs:
            ex_en = ex.get('en', '')
            ex_ru = ex.get('ru', '')
            
            # Find in raw text where this example is located
            ex_stem = re.sub(r'\(.*?\)', '', ex_en).strip()
            if ex_stem and len(ex_stem) >= 4:
                # search in raw_text
                pos_in_raw = raw_text.find(ex_stem.split()[0])
                # Check if there is a register abbreviation immediately preceding or following
                for reg_k, reg_name in REGISTER_MAP.items():
                    # check if reg_k is in ex_ru or right around ex in raw_text
                    if re.search(rf'\b{re.escape(reg_k)}', ex_ru) or (reg_name in m_regs and len(m_regs) > 1):
                        candidates.append({
                            'word': w,
                            'meaning_id': m['id'],
                            'translation': m_tr,
                            'meaning_regs': m_regs,
                            'example_en': ex_en,
                            'example_ru': ex_ru,
                            'found_reg': reg_name,
                            'reg_key': reg_k
                        })
                        break
                        
    return candidates

all_candidates = []
for item in oxford_data:
    all_candidates.extend(analyze_word_registers(item))

print(f"Total candidate example-level registers found: {len(all_candidates)}")
print("\nSamples:")
for c in all_candidates[:20]:
    print(f"Word: {c['word']} [id:{c['meaning_id']}]")
    print(f"  Tr: \"{c['translation']}\" | Sense regs: {c['meaning_regs']}")
    print(f"  Ex: \"{c['example_en']}\" -> \"{c['example_ru']}\" (Target Reg: {c['found_reg']})")
    print()
