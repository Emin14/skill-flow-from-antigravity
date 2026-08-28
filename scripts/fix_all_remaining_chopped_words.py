# -*- coding: utf-8 -*-
"""
Fix all remaining chopped words in oxford_5000_2026-08-27.json.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

EXACT_REPAIRS = {
    ('map', 1): ('карта (географическая или звёздного неба)', 'карточный термин'),
    ('marine', 1): ('морской флот', None),
    ('marine', 3): ('морской пейзаж, марина', None),
    ('marine', 4): ('морской', None),
    ('martial', 1): ('военный', None),
    ('mask', 7): ('морда зверя (как охотничий трофей)', 'морской термин'),
    ('military', 1): ('военный, воинский', None),
    ('mill', 8): ('матч по боксу; кулачный бой', 'математика'),
    ('mining', 2): ('горное дело; горная промышленность; разработка месторождений полезных ископаемых', None),
    ('minute', 1): ('минута (также астрономическая, 1/60 часть градуса)', 'минералогия'),
    ('navigation', 3): ('морское или воздушное путешествие; плавание', None),
    ('nut', 9): ('собирать орехи', 'собирательное'),
    ('optimistic', 1): ('оптимистичный, оптимистический', None),
    ('order', 6): ('слой общества; социальная группа', 'жаргон'),
    ('pale', 8): ('слабый, тусклый (о свете, цвете и т. п.)', 'жаргон'),
    ('photograph', 1): ('фотографический снимок, фотография', None),
    ('pink', 5): ('охотник в красном камзоле', 'охотничий термин'),
    ('pleasure', 7): ('искать развлечений', 'искусство'),
    ('pot', 17): ('стрелять, застрелить (на близком расстоянии)', 'строительное'),
    ('prime', 6): ('простое число', 'просодия'),
    ('process', 1): ('технологический процесс, приём, способ', 'техническое'),
    ('punk', 3): ('музыка в стиле «панк» (также punk rock)', None),
    ('quarter', 6): ('страна света', 'строительное'),
    ('queen', 2): ('матка (у пчёл)', 'математика'),
    ('quest', 5): ('искать дичь (о собаках); искать пищу (о животных)', 'искусство'),
    ('quick', 10): ('живая изгородь', 'живопись'),
    ('render', 10): ('топить (сало)', 'топография'),
    ('rent', 1): ('past и p. p. от rend', None),
    ('rest', 23): ('дом призрения для престарелых и инвалидов', None),
    ('rise', 10): ('исток (реки)', 'историческое'),
    ('rough', 21): ('шип (в подкове)', None),
    ('rule', 5): ('устав (общества, ордена)', 'устаревшее'),
    ('search', 5): ('искать (for)', 'искусство'),
    ('sink', 10): ('топить (судно); затоплять (местность)', 'топография'),
    ('step', 4): ('след (ноги)', 'жаргон'),
    ('training', 6): ('специальное училище (медицинское и т. п.)', None),
    ('wise', 3): ('колдунья, ворожея; знахарка', None),
    ('wound', 5): ('past и p. p. от wind 2', None),
    ('wound', 6): ('past и p. p. от wind 2', None)
}

fixed_count = 0

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        m_id = m['id']
        if (w, m_id) in EXACT_REPAIRS:
            new_trans, reg_to_remove = EXACT_REPAIRS[(w, m_id)]
            m['translation'] = new_trans
            if reg_to_remove and reg_to_remove in m.get('register', []):
                m['register'].remove(reg_to_remove)
            fixed_count += 1

print(f"Fixed {fixed_count} exact meaning defects!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved updated dataset successfully!")
