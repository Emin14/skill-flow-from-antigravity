# -*- coding: utf-8 -*-
"""
Comprehensive Audit & Repair Script for oxford_5000_updated.json
Verifies every word word-by-word against:
  1) SamPolnAnglRysSlovar - распарсенное.pdf (Doc2)
  2) SamPolnAnglRysSlovar.pdf (Doc1)
"""

import sys
import json
import re
import unicodedata
import os
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

print("=== Loading Dictionary PDFs and oxford_5000_updated.json ===")

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

print(f"Loaded {len(oxford_data)} words from oxford_5000_updated.json")

# Load Doc2 and Doc1 text
doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
pages_text2 = [doc2[p].get_text('text') for p in range(10, 508)]
doc2.close()

doc1 = pymupdf.open('SamPolnAnglRysSlovar.pdf')
pages_text1 = [doc1[p].get_text('text') for p in range(10, 508)]
doc1.close()

full_text2 = '\n'.join(pages_text2)
full_text1 = '\n'.join(pages_text1)

print(f"Doc2 text length: {len(full_text2)}, Doc1 text length: {len(full_text1)}")

# 1. Clean ligature splits in English text
LIGATURE_MAP = {
    r'\btraffi\s+c\b': 'traffic',
    r'\bdiffi\s+cult\b': 'difficult',
    r'\bdiffi\s+culty\b': 'difficulty',
    r'\bdiffi\s+culties\b': 'difficulties',
    r'\boffi\s+cial\b': 'official',
    r'\boffi\s+cially\b': 'officially',
    r'\boffi\s+ce\b': 'office',
    r'\boffi\s+ces\b': 'offices',
    r'\boffi\s+cer\b': 'officer',
    r'\boffi\s+cers\b': 'officers',
    r'\beffi\s+ciency\b': 'efficiency',
    r'\beffi\s+cient\b': 'efficient',
    r'\beffi\s+ciently\b': 'efficiently',
    r'\bsuffi\s+cient\b': 'sufficient',
    r'\bsuffi\s+ciently\b': 'sufficiently',
    r'\baffl\s+uence\b': 'affluence',
    r'\baffl\s+uent\b': 'affluent',
    r'\baffi\s+liated\b': 'affiliated',
    r'\baffi\s+liate\b': 'affiliate',
    r'\baffi\s+liation\b': 'affiliation',
    r'\bconfi\s+dence\b': 'confidence',
    r'\bconfi\s+dent\b': 'confident',
    r'\bconfi\s+rm\b': 'confirm',
    r'\bprofi\s+t\b': 'profit',
    r'\bprofi\s+table\b': 'profitable',
    r'\bdefi\s+cit\b': 'deficit',
    r'\bdefi\s+nite\b': 'definite',
    r'\bdefi\s+nition\b': 'definition',
    r'\bfl\s+our\b': 'flour',
    r'\bfl\s+ow\b': 'flow',
    r'\bfl\s+ight\b': 'flight',
    r'\bfl\s+y\b': 'fly',
    r'\bfl\s+oor\b': 'floor',
    r'\bfi\s+nd\b': 'find',
    r'\bfi\s+re\b': 'fire',
    r'\bfi\s+rst\b': 'first',
    r'\bfi\s+sh\b': 'fish',
    r'\bfi\s+ve\b': 'five',
    r'\bfi\s+x\b': 'fix',
    r'\bfi\s+ne\b': 'fine',
    r'\bfi\s+eld\b': 'field',
    r'\bfi\s+gure\b': 'figure',
    r'\bfi\s+ll\b': 'fill',
    r'\bfi\s+lm\b': 'film',
    r'\bfi\s+nal\b': 'final',
    r'\bfi\s+nancial\b': 'financial'
}

def clean_ligature_splits(text):
    if not text: return ""
    for pattern, repl in LIGATURE_MAP.items():
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    return text

print("Testing ligature cleaning...")
sample = "traffi c jam and diffi cult offi ce furniture"
cleaned = clean_ligature_splits(sample)
print("Sample cleaned:", repr(cleaned))
