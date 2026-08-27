# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

PHRASAL_PARTICLES = {
    'in', 'out', 'up', 'down', 'off', 'on', 'away', 'back', 'by', 
    'over', 'through', 'about', 'across', 'ahead', 'along', 'around', 
    'forth', 'forward', 'into', 'onto', 'to', 'together', 'under', 
    'apart', 'aside', 'behind', 'between', 'round'
}

def analyze_word(item):
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    meanings = item.get('meanings', [])
    phrases = list(item.get('phrases', []))
    
    direct_meanings = []
    pv_groups = {} # pv_name -> list of meanings/translations
    
    for m in meanings:
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        regs = m.get('register', [])
        pos = m.get('partOfSpeech', 'other')
        
        # Detect if this meaning is a phrasal verb sub-sense
        pv_name = None
        for ex in exs:
            en = ex.get('en', '').strip().lower()
            tokens = en.split()
            if len(tokens) == 2 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
                pv_name = f"{clean_w} {tokens[1]}"
                break
            elif len(tokens) == 3 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
                pv_name = f"{clean_w} {tokens[1]} {tokens[2]}"
                break
                
        if pv_name:
            if pv_name not in pv_groups:
                pv_groups[pv_name] = []
            # Extract real context examples (not self-repeating)
            real_exs = [ex for ex in exs if ex.get('en', '').lower() != pv_name]
            pv_groups[pv_name].append({
                'tr': tr,
                'exs': real_exs,
                'regs': regs
            })
        else:
            direct_meanings.append(m)
            
    # Form structured phrases
    new_phrases = list(phrases)
    next_pid = len(new_phrases) + 1
    
    for pv_name, senses in pv_groups.items():
        # Combine translations
        if len(senses) == 1:
            combined_tr = senses[0]['tr']
            combined_exs = senses[0]['exs']
            combined_regs = senses[0]['regs']
        else:
            tr_parts = []
            combined_exs = []
            combined_regs = []
            for idx, s in enumerate(senses, start=1):
                tr_parts.append(f"{idx}) {s['tr']}")
                combined_exs.extend(s['exs'])
                combined_regs.extend(s['regs'])
            combined_tr = '; '.join(tr_parts)
            # Deduplicate registers
            combined_regs = list(dict.fromkeys(combined_regs))
            
        new_phrases.append({
            'id': next_pid,
            'phrase': pv_name,
            'partOfSpeech': 'verb',
            'translation': combined_tr,
            'examples': combined_exs,
            'register': combined_regs
        })
        next_pid += 1
        
    return len(meanings), len(direct_meanings), len(phrases), len(new_phrases), pv_groups

total_pvs_found = 0
total_words_with_pvs = 0

sample_verbs = ['break', 'look', 'give', 'take', 'come', 'go', 'put', 'turn', 'set', 'run']

print("=== Phrasal Verb Extraction Safety Analysis ===")
for item in oxford:
    old_m, new_m, old_p, new_p, pvs = analyze_word(item)
    if pvs:
        total_words_with_pvs += 1
        total_pvs_found += len(pvs)
        if item['word'] in sample_verbs:
            print(f"Verb '{item['word']}':")
            print(f"  Meanings: {old_m} -> {new_m} (Clean direct meanings of the verb)")
            print(f"  Phrases:  {old_p} -> {new_p} (+{len(pvs)} phrasal verbs)")
            print(f"  Extracted Phrasal Verbs: {list(pvs.keys())}")
            print()

print(f"Summary across full dataset:")
print(f"  Total words containing phrasal verbs: {total_words_with_pvs}")
print(f"  Total phrasal verb units structured: {total_pvs_found}")
