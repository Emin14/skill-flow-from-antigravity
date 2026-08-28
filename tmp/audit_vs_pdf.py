"""
Полный аудит oxford_5000_2026-08-27.json по PDF Мюллера.
Извлекает статьи из PDF, сравнивает с JSON, находит расхождения.
"""
import pymupdf  # PyMuPDF
import json
import re
import io
import sys
from collections import defaultdict

PDF_PATH = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf"
JSON_PATH = "oxford_5000_2026-08-27.json"

PAGE_START = 14   # 0-indexed, page 15 of PDF
PAGE_END   = 959  # 0-indexed, last page

# Special chars in PDF from NewtonC font
ACCENT_CHAR = '\x02'       # ударение (cid:2) - удалять
SOFT_HYPHEN = '\x0b'       # мягкий перенос строки (cid:4) - склеивать
KNOWN_GARBAGE = re.compile(r'[\x01-\x1f\x7f]')  # все управляющие символы


def clean_pdf_text(text: str) -> str:
    """Очищает текст от артефактов PDF/OCR."""
    # Убираем ударения
    text = text.replace(ACCENT_CHAR, '')
    # Склеиваем мягкие переносы
    text = text.replace(SOFT_HYPHEN, '')
    # Убираем все прочие управляющие символы
    text = KNOWN_GARBAGE.sub('', text)
    # Нормализуем пробелы
    text = re.sub(r'  +', ' ', text)
    return text.strip()


def extract_full_text(doc, page_start, page_end):
    """Извлекает весь текст словаря как единую строку."""
    parts = []
    for page_num in range(page_start, min(page_end + 1, len(doc))):
        page = doc[page_num]
        text = page.get_text("text")
        parts.append(text)
    return '\n'.join(parts)


def find_word_in_pdf(full_text: str, word: str) -> str:
    """Находит словарную статью для слова в тексте PDF.
    Возвращает сырой блок текста статьи."""
    
    # Убираем цифровые суффиксы омонимов (can1 -> can, bear2 -> bear)
    base_word = re.sub(r'\d+$', '', word)
    
    # Ищем заголовок статьи в различных формах
    patterns = [
        # Точное совпадение в начале строки с транскрипцией
        rf'\b{re.escape(base_word)}\b\s*\[',
        # Точное совпадение с частью речи
        rf'\b{re.escape(base_word)}\s+[nva\d]',
        # Просто слово в начале
        rf'^{re.escape(base_word)}\b',
    ]
    
    best_match = None
    best_pos = -1
    
    for pattern in patterns:
        for m in re.finditer(pattern, full_text, re.IGNORECASE | re.MULTILINE):
            pos = m.start()
            if best_pos == -1 or pos < best_pos:
                best_pos = pos
                best_match = m
    
    if best_match is None:
        return None
    
    # Берём следующие ~2000 символов как тело статьи
    start = best_match.start()
    end = min(start + 2000, len(full_text))
    return full_text[start:end]


def extract_word_article(full_text: str, word: str) -> dict:
    """Извлекает структурированную статью для слова из PDF."""
    base_word = re.sub(r'\d+$', '', word)
    
    # Найти позицию статьи: ищем заголовок слова (bold-like — начало строки + транскрипция)
    # В тексте заголовки выглядят как: "abandon [əˈbændən]" или "abandon I [...]"
    
    # Pattern: слово + пробелы + необязательный номер + [ или 1. n или v или a
    header_pattern = rf'(?m)^{re.escape(base_word)}[\s\dIV]*[\[\s]'
    
    matches = list(re.finditer(header_pattern, full_text, re.IGNORECASE))
    if not matches:
        # Try case-insensitive partial
        header_pattern2 = rf'(?m)\b{re.escape(base_word)}\b'
        matches = list(re.finditer(header_pattern2, full_text, re.IGNORECASE))
    
    if not matches:
        return None
    
    # Берём первое совпадение (обычно нужная статья)
    m = matches[0]
    start = m.start()
    
    # Найти конец статьи - следующее заголовочное слово на новой строке
    # Следующий заголовок — строка начинающаяся с маленькой буквы + пробел + [  
    next_header = re.search(
        rf'\n[a-z]{{2,}}[\s\dIV]*\[',
        full_text[start + len(base_word):],
        re.IGNORECASE
    )
    
    if next_header:
        end = start + len(base_word) + next_header.start()
    else:
        end = min(start + 3000, len(full_text))
    
    raw = full_text[start:end]
    return {'raw': clean_pdf_text(raw), 'pos': start}


# ============================================================
# ОСНОВНАЯ ФУНКЦИЯ АУДИТА
# ============================================================

def audit_entry(entry: dict, pdf_article: str) -> list:
    """Проверяет одну словарную статью. Возвращает список найденных проблем."""
    issues = []
    word = entry['word']
    
    if pdf_article is None:
        return [{'type': 'not_found_in_pdf', 'word': word, 'msg': 'Статья не найдена в PDF'}]
    
    pdf = pdf_article.lower()
    
    for meaning in entry.get('meanings', []):
        mid = meaning['id']
        translation = meaning['translation']
        
        # 1. Проверка OCR-ошибок в переводе (обрезанные слова)
        ocr_issues = check_ocr_errors(translation)
        for iss in ocr_issues:
            issues.append({
                'type': 'ocr_error',
                'word': word,
                'meaning_id': mid,
                'field': 'translation',
                'text': translation,
                'detail': iss,
            })
        
        # 2. Проверка примеров
        for ex in meaning.get('examples', []):
            en = ex.get('en', '')
            ru = ex.get('ru', '')
            
            # Проверяем OCR в примерах
            for txt, fld in [(en, 'example.en'), (ru, 'example.ru')]:
                for iss in check_ocr_errors(txt):
                    issues.append({
                        'type': 'ocr_error',
                        'word': word,
                        'meaning_id': mid,
                        'field': fld,
                        'text': txt,
                        'detail': iss,
                    })
    
    return issues


# Паттерны для обнаружения OCR-ошибок
OCR_PATTERNS = [
    # Слово начинается с согласной без начала (обрезано)
    (re.compile(r'\bстрахо?ва[нн]'), 'possible truncation: страхование'),
    (re.compile(r'\bуча?йно'), 'OCR error: случайно → учайно'),
    (re.compile(r'\bуча?йн'), 'OCR error: случайн → учайн'),
    (re.compile(r'\bахова'), 'OCR error: страхова → ахова'),
    (re.compile(r'\bалтер\b'), 'OCR error: бухгалтер → алтер'),
    (re.compile(r'\bетенц'), 'OCR error: компетенц → петенц'),
    (re.compile(r'\bмпетенц'), 'OCR error: компетенц → мпетенц'),
    (re.compile(r'\bформ\.\s+выборк'), 'misplaced register: информ.'),
    # Прилипший текст из другой статьи
    (re.compile(r'\s[A-Z]\s*$'), 'trailing letter (likely OCR artifact from column header)'),
    # refl. попал в translation
    (re.compile(r'^refl\.?\s'), 'misplaced grammar mark: refl. in translation'),
    (re.compile(r'\brefl\.\s+предава'), 'refl. leaked into translation'),
]

def check_ocr_errors(text: str) -> list:
    """Находит OCR-ошибки в тексте."""
    issues = []
    for pattern, description in OCR_PATTERNS:
        if pattern.search(text):
            issues.append(description)
    return issues


def main():
    print("Loading JSON dictionary...")
    data = json.load(open(JSON_PATH, 'r', encoding='utf-8'))
    print(f"Loaded {len(data)} entries")
    
    print("Opening PDF...")
    doc = pymupdf.open(PDF_PATH)
    print(f"PDF has {len(doc)} pages")
    
    print("Extracting PDF text (pages 15-50 for first pass)...")
    # First, extract first 40 pages (pages 15-55 = A section)
    full_text_raw = []
    for page_num in range(PAGE_START, min(PAGE_START + 50, len(doc))):
        page = doc[page_num]
        full_text_raw.append(page.get_text("text"))
    
    full_text = clean_pdf_text('\n'.join(full_text_raw))
    
    print("Running audit on first 100 entries...")
    
    all_issues = []
    checked = 0
    
    for entry in data[:100]:
        word = entry['word']
        base_word = re.sub(r'\d+$', '', word)
        
        # Extract relevant PDF section
        article_info = extract_word_article(full_text, word)
        pdf_raw = article_info['raw'] if article_info else None
        
        issues = audit_entry(entry, pdf_raw)
        all_issues.extend(issues)
        checked += 1
    
    print(f"\nChecked: {checked} entries")
    print(f"Issues found: {len(all_issues)}")
    
    # Write report
    out = io.open('tmp/audit_pass1.txt', 'w', encoding='utf-8')
    out.write(f"AUDIT REPORT - Pass 1\n")
    out.write(f"Checked entries: {checked}\n")
    out.write(f"Total issues: {len(all_issues)}\n\n")
    
    by_type = defaultdict(list)
    for iss in all_issues:
        by_type[iss['type']].append(iss)
    
    for t, items in by_type.items():
        out.write(f"\n=== {t.upper()} ({len(items)}) ===\n")
        for item in items:
            out.write(f"  Word: {item['word']} [meaning {item.get('meaning_id','?')}]\n")
            out.write(f"  Field: {item.get('field','?')}\n")
            out.write(f"  Text: {item.get('text','')[:120]}\n")
            out.write(f"  Detail: {item.get('detail','')}\n")
            out.write("\n")
    
    out.close()
    print("Written to tmp/audit_pass1.txt")
    doc.close()


if __name__ == "__main__":
    main()
