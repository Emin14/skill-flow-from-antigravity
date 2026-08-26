# -*- coding: utf-8 -*-
import json
import sys
import pymupdf

from parse_entry_meanings_v2 import parse_entry_meanings_and_phrases

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

# Inspect look on page 265
from build_verified_dataset_v3 import index_by_base

entries = index_by_base.get('look', [])
print(f"Total raw entries for look: {len(entries)}")
for raw_hw, e in entries:
    m_list, p_list = parse_entry_meanings_and_phrases(raw_hw, e['body_spans'])
    print(f"--- Entry '{raw_hw}' (page {e['page']}) ---")
    pos_set = set(m['partOfSpeech'] for m in m_list)
    print(f"Meanings count: {len(m_list)}, POS set: {pos_set}")
    for m in m_list[:5]:
        print(f"  [{m['partOfSpeech']}] {m['translation']}")
