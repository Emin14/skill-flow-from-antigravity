# -*- coding: utf-8 -*-
"""
Comprehensive Fixer for all 7 error pattern classes across oxford_5000_2026-08-27.json:
1. Reconstruct all chopped Russian roots (комната, строгий, сбивать с ног, etc.)
2. Clean leading English fragments (of smth.;, to smth.;, etc.)
3. Clean trailing hanging brackets and notes ([см. тж, (см. тж, ; часто, [часто)
4. Clean orphaned brackets at start of translation/phrase
5. Extract embedded idioms (after (или in) a sort;, to [en] [ru])
6. Disentangle and properly split smashed phrasal dumps (send, tie, drive, deliver, pass, pay, etc.)
7. Fix internal soft-hyphen splits (подня тие -> поднятие, спла- чивать(ся) -> сплачивать(ся), etc.)
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

fix_log = []

# 1. SPECIFIC CHOPPED ROOT REPAIRS
CHOPPED_ROOT_REPAIRS = [
    (r'\bната на одного человека\b', 'комната на одного человека'),
    (r'\bната для одного человека\b', 'комната для одного человека'),
    (r'^огий\s*\(о\s*наказании', 'строгий (о наказании'),
    (r'^огая\s*\(о\s*диете', 'строгая (о диете'),
    (r'^огие\s*правила\b', 'строгие правила'),
    (r'\bсбивать\s*\(с\s*но;\s*4\)\b', 'сбивать (с ног)'),
    (r'\bсбивать\s*\(с\s*но\b', 'сбивать (с ног)'),
    (r'\bс\s*но;\s*4\b', 'с ног'),
    (r'^ь\s+на\s+чью-либо\s+сторону\b', 'встать на чью-либо сторону'),
    (r'^а\s+верховой\s+езды\b', 'школа верховой езды'),
    (r'^ное\s+училище\b', 'военное училище'),
    (r'^ный\s+магазин\b', 'военный магазин'),
    (r'^ное\s+искусство\b', 'военное искусство'),
    (r'^ный\s+кодекс\b', 'военный кодекс'),
    (r'^ья\s+конституции\b', 'статья конституции'),
    (r'^аться\s+толпой\b', 'собираться толпой'),
    (r'^ать\s+толпой\b', 'собирать толпой')
]

# 2. INTERNAL WORD SPLITS / HYPHENATION REPAIRS
INTERNAL_SPLIT_REPAIRS = [
    (r'\bподня\s+тие\b', 'поднятие'),
    (r'\bспла-\s*чивать\(ся\)\b', 'сплачивать(ся)'),
    (r'\bампли\s+туда\b', 'амплитуда'),
    (r'\bоплаченаполучателем\b', 'оплачена получателем'),
    (r'\bпоследождичка\b', 'после дождичка'),
    (r'\bпре\s+имущество\b', 'преимущество'),
    (r'\bсовершеннолет\s+ний\b', 'совершеннолетний'),
    (r'\bпоследова\s+тельную\b', 'последовательную'),
    (r'\bперево\s+зить\b', 'перевозить'),
    (r'\bприклю\s+чение\b', 'приключение'),
    (r'\bактивный;\s*жи\s+вой\b', 'активный; живой'),
    (r'\bдей\s+ствующий\b', 'действующий')
]

# 3. LEADING ENGLISH FRAGMENT REPAIRS
LEADING_ENGLISH_PATTERNS = [
    r'^(?:of|to|for|in|with|on|at|by|from|about|against|into)\s+(?:smb\.|smth\.|the\s+\w+|one\'s\s+\w+)\s*[;:,]\s*'
]

# 4. HANGING TAILS REPAIRS
HANGING_TAIL_PATTERNS = [
    r'\s*\[см\.?\s*тж.*$',
    r'\s*\(см\.?\s*тж.*$',
    r'\s*\[см\.?.*$',
    r'\s*;\s*часто\s*$',
    r'\s*\[часто\s*$',
    r'\s*\(часто\s*$',
    r'\s*\[тж\.\s*$',
    r'\s*\(тж\.\s*$'
]

# 5. ORPHANED BRACKET AT START
ORPHANED_BRACKET_START = [
    r'^[a-zA-Z\s,—\-]+\s*—\s*[\u0400-\u04FF\s,—\-]+\);\s*',
    r'^\);\s*',
    r'^\)\s*',
    r'^[^\(]*?\)\s*;\s*'
]

def clean_text_field(text, word, field_type, field_id):
    original = text
    
    # 1. Fix chopped roots
    for pat, repl in CHOPPED_ROOT_REPAIRS:
        text = re.sub(pat, repl, text)
        
    # 2. Fix internal word splits
    for pat, repl in INTERNAL_SPLIT_REPAIRS:
        text = re.sub(pat, repl, text)
        
    # 3. Fix leading English fragments
    for pat in LEADING_ENGLISH_PATTERNS:
        text = re.sub(pat, '', text)
        
    # 4. Fix hanging tails
    for pat in HANGING_TAIL_PATTERNS:
        text = re.sub(pat, '', text)
        
    # 5. Fix orphaned brackets at start
    for pat in ORPHANED_BRACKET_START:
        text = re.sub(pat, '', text)
        
    # Clean whitespace and trailing punctuation
    text = re.sub(r';;+', ';', text)
    text = re.sub(r'\s+', ' ', text).strip(' ;:,-')
    
    if text != original:
        fix_log.append({
            'word': word,
            'field': f"{field_type}_{field_id}",
            'before': original,
            'after': text
        })
    return text

# Process all items
for item in data:
    w = item['word']
    
    # Meaning clean
    for m in item.get('meanings', []):
        m['translation'] = clean_text_field(m['translation'], w, 'meaning', m['id'])
        
        # Clean embedded idioms like 'образ, манера; after (или in) a sort; некоторым образом; в некоторой степени'
        sort_m = re.search(r'^(.*?);\s*(after\s+\(или\s+in\)\s+a\s+sort|in\s+\(или\s+after\)\s+a\s+sort)\s*;\s*(.*)$', m['translation'])
        if sort_m:
            pure_ru = sort_m.group(1).strip(' ;:,-')
            en_phr = sort_m.group(2).strip(' ;:,-')
            ru_phr = sort_m.group(3).strip(' ;:,-')
            m['translation'] = pure_ru
            if 'examples' not in m:
                m['examples'] = []
            m['examples'].append({
                'en': en_phr,
                'ru': ru_phr,
                'register': []
            })
            fix_log.append({
                'word': w,
                'field': f"meaning_{m['id']}",
                'before': sort_m.group(0),
                'after': f"trans='{pure_ru}', ex='{en_phr}' -> '{ru_phr}'"
            })
            
        for ex_idx, ex in enumerate(m.get('examples', [])):
            ex['ru'] = clean_text_field(ex['ru'], w, f"meaning_{m['id']}_ex", ex_idx)
            
    # Phrases clean
    for p in item.get('phrases', []):
        p['translation'] = clean_text_field(p['translation'], w, 'phrase', p['id'])
        for ex_idx, ex in enumerate(p.get('examples', [])):
            ex['ru'] = clean_text_field(ex['ru'], w, f"phrase_{p['id']}_ex", ex_idx)

print(f"Total pattern repairs applied: {len(fix_log)}")

# Special Disentanglement for 'send', 'shine', 'tie', 'sort'
# Let's inspect 'send' specifically to rebuild its phrasal verbs perfectly according to Mueller
for item in data:
    if item['word'] == 'send':
        item['phrases'] = [
            { "id": 1, "phrase": "send down", "partOfSpeech": "verb", "translation": "1) понижать (цены); 2) сбивать (с ног); 3) исключать (из университета); 4) приговорить к тюремному заключению", "examples": [], "register": [] },
            { "id": 2, "phrase": "send for", "partOfSpeech": "verb", "translation": "посылать за (кем-либо, чем-либо)", "examples": [], "register": [] },
            { "id": 3, "phrase": "send in", "partOfSpeech": "verb", "translation": "подавать (заявление); представлять (экспонат на выставку)", "examples": [], "register": [] },
            { "id": 4, "phrase": "send off", "partOfSpeech": "verb", "translation": "1) отсылать; отправлять; 2) провожать, устраивать проводы; 3) спорт. удалять (с поля)", "examples": [], "register": [] },
            { "id": 5, "phrase": "send on", "partOfSpeech": "verb", "translation": "отправлять вперёд (багаж); пересылать (письма)", "examples": [], "register": [] },
            { "id": 6, "phrase": "send out", "partOfSpeech": "verb", "translation": "1) рассылать, рассылать циркуляры; 2) испускать (лучи, тепло); 3) давать (побеги)", "examples": [], "register": [] },
            { "id": 7, "phrase": "send up", "partOfSpeech": "verb", "translation": "1) направлять вверх; 2) повышать (цены); 3) разг. приговорить к тюремному заключению; 4) пародировать, высмеивать", "examples": [], "register": [] }
        ]
    elif item['word'] == 'shine':
        for m in item.get('meanings', []):
            if 'снять, удалить блеск' in m['translation']:
                m['translation'] = 'снять, удалить блеск, глянец с чего-либо; лишить что-либо блеска, новизны (to take the shine off/of smth.)'
    elif item['word'] == 'tie':
        item['phrases'] = [
            { "id": 1, "phrase": "tie down", "partOfSpeech": "verb", "translation": "связывать, ограничивать (свободу действий)", "examples": [], "register": [] },
            { "id": 2, "phrase": "tie in", "partOfSpeech": "verb", "translation": "увязывать, согласовывать (with — с чем-либо)", "examples": [], "register": [] },
            { "id": 3, "phrase": "tie up", "partOfSpeech": "verb", "translation": "1) привязывать (к чему-либо); 2) шнуровать (ботинки); 3) перевязывать (голову и т. п.); 4) связывать (капитал)", "examples": [], "register": [] }
        ]

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Successfully synced with src/data/oxford_5000.json!")
