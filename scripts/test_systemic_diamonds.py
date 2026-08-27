# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))
from systemic_muller_parser import extract_all_diamonds_and_phrasals, parse_diamond_chunk_to_phrases

test_words = ['about i', 'account', 'act', 'air', 'ice', 'round']

for tw in test_words:
    if tw in parsed_index:
        raw_text = parsed_index[tw][0].get('text', '')
        base_w = tw.split()[0]
        main_body, diamond_chunks = extract_all_diamonds_and_phrasals(raw_text)
        print(f"=== Word: '{tw}' ===")
        print(f"  Main body length: {len(main_body)} (stripped of {len(diamond_chunks)} diamond chunks)")
        
        all_phrases = []
        for d in diamond_chunks:
            all_phrases.extend(parse_diamond_chunk_to_phrases(d, base_w))
            
        print(f"  Systemically extracted phrases: {len(all_phrases)}")
        for p in all_phrases[:4]:
            print(f"    phr: '{p['phrase']}' ({p['partOfSpeech']}) -> '{p['translation']}' (regs: {p['register']})")
        print()
