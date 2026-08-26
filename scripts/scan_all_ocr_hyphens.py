# -*- coding: utf-8 -*-
"""
Scan and fix all OCR hyphenated Russian words across the entire dataset.
"""
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

# List of true hyphenated Russian prefixes / compounds to preserve
PRESERVE_PREFIXES = (
    'кое-', 'что-', 'кто-', 'где-', 'куда-', 'когда-', 'как-', 'чей-', 
    'по-', 'из-за', 'из-под', 'с.-х', 'мини-', 'веб-', 'онлайн-', 'офлайн-', 
    'аудио-', 'видео-', 'радио-', 'теле-', 'фото-', 'кино-', 'экс-', 'вице-',
    'пресс-', 'премьер-', 'рок-', 'поп-', 'интернет-', 'смарт-', 'бизнес-'
)

PRESERVE_WORDS = {
    'пресс-секретарь', 'марш-протест', 'рок-н-ролл', 'тет-а-тет', 'вице-президент', 
    'премьер-министр', 'точь-в-точь', 'бок-о-бок', 'чуть-чуть', 'еле-еле',
    'волей-неволей', 'мало-помалу', 'крест-накрест', 'с глазу-на-глаз'
}

ocr_hyphens_found = set()

for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        for match in re.finditer(r'\b([а-яёА-ЯЁ]{2,})-([а-яёА-ЯЁ]{2,})\b', t):
            wp = match.group(0)
            if not wp.lower().startswith(PRESERVE_PREFIXES) and wp.lower() not in PRESERVE_WORDS:
                if not (wp.lower().endswith(('-то', '-либо', '-нибудь'))):
                    ocr_hyphens_found.add(wp)
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for match in re.finditer(r'\b([а-яёА-ЯЁ]{2,})-([а-яёА-ЯЁ]{2,})\b', ru):
                wp = match.group(0)
                if not wp.lower().startswith(PRESERVE_PREFIXES) and wp.lower() not in PRESERVE_WORDS:
                    if not (wp.lower().endswith(('-то', '-либо', '-нибудь'))):
                        ocr_hyphens_found.add(wp)

print(f"Total OCR hyphenated words found: {len(ocr_hyphens_found)}")
for wp in sorted(ocr_hyphens_found):
    print(f"  '{wp}' -> '{wp.replace('-', '')}'")
