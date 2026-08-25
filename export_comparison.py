# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('comparison_100_words.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

output_lines = []
for i, r in enumerate(data):
    word = r['word']
    cur = r['current'][:300]
    ori = (r['original_pdf'] or 'N/A')[:300]
    par = (r['parsed_pdf'] or 'N/A')[:300]
    output_lines.append(f"--- {i+1}. {word} ---")
    output_lines.append(f"CUR: {cur}")
    output_lines.append(f"ORI: {ori}")
    output_lines.append(f"PAR: {par}")
    output_lines.append("")

with open('comparison_full_output.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print(f"Written {len(data)} entries to comparison_full_output.txt")
