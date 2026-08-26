# -*- coding: utf-8 -*-
"""
Research script for Round 5:
1. Scan for embedded register tags at the beginning of translations.
2. Inspect entries from A to Z that may have spurious entries or misplaced registers.
"""
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

REGISTER_PREFIXES = {
    r'^(?:юр|юрид)\.\s*': 'юриспруденция',
    r'^(?:мед)\.\s*': 'медицина',
    r'^(?:биол)\.\s*': 'биология',
    r'^(?:мат)\.\s*': 'математика',
    r'^(?:воен)\.\s*': 'военный термин',
    r'^(?:муз)\.\s*': 'музыка',
    r'^(?:тех)\.\s*': 'техника',
    r'^(?:мор)\.\s*': 'морской термин',
    r'^(?:спорт)\.\s*': 'спорт',
    r'^(?:театр)\.\s*': 'театр',
    r'^(?:грам)\.\s*': 'грамматика',
    r'^(?:лингв)\.\s*': 'лингвистика',
    r'^(?:анат)\.\s*': 'анатомия',
    r'^(?:бот)\.\s*': 'ботаника',
    r'^(?:зоол)\.\s*': 'зоология',
    r'^(?:геогр)\.\s*': 'география',
    r'^(?:геол)\.\s*': 'геология',
    r'^(?:астр)\.\s*': 'астрономия',
    r'^(?:хим)\.\s*': 'химия',
    r'^(?:физ)\.\s*': 'физика',
    r'^(?:филос)\.\s*': 'философия',
    r'^(?:эл)\.\s*': 'электротехника',
    r'^(?:ком)\.\s*': 'коммерция',
    r'^(?:фин)\.\s*': 'финансы',
    r'^(?:полит)\.\s*': 'политика',
    r'^(?:рел)\.\s*': 'религия',
    r'^(?:с\.-х)\.\s*': 'сельское хозяйство',
    r'^(?:разг)\.\s*': 'разговорное',
    r'^(?:шутл)\.\s*': 'шутливое',
    r'^(?:ирон)\.\s*': 'ироническое',
    r'^(?:бран)\.\s*': 'бранное',
    r'^(?:груб)\.\s*': 'грубое',
    r'^(?:поэт)\.\s*': 'поэтическое',
    r'^(?:книжн)\.\s*': 'книжное',
    r'^(?:уст)\.\s*': 'устаревшее',
    r'^(?:редк)\.\s*': 'редкое',
    r'^(?:амер)\.\s*': 'американизм',
    r'^(?:австрал)\.\s*': 'австралийское',
    r'^(?:шотл)\.\s*': 'шотландское',
    r'^(?:вчт|информ)\.\s*': 'информатика'
}

embedded_registers = []
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        for pat, reg in REGISTER_PREFIXES.items():
            if re.search(pat, t):
                embedded_registers.append((it['word'], m['id'], t, reg, pat))
                break

print(f"Found {len(embedded_registers)} embedded register tags in meanings:")
for er in embedded_registers[:35]:
    print(f"  Word: {er[0]:15} | ID: {er[1]:2} | Tag: {er[3]:15} | Text: {repr(er[2])}")
