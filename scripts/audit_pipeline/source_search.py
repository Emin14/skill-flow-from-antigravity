#!/usr/bin/env python3
"""Cached source extraction and lexical search. No semantic decisions."""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / 'tmp/audit_source_cache'
VERSION = 1
PDFKIT = '''ObjC.import('PDFKit'); ObjC.import('Foundation');
function run(args) {
 const doc=$.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(args[0]));
 if (!doc) throw Error('Cannot open PDF');
 let pages=[];
 for(let i=0;i<Number(doc.pageCount);i++) {
  let s=doc.pageAtIndex(i).string; pages.push(s ? ObjC.unwrap(s) : '');
 }
 return JSON.stringify(pages);
}'''


def extract(path):
    if path.suffix.lower() == '.docx':
        with zipfile.ZipFile(path) as archive:
            root = ET.fromstring(archive.read('word/document.xml'))
        ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        return [''.join(t.text or '' for t in p.iter(ns+'t')) for p in root.iter(ns+'p')]
    binary = shutil.which('pdftotext')
    if binary:
        text = subprocess.check_output([binary, str(path), '-'], text=True, stderr=subprocess.PIPE)
        pages = text.split('\f')
        return pages[:-1] if pages[-1] == '' else pages
    if shutil.which('osascript'):
        return json.loads(subprocess.check_output(['osascript', '-l', 'JavaScript', '-e', PDFKIT, str(path.resolve())], text=True, stderr=subprocess.PIPE))
    raise ValueError('PDF extraction unavailable: install pdftotext or use macOS PDFKit')


def source_data(path, cache=CACHE):
    path = Path(path)
    checksum = hashlib.sha256(path.read_bytes()).hexdigest()
    key = hashlib.sha256((str(VERSION)+checksum).encode()).hexdigest()
    cache.mkdir(parents=True, exist_ok=True)
    target = cache / (key+'.json')
    if target.exists():
        data = json.loads(target.read_text())
        if data['sha256'] == checksum and data['version'] == VERSION:
            return data, target
    units = [text if text is not None else "" for text in extract(path)]
    if not units or not any(t.strip() for t in units):
        raise ValueError(f'{path.name}: no extractable text; OCR required before model dispatch')
    data = {'version': VERSION, 'sha256': checksum, 'units': units,
            'empty_units': [i+1 for i,t in enumerate(units) if not t.strip()]}
    with tempfile.NamedTemporaryFile(mode='w', dir=cache, delete=False) as f:
        json.dump(data, f, ensure_ascii=False)
        temp = Path(f.name)
    temp.replace(target)
    return data, target


def search(units, word, limit=3):
    pattern = re.compile(r'(?<!\w)' + r'\s+'.join(re.escape(p) for p in word.split()) + r'(?!\w)', re.I)
    hits = []
    count = 0
    for number, original in enumerate(units, 1):
        # Keep original offsets and quotation bytes; NFC is used for filename comparison only.
        for match in pattern.finditer(original):
            count += 1
            start = max(0, match.start()-100)
            end = min(len(original), match.end()+220)
            at_line_start = not original[original.rfind('\n',0,match.start())+1:match.start()].strip()
            hit = {'location': number, 'quote': original[start:end], 'offset': match.start()}
            hits.append((not at_line_start, number, match.start(), hit))
    hits.sort(key=lambda h:h[:3])
    return {'query': pattern.pattern, 'match_count': count, 'truncated': count > limit,
            'locations': [h[3] for h in hits[:limit]]}


def prepare(root, words, output):
    paths = sorted(p for p in root.iterdir() if p.suffix.lower() in {'.pdf','.docx'})
    if not paths:
        raise ValueError('No local dictionary sources')
    sources = []
    results = {w: [] for w in words}
    for path in paths:
        data, cache_path = source_data(path)
        key = 'page' if path.suffix.lower() == '.pdf' else 'line'
        sources.append({'file': path.name, 'sha256': data['sha256'], 'cache': str(cache_path.resolve()),
                        'units': len(data['units']), 'empty_units': data['empty_units'], 'coordinate': key})
        for word in words:
            result = search(data['units'], word)
            for hit in result['locations']:
                hit[key] = hit.pop('location')
            result.update(file=path.name, found=bool(result['match_count']),
                          result='Literal search only; absence does not exclude OCR errors or inflected forms.',
                          extraction_has_empty_units=bool(data['empty_units']))
            results[word].append(result)
    packet = {'sources': sources, 'records': [{'word': w, 'search_results': results[w]} for w in words],
              'contract': 'Mechanical lexical hits, not verified sense evidence. Read more context if ambiguous. No hit is not proof of absence from scanned pages. Never treat this packet as agent approval.'}
    output.write_text(json.dumps(packet,ensure_ascii=False,indent=2)+'\n')
    return packet



def packet_view(packet, word=None, limit=1):
    if limit < 1:
        raise ValueError('limit must be positive')
    records = []
    for record in packet['records']:
        if word is not None and record['word'] != word:
            continue
        results = []
        for result in record['search_results']:
            item = dict(result)
            item['locations'] = result['locations'][:limit]
            item['truncated'] = result['match_count'] > len(item['locations'])
            results.append(item)
        records.append({'word': record['word'], 'search_results': results})
    if not records:
        raise ValueError('Word absent from prepared packet')
    return {'sources': packet['sources'], 'records': records, 'contract': packet['contract']}


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--packet', type=Path)
    p.add_argument('--cache-file', type=Path)
    p.add_argument('--location', type=int)
    p.add_argument('--word')
    p.add_argument('--limit',type=int,default=1)
    p.add_argument('--selected-list',type=Path)
    p.add_argument('--output',type=Path)
    a=p.parse_args()
    if a.packet:
        print(json.dumps(packet_view(json.loads(a.packet.read_text()),a.word,a.limit),ensure_ascii=False,separators=(',',':')))
    elif a.cache_file:
        units=json.loads(a.cache_file.read_text())['units']
        if a.location:
            if not 1 <= a.location <= len(units): p.error('Location out of range')
            print(units[a.location-1])
        elif a.word:
            print(json.dumps(search(units,a.word,a.limit),ensure_ascii=False))
        else: p.error('Specify --location or --word')
    elif a.selected_list and a.output:
        prepare(ROOT,[r['word'] for r in json.loads(a.selected_list.read_text())],a.output)
    else: p.error('Specify selection/output or cache-file')

if __name__=='__main__': main()
