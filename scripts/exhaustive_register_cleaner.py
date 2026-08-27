# -*- coding: utf-8 -*-
"""
Exhaustive Academic Register Extractor & Pronoun Normalizer.
Includes all scientific/technical registers: лог., филос., психол., фон., вет., топ., тлв., парл., полит., etc.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

EXTENDED_REGISTERS = {
    # Общие и стилистические
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
    'презр.': 'презрительное',
    'ласк.': 'ласкательное',
    'эвф.': 'эвфемизм',
    'сл.': 'сленг',
    'жарг.': 'сленг',
    'груб.': 'грубое',
    'вульг.': 'грубое',
    'детск.': 'детская речь',
    'собир.': 'собирательное',
    'школ.': 'школьный жаргон',
    'унив.': 'университетское',
    'спец.': 'специальный термин',

    # Территориальные
    'амер.': 'американизм',
    'англ.': 'британское',
    'брит.': 'британское',
    'австрал.': 'австралийский английский',
    'шотл.': 'шотландский английский',
    'ирл.': 'ирландское',
    'канад.': 'канадское',
    'диал.': 'диалектное',

    # Отраслевые и научные
    'тех.': 'техническое',
    'воен.': 'военное',
    'мор.': 'морской термин',
    'юр.': 'юридическое',
    'парл.': 'парламентский термин',
    'полит.': 'политическое',
    'дип.': 'дипломатия',
    'мед.': 'медицинское',
    'хир.': 'хирургия',
    'вет.': 'ветеринария',
    'биол.': 'биологическое',
    'бакт.': 'бактериология',
    'бот.': 'ботаника',
    'зоол.': 'зоология',
    'анат.': 'анатомия',
    'физиол.': 'физиология',
    'психол.': 'психология',
    'лог.': 'логика',
    'филос.': 'философия',
    'эл.': 'электротехника',
    'элн.': 'электроника',
    'вчт.': 'вычислительная техника',
    'информ.': 'информатика',
    'мат.': 'математика',
    'геом.': 'геометрия',
    'физ.': 'физика',
    'опт.': 'оптика',
    'хим.': 'химия',
    'геол.': 'геология',
    'мин.': 'минералогия',
    'геод.': 'геодезия',
    'геогр.': 'география',
    'топ.': 'топография',
    'гидр.': 'гидрология',
    'метео.': 'метеорология',
    'метал.': 'металлургия',
    'горн.': 'горное дело',
    'астр.': 'астрономия',
    'ист.': 'историческое',
    'миф.': 'мифология',
    'экон.': 'экономика',
    'эк.': 'экономика',
    'фин.': 'финансы',
    'банк.': 'банковское дело',
    'бирж.': 'биржевой термин',
    'бухг.': 'бухгалтерия',
    'ком.': 'коммерческое',
    'комм.': 'коммерческое',
    'торг.': 'торговое',
    'ав.': 'авиация',
    'авто': 'автомобильное дело',
    'ж.-д.': 'железнодорожное',
    'радио': 'радио',
    'тлв.': 'телевидение',
    'тлг.': 'телеграфия',
    'кино': 'кинематограф',
    'театр.': 'театр',
    'муз.': 'музыка',
    'спорт.': 'спортивное',
    'карт.': 'карточное',
    'шахм.': 'шахматное',
    'охот.': 'охота',
    'лес.': 'лесоводство',
    'с.-х.': 'сельскохозяйственное',
    'кулин.': 'кулинария',
    'кул.': 'кулинария',
    'полигр.': 'полиграфия',
    'текст.': 'текстильное',
    'стр.': 'строительное',
    'архит.': 'архитектура',
    'жив.': 'живопись',
    'иск.': 'искусство',
    'лит.': 'литература',
    'грам.': 'грамматика',
    'лингв.': 'лингвистика',
    'фон.': 'фонетика',
    'церк.': 'церковное',
    'рел.': 'религиозное',
    'библ.': 'библеизм',
    'фото': 'фотография'
}

def extract_all_registers_clean(text, existing_regs):
    regs = list(existing_regs)
    text = text.strip()
    
    # Fix broken pronoun tokens first
    text = text.replace('ктол.', 'кто-либо').replace('чтол.', 'что-либо').replace('кемл.', 'кем-либо').replace('чемл.', 'чем-либо')
    text = text.replace('комул.', 'кому-либо').replace('чемул.', 'чему-либо').replace('гдето', 'где-то')
    
    changed = True
    while changed:
        changed = False
        m_gram = re.match(r'^(?:pl|attr\.|attr\.:|refl\.|predic\.)\s+', text)
        if m_gram:
            rest = text[m_gram.end():]
            for reg_k, reg_v in EXTENDED_REGISTERS.items():
                pat = rf'^{re.escape(reg_k)}[\s,;:]*' if reg_k not in ['авто', 'радио', 'кино', 'фото'] else rf'^{reg_k}\b[\s,;:]*'
                if re.match(pat, rest):
                    if reg_v not in regs:
                        regs.append(reg_v)
                    text = m_gram.group(0) + re.sub(pat, '', rest).strip()
                    changed = True
                    break
        else:
            for reg_k, reg_v in EXTENDED_REGISTERS.items():
                pat = rf'^{re.escape(reg_k)}[\s,;:]*' if reg_k not in ['авто', 'радио', 'кино', 'фото'] else rf'^{reg_k}\b[\s,;:]*'
                if re.match(pat, text):
                    if reg_v not in regs:
                        regs.append(reg_v)
                    text = re.sub(pat, '', text).strip()
                    changed = True
                    break
                    
    text = re.sub(r'^[.;,:,\-\s]+', '', text).strip()
    return text, regs

total_updated = 0
for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        new_tr, new_regs = extract_all_registers_clean(tr, m.get('register', []))
        if new_tr != tr or len(new_regs) != len(m.get('register', [])):
            m['translation'] = new_tr
            m['register'] = new_regs
            total_updated += 1
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        new_tr, new_regs = extract_all_registers_clean(tr, p.get('register', []))
        if new_tr != tr or len(new_regs) != len(p.get('register', [])):
            p['translation'] = new_tr
            p['register'] = new_regs
            total_updated += 1

print(f"Exhaustive Academic Register Extractor updated {total_updated} entries!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
