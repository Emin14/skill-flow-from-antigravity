# -*- coding: utf-8 -*-
import sys
import zipfile
import xml.sax
import time
import re
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

docx_path = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'

POS_MAP = {
    'n': 'noun',
    'v': 'verb',
    'vi': 'verb',
    'vt': 'verb',
    'a': 'adjective',
    'adj': 'adjective',
    'adv': 'adverb',
    'prep': 'preposition',
    'cj': 'conjunction',
    'conj': 'conjunction',
    'int': 'interjection',
    'pron': 'pronoun',
    'num': 'numeral',
    'num.': 'numeral',
    'art': 'article',
    'pres. p.': 'participle',
    'pres.p.': 'participle',
    'p. p.': 'participle',
    'p.p.': 'participle',
    'pref': 'prefix',
    'suff': 'suffix',
    'predic': 'predicative',
    'predic.': 'predicative'
}

def clean_russian(t):
    if not t: return ""
    # Remove stress marks ' and ´ and `
    t = re.sub(r"([а-яёА-ЯЁ])['´`]\s*", r"\1", t)
    t = re.sub(r"\s*['´`]([а-яёА-ЯЁ])", r"\1", t)
    # Fix soft hyphen linebreaks: e.g. "па'- луба" -> "палуба", "нар- ко'тик" -> "наркотик"
    t = re.sub(r"([а-яёА-ЯЁ]+)\s*-\s*([а-яёА-ЯЁ]+)", r"\1\2", t)
    # Fix broken soft signs e.g. "бол' ьшей" -> "большей", "вводит' ь" -> "вводить"
    t = re.sub(r"([а-яёА-ЯЁ])\s+ь\b", r"\1ь", t)
    t = re.sub(r"([а-яёА-ЯЁ])\s+ъ\b", r"\1ъ", t)
    # Clean private unicode / bullet symbols
    t = re.sub(r'[\uf000-\uf8ff¬◆]', '', t)
    # Clean empty parentheses and double punctuation
    t = re.sub(r'\(\s*\)', '', t)
    t = re.sub(r'\s+([,;:?.!)])', r'\1', t)
    t = re.sub(r'([(])\s+', r'\1', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_english(t, hw=""):
    if not t: return ""
    # Expand tilde ~ to headword
    if hw:
        base_hw = re.sub(r'\s+[IVXLCDM]+$', '', hw).strip()
        t = t.replace('~', base_hw)
    t = re.sub(r'[\uf000-\uf8ff¬◆]', '', t)
    t = re.sub(r'\s+([,;:?.!\'\"])', r'\1', t)
    t = re.sub(r'([\'\"])\s+', r'\1', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_phon(p):
    if not p: return ""
    p = p.strip()
    p = re.sub(r'^[\[\/\(]+|[\]\/\)]+$', '', p).strip()
    p = p.replace('´', 'ˈ').replace('`', 'ˈ').replace('˛', 'ˌ').replace('∫', 'ʃ').replace('t∫', 'tʃ')
    p = p.replace('dy', 'dʒ').replace('dз', 'dʒ').replace('c:', 'ɔː').replace('3:', 'ɜː')
    p = re.sub(r'\s+', ' ', p).strip()
    return f"/{p}/" if p else ""

class DocxDictionaryParser:
    def __init__(self):
        pass

    def parse_entry(self, entry_paragraphs):
        # 1. Flatten all runs from paragraphs
        # Each run is (text, is_bold, is_italic)
        all_runs = []
        for p in entry_paragraphs:
            for txt, b, i in p:
                if txt:
                    if all_runs and all_runs[-1][1] == b and all_runs[-1][2] == i:
                        all_runs[-1] = (all_runs[-1][0] + txt, b, i)
                    else:
                        all_runs.append((txt, b, i))
            # add a space between paragraphs
            if all_runs and not all_runs[-1][0].endswith(' '):
                all_runs.append((' ', False, False))

        full_raw_text = ''.join(r[0] for r in all_runs).strip()
        
        # 2. Extract Headword, Phonetic, and Body
        # Headword is in initial bold run(s)
        hw_runs = []
        body_runs = []
        found_phon_or_body = False
        
        for r_idx, (r_txt, r_b, r_i) in enumerate(all_runs):
            if not found_phon_or_body:
                if '[' in r_txt:
                    # split before '['
                    before_br, _, after_br = r_txt.partition('[')
                    if before_br.strip():
                        hw_runs.append((before_br, r_b, r_i))
                    body_runs.append(('[' + after_br, r_b, r_i))
                    found_phon_or_body = True
                elif r_b and not re.search(r'\b(1\.|2\.|3\.|[1-9]\))\b', r_txt):
                    hw_runs.append((r_txt, r_b, r_i))
                else:
                    found_phon_or_body = True
                    body_runs.append((r_txt, r_b, r_i))
            else:
                body_runs.append((r_txt, r_b, r_i))

        raw_hw = ''.join(r[0] for r in hw_runs).strip()
        if not raw_hw:
            # fallback from full_raw_text
            m = re.match(r'^([a-zA-Z\-\'\s]{1,45}(?:\s+[IVXLCDM]+|\s+\d+)?)(.*)', full_raw_text)
            if m:
                raw_hw = m.group(1).strip()
            else:
                raw_hw = full_raw_text.split()[0]

        # Extract phonetic from body_runs or full text
        phon = ""
        phon_match = re.search(r'\[([^\]]+)\]', full_raw_text)
        if phon_match:
            phon = clean_phon(phon_match.group(1))

        # 3. Parse Meanings, POS sections, and Phrases
        # Split body by Roman/Arabic numerals for POS (e.g. "1. n", "2. v") or POS markers
        meanings = []
        phrases = []
        
        # Reconstruct body text and runs
        body_text = ''.join(r[0] for r in body_runs)
        # Remove the phonetic bracket from body text
        if phon_match:
            body_text = body_text.replace(phon_match.group(0), '', 1)

        # Detect phrases/collocations marked by ¬ or ◆
        # ¬ marks phrasal verbs / verb collocations
        # ◆ or  marks idioms / proverbs
        phrases_sections = []
        main_body = body_text
        
        phr_split = re.split(r'([¬◆\uf0a8])', body_text)
        if len(phr_split) > 1:
            main_body = phr_split[0]
            # subsequent pairs are (marker, content)
            for i in range(1, len(phr_split), 2):
                marker = phr_split[i]
                content = phr_split[i+1] if i+1 < len(phr_split) else ""
                # Parse expressions inside content
                # Expressions often look like: "~ away а) удалять; б) уносить; ~ back брать обратно"
                # or "to get on one's nerves действовать на нервы"
                # Split by ~ or English collocations
                sub_phrs = re.split(r'(?:^|;\s*|\s{2,})(?:(?=[~])|(?=to\s+[a-zA-Z]))', content)
                for sp in sub_phrs:
                    sp_clean = sp.strip()
                    if not sp_clean: continue
                    # Find English and Russian parts: English part is before Russian letters
                    m_ru = re.search(r'[а-яёА-ЯЁ]', sp_clean)
                    if m_ru:
                        en_part = clean_english(sp_clean[:m_ru.start()], raw_hw)
                        ru_part = clean_russian(sp_clean[m_ru.start():])
                        if en_part and ru_part:
                            phrases.append({'en': en_part, 'ru': ru_part})
                    else:
                        en_part = clean_english(sp_clean, raw_hw)
                        if en_part:
                            phrases.append({'en': en_part, 'ru': ''})

        # Parse main_body into senses/meanings
        # Check if there are POS sections (e.g. "1. n ... 2. v ...") or single POS
        pos_sections = re.split(r'(?:^|\s+)(?:([1-9]\.)\s+)?\b(n|v|vi|vt|adj|a|adv|prep|cj|conj|int|pron|num|art|pres\. p\.|p\. p\.|pref|suff|predic)\b', main_body)
        
        current_pos = 'noun'
        meaning_id = 1

        if len(pos_sections) > 1:
            # We have structured POS sections
            # pos_sections: [prefix, num1, pos1, text1, num2, pos2, text2, ...]
            # Step by 3
            i = 1
            while i < len(pos_sections):
                num = pos_sections[i]
                pos_code = pos_sections[i+1] if i+1 < len(pos_sections) else None
                sec_text = pos_sections[i+2] if i+2 < len(pos_sections) else ""
                i += 3
                
                if pos_code:
                    current_pos = POS_MAP.get(pos_code.lower(), 'noun')
                
                # Split numbered senses inside sec_text: "1) ... 2) ... 3) ..."
                senses = re.split(r'(?:^|\s+)([1-9][0-9]?\))\s+', sec_text)
                if len(senses) > 1:
                    # senses: [intro, num1, text1, num2, text2...]
                    s_idx = 1
                    while s_idx < len(senses):
                        s_num = senses[s_idx]
                        s_txt = senses[s_idx+1] if s_idx+1 < len(senses) else ""
                        s_idx += 2
                        
                        # Extract examples inside sense
                        # Examples usually have english text followed by russian text e.g. "to abandon ship покидать судно"
                        ex_list = []
                        # Clean sense translation
                        # Check for embedded examples
                        ru_clean = clean_russian(s_txt)
                        if ru_clean:
                            meanings.append({
                                'id': meaning_id,
                                'partOfSpeech': current_pos,
                                'translation': ru_clean,
                                'examples': ex_list
                            })
                            meaning_id += 1
                else:
                    ru_clean = clean_russian(sec_text)
                    if ru_clean:
                        meanings.append({
                            'id': meaning_id,
                            'partOfSpeech': current_pos,
                            'translation': ru_clean,
                            'examples': []
                        })
                        meaning_id += 1
        else:
            # Fallback: check numbered senses directly
            senses = re.split(r'(?:^|\s+)([1-9][0-9]?\))\s+', main_body)
            if len(senses) > 1:
                s_idx = 1
                while s_idx < len(senses):
                    s_num = senses[s_idx]
                    s_txt = senses[s_idx+1] if s_idx+1 < len(senses) else ""
                    s_idx += 2
                    ru_clean = clean_russian(s_txt)
                    if ru_clean:
                        meanings.append({
                            'id': meaning_id,
                            'partOfSpeech': current_pos,
                            'translation': ru_clean,
                            'examples': []
                        })
                        meaning_id += 1
            else:
                ru_clean = clean_russian(main_body)
                if ru_clean:
                    meanings.append({
                        'id': 1,
                        'partOfSpeech': current_pos,
                        'translation': ru_clean,
                        'examples': []
                    })

        entry_obj = {
            'word': raw_hw,
            'phon_br': phon,
            'phon_n_am': phon,
            'meanings': meanings,
            'phrases': phrases
        }
        return entry_obj

print("Parser class defined. Testing on 5 entries...")
