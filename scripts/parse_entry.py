# -*- coding: utf-8 -*-
"""
Этап 2: Парсер словарных статей.

Модуль для парсинга текста одной словарной статьи Мюллера
в структурированный формат meanings.
"""

import re
from typing import List, Dict, Optional, Tuple

# ── Маппинг частей речи ──────────────────────────────────────────────────
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
    'pres.p.': 'participle',
    'pres. p.': 'participle',
    'p. p.': 'participle',
    'p.p.': 'participle',
    'part': 'particle',
    'art': 'article',
}

# ── Нормализация регистров ────────────────────────────────────────────────
REGISTER_MAP = {
    'разг.': 'разговорное',
    'юр.': 'юридическое',
    'воен.': 'военное',
    'тех.': 'техническое',
    'мор.': 'морское',
    'мат.': 'математическое',
    'мед.': 'медицинское',
    'хим.': 'химическое',
    'бот.': 'ботаническое',
    'амер.': 'американизм',
    'сл.': 'сленг',
    'уст.': 'устаревшее',
    'перен.': 'переносное',
    'эл.': 'электротехническое',
    'церк.': 'церковное',
    'металл.': 'металлургическое',
    'метал.': 'металлургическое',
    'полигр.': 'полиграфическое',
    'ком.': 'коммерческое',
    'эк.': 'экономическое',
    'горн.': 'горное дело',
    'геол.': 'геологическое',
    'информ.': 'информатика',
    'ист.': 'историческое',
    'спорт.': 'спортивное',
    'муз.': 'музыкальное',
    'арх.': 'архитектурное',
    'фин.': 'финансовое',
    'ж.-д.': 'железнодорожное',
    'авт.': 'автомобильное',
    'ав.': 'авиационное',
    'анат.': 'анатомическое',
    'астр.': 'астрономическое',
    'диал.': 'диалектное',
    'поэт.': 'поэтическое',
    'геральд.': 'геральдическое',
    'дип.': 'дипломатическое',
    'стр.': 'строительное',
    'фр.': 'французское',
    'лат.': 'латинское',
    'текст.': 'текстильное',
    'театр.': 'театральное',
    'физ.': 'физическое',
    'физиол.': 'физиологическое',
    'фото.': 'фотографическое',
    'фото': 'фотографическое',
    'кул.': 'кулинарное',
    'с.-х.': 'сельскохозяйственное',
    'карт.': 'карточное',
    'шахм.': 'шахматное',
    'биол.': 'биологическое',
    'жарг.': 'жаргонное',
    'пренебр.': 'пренебрежительное',
    'шутл.': 'шутливое',
    'ирон.': 'ироническое',
    'презр.': 'презрительное',
    'книжн.': 'книжное',
    'офиц.': 'официальное',
    'арт.': 'артиллерийское',
    'кино': 'кинематографическое',
    'радио': 'радиотехническое',
    'тлг.': 'телеграфное',
    'тел.': 'телефонное',
    'опт.': 'оптическое',
    'психол.': 'психологическое',
    'зоол.': 'зоологическое',
    'энтом.': 'энтомологическое',
    'мин.': 'минералогическое',
    'полит.': 'политическое',
    'антроп.': 'антропологическое',
    'археол.': 'археологическое',
    'архит.': 'архитектурное',
    'бакт.': 'бактериологическое',
    'вет.': 'ветеринарное',
    'геогр.': 'географическое',
    'грам.': 'грамматическое',
    'канц.': 'канцелярское',
    'лингв.': 'лингвистическое',
    'лог.': 'логическое',
    'парл.': 'парламентское',
    'проф.': 'профессиональное',
    'собир.': 'собирательное',
    'филос.': 'философское',
    'эвф.': 'эвфемизм',
    'австрал.': 'австралийское',
    'шотл.': 'шотландское',
    'ирл.': 'ирландское',
    'полит.-эк.': 'политэкономическое',
    'арифм.': 'арифметическое',
    'attr.': None,  # Not a register, handled separately
    'тж.': None,    # Not a register
    'pl': None,     # Not a register
    'обыкн.': None, # Not a register
    'особ.': None,  # Not a register
    'преим.': None,  # Not a register
}

# Build regex for register detection
_register_abbrevs = sorted(
    [k for k, v in REGISTER_MAP.items() if v is not None],
    key=len, reverse=True
)
_register_pattern = '|'.join(re.escape(k) for k in _register_abbrevs)
REGISTER_RE = re.compile(rf'^(?:({_register_pattern})\s*(?:,\s*({_register_pattern})\s*)?)')


def fix_ocr_artifacts(text: str) -> str:
    """Fix common OCR artifacts in Russian text."""
    if not text:
        return text
    
    # Fix hyphenated line breaks in Russian: "разли- чать" -> "различать"
    # Pattern: Russian letters + "- " or "­" + Russian letters
    text = re.sub(r'([а-яёА-ЯЁ])[\-\­]\s+([а-яёА-ЯЁ])', r'\1\2', text)
    
    # Fix "востребо вать" -> "востребовать" (space in middle of Russian word)
    # This is tricky — we look for Russian word broken by single space
    # Only fix if both parts look like parts of one word
    text = re.sub(r'([а-яёА-ЯЁ]{2,})\s([а-яёА-ЯЁ]{2,}(?:ся|ть|ние|ный|ная|ное|ные|тель|щик|чик|вать|сти|ный))', 
                  lambda m: m.group(1) + m.group(2) if len(m.group(1)) + len(m.group(2)) < 25 else m.group(0), 
                  text)
    
    # Fix common known broken words
    known_fixes = {
        'востребо вать': 'востребовать',
        'сосредо точиваться': 'сосредоточиваться',
        'иск рой': 'искрой',
        'обан гличанах': 'об англичанах',
        'con siderable': 'considerable',
    }
    for broken, fixed in known_fixes.items():
        text = text.replace(broken, fixed)
    
    # Remove stray control characters
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    
    # Normalize whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = text.strip()
    
    return text


def normalize_register(abbrev: str) -> Optional[str]:
    """Normalize a register abbreviation to full form."""
    abbrev = abbrev.strip().rstrip('.')
    if not abbrev.endswith('.'):
        abbrev += '.'
    return REGISTER_MAP.get(abbrev)


def extract_registers_from_text(text: str) -> Tuple[List[str], str]:
    """
    Extract register markers from the beginning of a text.
    Returns (list_of_registers, remaining_text).
    """
    registers = []
    remaining = text.strip()
    
    while True:
        match = REGISTER_RE.match(remaining)
        if not match:
            break
        
        for g in [match.group(1), match.group(2)]:
            if g:
                norm = normalize_register(g)
                if norm and norm not in registers:
                    registers.append(norm)
        
        remaining = remaining[match.end():].strip()
    
    return registers, remaining


def split_translation_examples(text: str, headword: str) -> Tuple[str, List[Dict]]:
    """
    Split a meaning text into translation and examples.
    
    Rules:
    - Translation = Russian text before first English example
    - Examples = English phrase (often with ~) + Russian translation
    
    Returns (translation, list_of_examples)
    """
    if not text:
        return '', []
    
    text = text.strip()
    
    # Simple heuristic: Look for patterns like "; english phrase русский перевод"
    # English indicators: ~, to + verb, articles, headword itself
    
    # Split by semicolons first, then analyze each segment
    # But be careful — semicolons also separate synonymous translations
    
    translation_parts = []
    examples = []
    
    # Try to find where examples begin
    # Pattern: after Russian text, we see English text containing ~, 
    # or starting with common English patterns
    
    # First, let's find all "; " boundaries
    segments = re.split(r';\s*', text)
    
    in_examples = False
    for seg in segments:
        seg = seg.strip()
        if not seg:
            continue
        
        if in_examples:
            # Already in example zone — parse as example
            ex = parse_example_segment(seg, headword)
            if ex:
                examples.append(ex)
            else:
                # Might be continuation of translation
                # Only if it looks purely Russian
                if is_russian_text(seg) and not examples:
                    translation_parts.append(seg)
                elif ex is None and examples:
                    # Could be a Russian-only continuation, attach to last example
                    pass
            continue
        
        # Check if this segment contains English text (likely an example)
        if contains_english_example(seg, headword):
            # This segment has an example — split it
            trans_part, ex = split_segment_at_example(seg, headword)
            if trans_part:
                translation_parts.append(trans_part)
            if ex:
                examples.append(ex)
                in_examples = True
        else:
            # Pure translation
            translation_parts.append(seg)
    
    translation = '; '.join(translation_parts)
    translation = fix_ocr_artifacts(translation)
    
    return translation, examples


def contains_english_example(text: str, headword: str) -> bool:
    """Check if text contains an English example."""
    # Look for ~ (tilde replacing headword)
    if '~' in text:
        return True
    
    # Look for headword itself in context
    hw_lower = headword.lower()
    if re.search(rf'\b{re.escape(hw_lower)}\b', text.lower()):
        # Check if it's actually English context (has articles, prepositions nearby)
        if re.search(r'\b(the|a|an|to|of|in|on|at|for|with|by|from|is|are|was|were|be|have|has|had|not|no|do|does|did)\b', text.lower()):
            return True
    
    return False


def split_segment_at_example(text: str, headword: str) -> Tuple[str, Optional[Dict]]:
    """Split a segment into translation part and example part."""
    # Find where the English example starts
    # Look for ~ or English words
    
    tilde_pos = text.find('~')
    if tilde_pos >= 0:
        # Find the start of the English phrase containing ~
        # Go backwards from ~ to find start
        start = tilde_pos
        while start > 0 and text[start-1] not in ';':
            start -= 1
            # Look for the boundary between Russian and English
            if start > 0 and re.match(r'[a-zA-Z]', text[start]) and start > 1:
                # Check if previous char is space after Russian
                if re.match(r'[а-яёА-ЯЁ)\]]', text[start-1]):
                    break
        
        trans = text[:start].strip().rstrip(';').strip()
        ex_text = text[start:].strip()
        ex = parse_example_segment(ex_text, headword)
        return trans, ex
    
    return text, None


def parse_example_segment(text: str, headword: str) -> Optional[Dict]:
    """
    Parse a text segment as an example.
    Format: "english phrase русский перевод"
    
    Returns {"en": ..., "ru": ...} or None
    """
    if not text:
        return None
    
    text = text.strip()
    
    # Try to split into English and Russian parts
    # English part typically contains ~ or Latin chars
    # Russian part is Cyrillic
    
    # Strategy: find the boundary where English switches to Russian
    # Look for a space where before is English and after is Russian
    
    # Pattern: English text (with ~ and Latin) followed by Russian translation
    match = re.match(
        r'((?:[a-zA-Z~\s\',\.\(\)\-\!\?;:]+|(?:или|и)\s)+)'  # English part
        r'\s+'
        r'((?:[а-яёА-ЯЁ].*?))\s*$',  # Russian part
        text
    )
    
    if match:
        en = match.group(1).strip()
        ru = match.group(2).strip()
        
        # Replace ~ with headword in en
        en_expanded = en.replace('~', headword)
        
        return {'en': en_expanded, 'ru': fix_ocr_artifacts(ru)}
    
    # Fallback: if mostly English, treat as example without Russian translation
    if '~' in text or sum(1 for c in text if c.isascii() and c.isalpha()) > len(text) * 0.3:
        return {'en': text.replace('~', headword), 'ru': ''}
    
    return None


def is_russian_text(text: str) -> bool:
    """Check if text is primarily Russian."""
    cyrillic = sum(1 for c in text if '\u0400' <= c <= '\u04ff')
    latin = sum(1 for c in text if c.isascii() and c.isalpha())
    return cyrillic > latin


def parse_entry(entry_text: str, headword: str) -> List[Dict]:
    """
    Parse a full dictionary entry text into a list of meaning objects.
    
    Args:
        entry_text: Full text of the dictionary entry
        headword: The headword being parsed
    
    Returns:
        List of meaning dicts with keys: id, partOfSpeech, translation, examples, register
    """
    if not entry_text:
        return []
    
    # Clean entry text
    text = fix_ocr_artifacts(entry_text)
    
    # Remove the headword + transcription header
    # Pattern: headword [optional Roman numeral] [transcription] 
    header_match = re.match(
        r'^[A-Za-z][\w\'-]*(?:\s[\w\'-]+)?'  # headword
        r'(?:\s+I{1,3}V?|IV|V|VI{0,3})?'     # optional Roman numeral
        r'\s*\[[^\]]*\]'                        # transcription
        r'\s*',
        text
    )
    if header_match:
        text = text[header_match.end():]
    
    # Check for irregular verb forms after transcription
    # Pattern: (past; past_participle) or (pl -es)
    forms_match = re.match(r'\((?:[^)]+)\)\s*', text)
    if forms_match:
        text = text[forms_match.end():]
    
    # Remove everything after ♦ (idioms section)
    diamond_pos = text.find('♦')
    if diamond_pos >= 0:
        text = text[:diamond_pos].strip()
    
    # Remove phrasal verbs section
    # Phrasal verbs start with "~ word" pattern at a meaningful boundary
    # They typically appear after all numbered meanings
    # Pattern: look for "~ about", "~ away", "~ down", etc. that start new sub-entries
    phrasal_match = re.search(r'\n\s*~\s+[a-z]+\s+(?:а\)|[а-яА-Я])', text)
    if phrasal_match:
        text = text[:phrasal_match.start()].strip()
    
    # Also try to detect phrasal verbs after the last numbered meaning
    # Pattern: after last N) meaning, look for "~ word а)"
    phrasal_match2 = re.search(
        r'(?<=\))\s+~\s+[a-z]+\s+(?:а\s*\)|[а-яА-Я])',
        text
    )
    if phrasal_match2:
        # Check if this is inside a meaning or a new phrasal verb section
        # If there's no number before it (not N) ... ~ word), it's a phrasal verb
        before = text[:phrasal_match2.start()]
        last_number = before.rfind(')')
        if last_number >= 0:
            # Check what's between last_number and the phrasal verb
            between = text[last_number+1:phrasal_match2.start()].strip()
            # If there's substantial Russian text, it's part of a meaning
            if len(between) > 50 and is_russian_text(between):
                pass  # Keep it
            else:
                text = text[:phrasal_match2.start()].strip()
    
    # Split into POS sections: "1. n ...", "2. v ...", "3. a ..."
    pos_sections = split_pos_sections(text)
    
    meanings = []
    meaning_id = 1
    
    for pos_code, section_text in pos_sections:
        pos = POS_MAP.get(pos_code, 'other')
        
        # Check for entry-level register (e.g., "мор. 1) ..." for the whole section)
        section_registers, section_text = extract_registers_from_text(section_text)
        
        # Split into numbered meanings: 1), 2), 3)
        numbered_meanings = split_numbered_meanings(section_text)
        
        for meaning_text in numbered_meanings:
            meaning_text = meaning_text.strip()
            if not meaning_text:
                continue
            
            # Handle "attr." as separate adjective meaning
            attr_match = re.match(r'^attr\.\s*(.*)', meaning_text)
            if attr_match:
                attr_content = attr_match.group(1).strip()
                if attr_content:
                    # Has actual content — create adjective meaning
                    registers, attr_content = extract_registers_from_text(attr_content)
                    translation, examples = split_translation_examples(attr_content, headword)
                    if translation:
                        m = {
                            'id': meaning_id,
                            'partOfSpeech': 'adjective',
                            'translation': translation,
                            'examples': examples,
                        }
                        all_registers = section_registers + registers
                        if all_registers:
                            m['register'] = all_registers
                        meanings.append(m)
                        meaning_id += 1
                continue
            
            # Handle "pl ..." (plural usage)
            pl_match = re.match(r'^(?:тж\.\s+)?pl\s+(.*)', meaning_text)
            if pl_match:
                meaning_text = pl_match.group(1).strip()
                if not meaning_text:
                    continue
            
            # Extract registers for this meaning
            registers, meaning_text = extract_registers_from_text(meaning_text)
            
            # Split translation from examples
            translation, examples = split_translation_examples(meaning_text, headword)
            
            if not translation and not examples:
                continue
            
            # If translation is empty but we have examples, skip
            # (these are usually just example phrases)
            if not translation:
                continue
            
            m = {
                'id': meaning_id,
                'partOfSpeech': pos,
                'translation': fix_ocr_artifacts(translation),
                'examples': examples,
            }
            
            all_registers = section_registers + registers
            if all_registers:
                m['register'] = all_registers
            
            meanings.append(m)
            meaning_id += 1
    
    return meanings


def split_pos_sections(text: str) -> List[Tuple[str, str]]:
    """
    Split entry text into POS sections.
    
    Returns list of (pos_code, section_text) tuples.
    
    Patterns:
    - "1. n ..." / "2. v ..." (numbered POS)
    - Just "n ..." / "v ..." (single POS)
    """
    # Pattern for numbered POS sections: "N. pos_code "
    pos_pattern = re.compile(
        r'(?:^|\n)\s*(\d+)\.\s*(n|v|vi|vt|a|adj|adv|prep|cj|conj|int|pron|num\.?\s*(?:card|ord)\.?|pres\.?\s*p\.?|p\.?\s*p\.?|part)\s+',
        re.IGNORECASE
    )
    
    matches = list(pos_pattern.finditer(text))
    
    if matches:
        sections = []
        for i, match in enumerate(matches):
            pos_code = match.group(2).strip().lower()
            # Normalize compound pos codes
            if 'num' in pos_code:
                pos_code = 'num. card.' if 'card' in pos_code else 'num. ord.' if 'ord' in pos_code else 'num.'
            if pos_code.startswith('pres'):
                pos_code = 'pres.p.'
            if pos_code == 'p. p' or pos_code == 'p.p':
                pos_code = 'p. p.'
            
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            section_text = text[start:end].strip()
            sections.append((pos_code, section_text))
        return sections
    
    # No numbered sections — try single POS
    single_pos = re.match(
        r'^(n|v|vi|vt|a|adj|adv|prep|cj|conj|int|pron|num\.?\s*(?:card|ord)\.?|pres\.?\s*p\.?|p\.?\s*p\.?|part)\s+',
        text.strip(), re.IGNORECASE
    )
    
    if single_pos:
        pos_code = single_pos.group(1).strip().lower()
        section_text = text[single_pos.end():].strip()
        return [(pos_code, section_text)]
    
    # Fallback: treat entire text as 'other'
    return [('n', text)]  # Default to noun if we can't determine


def split_numbered_meanings(text: str) -> List[str]:
    """
    Split POS section into individual numbered meanings.
    
    Pattern: "1) meaning text 2) meaning text 3) ..."
    """
    # Find all "N)" markers
    pattern = re.compile(r'(?:^|\s)(\d+)\)\s+', re.MULTILINE)
    matches = list(pattern.finditer(text))
    
    if not matches:
        # No numbered meanings — return the whole text as one meaning
        return [text.strip()]
    
    meanings = []
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        meaning_text = text[start:end].strip()
        meanings.append(meaning_text)
    
    return meanings


# ── Test ──────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    
    # Test with a sample entry
    test_entry = """care [kea] 1. n 1) забота, попечение; надзор; хранение; in smb.'s ~ на чьём-л. попечении; to take ~ of заботиться о; ухаживать за 2) заботы, тревога, беспокойство; free from ~ свободный от забот 3) осторожность, внимание; тщательность
2. v 1) заботиться; беспокоиться; волноваться; for all I ~ мне безразлично 2) хотеть, желать; иметь желание (for); would you ~ for a cup of tea? хотите чашку чая? 3) ухаживать (for — за); питать любовь, привязанность (for — к)"""
    
    import json
    result = parse_entry(test_entry, 'care')
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\nTotal meanings: {len(result)}")
