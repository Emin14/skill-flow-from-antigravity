# -*- coding: utf-8 -*-
import sys
import os
import json
import re
import unicodedata
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

# Let's test the root fallback & derivation mapping for the remaining words
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Common mappings for specific words
EXPLICIT_FALLBACKS = {
    'according to': ('accord', 'prep', 'согласно; в соответствии с; по словам'),
    'any more': ('any', 'adv', 'больше не, уже не'),
    'have to': ('have', 'v', 'быть должным, вынужденным (сделать что-л.)'),
    'next to': ('next', 'prep', 'рядом с; почти, едва ли не'),
    'app': ('application', 'n', 'приложение, программа'),
    'blog': ('blog', 'n', 'блог, интернет-дневник'),
    'broadband': ('broadband', 'adj', 'широкополосный (о связи, интернете)'),
    'bye': ('goodbye', 'int', 'пока!, до свидания!'),
    'cafe': ('café', 'n', 'кафе, кофейня'),
    'dvd': ('dvd', 'n', 'DVD, цифровой видеодиск'),
    'email': ('email', 'n', 'электронная почта, имейл'),
    'healthcare': ('health', 'n', 'здравоохранение, медицинское обслуживание'),
    'marketplace': ('market', 'n', 'рыночная площадь; рынок, сфера торговли'),
    'memo': ('memorandum', 'n', 'памятная записка, служебная записка'),
    'mentor': ('mentor', 'n', 'наставник, ментор; руководитель'),
    'ok': ('ok', 'adj/adv/int', 'хорошо, ладно; правильный, в порядке'),
    'online': ('online', 'adj/adv', 'онлайн, в сети, через интернет'),
    'ongoing': ('ongoing', 'adj', 'происходящий в настоящее время, продолжающийся, непрерывный'),
    'pathway': ('path', 'n', 'тропинка, дорожка; путь, направление'),
    'smartphone': ('phone', 'n', 'смартфон, умный телефон'),
    'spokesperson': ('spokesman', 'n', 'представитель, официальный представитель'),
    'spokeswoman': ('spokesman', 'n', 'представительница, пресс-секретарь (женщина)'),
    'sustainable': ('sustain', 'adj', 'устойчивый; экологически безопасный; жизнеспособный'),
    'thought-provoking': ('thought', 'adj', 'заставляющий задуматься, глубокий'),
    'upcoming': ('come', 'adj', 'наступающий, предстоящий'),
    'whatsoever': ('whatever', 'adv', 'какой бы ни, совершенно, абсолютно (в отрицаниях)'),
    'whilst': ('while', 'cj', 'в то время как, пока'),
    'workplace': ('work', 'n', 'рабочее место'),
    'yeah': ('yes', 'int', 'да, ага'),
    'aide': ('aide', 'n', 'помощник, советник; адъютант'),
    'albeit': ('although', 'cj', 'хотя, пусть даже, тем не менее'),
    'asylum': ('asylum', 'n', 'убежище, приют; психиатрическая лечебница'),
    'awareness': ('aware', 'n', 'осведомлённость, знание, сознание'),
    'duo': ('duet', 'n', 'дуэт, пара'),
    'decision-making': ('decision', 'n', 'принятие решений'),
    'film-maker': ('film', 'n', 'кинорежиссёр, создатель фильмов'),
    'high-profile': ('profile', 'adj', 'привлекающий внимание, высокопоставленный, заметный'),
    'long-standing': ('standing', 'adj', 'давний, многолетний'),
    'long-time': ('time', 'adj', 'давний, давнишний'),
    'non-profit': ('profit', 'adj', 'некоммерческий, бесприбыльный'),
    'post-war': ('war', 'adj', 'послевоенный'),
    'line-up': ('line', 'n', 'расстановка; состав (команды, участников); очередь'),
    'enquire': ('inquire', 'v', 'спрашивать, наводить справки'),
    'enquiry': ('inquiry', 'n', 'вопрос, расспрашивание, наведение справок; расследование'),
    'program': ('programme', 'n/v', 'программа; составлять программу'),
    'upon': ('on', 'prep', 'на, по, после (более формальный вариант on)')
}

print(f"Explicit fallbacks defined: {len(EXPLICIT_FALLBACKS)}")
