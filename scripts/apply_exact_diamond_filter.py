# -*- coding: utf-8 -*-
"""
Exact Diamond & Phrasal Verb Filter:
A phrase is kept in phrases IF AND ONLY IF:
1. It is a genuine phrasal verb: 'headword + particle' (e.g. 'break in', 'give up', 'take off', 'ice up', 'look after').
2. OR the phrase literally appears inside the raw '♦' (diamond) block of the dictionary article!
Otherwise, it is a regular example (like 'accessible to bribery', 'area under crop', 'admission by ticket', 'rich in minerals', 'reduction in rank', 'traffic in drugs') and is moved to meaning.examples!
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

PHRASAL_PARTICLES = {
    'in', 'out', 'up', 'down', 'off', 'on', 'away', 'back', 'by', 
    'over', 'through', 'about', 'across', 'ahead', 'along', 'around', 
    'forth', 'forward', 'into', 'onto', 'together', 'under', 
    'apart', 'aside', 'behind', 'between', 'round'
}

def is_genuine_phrasal(p_text, base_word):
    clean_w = re.sub(r'[1-9]$', '', base_word.lower())
    tokens = p_text.lower().split()
    if len(tokens) == 2 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
        return True
    if len(tokens) == 3 and tokens[0] == 'to' and tokens[1] == clean_w and tokens[2] in PHRASAL_PARTICLES:
        return True
    return False

def is_literal_in_diamond(p_text, diamond_text, base_word):
    if not diamond_text:
        return False
    clean_w = re.sub(r'[1-9]$', '', base_word.lower())
    d_low = diamond_text.lower()
    p_low = p_text.lower()
    
    # Check direct match
    if p_low in d_low:
        return True
        
    # Check tilde match (e.g. "what are you about?" -> "what are you ~?")
    p_tilde = p_low.replace(clean_w, '~')
    if p_tilde in d_low:
        return True
        
    # Check without 'to '
    if p_low.startswith('to '):
        p_noto = p_low[3:]
        if p_noto in d_low or p_noto.replace(clean_w, '~') in d_low:
            return True
            
    return False

moved_count = 0
for item in oxford_data:
    if not item.get('phrases'):
        continue
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    diamond_text = ""
    if '♦' in raw_text:
        diamond_text = " ".join(raw_text.split('♦')[1:])
        
    kept_phrases = []
    for p in item['phrases']:
        p_text = p.get('phrase', '').strip()
        
        # 1. Phrasal verb?
        if is_genuine_phrasal(p_text, w):
            kept_phrases.append(p)
            continue
            
        # 2. In diamond?
        if is_literal_in_diamond(p_text, diamond_text, w):
            kept_phrases.append(p)
            continue
            
        # 3. False phrase -> move to meaning examples
        if item.get('meanings'):
            target_m = item['meanings'][0]
            if not target_m.get('examples'):
                target_m['examples'] = []
            if not any(ex.get('en') == p_text for ex in target_m['examples']):
                target_m['examples'].append({
                    'en': p_text,
                    'ru': p.get('translation', '')
                })
            moved_count += 1
            
    for idx, p in enumerate(kept_phrases, start=1):
        p['id'] = idx
        
    if kept_phrases:
        item['phrases'] = kept_phrases
    else:
        if 'phrases' in item:
            del item['phrases']

print(f"Exact Diamond Filter: Migrated {moved_count} false phrases back to examples!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated oxford_5000_2026-08-27.json successfully!")
