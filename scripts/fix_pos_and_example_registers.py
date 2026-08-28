# -*- coding: utf-8 -*-
"""
Fix non-canonical POS in phrases and extract register abbreviations from examples ru fields.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

from robust_dictionary_rebuilder import REGISTER_MAP

CANONICAL_POS = {
    "noun", "verb", "adjective", "adverb", "preposition",
    "conjunction", "pronoun", "numeral", "interjection",
    "article", "modal verb", "other"
}

def clean_example_ru(ru_text):
    regs = []
    changed = True
    while changed:
        changed = False
        for abbrev, full in REGISTER_MAP.items():
            pat = r'^\s*(?:\()?' + re.escape(abbrev) + r'(?:\))?\s*(?:,\s*)?'
            match = re.match(pat, ru_text)
            if match:
                if full not in regs:
                    regs.append(full)
                ru_text = ru_text[match.end():].strip(' ,;:-')
                changed = True
    return ru_text, regs

for item in data:
    base_pos = item.get('meanings', [{}])[0].get('partOfSpeech', 'noun')
    
    # 1. Clean examples in meanings
    for m in item.get('meanings', []):
        for ex in m.get('examples', []):
            if 'register' not in ex:
                ex['register'] = []
            clean_ru, extra_regs = clean_example_ru(ex.get('ru', ''))
            ex['ru'] = clean_ru
            for r in extra_regs:
                if r not in ex['register']:
                    ex['register'].append(r)
                    
    # 2. Clean phrases and examples in phrases
    for p in item.get('phrases', []):
        pos = p.get('partOfSpeech', '').lower()
        if pos not in CANONICAL_POS:
            if pos == 'phrasal verb':
                p['partOfSpeech'] = 'verb'
            elif pos == 'phrase':
                p_text = p.get('phrase', '').strip()
                if p_text.startswith('to ') or base_pos == 'verb':
                    p['partOfSpeech'] = 'verb'
                elif p_text.startswith('in ') or p_text.startswith('at ') or p_text.startswith('by ') or p_text.startswith('on '):
                    p['partOfSpeech'] = 'adverb'
                elif p_text.startswith('a ') or p_text.startswith('the ') or base_pos == 'noun':
                    p['partOfSpeech'] = 'noun'
                else:
                    p['partOfSpeech'] = base_pos
                    
        for ex in p.get('examples', []):
            if 'register' not in ex:
                ex['register'] = []
            clean_ru, extra_regs = clean_example_ru(ex.get('ru', ''))
            ex['ru'] = clean_ru
            for r in extra_regs:
                if r not in ex['register']:
                    ex['register'].append(r)

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Cleaned non-canonical phrase POS and extracted example registers successfully!")
