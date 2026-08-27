# -*- coding: utf-8 -*-
"""
Recombine detached lettered sub-markers (б), в), г), etc.) into parent examples
and clean translation fields across all 4980 words.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

def standardize_sub_letters(text):
    # Converts а) ... б) ... into 1) ...; 2) ...
    # e.g. "а) дать полную меру; б) воздать полной мерой" -> "1) дать полную меру; 2) воздать полной мерой"
    def repl_letter(m):
        letter = m.group(1).lower()
        idx_map = {'а': '1', 'б': '2', 'в': '3', 'г': '4', 'д': '5', 'е': '6', 'ж': '7', 'з': '8', 'и': '9', 'к': '10'}
        num = idx_map.get(letter, letter)
        prefix = '; ' if m.start() > 0 and not m.string[:m.start()].rstrip().endswith(';') else ''
        return f"{prefix}{num}) "
    
    text = re.sub(r'(?:;\s*)?([абвгдежзик])\)\s*', repl_letter, text)
    text = re.sub(r'^[;\s,]+', '', text).strip()
    return text

def process_entry_meanings(item):
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        
        # Check if translation has trailing lettered segments like "; б) воздать полной мерой..."
        # Find the first occurrence of "; б)" or "б)" after the main translation
        # But distinguish from legitimate descriptions like "указывает на: а) движение... б) нахождение..."
        if not re.search(r'указывает на|служит для|обозначает', tr, re.I):
            m_split = re.search(r'[;\s]\s*([бвгдежзик])\)\s*(.+)$', tr)
            if m_split:
                tail = m_split.group(0).strip('; \t\n')
                head = tr[:m_split.start()].strip('; \t\n')
                
                # If there are existing examples, and the last example has 'а)' or needs the tail
                if exs:
                    last_ex = exs[-1]
                    last_ru = last_ex.get('ru', '')
                    # Recombine
                    combined_ru = last_ru + '; ' + tail
                    combined_ru = standardize_sub_letters(combined_ru)
                    last_ex['ru'] = combined_ru
                    m['translation'] = head
                else:
                    # If no preceding example, just clean the tail or format cleanly
                    if head:
                        m['translation'] = head
                        
        # Standardize any remaining sub-letters in examples
        for ex in exs:
            ru = ex.get('ru', '')
            if re.search(r'\b[абвгдежзик]\)\s*', ru):
                ex['ru'] = standardize_sub_letters(ru)

for item in oxford_data:
    process_entry_meanings(item)

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Recombined broken lettered examples and cleaned translations successfully!")
