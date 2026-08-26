# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_updated.json', encoding='utf-8'))

count = 0
for item in data:
    word = item.get('word')
    for m in item.get('meanings', []):
        m_id = m.get('id')
        m_reg = m.get('register')
        for ex_idx, ex in enumerate(m.get('examples', [])):
            if 'register' in ex:
                count += 1
                if count <= 15:
                    print(f"Word: {word} | Meaning ID: {m_id} | Meaning Register: {m_reg}")
                    print(f"  Example: {ex}")
print(f"Total misplaced register in examples: {count}")
