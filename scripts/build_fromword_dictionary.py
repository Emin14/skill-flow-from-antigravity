# -*- coding: utf-8 -*-
"""
Full Muller Dictionary DOCX to JSON Parser
Generates fromword.json matching oxford_5000_verified.json schema.
"""

import sys
import os
import zipfile
import xml.sax
import time
import re
import json
import unicodedata

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DOCX_PATH = 'Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.docx'
OUTPUT_JSON = 'fromword.json'

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
    'num. card.': 'numeral',
    'num. ord.': 'numeral',
    'art': 'article',
    'pres. p.': 'participle',
    'pres.p.': 'participle',
    'p. p.': 'participle',
    'p.p.': 'participle',
    'pref': 'prefix',
    'suff': 'suffix',
    'predic': 'predicative',
    'predic.': 'predicative',
    'phrase': 'phrase',
    'idiom': 'idiom'
}

LEGIT_HYPHEN_PATTERNS = [
    r'-(?:то|либо|нибудь|таки|ка|де|с|л\.)',
    r'(?:кто|что|где|когда|куда|откуда|почему|зачем|как|чей|какой|каком|какому|каким|каком|какая|какую|какой|какие|каких|каким|какими)-(?:то|либо|нибудь|л\.)',
    r'(?:кое|кой|по|во|из)-(?:[а-яА-ЯёЁ]+)',
    r'(?:пресс|секс|веб|онлайн|офлайн|бизнес|топ|мини|макси|микро|макро|экс|вице|генерал|премьер|контр|штаб|лейтенант|майор|полковник|капитан|норд|вест|ост|зюйд|киловатт|человеко|жар|дизель|интернет|рок|поп|джаз)-(?:[а-яА-ЯёЁ]+)',
    r'(?:[а-яА-ЯёЁ]+)-(?:шоу|клуб|тест|контроль|ресурс|центр|холл|бар|кафе|парк|сервис|авто|тур|сити|банк|арт|матч|тайм|бокс|ринг|корт|трек|драйв|класс|лидер|мастер|спринт|чат|бот|сайт|блог|влог|стрим|пост|код|файл|сервер|драйвер|хост|порт|слот)',
    r'светло-[а-яА-ЯёЁ]+',
    r'тёмно-[а-яА-ЯёЁ]+',
    r'темно-[а-яА-ЯёЁ]+',
    r'ярко-[а-яА-ЯёЁ]+',
    r'бледно-[а-яА-ЯёЁ]+',
    r'кисло-[а-яА-ЯёЁ]+',
    r'горько-[а-яА-ЯёЁ]+',
    r'сладко-[а-яА-ЯёЁ]+',
    r'северо-[а-яА-ЯёЁ]+',
    r'юго-[а-яА-ЯёЁ]+',
    r'восточно-[а-яА-ЯёЁ]+',
    r'западно-[а-яА-ЯёЁ]+',
    r'научно-[а-яА-ЯёЁ]+',
    r'торгово-[а-яА-ЯёЁ]+',
    r'социально-[а-яА-ЯёЁ]+',
    r'общественно-[а-яА-ЯёЁ]+',
    r'военно-[а-яА-ЯёЁ]+',
    r'материально-[а-яА-ЯёЁ]+',
    r'технико-[а-яА-ЯёЁ]+',
    r'финансово-[а-яА-ЯёЁ]+',
    r'экономико-[а-яА-ЯёЁ]+'
]

def clean_phonetic_ipa(p):
    if not p:
        return ""
    p = p.strip()
    p = re.sub(r'^[\[\/\(\s]+|[\]\/\)\s]+$', '', p).strip()
    
    p = p.replace('´', 'ˈ').replace('`', 'ˈ').replace("'", 'ˈ')
    p = p.replace('˛', 'ˌ').replace(',', 'ˌ')
    p = p.replace('∫', 'ʃ')
    p = p.replace('t∫', 'tʃ')
    p = p.replace('dy', 'dʒ').replace('dз', 'dʒ')
    p = p.replace('c:', 'ɔː')
    p = p.replace('3:', 'ɜː')
    p = p.replace('a:', 'ɑː')
    p = p.replace('i:', 'iː')
    p = p.replace('u:', 'uː')
    p = p.replace('w', 'ʊ')
    p = p.replace(':', 'ː')
    p = re.sub(r'\s+', ' ', p).strip()
    return f"/{p}/" if p else ""

def clean_russian_text(t):
    if not t:
        return ""
    
    # 1. Remove stress accents
    t = re.sub(r"([а-яёА-ЯЁ])['´`’‘]\s*", r"\1", t)
    t = re.sub(r"\s*['´`’‘]([а-яёА-ЯЁ])", r"\1", t)
    t = re.sub(r"['´`]", "", t)
    
    # 2. Fix broken soft and hard signs
    t = re.sub(r"([а-яёА-ЯЁ])\s+ь\b", r"\1ь", t)
    t = re.sub(r"([а-яёА-ЯЁ])\s+ъ\b", r"\1ъ", t)
    t = re.sub(r"([а-яёА-ЯЁ])\s+ти\b", r"\1ти", t)
    t = re.sub(r"([а-яёА-ЯЁ])\s+тся\b", r"\1тся", t)
    t = re.sub(r"([а-яёА-ЯЁ])\s+ться\b", r"\1ться", t)
    
    # 3. Fix line-broken hyphens in Russian words
    def fix_hyphen(match):
        full = match.group(0)
        for pat in LEGIT_HYPHEN_PATTERNS:
            if re.search(pat, full, re.IGNORECASE):
                return full
        return match.group(1) + match.group(2)

    t = re.sub(r'([а-яёА-ЯЁ]{2,})\s*-\s*([а-яёА-ЯЁ]{2,})', fix_hyphen, t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*тью\b', r'\1тью', t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*ся\b', r'\1ся', t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*ние\b', r'\1ние', t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*ность\b', r'\1ность', t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*ный\b', r'\1ный', t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*ная\b', r'\1ная', t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*ное\b', r'\1ное', t)
    t = re.sub(r'([а-яёА-ЯЁ]+)\s*-\s*ные\b', r'\1ные', t)
    
    # 4. Clean symbols and artifacts
    t = re.sub(r'[\uf000-\uf8ff¬◆]', '', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    
    # 5. Fix common abbreviations
    t = re.sub(r'\bв\s+т\s+ч\b', 'в т.ч.', t)
    t = re.sub(r'\bи\s+т\s+п\b', 'и т.п.', t)
    t = re.sub(r'\bи\s+т\s+д\b', 'и т.д.', t)
    t = re.sub(r'\bи\s+др\b', 'и др.', t)
    t = re.sub(r'\bи\s+пр\b', 'и пр.', t)
    t = re.sub(r'\bт\s+к\b', 'т.к.', t)
    t = re.sub(r'\bт\s+е\b', 'т.е.', t)
    
    # 6. Fix punctuation and parentheses
    t = re.sub(r'\(\s*\)', '', t)
    t = re.sub(r'\(\s*\(', '(', t)
    t = re.sub(r'\)\s*\)', ')', t)
    t = re.sub(r'\s+([,;:?.!)])', r'\1', t)
    t = re.sub(r'([(])\s+', r'\1', t)
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'^[,;:\s\-]+', '', t)
    t = re.sub(r'[,;:\s\-]+$', '', t)
    
    return unicodedata.normalize('NFC', t).strip()

def clean_english_text(t, headword=""):
    if not t:
        return ""
    if headword:
        base_hw = re.sub(r'(\s+[IVXLCDM]+|\s+\d+)$', '', headword).strip()
        t = t.replace('~', base_hw)
    
    t = re.sub(r'[\uf000-\uf8ff¬◆]', '', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\xad\ufeff]', '', t)
    t = re.sub(r'([a-zA-Z])-\s*([a-zA-Z])', r'\1\2', t)
    t = re.sub(r'\s+([,;:?.!\'\"])', r'\1', t)
    t = re.sub(r'([\'\"])\s+', r'\1', t)
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'^[,;:\s\-]+', '', t)
    t = re.sub(r'[,;:\s\-]+$', '', t)
    return unicodedata.normalize('NFC', t).strip()

class DocxHandler(xml.sax.ContentHandler):
    def __init__(self):
        super().__init__()
        self.paragraphs = []
        self.current_runs = []
        self.current_text = []
        self.is_bold = False
        self.is_italic = False
        self.in_r = False
        self.in_t = False
        self.in_p = False

    def startElement(self, name, attrs):
        if name == 'w:p':
            self.in_p = True
            self.current_runs = []
        elif name == 'w:r':
            self.in_r = True
            self.is_bold = False
            self.is_italic = False
            self.current_text = []
        elif name == 'w:b':
            val = attrs.get('w:val', 'true')
            if val not in ('0', 'false', 'none'):
                self.is_bold = True
        elif name == 'w:i':
            val = attrs.get('w:val', 'true')
            if val not in ('0', 'false', 'none'):
                self.is_italic = True
        elif name == 'w:t':
            self.in_t = True

    def characters(self, content):
        if self.in_t:
            self.current_text.append(content)

    def endElement(self, name):
        if name == 'w:t':
            self.in_t = False
        elif name == 'w:r':
            self.in_r = False
            txt = ''.join(self.current_text)
            if txt:
                if self.current_runs and self.current_runs[-1][1] == self.is_bold and self.current_runs[-1][2] == self.is_italic:
                    prev_txt, b, i = self.current_runs[-1]
                    self.current_runs[-1] = (prev_txt + txt, b, i)
                else:
                    self.current_runs.append((txt, self.is_bold, self.is_italic))
        elif name == 'w:p':
            self.in_p = False
            if self.current_runs:
                self.paragraphs.append(self.current_runs)

def is_headword_paragraph(p):
    if not p:
        return False
    first_txt, first_b, first_i = p[0]
    if not first_b:
        return False
    first_strip = first_txt.strip()
    if not first_strip:
        return False
    
    is_latin = (first_strip[0].isalpha() and ord(first_strip[0]) < 128) or (first_strip.startswith('-') and len(first_strip) > 1 and first_strip[1].isalpha())
    if not is_latin:
        return False
        
    if len(first_strip) == 1 and first_strip.isupper():
        full_p = ''.join(r[0] for r in p).strip()
        if len(full_p) <= 2:
            return False
            
    full_p = ''.join(r[0] for r in p).strip()
    if '[' in full_p:
        return True
    if re.search(r'\b(pl|past|p\. p\.|pres\. p\.|от)\b', full_p):
        return True
    if re.search(r'\b(n|v|vi|vt|adj|a|adv|prep|cj|int|pron|num|art|pref|suff|predic)\b', full_p):
        return True
    if '=' in full_p:
        return True
    return False

def parse_single_entry(entry_paras):
    # Flatten runs with paragraph line-break hyphen handling
    all_runs = []
    for p_idx, p in enumerate(entry_paras):
        for txt, b, i in p:
            if txt:
                if all_runs and all_runs[-1][1] == b and all_runs[-1][2] == i:
                    all_runs[-1] = (all_runs[-1][0] + txt, b, i)
                else:
                    all_runs.append((txt, b, i))
        
        # Handle joining between paragraphs
        if p_idx < len(entry_paras) - 1:
            if all_runs:
                last_txt, last_b, last_i = all_runs[-1]
                if last_txt.endswith('-'):
                    # Strip trailing hyphen to directly connect with next paragraph's first word
                    all_runs[-1] = (last_txt[:-1], last_b, last_i)
                elif not last_txt.endswith(' '):
                    all_runs.append((' ', False, False))

    full_raw_text = ''.join(r[0] for r in all_runs).strip()
    
    # Extract Headword
    hw_runs = []
    body_runs = []
    found_phon_or_body = False
    
    for r_txt, r_b, r_i in all_runs:
        if not found_phon_or_body:
            if '[' in r_txt:
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
        m = re.match(r'^([a-zA-Z\-\'\s]{1,45}(?:\s+[IVXLCDM]+|\s+\d+)?)(.*)', full_raw_text)
        if m:
            raw_hw = m.group(1).strip()
        else:
            raw_hw = full_raw_text.split()[0]

    raw_hw = re.sub(r'[,;:\s]+$', '', raw_hw).strip()

    # Extract Phonetic Transcription
    phon = ""
    phon_match = re.search(r'\[([^\]]+)\]', full_raw_text)
    if phon_match:
        phon = clean_phonetic_ipa(phon_match.group(1))

    body_text = ''.join(r[0] for r in body_runs)
    if phon_match:
        body_text = body_text.replace(phon_match.group(0), '', 1)

    meanings = []
    phrases = []
    meaning_id = 1

    # Extract Phrases / Phrasal Verbs / Idioms (marked by ¬, ◆, , \uf0a8)
    main_body = body_text
    phr_split = re.split(r'([¬◆\uf0a8])', body_text)
    if len(phr_split) > 1:
        main_body = phr_split[0]
        for i in range(1, len(phr_split), 2):
            content = phr_split[i+1] if i+1 < len(phr_split) else ""
            sub_phrs = re.split(r'(?:^|;\s*|\s{2,})(?=(?:~|[a-zA-Z]{2,}))', content)
            for sp in sub_phrs:
                sp_clean = sp.strip()
                if not sp_clean or len(sp_clean) < 3:
                    continue
                m_ru = re.search(r'[а-яёА-ЯЁ]', sp_clean)
                if m_ru:
                    en_part = clean_english_text(sp_clean[:m_ru.start()], raw_hw)
                    ru_part = clean_russian_text(sp_clean[m_ru.start():])
                    if en_part and ru_part and re.search(r'[a-zA-Z]', en_part) and re.search(r'[а-яёА-ЯЁ]', ru_part):
                        phrases.append({'en': en_part, 'ru': ru_part})
                else:
                    en_part = clean_english_text(sp_clean, raw_hw)
                    if en_part and re.search(r'[a-zA-Z]', en_part):
                        phrases.append({'en': en_part, 'ru': ''})

    # Parse POS sections and Senses
    pos_sections = re.split(
        r'(?:^|\s+)(?:([1-9]\.)\s+)?\b(n|v|vi|vt|adj|a|adv|prep|cj|conj|int|pron|num|art|pres\. p\.|p\. p\.|pref|suff|predic)\b',
        main_body
    )
    
    current_pos = 'noun'
    
    if len(pos_sections) > 1:
        i = 1
        while i < len(pos_sections):
            num = pos_sections[i]
            pos_code = pos_sections[i+1] if i+1 < len(pos_sections) else None
            sec_text = pos_sections[i+2] if i+2 < len(pos_sections) else ""
            i += 3
            
            if pos_code:
                current_pos = POS_MAP.get(pos_code.lower(), 'noun')
            
            senses = re.split(r'(?:^|\s+)([1-9][0-9]?\))\s+', sec_text)
            if len(senses) > 1:
                s_idx = 1
                while s_idx < len(senses):
                    s_num = senses[s_idx]
                    s_txt = senses[s_idx+1] if s_idx+1 < len(senses) else ""
                    s_idx += 2
                    
                    examples = []
                    chunks = [c.strip() for c in re.split(r';\s*', s_txt) if c.strip()]
                    trans_parts = []
                    
                    for chunk in chunks:
                        m_en = re.match(r'^([a-zA-Z\s\~\-\'\(\)\,\/]{3,}?)\s+([а-яёА-ЯЁ].*)', chunk)
                        if m_en:
                            lead_en = m_en.group(1).strip()
                            if not lead_en.lower().startswith(('см.', 'тж.', 'напр.', 'pl', 'past', 'pres', 'attr', 'predic')):
                                en_ex = clean_english_text(lead_en, raw_hw)
                                ru_ex = clean_russian_text(m_en.group(2))
                                if en_ex and ru_ex and re.search(r'[a-zA-Z]', en_ex) and re.search(r'[а-яёА-ЯЁ]', ru_ex):
                                    examples.append({'en': en_ex, 'ru': ru_ex})
                                else:
                                    trans_parts.append(chunk)
                            else:
                                trans_parts.append(chunk)
                        else:
                            trans_parts.append(chunk)
                    
                    translation = clean_russian_text("; ".join(trans_parts)) if trans_parts else clean_russian_text(s_txt)
                    if translation:
                        meanings.append({
                            'id': meaning_id,
                            'partOfSpeech': current_pos,
                            'translation': translation,
                            'examples': examples
                        })
                        meaning_id += 1
            else:
                translation = clean_russian_text(sec_text)
                if translation:
                    meanings.append({
                        'id': meaning_id,
                        'partOfSpeech': current_pos,
                        'translation': translation,
                        'examples': []
                    })
                    meaning_id += 1
    else:
        senses = re.split(r'(?:^|\s+)([1-9][0-9]?\))\s+', main_body)
        if len(senses) > 1:
            s_idx = 1
            while s_idx < len(senses):
                s_num = senses[s_idx]
                s_txt = senses[s_idx+1] if s_idx+1 < len(senses) else ""
                s_idx += 2
                translation = clean_russian_text(s_txt)
                if translation:
                    meanings.append({
                        'id': meaning_id,
                        'partOfSpeech': current_pos,
                        'translation': translation,
                        'examples': []
                    })
                    meaning_id += 1
        else:
            translation = clean_russian_text(main_body)
            if translation:
                meanings.append({
                    'id': 1,
                    'partOfSpeech': current_pos,
                    'translation': translation,
                    'examples': []
                })

    if not meanings:
        fallback_tr = clean_russian_text(main_body)
        if not fallback_tr:
            fallback_tr = clean_russian_text(full_raw_text)
        meanings.append({
            'id': 1,
            'partOfSpeech': current_pos,
            'translation': fallback_tr,
            'examples': []
        })

    # Clean phrases
    seen_phrs = set()
    unique_phrases = []
    for ph in phrases:
        k = (ph.get('en', '').lower(), ph.get('ru', '').lower())
        if k not in seen_phrs and ph.get('en'):
            seen_phrs.add(k)
            unique_phrases.append(ph)

    entry_data = {
        'word': raw_hw,
        'phon_br': phon,
        'phon_n_am': phon,
        'meanings': meanings,
        'phrases': unique_phrases
    }
    return entry_data

def main():
    print(f"=== Reading DOCX from {DOCX_PATH} ===")
    t0 = time.time()
    handler = DocxHandler()
    with zipfile.ZipFile(DOCX_PATH, 'r') as z:
        with z.open('word/document.xml') as f:
            xml.sax.parse(f, handler)
    print(f"Read {len(handler.paragraphs)} paragraphs in {time.time()-t0:.2f}s")

    entries = []
    curr_entry_paras = []

    for idx, p in enumerate(handler.paragraphs):
        if idx < 525 or idx > 107350:
            continue
        
        if is_headword_paragraph(p):
            if curr_entry_paras:
                entries.append(curr_entry_paras)
            curr_entry_paras = [p]
        else:
            if curr_entry_paras:
                curr_entry_paras.append(p)

    if curr_entry_paras:
        entries.append(curr_entry_paras)

    print(f"Total entries segmented: {len(entries)}")

    print("Parsing all entries into structured JSON...")
    t1 = time.time()
    parsed_dictionary = []
    
    for e_idx, e_paras in enumerate(entries):
        entry_obj = parse_single_entry(e_paras)
        if entry_obj and entry_obj.get('word'):
            parsed_dictionary.append(entry_obj)
        if (e_idx + 1) % 5000 == 0:
            print(f"  Processed {e_idx+1}/{len(entries)} entries...")

    print(f"Parsed {len(parsed_dictionary)} entries in {time.time()-t1:.2f}s")

    print(f"Saving to {OUTPUT_JSON}...")
    t2 = time.time()
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(parsed_dictionary, f, ensure_ascii=False, indent=2)
    
    file_size_mb = os.path.getsize(OUTPUT_JSON) / (1024 * 1024)
    print(f"Successfully generated {OUTPUT_JSON} ({file_size_mb:.2f} MB) in {time.time()-t2:.2f}s")

if __name__ == '__main__':
    main()
