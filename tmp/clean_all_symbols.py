import io, json, re

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

def clean_text(s):
    if not isinstance(s, str):
        return s
    # Fix broken hyphenations like сло- ≅ во -> слово
    s = re.sub(r'([а-яА-ЯёЁa-zA-Z]+)-\s*[≅♦]\s*([а-яА-ЯёЁa-zA-Z]+)', r'\1\2', s)
    # Remove ≅
    s = re.sub(r'\s*≅\s*', ' ', s)
    # Replace ♦ with semicolon if between words, else remove
    s = re.sub(r'\s*♦\s*', '; ', s)
    # Clean multiple spaces
    s = re.sub(r'\s{2,}', ' ', s)
    return s.strip()

def clean_obj(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str):
                obj[k] = clean_text(v)
            else:
                clean_obj(v)
    elif isinstance(obj, list):
        for item in obj:
            clean_obj(item)

clean_obj(data)

with io.open('oxford_5000_2026-08-27.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

s = json.dumps(data, ensure_ascii=False)
print("Remaining approx count:", s.count('\u2245'))
print("Remaining diamond count:", s.count('♦'))
