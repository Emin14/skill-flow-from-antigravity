# -*- coding: utf-8 -*-
"""
Strip all invisible soft hyphens (\u00ad) across the entire JSON dataset.
"""
import json, os, sys

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all \u00ad soft hyphens
text_clean = text.replace('\u00ad', '').replace('\xad', '')

with open(oxford_path, 'w', encoding='utf-8') as f:
    f.write(text_clean)

import shutil
shutil.copyfile(oxford_path, 'src/data/oxford_5000.json')
print("Stripped all soft hyphens and synced files successfully!")
