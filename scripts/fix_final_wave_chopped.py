# -*- coding: utf-8 -*-
"""
Fix final wave of chopped words.
"""
import json, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

FINAL_FIXES = {
    ('frame', 7): ('строение, структура; система', 'строительное'),
    ('frame', 12): ('собирать (конструкцию)', 'собирательное'),
    ('funny', 4): ('лечебница для наркоманов', None),
    ('game', 11): ('готовый (сделать что-либо); ничего не бояться', None),
    ('gap', 5): ('горный проход, глубокое ущелье', 'горное дело'),
    ('gate', 4): ('горный проход', 'горное дело'),
    ('harvest', 5): ('собирать урожай', 'собирательное'),
    ('healthcare', 1): ('медицинское обслуживание и здравоохранение', None),
    ('investigation', 1): ('научное исследование', 'научное'),
    ('jet', 5): ('реактивный двигатель', None),
    ('lane', 6): ('морской путь', None),
    ('language', 3): ('ругань (также bad language)', 'бранное'),
    ('lead', 26): ('стрела, укосина', 'строительное'),
    ('left', 1): ('past и p. p. от leave', None),
    ('live', 1): ('живой (не мёртвый)', 'живопись'),
    ('lively', 3): ('живой (об описании и т. п.)', 'живопись'),
    ('living', 9): ('живой (о языке)', 'живопись'),
    ('lost', 1): ('past и p. p. от lose', None),
    ('thin', 4): ('редкий (о волосах, лесе)', 'редкое')
}

fixed_cnt = 0
for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        m_id = m['id']
        if (w, m_id) in FINAL_FIXES:
            new_t, reg_to_rem = FINAL_FIXES[(w, m_id)]
            m['translation'] = new_t
            if reg_to_rem and reg_to_rem in m.get('register', []):
                m['register'].remove(reg_to_rem)
            fixed_cnt += 1

print(f"Fixed {fixed_cnt} final wave entries!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully synced with src/data/oxford_5000.json!")
