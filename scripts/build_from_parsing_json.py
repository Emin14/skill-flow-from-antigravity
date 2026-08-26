# -*- coding: utf-8 -*-
"""
Build fromParsing.json from Muller 2021 PDF.
Matches the structure of oxford_5000_verified.json.
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import unicodedata
from typing import Any

import pymupdf

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PDF_PATH = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021 - спарсенное.pdf"
OUTPUT_PATH = "fromParsing.json"

FIRST_PAGE_INDEX = 14  # PDF page 15 (0-indexed 14)
LAST_PAGE_INDEX = 924  # PDF page 924 (exclusive)

COLUMN_BOUNDS = ((35.0, 205.0), (205.0, 369.0), (369.0, 560.0))

POS_MAP = {
    "n": "noun",
    "v": "verb",
    "a": "adjective",
    "adj": "adjective",
    "adv": "adverb",
    "pron": "pronoun",
    "prep": "preposition",
    "cj": "conjunction",
    "conj": "conjunction",
    "int": "interjection",
    "interj": "interjection",
    "num": "numeral",
    "pref": "prefix",
    "suff": "suffix",
    "art": "article",
    "part": "particle",
    "vi": "verb",
    "vt": "verb",
    "p. p.": "participle",
    "pres. p.": "participle",
    "pres p.": "participle",
    "past p.": "participle",
    "р. р.": "participle",
    "predic": "predicative",
    "attr": "attribute",
    "pl": "noun",
}

REGISTER_MAP = {
    "разг.": "разговорное",
    "прост.": "просторечное",
    "книжн.": "книжное",
    "поэт.": "поэтическое",
    "посл.": "пословица",
    "уст.": "устаревшее",
    "архаич.": "архаичное",
    "редк.": "редкое",
    "офиц.": "официальное",
    "перен.": "переносное",
    "шутл.": "шутливое",
    "ирон.": "ироническое",
    "неодобр.": "неодобрительное",
    "пренебр.": "пренебрежительное",
    "эвф.": "эвфемизм",
    "амер.": "американизм",
    "англ.": "британское",
    "австрал.": "австралийское",
    "шотл.": "шотландское",
    "воен.": "военное",
    "юр.": "юриспруденция",
    "тех.": "техническое",
    "мед.": "медицинское",
    "биол.": "биологическое",
    "бот.": "ботаника",
    "зоол.": "зоология",
    "анат.": "анатомия",
    "физиол.": "физиология",
    "эл.": "электротехника",
    "церк.": "церковное",
    "рел.": "религиозное",
    "метал.": "металлургия",
    "полигр.": "полиграфия",
    "стр.": "строительное",
    "грам.": "грамматика",
    "лингв.": "лингвистика",
    "фон.": "фонетика",
    "мат.": "математика",
    "физ.": "физика",
    "хим.": "химия",
    "геол.": "геология",
    "геогр.": "география",
    "ист.": "историческое",
    "экон.": "экономика",
    "фин.": "финансы",
    "торг.": "торговое",
    "мор.": "морское",
    "ав.": "авиация",
    "ж.-д.": "железнодорожное",
    "радио": "радио",
    "кино": "кино",
    "театр.": "театр",
    "муз.": "музыка",
    "спорт.": "спортивное",
    "карт.": "карточное",
    "охот.": "охота",
    "кулин.": "кулинария",
    "морф.": "морфология",
    "прос.": "просодия",
    "фото": "фотография",
    "бухг.": "бухгалтерское",
    "ком.": "коммерческое",
    "комм.": "коммерческое",
    "горн.": "горное дело",
    "текст.": "текстильное",
    "сл.": "сленг",
    "sl.": "сленг",
    "диал.": "диалектное",
    "груб.": "грубое",
    "лат.": "латинское",
    "фр.": "французское",
    "ирл.": "ирландское",
    "шахм.": "шахматное",
    "архит.": "архитектура",
    "aрхит.": "архитектура",
    "неправ.": "ненормативное",
    "авто": "автомобильное дело",
    "ак.": "акустика",
    "антроп.": "антропология",
    "араб.": "арабское",
    "арт.": "артиллерия",
    "археол.": "археология",
    "астр.": "астрономия",
    "бакт.": "бактериология",
    "банк.": "банковское",
    "библ.": "библеизм",
    "бирж.": "биржевое",
    "вет.": "ветеринария",
    "возвыш.": "возвышенное",
    "вульг.": "вульгарное",
    "вчт.": "вычислительная техника",
    "геод.": "геодезия",
    "геом.": "геометрия",
    "гидр.": "гидротехника",
    "детск.": "детская речь",
    "дип.": "дипломатия",
    "информ.": "информатика",
    "иск.": "искусство",
    "исп.": "испанское",
    "ит.": "итальянское",
    "кит.": "китайское",
    "косм.": "космонавтика",
    "кул.": "кулинария",
    "ласк.": "ласкательное",
    "лес.": "лесное дело",
    "лит.": "литература",
    "лог.": "логика",
    "метео": "метеорология",
    "мех.": "механика",
    "мин.": "минералогия",
    "миф.": "мифология",
    "нем.": "немецкое",
    "неол.": "неологизм",
    "опт.": "оптика",
    "палеонт.": "палеонтология",
    "парл.": "парламентское",
    "полит.": "политическое",
    "психол.": "психология",
    "ритор.": "риторическое",
    "с.-х.": "сельское хозяйство",
    "c.-х.": "сельское хозяйство",
    "спец.": "специальный термин",
    "стат.": "статистика",
    "страх.": "страховое",
    "студ.": "студенческое",
    "тлв.": "телевидение",
    "тлг.": "телеграфия",
    "тлф.": "телефония",
    "топ.": "топография",
    "фарм.": "фармакология",
    "филос.": "философия",
    "хир.": "хирургия",
    "школ.": "школьное",
    "эк.": "экономика",
    "элн.": "электроника",
    "этн.": "этнография",
}

def get_column_index(x0: float) -> int:
    for idx, (c_min, c_max) in enumerate(COLUMN_BOUNDS):
        if c_min <= x0 < c_max:
            return idx
    return 0

def normalize_spaces(text: str) -> str:
    text = unicodedata.normalize("NFC", text)
    text = text.replace("\u00a0", " ").replace("\u200b", "").replace("\ufeff", "")
    text = re.sub(r"[ \t\r\f\v]+", " ", text)
    return text.strip()

def fix_stress_and_ocr_artifacts(text: str) -> str:
    """Normalize OCR capitalized stress letters e.g. манИльская -> манильская, лОжное -> ложное."""
    def lower_stressed(m: re.Match) -> str:
        word = m.group(0)
        if re.search(r"[а-яё][А-ЯЁ][а-яё]", word) or re.search(r"^[а-яё]+[А-ЯЁ]$", word):
            return word[0] + word[1:].lower()
        return word

    text = re.sub(r"[А-Яа-яЁё]+", lower_stressed, text)
    return text

def clean_hyphens(text: str) -> str:
    """Rejoin words split by hyphens at line breaks or in OCR."""
    text = text.replace("\xad", "-").replace("\u00ad", "-")
    # Rejoin words with hyphen at line break: e.g. "африкан-\nский" or "африкан- ский" -> "африканский"
    text = re.sub(r"(?<=[А-Яа-яA-Za-z])-\s*(?=[а-яa-z])", "", text)
    return text

def expand_tilde(text: str, base_word: str) -> str:
    """Expand ~ placeholder with the base headword."""
    clean_hw = re.sub(r"\s+(?:I|II|III|IV|V|VI|VII|VIII|IX|X|\d+)$", "", base_word).strip()
    clean_hw = clean_hw.split(",")[0].strip()
    if not clean_hw:
        return text

    stem = clean_hw[:-1] if clean_hw.endswith("e") else clean_hw
    y_stem = clean_hw[:-1] if clean_hw.endswith("y") and len(clean_hw) > 1 and clean_hw[-2] not in "aeiou" else clean_hw

    replacements = [
        ("~est", stem + "est"),
        ("~er", stem + "er"),
        ("~ies", y_stem + "ies"),
        ("~ied", y_stem + "ied"),
        ("~ing", stem + "ing"),
        ("~ed", stem + "ed"),
        ("~d", stem + "d"),
        ("~s", y_stem + "ies" if clean_hw.endswith("y") and len(clean_hw) > 1 and clean_hw[-2] not in "aeiou" else clean_hw + "s"),
        ("~'s", clean_hw + "'s"),
        ("~", clean_hw),
    ]
    for pattern, target in replacements:
        text = text.replace(pattern, target)
    return text

def extract_transcription(body_text: str) -> tuple[str, str]:
    """Extract phonetics in brackets [...] from the start of body text."""
    phon = ""
    rest = body_text.strip()
    match = re.search(r"^\s*\[([^\]]+)\]", rest)
    if match:
        phon_raw = match.group(1).strip()
        phon_clean = re.sub(r"<i>[^<]*</i>", "", phon_raw)
        phon_clean = re.sub(r"\([^)]*\)", "", phon_clean).strip()
        phon_clean = re.sub(r"\s+", " ", phon_clean)
        phon_ipa = phon_clean.replace("'", "ˈ").replace(",", "ˌ").strip(" /")
        if phon_ipa:
            phon = f"/{phon_ipa}/"
        rest = rest[match.end():].strip()
    return phon, rest

def extract_forms(body_text: str) -> tuple[list[dict[str, Any]], str]:
    """Extract inflection forms (pl ..., past ..., etc.) from body text."""
    forms = []
    rest = body_text.strip()
    
    match = re.search(r"^\s*\((\s*<i>\s*(?:pl|past|p\.\s*p\.|pres\.\s*p\.|pt\s*&\s*pp)\s*</i>[^)]*)\)", rest)
    if not match:
        match = re.search(r"^\s*\(\s*(?:pl|past|p\.\s*p\.|pres\.\s*p\.|pt\s*&\s*pp)\s+[^)]*\)", rest)
        
    if match:
        morph_plain = re.sub(r"</?i>", "", match.group(0)).strip("()")
        if "pl" in morph_plain:
            pl_match = re.search(r"pl\s+([^,;\]]+)", morph_plain)
            if pl_match:
                pl_word = pl_match.group(1).strip()
                if pl_word and not pl_word.startswith("от"):
                    forms.append({"word": pl_word, "types": ["plural"]})
        if "past" in morph_plain:
            past_match = re.search(r"past\s+([^,;\]]+)", morph_plain)
            if past_match:
                past_word = past_match.group(1).strip()
                forms.append({"word": past_word, "types": ["past"]})
        if "p. p." in morph_plain or "pp" in morph_plain:
            pp_match = re.search(r"(?:p\.\s*p\.|pp)\s+([^,;\]]+)", morph_plain)
            if pp_match:
                pp_word = pp_match.group(1).strip()
                forms.append({"word": pp_word, "types": ["past_participle"]})
                
        rest = rest[match.end():].strip()
        
    return forms, rest

def extract_registers(text: str) -> tuple[list[str], str]:
    """Extract register / subject field markers from text."""
    regs = []
    text_clean = text
    for abbrev, full in sorted(REGISTER_MAP.items(), key=lambda x: len(x[0]), reverse=True):
        pattern = rf"(?<!\w){re.escape(abbrev)}(?!\w)"
        if re.search(pattern, text_clean, flags=re.IGNORECASE):
            if full not in regs:
                regs.append(full)
            text_clean = re.sub(pattern, "", text_clean, flags=re.IGNORECASE)
    text_clean = re.sub(r"\s+", " ", text_clean).strip(" ,:;")
    return regs, text_clean

def clean_final_text(text: str) -> str:
    """Final cleanup of Russian translation or English example text."""
    text = re.sub(r"</?[a-zA-Z0-9]+>", "", text)
    text = clean_hyphens(text)
    text = fix_stress_and_ocr_artifacts(text)
    text = re.sub(r"♦", "", text)
    text = re.sub(r"¬", "", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?%)\]])", r"\1", text)
    text = re.sub(r"([([])\s+", r"\1", text)
    text = text.strip(" ;,.-")
    return text

def parse_entry_meanings_and_phrases(headword: str, raw_body: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Parse raw article body into structured meanings and phrases lists."""
    body = raw_body.strip()
    
    # 1. Separate idioms (♦) and phrasal sections
    phrases = []
    idiom_idx = body.find("♦")
    if idiom_idx != -1:
        idiom_text = body[idiom_idx + 1:].strip()
        body = body[:idiom_idx].strip()
        
        idiom_chunks = idiom_text.split(";")
        for ich in idiom_chunks:
            ich = expand_tilde(ich, headword)
            ich = clean_hyphens(ich)
            cyr_match = re.search(r"[А-Яа-яЁё]", ich)
            if cyr_match:
                c_idx = cyr_match.start()
                en_part = clean_final_text(ich[:c_idx])
                ru_part = clean_final_text(ich[c_idx:])
                if en_part and ru_part:
                    phrases.append({
                        "en": en_part,
                        "ru": ru_part
                    })

    # 2. Major sections by POS (e.g. "1. <i>v</i> ... 2. <i>n</i> ..." or "<i>n</i> ...")
    pos_matches = list(re.finditer(r"(?:^|\s)(?:([1-9])\.\s*)?<i>([a-z\.\s]+)</i>", body))
    
    sections = []
    if pos_matches:
        for idx, pm in enumerate(pos_matches):
            pos_tag = pm.group(2).strip().rstrip(".")
            pos_canonical = POS_MAP.get(pos_tag, POS_MAP.get(pos_tag + ".", "other"))
            start_pos = pm.end()
            end_pos = pos_matches[idx + 1].start() if idx + 1 < len(pos_matches) else len(body)
            sec_text = body[start_pos:end_pos].strip()
            sections.append((pos_canonical, sec_text))
    else:
        plain_pos_match = re.search(r"^\s*(?:([1-9])\.\s*)?(n|v|a|adj|adv|prep|cj|conj|pron|num|int|art|pref|suff)\b", body)
        if plain_pos_match:
            pos_tag = plain_pos_match.group(2).lower()
            pos_canonical = POS_MAP.get(pos_tag, "other")
            sections.append((pos_canonical, body[plain_pos_match.end():].strip()))
        else:
            sections.append(("other", body))

    meanings = []
    meaning_id = 1
    
    for pos_type, sec_text in sections:
        sec_text = sec_text.replace("¬", " ")
        
        # Split section into numbered senses "1) ", "2) ", "3) "
        sense_chunks = re.split(r"(?:^|\s)[0-9]{1,2}\)\s*", sec_text)
        if len(sense_chunks) <= 1:
            sense_chunks = [sec_text]
            
        for chunk in sense_chunks:
            chunk = chunk.strip()
            if not chunk:
                continue
                
            chunk = expand_tilde(chunk, headword)
            
            # Check for sub-enumerations "а) ", "б) ", "в) "
            if re.search(r"(?:^|\s)[а-яa-z]\)\s*", chunk):
                sub_chunks = re.split(r";?\s*(?:^|\s)[а-яa-z]\)\s*", chunk)
            else:
                sub_chunks = [chunk]
                
            for sub_chunk in sub_chunks:
                sub_chunk = sub_chunk.strip()
                if not sub_chunk:
                    continue
                    
                regs, sub_clean = extract_registers(sub_chunk)
                
                parts = sub_clean.split(";")
                def_parts = []
                examples = []
                
                for p in parts:
                    p = p.strip()
                    if not p:
                        continue
                    
                    p_plain = re.sub(r"</?[a-zA-Z0-9]+>", "", p).strip()
                    
                    cyr_match = re.search(r"[А-Яа-яЁё]", p_plain)
                    if cyr_match:
                        c_idx = cyr_match.start()
                        candidate_en = p_plain[:c_idx].strip(" ;,-([")
                        candidate_ru = p_plain[c_idx:].strip(" ;,-)]")
                        
                        has_latin_words = any(c.isalpha() for c in candidate_en) and bool(re.search(r"[A-Za-z]{2,}", candidate_en))
                        
                        if has_latin_words and len(candidate_en) > 1 and len(candidate_ru) > 1:
                            cl_en = clean_final_text(candidate_en)
                            cl_ru = clean_final_text(candidate_ru)
                            if cl_en and cl_ru:
                                examples.append({"en": cl_en, "ru": cl_ru})
                                continue
                                
                    cl_def = clean_final_text(p_plain)
                    if cl_def and any("\u0400" <= c <= "\u04FF" for c in cl_def):
                        def_parts.append(cl_def)
                        
                translation = "; ".join(def_parts)
                if not translation and examples:
                    translation = examples[0]["ru"]
                    examples = examples[1:]
                    
                translation = clean_final_text(translation)
                if translation and any("\u0400" <= c <= "\u04FF" for c in translation):
                    meaning_item: dict[str, Any] = {
                        "id": meaning_id,
                        "partOfSpeech": pos_type,
                        "translation": translation,
                        "examples": examples,
                    }
                    if regs:
                        meaning_item["register"] = regs
                    meanings.append(meaning_item)
                    meaning_id += 1

    return meanings, phrases

def process_pdf_to_json(pdf_path: str, output_path: str) -> list[dict[str, Any]]:
    print(f"Opening {pdf_path}...", flush=True)
    t0 = time.time()
    doc = pymupdf.open(pdf_path)
    print(f"Loaded PDF with {len(doc)} pages.", flush=True)
    
    raw_articles = []
    current_article = None
    
    for page_idx in range(FIRST_PAGE_INDEX, LAST_PAGE_INDEX):
        page = doc[page_idx]
        page_h = page.rect.height
        d = page.get_text("dict")
        
        lines_by_col = [[], [], []]
        for b in d["blocks"]:
            if "lines" not in b:
                continue
            for l in b["lines"]:
                y0, y1 = l["bbox"][1], l["bbox"][3]
                if y0 < 50 or y1 > page_h - 25:
                    continue
                if not l["spans"]:
                    continue
                col_idx = get_column_index(l["bbox"][0])
                lines_by_col[col_idx].append(l)
                
        for col_idx in range(3):
            col_lines = sorted(lines_by_col[col_idx], key=lambda l: l["bbox"][1])
            for l in col_lines:
                spans = l["spans"]
                first_s = spans[0]
                f_txt = first_s["text"].strip()
                f_bold = ("Bold" in first_s["font"] or first_s["flags"] & 16)
                f_sz = first_s["size"]
                
                # Exclude single letter alphabet headers like "A", "B", "C"
                if len(spans) == 1 and len(f_txt) == 1 and f_txt.isupper() and f_sz > 12.0:
                    continue
                if len(f_txt) == 1 and f_txt.isupper() and f_sz > 14.0:
                    continue

                is_sec_num = bool(re.match(r"^[1-9]\.$", f_txt)) or bool(re.match(r"^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.?$", f_txt))
                is_cyr = bool(re.search(r"[А-Яа-яЁё]", f_txt))
                
                is_hw = (
                    f_bold
                    and not is_sec_num
                    and not is_cyr
                    and f_sz >= 7.0
                    and bool(re.match(r"^[A-Za-z]", f_txt))
                )
                
                if is_hw:
                    hw_parts = []
                    body_start_span_idx = 0
                    for s_idx, s in enumerate(spans):
                        s_bold = ("Bold" in s["font"] or s["flags"] & 16)
                        s_txt = s["text"].strip()
                        if "[" in s["text"] or "Italic" in s["font"] or (not s_bold and s_txt) or re.match(r"^[1-9]\.", s_txt):
                            body_start_span_idx = s_idx
                            break
                        hw_parts.append(s["text"])
                        body_start_span_idx = s_idx + 1
                        
                    hw_str = re.sub(r"\s+", " ", "".join(hw_parts)).strip()
                    
                    body_spans = spans[body_start_span_idx:]
                    body_pieces = []
                    for s in body_spans:
                        txt = s["text"]
                        if "Italic" in s["font"] or (s["flags"] & 2):
                            body_pieces.append(f"<i>{txt}</i>")
                        else:
                            body_pieces.append(txt)
                    body_line = "".join(body_pieces).strip()
                    
                    if current_article:
                        raw_articles.append(current_article)
                    current_article = {
                        "headword": hw_str,
                        "page": page_idx + 1,
                        "body": body_line,
                    }
                else:
                    body_pieces = []
                    for s in spans:
                        txt = s["text"]
                        if "Italic" in s["font"] or (s["flags"] & 2):
                            body_pieces.append(f"<i>{txt}</i>")
                        else:
                            body_pieces.append(txt)
                    body_line = "".join(body_pieces)
                    if current_article:
                        # Rejoin hyphenated line endings
                        if current_article["body"].endswith("-") or current_article["body"].endswith("\xad"):
                            current_article["body"] = current_article["body"].rstrip("-\xad") + body_line.lstrip()
                        else:
                            current_article["body"] += ("\n" if current_article["body"] else "") + body_line
                        
        if (page_idx + 1) % 100 == 0:
            print(f"Parsed through page {page_idx + 1}/{LAST_PAGE_INDEX} ({len(raw_articles)} articles extracted)...", flush=True)

    if current_article:
        raw_articles.append(current_article)

    doc.close()
    print(f"Extracted {len(raw_articles)} total raw articles from PDF in {time.time() - t0:.2f}s.", flush=True)
    
    print("Converting articles to structured JSON...", flush=True)
    t1 = time.time()
    structured_entries = []
    
    for idx, art in enumerate(raw_articles):
        hw_raw = art["headword"]
        body_text = art["body"]
        
        # Clean headword
        word_clean = re.sub(r"</?b>", "", hw_raw).strip()
        word_clean = re.sub(r"\s+", " ", word_clean)
        
        # Extract phonetics
        phon_br, body_text = extract_transcription(body_text)
        
        # Extract forms
        forms, body_text = extract_forms(body_text)
        
        # Parse meanings and phrases
        meanings, phrases = parse_entry_meanings_and_phrases(word_clean, body_text)
        
        entry: dict[str, Any] = {
            "word": word_clean,
        }
        if phon_br:
            entry["phon_br"] = phon_br
            entry["phon_n_am"] = phon_br
        if forms:
            entry["forms"] = forms
            
        entry["meanings"] = meanings
        entry["phrases"] = phrases
        
        structured_entries.append(entry)
        
        if (idx + 1) % 10000 == 0:
            print(f"Processed {idx + 1}/{len(raw_articles)} structured entries...", flush=True)
            
    print(f"Structured {len(structured_entries)} entries in {time.time() - t1:.2f}s.", flush=True)
    
    print(f"Writing output to {output_path}...", flush=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(structured_entries, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully generated {output_path}! File size: {os.path.getsize(output_path):,} bytes.", flush=True)
    return structured_entries

if __name__ == "__main__":
    process_pdf_to_json(PDF_PATH, OUTPUT_PATH)
