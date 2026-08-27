# -*- coding: utf-8 -*-
"""
High-Precision Batch Reconstructor for Oxford 5000 multi-POS words.
"""
import re, json, sys, os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

from robust_dictionary_rebuilder import REGISTER_MAP, POS_MAP, extract_registers

# Known compound Russian words that MUST have hyphens
HYPHEN_REPLACEMENTS = {
    r'\bинженермеханик\b': 'инженер-механик',
    r'\bпремьерминистр\b': 'премьер-министр',
    r'\bпорусски\b': 'по-русски',
    r'\bпоанглийски\b': 'по-английски',
    r'\bктото\b': 'кто-то',
    r'\bчтото\b': 'что-то',
    r'\bгдето\b': 'где-то',
    r'\bкогдато\b': 'когда-то',
    r'\bкакойто\b': 'какой-то',
    r'\bчейто\b': 'чей-то',
    r'\bкакнибудь\b': 'как-нибудь',
    r'\bчтонибудь\b': 'что-нибудь',
    r'\bктонибудь\b': 'кто-нибудь',
    r'\bгденибудь\b': 'где-нибудь',
    r'\bизза\b': 'из-за',
    r'\bизпод\b': 'из-под'
}

def clean_hyphens_and_ocr(text):
    for pat, rep in HYPHEN_REPLACEMENTS.items():
        text = re.sub(pat, rep, text, flags=re.IGNORECASE)
    # Remove soft hyphens or broken OCR breaks
    text = text.replace('\xad', '').replace('\u00ad', '')
    return text

def parse_full_raw_entry(word, raw_text, base_item):
    """
    Parse a complete raw entry into an OxfordWordEntry schema.
    """
    # Clean raw text
    text = clean_hyphens_and_ocr(raw_text)
    
    # Remove header line if present (e.g. "go [gou] 1. v...")
    # Find all POS sections: e.g. "1. n", "2. v", "3. a", "1. v", "2. n", etc.
    # Match pattern: (?:^|\n)\s*([1-4])\.\s*([a-z]+)\b
    pos_matches = list(re.finditer(r'(?:^|\n)\s*([1-4])\.\s*([a-zA-Z]+)\b', text))
    
    meanings = []
    phrases = []
    
    meaning_id = 1
    phrase_id = 1
    
    if not pos_matches:
        # Fallback: maybe just simple "n 1) ...", "v 1) ..."
        pos_matches = list(re.finditer(r'(?:^|\n)\s*(?:[1-4]\.\s*)?([a-zA-Z]+)\s+1\)', text))
    
    if pos_matches:
        for idx, match in enumerate(pos_matches):
            sec_pos_raw = match.group(2) if len(match.groups()) == 2 else match.group(1)
            sec_pos = POS_MAP.get(sec_pos_raw.lower(), base_item.get('meanings', [{}])[0].get('partOfSpeech', 'noun'))
            
            start_pos = match.end()
            end_pos = pos_matches[idx+1].start() if idx + 1 < len(pos_matches) else len(text)
            
            section_text = text[start_pos:end_pos]
            
            # Check for idioms (♦) or phrasals (¬) in this section
            main_part = section_text
            phr_part = ""
            
            split_phr = re.split(r'[♦¬]', section_text, maxsplit=1)
            if len(split_phr) > 1:
                main_part = split_phr[0]
                phr_part = section_text[len(split_phr[0]):]
            
            # Parse numbered meanings: 1), 2), 3)
            num_matches = list(re.finditer(r'(?:^|\s)(\d+)\)\s*', main_part))
            if num_matches:
                for n_idx, n_match in enumerate(num_matches):
                    m_start = n_match.end()
                    m_end = num_matches[n_idx+1].start() if n_idx + 1 < len(num_matches) else len(main_part)
                    m_chunk = main_part[m_start:m_end].strip()
                    
                    # Clean chunk
                    m_chunk = re.sub(r'\s+', ' ', m_chunk)
                    
                    # Split translation and examples
                    # Examples often follow semicolon or colon, e.g. "пальто сидит хорошо; the coat fits well"
                    # Or "to act promptly действовать незамедлительно"
                    ex_list = []
                    
                    # Check attr.
                    if m_chunk.startswith('attr.') or m_chunk.startswith('attr '):
                        m_chunk = 'в роли определения: ' + m_chunk[5:].strip(' :;')
                    
                    # Standardize pl
                    if re.search(r'\bpl\b', m_chunk):
                        m_chunk = re.sub(r'\bобыкн\.\s*pl\b', 'обыкн. при англ. мн. ч.:', m_chunk)
                        m_chunk = re.sub(r'\bтж\.\s*pl\b', 'при англ. мн. ч.:', m_chunk)
                        m_chunk = re.sub(r'\bpl:\b', 'при англ. мн. ч.:', m_chunk)
                        m_chunk = re.sub(r'\(pl\s+([^)]+)\)', r'при англ. мн. ч. \1:', m_chunk)
                        m_chunk = re.sub(r'\bpl\b', 'при англ. мн. ч.:', m_chunk)
                    
                    trans, regs = extract_registers(m_chunk)
                    
                    meanings.append({
                        "id": meaning_id,
                        "partOfSpeech": sec_pos,
                        "translation": trans,
                        "examples": ex_list,
                        "register": regs
                    })
                    meaning_id += 1
            else:
                # No numbers, whole section is one meaning
                clean_sec = re.sub(r'\s+', ' ', main_part).strip(' ,;')
                if clean_sec:
                    if clean_sec.startswith('attr.') or clean_sec.startswith('attr '):
                        clean_sec = 'в роли определения: ' + clean_sec[5:].strip(' :;')
                    if re.search(r'\bpl\b', clean_sec):
                        clean_sec = re.sub(r'\bобыкн\.\s*pl\b', 'обыкн. при англ. мн. ч.:', clean_sec)
                        clean_sec = re.sub(r'\bтж\.\s*pl\b', 'при англ. мн. ч.:', clean_sec)
                        clean_sec = re.sub(r'\bpl:\b', 'при англ. мн. ч.:', clean_sec)
                        clean_sec = re.sub(r'\(pl\s+([^)]+)\)', r'при англ. мн. ч. \1:', clean_sec)
                        clean_sec = re.sub(r'\bpl\b', 'при англ. мн. ч.:', clean_sec)
                    
                    trans, regs = extract_registers(clean_sec)
                    meanings.append({
                        "id": meaning_id,
                        "partOfSpeech": sec_pos,
                        "translation": trans,
                        "examples": [],
                        "register": regs
                    })
                    meaning_id += 1
            
            # Parse phrases in phr_part
            if phr_part:
                # Split by ♦ or ¬ or ~
                phr_items = re.split(r'[♦¬;]\s*', phr_part)
                for pi in phr_items:
                    pi = pi.strip()
                    if not pi or len(pi) < 3:
                        continue
                    pi = re.sub(r'\s+', ' ', pi)
                    if '~' in pi:
                        pi = pi.replace('~', word)
                    # Try to split en phrase and ru translation
                    # En phrase is typically english letters at start
                    en_match = re.match(r'^([a-zA-Z\s\',./\(\)-]+)([\u0400-\u04FF].*)$', pi)
                    if en_match:
                        en_p = en_match.group(1).strip()
                        ru_t = en_match.group(2).strip()
                        ru_t, p_regs = extract_registers(ru_t)
                        phrases.append({
                            "id": phrase_id,
                            "phrase": en_p,
                            "partOfSpeech": sec_pos,
                            "translation": ru_t,
                            "examples": [],
                            "register": p_regs
                        })
                        phrase_id += 1
    
    if not meanings:
        return None
        
    return {
        "word": base_item["word"],
        "frequency_rank": base_item.get("frequency_rank", 5000),
        "cefr": base_item.get("cefr", "b1"),
        "phon_br": base_item.get("phon_br", ""),
        "phon_n_am": base_item.get("phon_n_am", ""),
        "lists": base_item.get("lists", { "oxford3000": True, "oxford5000": True }),
        "meanings": meanings,
        "phrases": phrases if phrases else base_item.get("phrases", [])
    }

print("Batch reconstructor ready.")
