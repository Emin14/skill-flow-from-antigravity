# -*- coding: utf-8 -*-
"""
Precise English-anchored False Phrases Cleaner:
Only keeps phrases that:
1. Are genuine phrasal verbs (verb + particle from PHRASAL_PARTICLES).
2. OR their exact English phrase (or tilde pattern) appears AFTER a '♦' in the raw article!
All other phrases (like 'area under crop', 'adjustment in direction', 'admission by ticket', 'rich in minerals', 'reduction in rank', 'traffic in drugs') are moved to meaning.examples!
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

def is_genuine_phrasal_verb(phrase_text, base_word):
    tokens = phrase_text.lower().split()
    clean_w = re.sub(r'[1-9]$', '', base_word.lower())
    
    if len(tokens) >= 2 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
        return True
    if len(tokens) >= 3 and tokens[0] == 'to' and tokens[1] == clean_w and tokens[2] in PHRASAL_PARTICLES:
        return True
    return False

def clean_all_false_phrases_strict():
    moved_count = 0
    words_affected = 0
    
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
                
        # Collect all diamond sections
        diamond_sections = []
        if '♦' in raw_text:
            parts = raw_text.split('♦')
            diamond_sections = parts[1:]
        diamond_all_text = " ".join(diamond_sections).lower()
        
        kept_phrases = []
        for p in item['phrases']:
            p_text = p.get('phrase', '').strip()
            
            # Check 1: Genuine phrasal verb?
            if is_genuine_phrasal_verb(p_text, w):
                kept_phrases.append(p)
                continue
                
            # Check 2: Genuine diamond idiom?
            # Check if English words of p_text appear in diamond_all_text
            p_tokens = [t for t in re.sub(r'[^a-zA-Z\s]', '', p_text).lower().split() if t not in ['to', 'the', 'a', 'an', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'one', 'smb', 'smth', 'oneself']]
            
            # If all significant English tokens are found in diamond text
            is_in_diamond = False
            if diamond_all_text and p_tokens:
                # Check if first 2 tokens or the whole sequence is in diamond_all_text
                seq = " ".join(p_tokens[:2])
                if seq in diamond_all_text or (len(p_tokens) == 1 and p_tokens[0] in diamond_all_text):
                    is_in_diamond = True
                elif p_text.lower() in diamond_all_text:
                    is_in_diamond = True
                    
            if is_in_diamond:
                kept_phrases.append(p)
                continue
                
            # Check 3: It is an example collocation! Move to meaning.examples
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
                
        words_affected += 1

    print(f"Strict Cleaner: Migrated {moved_count} false phrases to examples across dataset!")

clean_all_false_phrases_strict()

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated oxford_5000_2026-08-27.json successfully!")
