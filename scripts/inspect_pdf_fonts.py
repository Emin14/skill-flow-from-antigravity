import argparse
import sys

import pdfplumber


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PDF_PATH = "Мюллер В.К.,Александрова Т.Е.,Дворкина А.Я.,Романова С.П.-Новый англо-русский словарь...-2021.a4.pdf"

parser = argparse.ArgumentParser()
parser.add_argument("--page", type=int, default=208, help="one-based PDF page")
parser.add_argument("--top", type=float, default=145.0)
parser.add_argument("--bottom", type=float, default=190.0)
parser.add_argument("--left", type=float, default=205.0)
parser.add_argument("--right", type=float, default=369.0)
args = parser.parse_args()

with pdfplumber.open(PDF_PATH) as pdf:
    page = pdf.pages[args.page - 1]
    words = page.extract_words(extra_attrs=["fontname", "size"])
    for word in words:
        if not (
            args.top <= word["top"] <= args.bottom
            and args.left <= word["x0"] <= args.right
        ):
            continue
        print(
            f"{word['top']:7.2f} {word['x0']:7.2f}-{word['x1']:7.2f} {word['size']:4.1f} "
            f"{word['fontname']:<30} {word['text']}"
        )
