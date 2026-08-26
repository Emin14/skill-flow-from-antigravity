# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

fixed_ex_count = 0
for entry in data:
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        # Clean broken meanings
        if tr.startswith('или to ') or tr.startswith('или the '):
            tr_match = re.match(r'^или\s+([a-zA-Z\s\(\)\'\’\/\-,]+)\)\s*(.*)$', tr)
            if tr_match:
                m['translation'] = tr_match.group(2).strip()
                
        cleaned_exs = []
        for ex in m.get('examples', []):
            en = ex.get('en', '').strip()
            ru = ex.get('ru', '').strip()
            
            # Check if en ends with '(' and ru starts with 'или ...)'
            m_var = re.match(r'^или\s+([a-zA-Z\s\(\)\'\’\/\-,]+)\)\s*(.*)$', ru)
            if en.endswith('(') and m_var:
                var_en = m_var.group(1).strip()
                rest_ru = m_var.group(2).strip()
                en = en.rstrip('(').strip() + f" (or {var_en})"
                ru = rest_ru
                fixed_ex_count += 1
                
            # If ru starts with 'или to ...' and en is incomplete
            m_var2 = re.match(r'^или\s+(?:to\s+|the\s+|[a-zA-Z]+)[a-zA-Z\s\(\)\'\’\/\-,]+\)\s*(?:into|on|for|with|of|in|at|from|to)?\s*(?:thin\s+air|[a-zA-Z\s]+)?\s*([а-яА-ЯёЁ].*)$', ru)
            if m_var2:
                ru = m_var2.group(1).strip()
                fixed_ex_count += 1
                
            if en == 'to melt (' or en == 'to melt':
                en = 'to melt (or to vanish, to disappear) into thin air'
                ru = 'скрыться из виду, бесследно исчезнуть'
            elif en == 'to tread (' or en == 'to tread':
                en = 'to tread (or to walk) on air'
                ru = 'ног под собой не чуять; ликовать, радоваться'
            elif en.startswith('the ball is with you ('):
                en = 'the ball is with you (or the ball is in your court)'
                ru = 'очередь за вами'
                
            cleaned_exs.append({'en': en, 'ru': ru})
            
        m['examples'] = cleaned_exs

print(f"Fixed {fixed_ex_count} split examples.")

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('oxford_5000_verified.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved repaired files.")
