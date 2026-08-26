# -*- coding: utf-8 -*-
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

# Identify all words where stemming happened
stemmed_words = []

# Load the PDF index to see what words directly match vs stemmed
# Let's inspect which words are derivative forms in Oxford 5000
derivatives = []
for it in data:
    w = it['word']
    w_low = w.lower()
    # Check if word ends with common derivative suffixes
    if any(w_low.endswith(sfx) for sfx in ['ly', 'ed', 'ing', 'tion', 'ment', 'ness', 'able', 'ible', 'ive', 'al', 'ic', 'ful', 'less']):
        derivatives.append(it)

print(f"Total derivative candidates in Oxford 5000: {len(derivatives)}")
