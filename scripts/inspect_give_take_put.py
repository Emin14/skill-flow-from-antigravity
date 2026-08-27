# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}

PHRASAL_PARTICLES = {
    'in', 'out', 'up', 'down', 'off', 'on', 'away', 'back', 'by', 
    'over', 'through', 'about', 'across', 'ahead', 'along', 'around', 
    'forth', 'forward', 'into', 'onto', 'to', 'together', 'under', 
    'apart', 'aside', 'behind', 'between', 'round'
}

def get_extracted_phrases_for_word(item):
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    meanings = item.get('meanings', [])
    existing_phrases = list(item.get('phrases', []))
    
    pv_groups = {}
    for m in meanings:
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        regs = m.get('register', [])
        
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
            real_exs = [ex for ex in exs if ex.get('en', '').lower() != pv_name]
            pv_groups[pv_name].append({
                'tr': tr,
                'exs': real_exs,
                'regs': regs
            })
            
    result = []
    pid = 1
    for pv_name, senses in pv_groups.items():
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
            combined_regs = list(dict.fromkeys(combined_regs))
            
        result.append({
            'id': pid,
            'phrase': pv_name,
            'partOfSpeech': 'verb',
            'translation': combined_tr,
            'examples': combined_exs,
            'register': combined_regs
        })
        pid += 1
    return result

for target in ['give', 'take', 'put']:
    if target in by_word:
        pvs = get_extracted_phrases_for_word(by_word[target])
        print(f"==================== {target.upper()} ({len(pvs)} Phrasal Verbs) ====================")
        print(json.dumps(pvs, ensure_ascii=False, indent=2))
        print()
