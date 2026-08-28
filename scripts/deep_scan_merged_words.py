# -*- coding: utf-8 -*-
"""
Deep scan for any missing spaces and merged Russian words in translations and examples.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Patterns of glued Russian prepositions and words
GLUED_PATTERNS = [
    (r'\bпоследождичка\b', 'после дождичка'),
    (r'\bоплаченаполучателем\b', 'оплачена получателем'),
    (r'\bдосвидания\b', 'до свидания'),
    (r'\bдосвиданья\b', 'до свиданья'),
    (r'\bпомне\b', 'по мне'),
    (r'\bкомне\b', 'ко мне'),
    (r'\bсомной\b', 'со мной'),
    (r'\bотменя\b', 'от меня'),
    (r'\bизпод\b', 'из-под'),
    (r'\bизза\b', 'из-за'),
    (r'\bвсилу\b', 'в силу'),
    (r'\bввиде\b', 'в виде'),
    (r'\bвсвязи\b', 'в связи'),
    (r'\bвцелях\b', 'в целях'),
    (r'\bвтечение\b', 'в течение'),
    (r'\bвпродолжение\b', 'в продолжение'),
    (r'\bзасчёт\b', 'за счёт'),
    (r'\bзасчет\b', 'за счет'),
    (r'\bпомере\b', 'по мере'),
    (r'\bпопричине\b', 'по причине'),
    (r'\bпоповоду\b', 'по поводу'),
    (r'\bсучетом\b', 'с учетом'),
    (r'\bсучётом\b', 'с учётом'),
    (r'\bнипричём\b', 'ни при чём'),
    (r'\bнипричем\b', 'ни при чем'),
    (r'\bнизачто\b', 'ни за что'),
    (r'\bнивкоем\b', 'ни в коем')
]

found_glued = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        for pat, repl in GLUED_PATTERNS:
            if re.search(pat, t, re.IGNORECASE):
                found_glued.append((w, 'meaning', m['id'], t, pat, repl))
        for ex in m.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in GLUED_PATTERNS:
                if re.search(pat, ru, re.IGNORECASE):
                    found_glued.append((w, 'meaning_ex', m['id'], ru, pat, repl))
                    
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        for pat, repl in GLUED_PATTERNS:
            if re.search(pat, t, re.IGNORECASE):
                found_glued.append((w, 'phrase', p['id'], t, pat, repl))
        for ex in p.get('examples', []):
            ru = ex.get('ru', '')
            for pat, repl in GLUED_PATTERNS:
                if re.search(pat, ru, re.IGNORECASE):
                    found_glued.append((w, 'phrase_ex', p['id'], ru, pat, repl))

print(f"Found {len(found_glued)} glued word occurrences:")
for f_ in found_glued:
    print(f"  [{f_[0]}] ({f_[1]} {f_[2]}): in '{f_[3]}' -> replace '{f_[4]}' with '{f_[5]}'")
