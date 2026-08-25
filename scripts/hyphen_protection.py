# -*- coding: utf-8 -*-
import re

PROTECTED_HYPHENS = [
    (r'\b(кто|кого|кому|кем|ком|что|чего|чему|чем|чём|где|куда|откуда|как|когда|почему|зачем|какой|какого|какому|каким|каком|какая|какую|какой|какое|какие|каких|какими|чей|чьего|чьему|чьим|чьём|чья|чью|чьей|чьё|чьи|чьих|чьими)\s*-\s*(л\b\.?|либо\b|нибудь\b|то\b)', r'\1-\2'),
    (r'\bкое\s*-\s*(кто|кого|кому|кем|ком|что|чего|чему|чем|чём|где|куда|как|когда)', r'кое-\1'),
    (r'\bиз\s*-\s*(за|под)\b', r'из-\1'),
    (r'\b(по)\s*-\s*(русски|английски|французски|немецки|прежнему|новому|моему|твоему|своему|нашему|вашему)\b', r'\1-\2'),
    (r'\bс\s*-\s*х\b', 'с-х'),
    (r'\bж\s*-\s*д\b', 'ж-д'),
    (r'\bп\s*-\s*ов\b', 'п-ов')
]

def protect_hyphenated_russian(text):
    # Protect valid hyphenated words by replacing '-' with special placeholder
    # e.g. кого-л. -> кого___HYPH___л.
    text = re.sub(r'\b([а-яёА-ЯЁ]+)\s*-\s*(л\b\.?|либо\b|нибудь\b|то\b)', r'\1___HYPH___\2', text)
    text = re.sub(r'\b(кое|из)\s*-\s*([а-яёА-ЯЁ]+)', r'\1___HYPH___\2', text)
    text = re.sub(r'\b(по)\s*-\s*(русски|английски|прежнему|новому|моему|твоему|своему)\b', r'\1___HYPH___\2', text)
    text = re.sub(r'\b(с|ж|п)\s*-\s*(х|д|ов)\b', r'\1___HYPH___\2', text)
    return text

def restore_hyphenated_russian(text):
    # Restore placeholder
    text = text.replace('___HYPH___', '-')
    # Normalize -л to -л.
    text = re.sub(r'\b-\s*л\b(?!\.)', '-л.', text)
    return text

print("Hyphen protection module ready.")
