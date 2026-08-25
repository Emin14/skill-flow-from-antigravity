# -*- coding: utf-8 -*-
"""Analyze comparison results and find discrepancies."""
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('comparison_100_words.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

found_parsed = sum(1 for r in data if r['parsed_pdf'] != '(не найдено)')
found_original = sum(1 for r in data if r['original_pdf'] != '(не найдено)')

print(f'Total words checked: {len(data)}')
print(f'Found in parsed PDF: {found_parsed}/100')
print(f'Found in original PDF: {found_original}/100')

# Find potential issues: words where current meanings seem incomplete or wrong
issues = []
for r in data:
    word = r['word']
    current = r['current']
    parsed = r['parsed_pdf']
    original = r['original_pdf']
    
    if parsed == '(не найдено)':
        continue
    
    # Extract key Russian translation words from current
    current_words = set()
    for part in current.split('|'):
        bracket_end = part.find(']')
        if bracket_end >= 0:
            text = part[bracket_end+1:].strip()
            for w in text.split():
                clean = w.strip('.,;()[]{}')
                if len(clean) > 3 and all(ord(c) > 127 or c.isalpha() for c in clean):
                    current_words.add(clean.lower())
    
    # Check how many current words appear in parsed text
    parsed_lower = parsed.lower()
    if current_words:
        found_count = sum(1 for w in current_words if w in parsed_lower)
        match_ratio = found_count / len(current_words)
    else:
        match_ratio = 1.0
    
    # Also check if parsed has significantly MORE content
    parsed_meanings_approx = parsed.count(')') + parsed.count(';')
    current_meanings_approx = current.count(';') + current.count('|')
    
    has_issue = False
    issue_type = []
    
    if match_ratio < 0.6:
        has_issue = True
        issue_type.append(f'Low match ({match_ratio:.0%})')
    
    if parsed_meanings_approx > current_meanings_approx * 1.5 + 3:
        has_issue = True
        issue_type.append('More meanings in PDF')
    
    issues.append({
        'word': word,
        'has_issue': has_issue,
        'issue_type': ', '.join(issue_type),
        'match_ratio': match_ratio,
        'current': current,
        'parsed_pdf': parsed,
        'original_pdf': original
    })

issues_found = [i for i in issues if i['has_issue']]
print(f'\nPotential issues found: {len(issues_found)}')

for i in issues_found:
    print(f"\n{'='*80}")
    print(f"WORD: {i['word']} | Issue: {i['issue_type']}")
    print(f"CURRENT:  {i['current'][:250]}")
    print(f"PARSED:   {i['parsed_pdf'][:250]}")
    print(f"ORIGINAL: {(i['original_pdf'] or 'N/A')[:250]}")

# Save detailed report
report = {
    'summary': {
        'total_words': len(data),
        'found_in_parsed': found_parsed,
        'found_in_original': found_original,
        'issues_found': len(issues_found)
    },
    'issues': issues_found,
    'all_comparisons': issues
}

with open('comparison_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print(f"\nDetailed analysis saved to comparison_analysis.json")
