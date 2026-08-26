# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def audit_file(path):
    print(f"\n=================== AUDITING: {path} ===================")
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    empty_trans = 0
    english_fragments = []
    dangling_parens = []
    trailing_single_chars = []
    no_russian_words = []

    for entry in data:
        word = entry.get('word', '')
        has_any_ru = False
        for m in entry.get('meanings', []):
            tr = m.get('translation', '')
            exs = m.get('examples', [])
            
            if tr:
                if any('\u0400' <= c <= '\u04FF' for c in tr):
                    has_any_ru = True
                elif re.match(r'^[a-zA-Z\s\(\)\,\.\-\'\=]+$', tr):
                    english_fragments.append((word, m.get('id'), tr))
                    
                if tr.count('(') != tr.count(')') or tr.count('[') != tr.count(']'):
                    dangling_parens.append((word, 'tr', tr))
            else:
                empty_trans += 1
                
            for ex in exs:
                ru_ex = ex.get('ru', '')
                if ru_ex:
                    if any('\u0400' <= c <= '\u04FF' for c in ru_ex):
                        has_any_ru = True
                    if ru_ex.count('(') != ru_ex.count(')'):
                        dangling_parens.append((word, 'ru_ex', ru_ex))
                    if re.search(r'\s+[a-zA-Z]\s*$', ru_ex):
                        trailing_single_chars.append((word, ru_ex))
                        
        if not has_any_ru:
            no_russian_words.append(word)

    print(f"Total entries: {len(data)}")
    print(f"Empty translations: {empty_trans}")
    print(f"English-only fragment translations: {len(english_fragments)}")
    print(f"Dangling parens: {len(dangling_parens)}")
    print(f"Trailing single chars: {len(trailing_single_chars)}")
    print(f"Words with NO Russian translations at all: {len(no_russian_words)} -> {no_russian_words[:10]}")

audit_file('oxford_5000.json')
audit_file('tmp/muller_rebuild/oxford_5000.clean.json')
audit_file('tmp/muller_rebuild/oxford_5000.rebuilt.json')
audit_file('oxford_5000_updated.json')
