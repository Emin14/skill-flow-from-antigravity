# -*- coding: utf-8 -*-
"""
Deep inspection of all inline example registers from raw dictionary articles.
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

found_inline_registers = []

for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    if not raw_text:
        continue
        
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            ex_en = ex.get('en', '')
            # find ex_en or parts of ex_en in raw_text
            # e.g. "angle of attack"
            ex_stem = re.sub(r'[\(\)\.\,\;]+', ' ', ex_en).strip()
            tokens = [t for t in ex_stem.split() if len(t) >= 3 and t.lower() != clean_w]
            if tokens:
                search_token = tokens[0]
                # look for pattern: token ... [reg_k] [russian]
                pos = raw_text.find(search_token)
                if pos != -1:
                    snippet = raw_text[max(0, pos-20):min(len(raw_text), pos+80)]
                    for reg_k, reg_v in REGISTER_MAP.items():
                        if re.search(rf'\b{re.escape(reg_k)}\s+[а-яА-Я]', snippet):
                            # check if it's right before russian translation of this example
                            found_inline_registers.append({
                                'word': w,
                                'meaning_id': m['id'],
                                'translation': m['translation'],
                                'example_en': ex_en,
                                'example_ru': ex['ru'],
                                'register': reg_v,
                                'reg_abbr': reg_k,
                                'snippet': snippet.replace('\n', ' ')
                            })
                            break

print(f"Total verified inline example registers in raw text: {len(found_inline_registers)}")
for r in found_inline_registers[:30]:
    print(f"{r['word']} [id:{r['meaning_id']}] ({r['register']}): '{r['example_en']}' -> '{r['example_ru']}'")
    print(f"   Snippet: ... {r['snippet']} ...\n")
