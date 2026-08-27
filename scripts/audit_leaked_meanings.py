# -*- coding: utf-8 -*-
"""
Auditing all leaked idioms inside meanings array:
Matches meanings against raw ♦ blocks and extracts them to phrases.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

def clean_t(t):
    if not t:
        return ""
    t = t.replace('\xad', '-').replace('\u00ad', '-').replace('\ue000', '-')
    t = re.sub(r'([А-Яа-яA-Za-z])-\s*\n\s*([А-Яа-яA-Za-z])', r'\1\2', t)
    t = re.sub(r'([А-Яа-яA-Za-z])-\s+([а-яa-z])', r'\1\2', t)
    def lower_stress(m):
        w = m.group(0)
        if re.search(r'[а-яё][А-ЯЁ]', w):
            return w[0] + w[1:].lower()
        return w
    t = re.sub(r'[А-Яа-яЁё]+', lower_stress, t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

leaked_meaning_count = 0
affected_words = []

for item in oxford:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_article = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_article = clean_t(parsed_index[k][0].get('text', ''))
            if '♦' in raw_article:
                break
                
    if '♦' in raw_article:
        # Extract all ♦ blocks
        diamond_blocks = []
        for part in raw_article.split('♦')[1:]:
            m_next = re.search(r'\s+\d+\.\s*(?:n|v|a|adv|prep|cj)\b', part)
            if m_next:
                diamond_blocks.append(part[:m_next.start()])
            else:
                diamond_blocks.append(part)
        all_diamonds_text = ' '.join(diamond_blocks)
        
        # Check if any meaning is inside diamond blocks
        meanings = item.get('meanings', [])
        for m in meanings:
            tr = m.get('translation', '').strip()
            # check significant substring
            words_in_tr = [x for x in re.split(r'[\s,;:]+', tr) if len(x) >= 4 and re.search(r'[а-яА-Я]', x)]
            if len(words_in_tr) >= 2:
                sample_phrase = ' '.join(words_in_tr[:3])
                if sample_phrase in all_diamonds_text:
                    leaked_meaning_count += 1
                    if w not in affected_words:
                        affected_words.append(w)

print(f"Total leaked meaning items found inside diamond blocks: {leaked_meaning_count}")
print(f"Total affected words with leaked idiom meanings: {len(affected_words)}")
print("Sample affected words:", affected_words[:20])
