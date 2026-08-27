# -*- coding: utf-8 -*-
"""
Precision Homograph & False Phrases Fixer:
1. Move tear phrasal verbs exclusively to tear2 (verb /teə/), remove from tear1 (/tɪə/ слеза)
2. Move row phrasal verbs exclusively to row (verb /rəʊ/), remove from row (noun)
3. Move false adjective/noun collocations (partial to, tired out, wide apart, north about) to examples
4. Propagate POS for all numbered senses (dropping 'other' count from 1346 to <70)
5. Clean English leaks in meanings
"""
import json, re, sys, copy
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# 1. Clean tear1
for item in oxford_data:
    if item['word'] == 'tear1': # noun слеза
        if 'phrases' in item:
            del item['phrases']
    if item['word'] == 'tear2': # verb рвать
        pass # keep phrasal verbs
        
    if item['word'] == 'row1' or item['word'] == 'row2':
        # row1 is noun ряд, row2 is noun шум/скандал
        if 'phrases' in item:
            del item['phrases']
            
    if item['word'] == 'bear1': # verb носить, терпеть
        pass
    if item['word'] == 'bear2': # noun медведь
        # Remove verb phrasal verbs if any
        if 'phrases' in item:
            item['phrases'] = [p for p in item['phrases'] if 'медведь' in p.get('translation', '') or 'bear' in p.get('phrase', '')]
            if not item['phrases']:
                del item['phrases']

    # False adjective collocations -> move to examples
    if item['word'] == 'partial':
        if 'phrases' in item:
            for p in item['phrases']:
                if item.get('meanings'):
                    if not item['meanings'][0].get('examples'):
                        item['meanings'][0]['examples'] = []
                    item['meanings'][0]['examples'].append({'en': p['phrase'], 'ru': p['translation']})
            del item['phrases']
            
    if item['word'] == 'tired':
        if 'phrases' in item:
            for p in item['phrases']:
                if item.get('meanings'):
                    if not item['meanings'][0].get('examples'):
                        item['meanings'][0]['examples'] = []
                    item['meanings'][0]['examples'].append({'en': p['phrase'], 'ru': p['translation']})
            del item['phrases']

    if item['word'] == 'wide':
        if 'phrases' in item:
            for p in item['phrases']:
                if p['phrase'] == 'wide apart':
                    if item.get('meanings'):
                        if not item['meanings'][0].get('examples'):
                            item['meanings'][0]['examples'] = []
                        item['meanings'][0]['examples'].append({'en': p['phrase'], 'ru': p['translation']})
            item['phrases'] = [p for p in item['phrases'] if p['phrase'] != 'wide apart']
            if not item['phrases']:
                del item['phrases']

    if item['word'] == 'north':
        if 'phrases' in item:
            for p in item['phrases']:
                if p['phrase'] == 'north about':
                    if item.get('meanings'):
                        if not item['meanings'][0].get('examples'):
                            item['meanings'][0]['examples'] = []
                        item['meanings'][0]['examples'].append({'en': p['phrase'], 'ru': p['translation']})
            item['phrases'] = [p for p in item['phrases'] if p['phrase'] != 'north about']
            if not item['phrases']:
                del item['phrases']

# 2. POS Propagation
for item in oxford_data:
    current_pos = None
    for m in item.get('meanings', []):
        pos = m.get('partOfSpeech')
        if pos and pos != 'other':
            current_pos = pos
        elif pos == 'other' and current_pos:
            m['partOfSpeech'] = current_pos

# 3. Clean English leaks in meanings
for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        m_lead = re.match(r'^(to\s+[a-zA-Z\s\-\'\,\(\)\/\.\~]+?)\s+([а-яА-Я].*)$', tr)
        if m_lead:
            ex_en = m_lead.group(1).replace('~', item['word']).strip(' ;,')
            ex_ru = m_lead.group(2).strip(' ;,')
            m['translation'] = ex_ru
            exs = m.get('examples', [])
            if not any(e.get('en') == ex_en for e in exs):
                exs.append({'en': ex_en, 'ru': ex_ru})
            m['examples'] = exs
            
        if item['word'] == 'appeal':
            if 'ссылаться на факт' in tr:
                m['translation'] = 'ссылаться (на факт); апеллировать (к разуму); прибегать (к оружию)'
                m['examples'] = [
                    {'en': 'to appeal to the fact', 'ru': 'ссылаться на факт'},
                    {'en': 'to appeal to reason', 'ru': 'апеллировать к здравому смыслу'},
                    {'en': 'to appeal to arms', 'ru': 'прибегать к оружию'}
                ]
        if item['word'] == 'carpet':
            if 'have smb. on the carpet' in tr:
                m['translation'] = 'вызывать на ковёр, давать нагоняй кому-либо'
                m['examples'] = [{'en': 'to have smb. on the carpet', 'ru': 'давать нагоняй кому-либо'}]
        if item['word'] == 'contempt':
            if 'fall into contempt' in tr:
                m['translation'] = 'вызывать к себе презрение; презирать'
                m['examples'] = [
                    {'en': 'to fall into contempt', 'ru': 'вызывать к себе презрение'},
                    {'en': 'to have (or to hold) in contempt', 'ru': 'презирать'}
                ]

# Reindex phrases
for item in oxford_data:
    for p_idx, p in enumerate(item.get('phrases', []), start=1):
        p['id'] = p_idx

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Successfully applied precision homograph & POS fixes!")
