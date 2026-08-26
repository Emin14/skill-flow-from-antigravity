# -*- coding: utf-8 -*-
import json
import sys
import re

from deep_cleaner import clean_russian_text_deep

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

cleaned_count = 0
unbalanced_after = 0
hyphen_issues_after = 0
fused_issues_after = 0

for it in data:
    for m in it.get('meanings', []):
        old_t = m.get('translation', '')
        new_t = clean_russian_text_deep(old_t)
        if old_t != new_t:
            cleaned_count += 1
        if new_t.count('(') != new_t.count(')'):
            unbalanced_after += 1
            print(f"Unbalanced after: {it['word']} -> {repr(new_t)}")
        for match in re.finditer(r'\b([а-яёА-ЯЁ]{2,})-([а-яёА-ЯЁ]{2,})\b', new_t):
            wp = match.group(0)
            if not wp.startswith(('кое-', 'что-', 'кто-', 'где-', 'куда-', 'когда-', 'как-', 'чей-', 'по-', 'из-за', 'с.-х', 'мини-', 'веб-', 'онлайн-', 'офлайн-', 'аудио-', 'видео-', 'радио-', 'теле-', 'фото-', 'кино-')):
                if wp not in ['пресс-секретарь', 'марш-протест', 'рок-н-ролл', 'тет-а-тет', 'вице-президент', 'премьер-министр']:
                    hyphen_issues_after += 1
                    print(f"Hyphen after: {it['word']} -> {wp} in {repr(new_t)}")

print(f"\nTotal translations cleaned: {cleaned_count}")
print(f"Unbalanced parentheses remaining: {unbalanced_after}")
print(f"Non-standard hyphens remaining: {hyphen_issues_after}")
