# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def audit_entry(entry):
    w = entry['word']
    issues = []
    
    for m in entry.get('meanings', []):
        tr = m.get('translation', '')
        mid = m['id']
        
        # 1. Embedded English words inside Russian translation
        # e.g. "с ним надо считаться reckon among"
        eng_in_tr = re.findall(r'[а-яА-ЯёЁ]\s+([a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})*)\s+[а-яА-ЯёЁ]', tr)
        if eng_in_tr:
            issues.append((mid, 'eng_glued_in_tr', tr, eng_in_tr))
            
        # 2. Embedded sub-enumerations like "7)", "2)", "3)", "; б)", "; в)"
        if re.search(r'(?:^|\s|\;)[0-9]{1,2}\)\s*', tr):
            issues.append((mid, 'number_marker_in_tr', tr))
        if re.search(r';\s*[а-яa-z]\)\s*', tr):
            issues.append((mid, 'sub_enum_in_tr', tr))
            
        # 3. Unmatched parens
        if tr.count('(') != tr.count(')') or tr.count('[') != tr.count(']'):
            issues.append((mid, 'unmatched_parens_in_tr', tr))
            
        # 4. Leading lone closing paren e.g. "грубая) шутка"
        if re.match(r'^[^\(\[]*[\)\]]', tr):
            issues.append((mid, 'leading_closing_paren', tr))
            
        # 5. Grammar glosses like "(сравн. ст. от late 1)"
        if re.search(r'\((?:сравн\.|превосх\.|прош\.|прич\.|повелит\.|сокращ\.|уменьш\.)\s+ст\.', tr):
            issues.append((mid, 'grammar_gloss_in_tr', tr))
            
        # 6. Check examples
        for ex in m.get('examples', []):
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            eng_in_ru = re.findall(r'[а-яА-ЯёЁ]\s+([a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})*)\s+[а-яА-ЯёЁ]', ru)
            if eng_in_ru:
                issues.append((mid, 'eng_glued_in_ex_ru', f"en: {en} | ru: {ru}", eng_in_ru))
            if re.search(r';\s*[а-яa-z]\)\s*', ru):
                issues.append((mid, 'sub_enum_in_ex_ru', f"en: {en} | ru: {ru}"))
            if ru.count('(') != ru.count(')') or ru.count('[') != ru.count(']'):
                issues.append((mid, 'unmatched_parens_in_ex_ru', f"en: {en} | ru: {ru}"))
                
    return issues

all_issues = {}
issue_counts = {}

for entry in data:
    issues = audit_entry(entry)
    if issues:
        all_issues[entry['word']] = issues
        for _, itype, *rest in issues:
            issue_counts[itype] = issue_counts.get(itype, 0) + 1

print(f"Total words with issues: {len(all_issues)} / {len(data)}")
print("\nIssue breakdown:")
for k, v in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {k}: {v}")

sample_words = ['lady', 'latter', 'lend', 'lie', 'long', 'joke', 'push', 'reckon']
print("\n=== USER REPORTED WORDS AUDIT ===")
for sw in sample_words:
    if sw in all_issues:
        print(f"\nWord: {sw}")
        for iss in all_issues[sw]:
            print(f"  {iss}")
