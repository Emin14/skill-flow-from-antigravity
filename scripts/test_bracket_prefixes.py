# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

PREFIXES = {
    'при', 'по', 'за', 'на', 'вы', 'от', 'до', 'из', 'ис', 'с', 'со', 
    'у', 'про', 'пере', 'пред', 'пре', 'раз', 'рас', 'вос', 'воз', 
    'под', 'над', 'об', 'обо', 'в', 'во', 'не', 'недо', 'сверх', 
    'радио', 'перво', 'благо', 'веро', 'кино', 'фото', 'теле'
}

# But exclude whole words like '(в) другой раз', '(на) этот раз', '(по) праву', '(из) города', '(с) ним'
# If followed by a root that merges into a standard Russian word (e.g. (при)годный, (по)являться, (пред)полагать, (на)хлынуть, (вос)торжествовать)

def merge_bracketed_prefixes(text):
    if not text: return ""
    
    # Check each prefix
    for pref in PREFIXES:
        # Pattern: (pref) word -> (pref)word
        # e.g. (при) годный -> (при)годный
        pattern = re.compile(rf'\({pref}\)\s+([а-яёА-ЯЁ]+)', re.IGNORECASE)
        # We need to distinguish prefix attaching to word vs preposition '(в) другой раз'
        # If pref in ('в', 'на', 'из', 'с', 'по', 'до', 'у', 'от', 'за', 'о', 'об') and word is a pronoun/noun/adjective:
        # e.g. '(на) этот раз', '(в) другой раз', '(по) праву'
        def repl(match):
            w = match.group(1).lower()
            if pref in ('в', 'на', 'из', 'с', 'по', 'до', 'у', 'от', 'за') and w in (
                'этот', 'этом', 'эту', 'этой', 'другой', 'другом', 'другую', 'другое', 
                'какой', 'каком', 'какую', 'какое', 'свой', 'своём', 'свою', 'своё', 
                'праву', 'себе', 'себя', 'собой', 'нём', 'ней', 'них', 'мне', 'меня'
            ):
                return match.group(0) # Keep space
            return f"({match.group(0).split('(')[1].split(')')[0]}){match.group(1)}"
            
        text = pattern.sub(repl, text)
    return text

count = 0
for it in data:
    for m in it.get('meanings', []):
        old_t = m.get('translation', '')
        new_t = merge_bracketed_prefixes(old_t)
        if old_t != new_t:
            count += 1
            print(f"[{it['word']:12}] {repr(old_t)} -> {repr(new_t)}")
        for ex in m.get('examples', []):
            old_ru = ex.get('ru', '')
            new_ru = merge_bracketed_prefixes(old_ru)
            if old_ru != new_ru:
                count += 1
                print(f"  ex [{it['word']:12}] {repr(old_ru)} -> {repr(new_ru)}")

print(f"\nTotal merged prefix occurrences: {count}")
