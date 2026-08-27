# -*- coding: utf-8 -*-
"""
Final sweep for remaining composite and parenthetical pl patterns.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        regs = m.get('register', [])
        
        # (the ~s) pl or (the ~) pl
        if re.match(r'^\(?the\s*~s?\)?\s*pl\s*(?:собир\.)?\s*', tr, re.I):
            is_sobir = 'собир.' in tr
            tr = re.sub(r'^\(?the\s*~s?\)?\s*pl\s*(?:собир\.)?\s*', '', tr)
            # check register after prefix
            if tr.startswith('разг.'):
                if 'разговорное' not in regs: regs.append('разговорное')
                tr = re.sub(r'^разг\.[\s,;]*', '', tr)
            if tr.startswith('муз.'):
                if 'музыка' not in regs: regs.append('музыка')
                tr = re.sub(r'^муз\.[\s,;]*', '', tr)
            if tr.startswith('библ.'):
                if 'библеизм' not in regs: regs.append('библеизм')
                tr = re.sub(r'^библ\.[\s,;]*', '', tr)
            prefix = "собир. при англ. мн. ч.: " if is_sobir else "при англ. мн. ч.: "
            m['translation'] = prefix + tr.strip()
            m['register'] = regs
            
        elif re.match(r'^\(?тж\.\s*pl\)?\s*', tr, re.I):
            tr = re.sub(r'^\(?тж\.\s*pl\)?\s*', '', tr)
            m['translation'] = "тж. при англ. мн. ч.: " + tr.strip()
            
        elif re.match(r'^\(?употр\.\s*как\s*pl\)?\s*', tr, re.I):
            tr = re.sub(r'^\(?употр\.\s*как\s*pl\)?\s*', '', tr)
            m['translation'] = "при англ. мн. ч.: " + tr.strip()

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Final sweep completed successfully!")
