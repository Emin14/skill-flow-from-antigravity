"""
Полный аудит oxford_5000_2026-08-27.json по PDF Мюллера.
Этап 1: Извлечение ВСЕГО текста PDF в один файл (для быстрого поиска).
"""
import pymupdf
import io
import sys
import time

PDF_PATH = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf"
OUT_PATH = "tmp/muller_full_text.txt"

PAGE_START = 14   # 0-indexed, page 15 of PDF
PAGE_END   = 958  # 0-indexed

# Special chars
ACCENT_CHAR = '\x02'
SOFT_HYPHEN = '\x0b'

def clean_text(text):
    text = text.replace(ACCENT_CHAR, '')
    text = text.replace(SOFT_HYPHEN, '')
    return text

def main():
    print("Opening PDF...")
    doc = pymupdf.open(PDF_PATH)
    total = len(doc)
    print(f"PDF pages: {total}")
    
    out = io.open(OUT_PATH, 'w', encoding='utf-8')
    
    t0 = time.time()
    for page_num in range(PAGE_START, min(PAGE_END + 1, total)):
        page = doc[page_num]
        text = page.get_text("text")
        text = clean_text(text)
        out.write(f"\n<<<PAGE{page_num+1}>>>\n")
        out.write(text)
        
        if (page_num - PAGE_START) % 100 == 0:
            elapsed = time.time() - t0
            pct = (page_num - PAGE_START) / (PAGE_END - PAGE_START) * 100
            print(f"  Page {page_num+1} ({pct:.0f}%) - {elapsed:.1f}s")
    
    out.close()
    doc.close()
    
    elapsed = time.time() - t0
    print(f"Done in {elapsed:.1f}s. Written to {OUT_PATH}")

if __name__ == "__main__":
    main()
