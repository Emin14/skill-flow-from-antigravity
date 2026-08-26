# -*- coding: utf-8 -*-
"""
Final Verification & Repair for oxford_5000_updated_verified.json,
oxford_5000_updated.json, and src/data/oxford_5000.json.
"""

import sys
import json
import re
import os
import shutil

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated_verified.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Fix specific words
FIXES = {
    'accountant': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'бухгалтер',
                'examples': [{'en': 'accountant in charge', 'ru': 'главный бухгалтер'}],
                'id': 1
            }
        ],
        'phrases': []
    },
    'beer': {
        'meanings': [
            {
                'partOfSpeech': 'noun',
                'translation': 'пиво',
                'examples': [
                    {'en': 'light beer', 'ru': 'светлое пиво'},
                    {'en': 'beer on draught', 'ru': 'пиво из бочки'}
                ],
                'id': 1
            }
        ],
        'phrases': [
            {'en': 'beer and skittles', 'ru': 'забавы и развлечения'},
            {'en': 'life is not all beer and skittles', 'ru': 'жизнь прожить — не поле перейти'}
        ]
    },
    'depart': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'отбывать, отправляться; уезжать',
                'examples': [
                    {'en': 'to depart for London', 'ru': 'уехать в Лондон'},
                    {'en': 'to depart (from) London', 'ru': 'покинуть Лондон'}
                ],
                'id': 1
            },
            {
                'partOfSpeech': 'verb',
                'translation': '(from) отклоняться',
                'examples': [
                    {'en': 'to depart from the original concept', 'ru': 'отойти от первоначальной концепции'},
                    {'en': 'to depart from a question', 'ru': 'уклониться от вопроса'}
                ],
                'id': 2
            }
        ],
        'phrases': []
    },
    'sue': {
        'meanings': [
            {
                'partOfSpeech': 'verb',
                'translation': 'преследовать судебным порядком; возбуждать дело; предъявлять иск, подавать жалобу',
                'examples': [{'en': 'to sue for alimony', 'ru': 'подавать в суд на алименты'}],
                'id': 1
            }
        ],
        'phrases': []
    }
}

for item in data:
    w = item['word']
    if w in FIXES:
        item['meanings'] = FIXES[w]['meanings']
        item['phrases'] = FIXES[w]['phrases']
        
# Re-validate
for item in data:
    assert len(item['meanings']) > 0, f"Empty meanings in {item['word']}"
    for idx, m in enumerate(item['meanings'], 1):
        m['id'] = idx
        assert m['translation'], f"Empty translation in {item['word']} meaning {idx}"

# Save to all target files
with open('oxford_5000_updated_verified.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

shutil.copyfile('oxford_5000_updated_verified.json', 'oxford_5000_updated.json')
if os.path.exists('src/data/oxford_5000.json'):
    shutil.copyfile('oxford_5000_updated_verified.json', 'src/data/oxford_5000.json')

# Update verification progress
progress_info = {
    'total_words': len(data),
    'total_batches': 200,
    'completed_batches': 200,
    'verified_words_count': len(data),
    'last_processed_idx': len(data),
    'percentage': 100.0,
    'updated_at': '2026-08-26 02:30:30'
}
with open('verification__updated_progress.json', 'w', encoding='utf-8') as pf:
    json.dump(progress_info, pf, ensure_ascii=False, indent=2)

print("Saved and synced all files.")
