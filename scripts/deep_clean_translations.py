import sys, re, json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

def deep_clean_translation(tr):
    if not tr:
        return ''
    t = tr
    # Remove cross reference brackets like [см. тж. ...], [см. ...], [ см. ... ]
    t = re.sub(r'\[\s*см\.[^\]]*\]', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\[\s*тж\.[^\]]*\]', '', t, flags=re.IGNORECASE)
    # Remove dangling brackets or leading junk
    t = re.sub(r'^[\]\)\,\;\:\.\s]+', '', t)
    t = re.sub(r'[\[\(\,\;\:\.\s]+$', '', t)
    # Remove double spaces
    t = re.sub(r'[ \t]+', ' ', t).strip()
    return t

def deep_clean_example(ex):
    if not ex or not isinstance(ex, dict):
        return ex
    en = ex.get('en', '')
    ru = ex.get('ru', '')
    en = re.sub(r'^[\]\)\,\;\:\.\s]+', '', en)
    en = re.sub(r'[\[\(\,\;\:\.\s]+$', '', en)
    ru = re.sub(r'\[\s*см\.[^\]]*\]', '', ru, flags=re.IGNORECASE)
    ru = re.sub(r'^[\]\)\,\;\:\.\s]+', '', ru)
    ru = re.sub(r'[\[\(\,\;\:\.\s]+$', '', ru)
    ex['en'] = re.sub(r'[ \t]+', ' ', en).strip()
    ex['ru'] = re.sub(r'[ \t]+', ' ', ru).strip()
    return ex

# Clean all words
cleaned_count = 0
for w in words:
    for m in w.get('meanings', []):
        old_tr = m.get('translation', '')
        new_tr = deep_clean_translation(old_tr)
        if old_tr != new_tr:
            cleaned_count += 1
            m['translation'] = new_tr
        m['examples'] = [deep_clean_example(ex) for ex in m.get('examples', []) if ex.get('en') and ex.get('ru')]

print(f"Deep cleaned {cleaned_count} translations across dataset.")

# Verify sample words
for test_w in ['catch', 'water', 'table', 'press', 'board', 'break', 'deal', 'fall', 'run', 'set']:
    e = next((w for w in words if w['word'].lower() == test_w), None)
    if e:
        print(f"\nWord: {test_w} ({len(e['meanings'])} meanings):")
        for m in e['meanings'][:4]:
            print(f"  #{m['id']} [{m['partOfSpeech']}] {m['translation']}")

with open('oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

with open('src/data/oxford_5000.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print("Saved deeply cleaned datasets.")
