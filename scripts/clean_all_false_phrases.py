# -*- coding: utf-8 -*-
"""
Universal False Phrases Cleaner:
1. Keeps genuine phrasal verbs (verb + particle).
2. Keeps genuine diamond idioms (present in raw ♦ text).
3. Moves ALL regular noun/adjective/verb collocations (like 'accessible to bribery', 'quick to learn', 'rich in minerals', 'resistance to wear', 'area under crop', 'reduction in rank') into the appropriate meaning's examples!
4. Updates oxford_5000_2026-08-27.json.
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
    
    # "pick up", "set out", "take off", "tear down"
    if len(tokens) >= 2 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
        return True
    if len(tokens) >= 3 and tokens[0] == 'to' and tokens[1] == clean_w and tokens[2] in PHRASAL_PARTICLES:
        return True
    return False

def clean_all_false_phrases():
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
                
        diamond_text = raw_text.split('♦', 1)[1] if '♦' in raw_text else ""
        
        kept_phrases = []
        for p in item['phrases']:
            p_text = p.get('phrase', '')
            
            # Check 1: Genuine phrasal verb?
            if is_genuine_phrasal_verb(p_text, w):
                kept_phrases.append(p)
                continue
                
            # Check 2: Genuine diamond idiom?
            p_stem = p_text.replace(clean_w, '~').replace('to ', '')
            p_first_word = p_text.split()[0] if p_text.split() else ""
            if diamond_text and (p_text.lower() in diamond_text.lower() or p_stem.lower() in diamond_text.lower() or p['translation'][:10] in diamond_text):
                kept_phrases.append(p)
                continue
                
            # Check 3: If neither, it's a false phrase (example collocation) like 'accessible to bribery', 'quick to learn'
            # Move to meaning examples!
            if item.get('meanings'):
                # Find best target meaning
                target_m = item['meanings'][0]
                if not target_m.get('examples'):
                    target_m['examples'] = []
                # Avoid duplicate example
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
                
        if len(kept_phrases) != len(item.get('phrases', kept_phrases)):
            words_affected += 1

    print(f"Successfully migrated {moved_count} false phrases back to examples across the entire dataset!")

clean_all_false_phrases()

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated oxford_5000_2026-08-27.json successfully!")
