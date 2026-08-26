# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total words: {len(data)}")

multi_idioms = []
truncated_english_examples = []
unmapped_registers = []

for entry in data:
    w = entry['word']
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        pos = m.get('partOfSpeech', '')
        
        # Check if translation has register abbreviation
        for abbrev in ['жив.', 'лог.', 'карт.', 'мор.', 'юр.', 'тех.', 'библ.', 'разг.', 'муз.', 'авт.', 'горн.', 'с.-х.', 'анат.', 'биол.', 'бот.', 'грам.', 'зоол.', 'мат.', 'мед.', 'спорт.', 'театр.', 'физ.', 'хим.', 'шахм.', 'экон.', 'уст.', 'амер.']:
            if tr.startswith(abbrev) or f' {abbrev}' in tr:
                unmapped_registers.append((w, m['id'], abbrev, tr))
                break
                
        # Check if translation or example contains multi-idioms glued together
        if '; to ' in tr or '; ~ ' in tr or ' ♦ ' in tr or '; in ' in tr or '; on ' in tr:
            multi_idioms.append((w, m['id'], 'tr', tr))
            
        for ex in m.get('examples', []):
            ru_ex = ex.get('ru', '')
            en_ex = ex.get('en', '')
            if '; to ' in ru_ex or '; ~ ' in ru_ex or ' ♦ ' in ru_ex:
                multi_idioms.append((w, m['id'], 'ru_ex', ru_ex))
            if en_ex and not en_ex.startswith('to ') and not en_ex.startswith('in ') and not en_ex.startswith('on ') and not en_ex.startswith('at '):
                # Check for truncated phrases like "sea(s)" where headword was missing
                if len(en_ex.split()) == 1 and en_ex.endswith('(s)'):
                    truncated_english_examples.append((w, m['id'], en_ex, ru_ex))

print(f"Unmapped register abbreviations in translation: {len(unmapped_registers)}")
print(f"Multi-idiom glued strings: {len(multi_idioms)}")
print(f"Truncated English example phrases: {len(truncated_english_examples)}")

print("\n--- Samples of unmapped registers ---")
for w, mid, ab, tr in unmapped_registers[:10]:
    print(f"  [{w} id={mid}] abbrev='{ab}': {repr(tr)}")

print("\n--- Samples of multi-idioms ---")
for w, mid, loc, txt in multi_idioms[:10]:
    print(f"  [{w} id={mid} ({loc})]: {repr(txt[:100])}...")
