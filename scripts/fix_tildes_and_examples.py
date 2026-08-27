# -*- coding: utf-8 -*-
"""
Fix all unexpanded tildes and format examples across the entire dataset.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

def expand_tilde_in_string(text, word):
    if '~' not in text:
        return text
    
    # Handle forms like ~s, ~ed, ~ing, ~d
    text = re.sub(r'~(\w+)', lambda m: word + m.group(1), text)
    text = text.replace('~', word)
    return text

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        if '~' in m.get('translation', ''):
            m['translation'] = expand_tilde_in_string(m['translation'], w)
            # Remove any trailing new headword captures like "bombard 1. n..." or "bow II [bau]"
            m['translation'] = re.sub(r'\s+[a-zA-Z-]+\s+(?:[1-4]\.|\bI+\b|\[).*$', '', m['translation'])
            # Clean detached letter markers like "а) ...; б) ..."
            m['translation'] = re.sub(r'\s+[абвгде]\)\s*', '; ', m['translation'])
            m['translation'] = re.sub(r'\s+', ' ', m['translation']).strip(' ;:,.-')
            
        for ex in m.get('examples', []):
            if '~' in ex.get('en', ''):
                ex['en'] = expand_tilde_in_string(ex['en'], w)
            if '~' in ex.get('ru', ''):
                ex['ru'] = expand_tilde_in_string(ex['ru'], w)
                
    for p in item.get('phrases', []):
        if '~' in p.get('phrase', ''):
            p['phrase'] = expand_tilde_in_string(p['phrase'], w)
        if '~' in p.get('translation', ''):
            p['translation'] = expand_tilde_in_string(p['translation'], w)
        for ex in p.get('examples', []):
            if '~' in ex.get('en', ''):
                ex['en'] = expand_tilde_in_string(ex['en'], w)
            if '~' in ex.get('ru', ''):
                ex['ru'] = expand_tilde_in_string(ex['ru'], w)

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Tildes expanded and cleaned successfully across all words!")
