# -*- coding: utf-8 -*-
import pymupdf
import sys

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open('SamPolnAnglRysSlovar.pdf')

for p in range(160, 185):
    d = doc[p].get_text('dict')
    for b in d['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            for s in l['spans']:
                if any(hf in s['font'] for hf in ['PragmaticaBold', 'Pragmatica-Bold', 'PragmaticaBoldA-Reg']):
                    t = s['text']
                    if any(sub in t for sub in ['ilm', 'ind', 'ire', 'rst', 'ield', 'ight', 'lash', 'lat']):
                        print("P.%d | font=%s | text=%r | ords=%s" % (p, s['font'], t, [ord(c) for c in t]))
