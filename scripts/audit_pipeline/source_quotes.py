"""Mechanical quotation verification, never semantic approval."""
from functools import lru_cache
from pathlib import Path
import shutil
import subprocess
import unicodedata
import xml.etree.ElementTree as ET
import zipfile


def normalize(text):
    return ' '.join(unicodedata.normalize('NFC', text).split())


def pdf_text_binary():
    binary = shutil.which('pdftotext')
    fallback = Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/pdftotext'
    if not binary and fallback.is_file():
        binary = str(fallback)
    if not binary:
        raise ValueError('pdftotext is required before dispatching paid workers')
    subprocess.run([binary, '-v'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return binary


@lru_cache(maxsize=16)
def _source_units(path, mtime, size):
    source = Path(path)
    if source.suffix.lower() in {'.pdf', '.docx'}:
        from source_search import source_data
        data, _ = source_data(source)
        return data['units']
    return source.read_text().split('\n')


@lru_cache(maxsize=256)
def _location(path, mtime, size, number):
    return _source_units(path, mtime, size)[number-1]


def quote_error(path, number, quote):
    try:
        stat = path.stat()
        text = _location(str(path.resolve()), stat.st_mtime_ns, stat.st_size, number)
        if normalize(quote) not in normalize(text):
            return 'quote is absent from specified page/line (only whitespace normalization allowed)'
    except (OSError, ValueError, IndexError, subprocess.SubprocessError, zipfile.BadZipFile, ET.ParseError) as exc:
        return f'cannot verify quotation: {exc}'
    return None
