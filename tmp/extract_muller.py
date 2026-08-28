"""
Извлечение словарных статей из PDF Мюллера 2021 (a4, 924 стр.)
для аудита oxford_5000_2026-08-27.json
"""
import fitz  # PyMuPDF
import json
import re
import io
import sys

PDF_PATH = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf"
OUT_PATH = "tmp/muller_extracted.txt"

# Страницы словаря (0-индекс): 14..923
PAGE_START = 14
PAGE_END = 923

def extract_page_text(page):
    """Извлекает текст страницы блоками, сохраняя структуру."""
    blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_LIGATURES)["blocks"]
    lines = []
    for block in blocks:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                text = span["text"].strip()
                if text:
                    lines.append({
                        "text": text,
                        "font": span["font"],
                        "size": round(span["size"], 1),
                        "bold": "Bold" in span["font"] or "bold" in span["font"],
                        "x0": round(span["origin"][0], 1),
                        "y0": round(span["origin"][1], 1),
                    })
    return lines

def main():
    print(f"Opening PDF: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    total_pages = len(doc)
    print(f"Total pages: {total_pages}")
    
    out = io.open(OUT_PATH, "w", encoding="utf-8")
    
    # Extract first 20 pages to understand structure
    end = min(PAGE_START + 20, PAGE_END)
    
    for page_num in range(PAGE_START, end):
        page = doc[page_num]
        out.write(f"\n{'='*60}\n")
        out.write(f"PAGE {page_num + 1} (0-index: {page_num})\n")
        out.write(f"{'='*60}\n")
        
        # Get text with layout
        text = page.get_text("text")
        out.write(text)
        out.write("\n")
    
    out.close()
    doc.close()
    print(f"Done. Written to {OUT_PATH}")

if __name__ == "__main__":
    main()
