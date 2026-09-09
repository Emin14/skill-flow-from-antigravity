"""Structural QA for the three live dictionaries (created 2026-09-09).

This is a new validator, not a recovered historical validator. Optional baseline
and change manifest verify that only explicitly reviewed string edits occurred.
It does not certify lexical completeness or accuracy.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FILES = ('oxford_5000_2026-08-27.json', 'oxford_5000.json', 'src/data/oxford_5000.json')
CORE = set('a all that of to for by with do have be as but if there miss'.split())
ALLOWED_DUPLICATES = {'house', 'live', 'minute', 'use'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path)
    parser.add_argument('--changes', type=Path)
    args = parser.parse_args()
    errors = []
    datasets = []
    hashes = []
    for filename in FILES:
        try:
            raw = (ROOT / filename).read_bytes()
            hashes.append(hashlib.sha256(raw).hexdigest())
            data = json.loads(raw)
            datasets.append(data)
            assert isinstance(data, list), 'root must be an array'
            words = set()
            for entry in data:
                assert isinstance(entry, dict), 'entry must be an object'
                word = entry.get('word')
                assert isinstance(word, str) and word.strip(), 'missing word'
                if word in words and word not in ALLOWED_DUPLICATES:
                    errors.append(f'{filename}: duplicate word: {word}')
                words.add(word)
                assert isinstance(entry.get('meanings'), list) and entry['meanings'], f'{word}: missing meanings'

                def walk(value, path):
                    if isinstance(value, dict):
                        for key, child in value.items():
                            if key in ('translation', 'en', 'ru'):
                                assert isinstance(child, str), f'{path}.{key}: not a string'
                                if key == 'translation':
                                    assert child.strip(), f'{path}: empty translation'
                            if key == 'examples':
                                assert isinstance(child, list), f'{path}: examples not an array'
                                assert all(isinstance(ex, dict) and 'en' in ex and 'ru' in ex for ex in child), f'{path}: malformed example'
                            walk(child, f'{path}.{key}')
                    elif isinstance(value, list):
                        for i, child in enumerate(value):
                            walk(child, f'{path}[{i}]')
                    elif isinstance(value, str):
                        assert not any(c in value for c in ('\ufffd', '\x00', '\x07', '\x08')), f'{path}: corrupt character'

                walk(entry, word)
        except (AssertionError, ValueError, OSError) as exc:
            errors.append(f'{filename}: {exc}')
    if len(set(hashes)) != 1:
        errors.append('SHA-256 mismatch')
    if bool(args.baseline) != bool(args.changes):
        errors.append('--baseline and --changes must be used together')
    elif args.baseline and len(datasets) == 3:
        try:
            expected = json.loads(args.baseline.read_bytes())
            changes = json.loads(args.changes.read_bytes())
            entries = {e['word']: e for e in expected}
            for change in changes:
                assert sum(e['word'] == change['word'] for e in expected) == 1, 'ambiguous target word'
                assert change['word'] not in CORE, 'protected core word changed'
                # This reviewed batch contains no participle adjectives.
                assert not change['word'].endswith(('ed', 'ing')), 'participle-like word requires registry review'
                target = entries[change['word']]
                for key in change['path'][:-1]:
                    target = target[key]
                key = change['path'][-1]
                assert key in ('translation', 'en', 'ru'), 'non-text edit'
                assert target[key] == change['before'], 'baseline mismatch'
                assert isinstance(change['after'], str) and change['after'].strip(), 'invalid replacement'
                target[key] = change['after']
            assert all(data == expected for data in datasets), 'changes outside reviewed manifest'
        except (AssertionError, ValueError, OSError, KeyError, IndexError) as exc:
            errors.append(f'Change verification: {exc}')
    for error in errors:
        print(error)
    for filename, digest in zip(FILES, hashes):
        print(f'{filename}: {digest}')
    print(f'Total errors found: {len(errors)}')
    return bool(errors)


if __name__ == '__main__':
    raise SystemExit(main())
