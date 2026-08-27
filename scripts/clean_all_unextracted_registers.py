# -*- coding: utf-8 -*-
"""
Universal Multi-Register Cleaner Engine:
1. Extracts multiple and comma-separated registers (e.g. "астр., геол.", "воен., мор.", "амер., разг.") from meanings and phrases.
2. Cleans leading register abbreviations from definitions.
3. Protects Russian roots (e.g. "из уст в уста", "моря", "собираться", "бухгалтер").
4. Updates oxford_5000_2026-08-27.json.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

REGISTER_MAP_ALL = {
    'разг.': 'разговорное',
    'прост.': 'просторечное',
    'книжн.': 'книжное',
    'поэт.': 'поэтическое',
    'посл.': 'пословица',
    'уст.': 'устаревшее',
    'архаич.': 'архаичное',
    'редк.': 'редкое',
    'офиц.': 'официальное',
    'перен.': 'переносное',
    'шутл.': 'шутливое',
    'ирон.': 'ироническое',
    'неодобр.': 'неодобрительное',
    'пренебр.': 'пренебрежительное',
    'эвф.': 'эвфемизм',
    'сл.': 'сленг',
    'жарг.': 'сленг',
    'груб.': 'грубое',
    'вульг.': 'грубое',
    'детск.': 'детская речь',
    'собир.': 'собирательное',
    'амер.': 'американизм',
    'англ.': 'британское',
    'брит.': 'британское',
    'австрал.': 'австралийский английский',
    'шотл.': 'шотландский английский',
    'ирл.': 'ирландское',
    'канад.': 'канадское',
    'тех.': 'техническое',
    'воен.': 'военное',
    'мор.': 'морской термин',
    'юр.': 'юридическое',
    'мед.': 'медицинское',
    'биол.': 'биологическое',
    'бот.': 'ботаника',
    'зоол.': 'зоология',
    'анат.': 'анатомия',
    'физиол.': 'физиология',
    'эл.': 'электротехника',
    'элн.': 'электроника',
    'вчт.': 'вычислительная техника',
    'информ.': 'информатика',
    'мат.': 'математика',
    'физ.': 'физика',
    'хим.': 'химия',
    'геол.': 'геология',
    'геогр.': 'география',
    'астр.': 'астрономия',
    'ист.': 'историческое',
    'экон.': 'экономика',
    'эк.': 'экономика',
    'фин.': 'финансы',
    'ком.': 'коммерческое',
    'комм.': 'коммерческое',
    'торг.': 'торговое',
    'ав.': 'авиация',
    'авто': 'автомобильное дело',
    'ж.-д.': 'железнодорожное',
    'радио': 'радио',
    'кино': 'кинематограф',
    'театр.': 'театр',
    'муз.': 'музыка',
    'спорт.': 'спортивное',
    'карт.': 'карточное',
    'шахм.': 'шахматное',
    'охот.': 'охота',
    'кулин.': 'кулинария',
    'кул.': 'кулинария',
    'полигр.': 'полиграфия',
    'стр.': 'строительное',
    'архит.': 'архитектура',
    'грам.': 'грамматика',
    'лингв.': 'лингвистика',
    'церк.': 'церковное',
    'рел.': 'религиозное',
    'библ.': 'библеизм',
    'фото': 'фотография',
    'бухг.': 'бухгалтерия',
    'горн.': 'горное дело',
    'текст.': 'текстильное',
    'диал.': 'диалектное',
    'с.-х.': 'сельскохозяйственное',
}

def extract_all_leading_registers(text, existing_regs):
    regs = list(existing_regs)
    text = text.strip()
    
    # Loop to extract chained registers at the start: e.g. "астр., геол.", "воен., мор.", "pl юр.", "refl. уст."
    # Patterns like: "астр., геол. ", "тех.: ", "pl фин. "
    changed = True
    while changed:
        changed = False
        # Strip leading grammar markers like "pl ", "attr. ", "refl. " if followed by register
        m_gram = re.match(r'^(?:pl|attr\.|refl\.|predic\.)\s+', text)
        prefix = ""
        if m_gram:
            # Check if next token is a register
            rest = text[m_gram.end():]
            for reg_k, reg_v in REGISTER_MAP_ALL.items():
                pat = rf'^{re.escape(reg_k)}[\s,;:]*' if reg_k not in ['авто', 'радио', 'кино', 'фото'] else rf'^{reg_k}\b[\s,;:]*'
                if re.match(pat, rest):
                    if reg_v not in regs:
                        regs.append(reg_v)
                    text = m_gram.group(0) + re.sub(pat, '', rest).strip()
                    changed = True
                    break
        else:
            for reg_k, reg_v in REGISTER_MAP_ALL.items():
                pat = rf'^{re.escape(reg_k)}[\s,;:]*' if reg_k not in ['авто', 'радио', 'кино', 'фото'] else rf'^{reg_k}\b[\s,;:]*'
                if re.match(pat, text):
                    if reg_v not in regs:
                        regs.append(reg_v)
                    text = re.sub(pat, '', text).strip()
                    changed = True
                    break
                    
    # Clean leading punctuation
    text = re.sub(r'^[.;,:,\-\s]+', '', text).strip()
    return text, regs

count_cleaned = 0
for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        new_tr, new_regs = extract_all_leading_registers(tr, m.get('register', []))
        if new_tr != tr or len(new_regs) != len(m.get('register', [])):
            m['translation'] = new_tr
            m['register'] = new_regs
            count_cleaned += 1
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        new_tr, new_regs = extract_all_leading_registers(tr, p.get('register', []))
        if new_tr != tr or len(new_regs) != len(p.get('register', [])):
            p['translation'] = new_tr
            p['register'] = new_regs
            count_cleaned += 1

print(f"Extracted chained & leading registers across {count_cleaned} entries!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
