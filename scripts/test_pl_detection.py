# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))
oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

def clean_t(t):
    t = re.sub(r'([А-Яа-яA-Za-z])-\s*\n\s*([А-Яа-яA-Za-z])', r'\1\2', t)
    t = re.sub(r'([А-Яа-яA-Za-z])-\s+([а-яa-z])', r'\1\2', t)
    def lower_stress(m):
        w = m.group(0)
        if re.search(r'[а-яё][А-ЯЁ]', w):
            return w[0] + w[1:].lower()
        return w
    t = re.sub(r'[А-Яа-яЁё]+', lower_stress, t)
    return re.sub(r'\s+', ' ', t).strip()

count_detected = 0
for item in oxford:
    w = item['word']
    raw_art = ''
    for k in [w.lower(), f'{w.lower()} i', f'{w.lower()} ii', re.sub(r'[1-9]$', '', w.lower())]:
        if k in parsed_index and parsed_index[k]:
            raw_art = clean_t(parsed_index[k][0].get('text', ''))
            if 'pl' in raw_art or 'собир' in raw_art:
                break
    if not raw_art:
        continue
        
    for m in item['meanings']:
        tr = m['translation']
        exs = m.get('examples', [])
        
        # Check if exs has pl indicator
        has_pl_ex = any(ex.get('en') in ['pl', '(pl)', '(the blind) pl', '(the accused) pl'] for ex in exs)
        
        tr_words = [re.escape(x) for x in re.split(r'[\s,;:]+', tr[:30]) if len(x) >= 3]
        is_pl = False
        pl_type = 'при англ. мн. ч.:'
        
        if has_pl_ex:
            is_pl = True
        elif tr_words:
            pat = r'(?:(\d+\)|[a-z]\))\s*)?(?:(\(?[а-яё\.\s]*?(?:обыкн\.|часто|собир\.|без\s+измен\.)?\s*pl\)?|\(the\s+[^)]*?\)\s*pl|\(собир\.\))\s+)(?:[а-яё\.\s]+\s+)?' + r'[\s,;:]+'.join(tr_words[:3])
            m_found = re.search(pat, raw_art, re.I)
            if m_found:
                is_pl = True
                pl_label = m_found.group(2).lower()
                if 'обыкн' in pl_label:
                    pl_type = 'обыкн. при англ. мн. ч.:'
                elif 'часто' in pl_label:
                    pl_type = 'часто при англ. мн. ч.:'
                elif 'собир' in pl_label:
                    pl_type = 'собир. при англ. мн. ч.:'
                elif 'без измен' in pl_label:
                    pl_type = 'без измен. при англ. мн. ч.:'
                    
        if is_pl and not tr.startswith('при англ. мн. ч.') and not tr.startswith('собир. при англ. мн. ч.') and not tr.startswith('обыкн. при англ. мн. ч.'):
            count_detected += 1
            if count_detected <= 25:
                print(f'{w} [id:{m["id"]}]: {pl_type} {tr[:45]}')

print(f'Total detected pl senses from raw text: {count_detected}')
