# -*- coding: utf-8 -*-
import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

# High quality Russian dictionary definitions for the 42 derivative words
ADDITIONAL_FALLBACKS = {
    'accountability': [{'partOfSpeech': 'noun', 'translation': 'подотчётность; ответственность', 'examples': []}],
    'agricultural': [{'partOfSpeech': 'adjective', 'translation': 'сельскохозяйственный, аграрный', 'examples': []}],
    'bacteria': [{'partOfSpeech': 'noun', 'translation': '(во мн.ч.) бактерии', 'examples': []}],
    'beneficial': [{'partOfSpeech': 'adjective', 'translation': 'выгодный, полезный; целительный', 'examples': []}],
    'communist': [{'partOfSpeech': 'noun', 'translation': 'коммунист', 'examples': []}, {'partOfSpeech': 'adjective', 'translation': 'коммунистический', 'examples': []}],
    'congregation': [{'partOfSpeech': 'noun', 'translation': 'собрание; религиозная община, прихожане', 'examples': []}],
    'congressional': [{'partOfSpeech': 'adjective', 'translation': 'относящийся к конгрессу; парламентский', 'examples': []}],
    'consequently': [{'partOfSpeech': 'adverb', 'translation': 'следовательно, поэтому, в результате', 'examples': []}],
    'consistency': [{'partOfSpeech': 'noun', 'translation': 'последовательность, постоянство; согласованность; плотность', 'examples': []}],
    'contractor': [{'partOfSpeech': 'noun', 'translation': 'подрядчик, контрагент, поставщик', 'examples': []}],
    'coordinator': [{'partOfSpeech': 'noun', 'translation': 'координатор, организатор', 'examples': []}],
    'correlate': [{'partOfSpeech': 'verb', 'translation': 'соотноситься, находиться в соотношении; устанавливать соотношение', 'examples': []}],
    'counselling': [{'partOfSpeech': 'noun', 'translation': 'консультирование, психологическая помощь', 'examples': []}],
    'cultural': [{'partOfSpeech': 'adjective', 'translation': 'культурный', 'examples': []}],
    'deprive': [{'partOfSpeech': 'verb', 'translation': 'лишать (кого-л. чего-л. — of); отнимать', 'examples': []}],
    'educator': [{'partOfSpeech': 'noun', 'translation': 'педагог, воспитатель, преподаватель', 'examples': []}],
    'enthusiastic': [{'partOfSpeech': 'adjective', 'translation': 'восторженный, полный энтузиазма, увлечённый', 'examples': []}],
    'gene': [{'partOfSpeech': 'noun', 'translation': 'биол. ген', 'examples': []}],
    'genetic': [{'partOfSpeech': 'adjective', 'translation': 'биол. генетический', 'examples': []}],
    'globalization': [{'partOfSpeech': 'noun', 'translation': 'глобализация', 'examples': []}],
    'historic': [{'partOfSpeech': 'adjective', 'translation': 'исторический (имеющий историческое значение)', 'examples': []}],
    'imagery': [{'partOfSpeech': 'noun', 'translation': 'образы, изобразительные средства; скульптура; изображения', 'examples': []}],
    'innovative': [{'partOfSpeech': 'adjective', 'translation': 'инновационный, передовой, новаторский', 'examples': []}],
    'installation': [{'partOfSpeech': 'noun', 'translation': 'установка, монтаж; инсталляция; сооружение', 'examples': []}],
    'ironic': [{'partOfSpeech': 'adjective', 'translation': 'иронический, насмешливый', 'examples': []}],
    'ironically': [{'partOfSpeech': 'adverb', 'translation': 'иронически, с иронией; по иронии судьбы', 'examples': []}],
    'magical': [{'partOfSpeech': 'adjective', 'translation': 'магический, волшебный; феерический', 'examples': []}],
    'memorable': [{'partOfSpeech': 'adjective', 'translation': 'памятный, незабываемый; достопамятный', 'examples': []}],
    'motorist': [{'partOfSpeech': 'noun', 'translation': 'автомобилист, автолюбитель', 'examples': []}],
    'optimistic': [{'partOfSpeech': 'adjective', 'translation': 'оптимистичный, оптимистический', 'examples': []}],
    'philosophical': [{'partOfSpeech': 'adjective', 'translation': 'философский; рассудительный, спокойный', 'examples': []}],
    'planning': [{'partOfSpeech': 'noun', 'translation': 'планирование; проектирование', 'examples': []}],
    'problematic': [{'partOfSpeech': 'adjective', 'translation': 'проблематичный, сомнительный; трудный', 'examples': []}],
    'satisfied': [{'partOfSpeech': 'adjective', 'translation': 'довольный, удовлетворённый', 'examples': []}],
    'seeker': [{'partOfSpeech': 'noun', 'translation': 'искатель, человек, который ищет', 'examples': []}],
    'teens': [{'partOfSpeech': 'noun', 'translation': '(во мн.ч.) подростковый возраст (от 13 до 19 лет); подростки', 'examples': []}],
    'terrain': [{'partOfSpeech': 'noun', 'translation': 'местность, территория, район; рельеф местности', 'examples': []}],
    'terribly': [{'partOfSpeech': 'adverb', 'translation': 'ужасно, страшно, очень', 'examples': []}],
    'terrify': [{'partOfSpeech': 'verb', 'translation': 'ужасать, страшить, запугивать', 'examples': []}],
    'theoretical': [{'partOfSpeech': 'adjective', 'translation': 'теоретический', 'examples': []}],
    'transcript': [{'partOfSpeech': 'noun', 'translation': 'копия, стенограмма; академическая справка с оценками', 'examples': []}],
    'trustee': [{'partOfSpeech': 'noun', 'translation': 'попечитель, опекун; доверенное лицо', 'examples': []}]
}

print(f"Defined {len(ADDITIONAL_FALLBACKS)} additional lemmas.")
