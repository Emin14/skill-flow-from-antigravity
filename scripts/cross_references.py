# -*- coding: utf-8 -*-
import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

CROSS_REFERENCE_MAP = {
    'a': [
        {'partOfSpeech': 'article', 'translation': 'неопределённый артикль', 'examples': []},
        {'partOfSpeech': 'other', 'translation': 'один, некий; каждый', 'examples': [{'en': 'twice a day', 'ru': 'два раза в день'}]}
    ],
    'ad': [{'partOfSpeech': 'noun', 'translation': 'реклама, объявление', 'examples': []}],
    'anyone': [{'partOfSpeech': 'pronoun', 'translation': 'кто-нибудь, кто-либо, всякий, любой', 'examples': []}],
    'backdrop': [{'partOfSpeech': 'noun', 'translation': 'задний план, фон; фоновый занавес', 'examples': []}],
    'blend': [{'partOfSpeech': 'verb', 'translation': 'смешивать(ся), сочетать(ся), гармонировать', 'examples': []}, {'partOfSpeech': 'noun', 'translation': 'смесь, сочетание', 'examples': []}],
    'bound': [{'partOfSpeech': 'adjective', 'translation': 'обязанный, связанный (клятвой, обещанием); направляющийся (куда-л.)', 'examples': []}, {'partOfSpeech': 'verb', 'translation': 'ограничивать; связывать; прыгать, скакать', 'examples': []}, {'partOfSpeech': 'noun', 'translation': 'граница, предел; скачок, прыжок', 'examples': []}],
    'broken': [{'partOfSpeech': 'adjective', 'translation': 'сломанный, разбитый; нарушенный; прерывистый', 'examples': []}],
    'cannot': [{'partOfSpeech': 'verb', 'translation': 'не мочь, быть не в состоянии', 'examples': []}],
    'check': [{'partOfSpeech': 'verb', 'translation': 'проверять, контролировать; останавливать, сдерживать', 'examples': []}, {'partOfSpeech': 'noun', 'translation': 'проверка, контроль; чек; клетка (узор)', 'examples': []}],
    'corresponding': [{'partOfSpeech': 'adjective', 'translation': 'соответствующий, аналогичный; корреспондентский', 'examples': []}],
    'disk': [{'partOfSpeech': 'noun', 'translation': 'диск; магнитный диск, накопитель', 'examples': []}],
    'extra': [{'partOfSpeech': 'adjective', 'translation': 'дополнительный, лишний', 'examples': []}, {'partOfSpeech': 'adverb', 'translation': 'дополнительно, сверх нормы', 'examples': []}, {'partOfSpeech': 'noun', 'translation': 'дополнительный предмет; статист, массовка', 'examples': []}],
    'her': [{'partOfSpeech': 'pronoun', 'translation': 'её, ей, ею, о ней (косвенный падеж от she); её (притяжательное)', 'examples': []}],
    'him': [{'partOfSpeech': 'pronoun', 'translation': 'его, ему, им, о нём (косвенный падеж от he)', 'examples': []}],
    'later': [{'partOfSpeech': 'adverb', 'translation': 'позже, позднее, спустя', 'examples': [{'en': 'see you later', 'ru': 'увидимся позже'}]}],
    'latest': [{'partOfSpeech': 'adjective', 'translation': 'самый последний, новейший, свежий (о новостях)', 'examples': [{'en': 'the latest news', 'ru': 'последние новости'}]}],
    'meantime': [{'partOfSpeech': 'noun/adverb', 'translation': 'тем временем, между тем', 'examples': [{'en': 'in the meantime', 'ru': 'тем временем'}]}],
    'mum': [{'partOfSpeech': 'noun', 'translation': 'мама, мамочка', 'examples': []}],
    'physical': [{'partOfSpeech': 'adjective', 'translation': 'физический; материальный; телесный', 'examples': []}, {'partOfSpeech': 'noun', 'translation': 'медицинский осмотр', 'examples': []}],
    'shot': [{'partOfSpeech': 'noun', 'translation': 'выстрел; укол, инъекция; кадр, снимок; попытка; рюмка спиртного', 'examples': []}],
    'sin': [{'partOfSpeech': 'noun', 'translation': 'грех, проступок', 'examples': []}, {'partOfSpeech': 'verb', 'translation': 'грешить, совершать грех', 'examples': []}],
    'them': [{'partOfSpeech': 'pronoun', 'translation': 'их, им, ими, о них (косвенный падеж от they)', 'examples': []}],
    'us': [{'partOfSpeech': 'pronoun', 'translation': 'нас, нам, нами, о нас (косвенный падеж от we)', 'examples': []}],
    'whom': [{'partOfSpeech': 'pronoun', 'translation': 'кого, кому, кем, о ком (косвенный падеж от who)', 'examples': []}]
}

print(f"Loaded {len(CROSS_REFERENCE_MAP)} cross references.")
