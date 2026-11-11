"""Structural QA for the single Oxford 5000 dictionary source.

This validator checks the canonical application dataset. It does not certify
lexical completeness or translation accuracy.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATASET = ROOT / 'src/data/oxford_5000.json'
ALLOWED_DUPLICATES = {'house', 'live', 'minute', 'use'}


def validate(data):
    errors = []
    assert isinstance(data, list), 'root must be an array'
    words = set()
    for entry in data:
        assert isinstance(entry, dict), 'entry must be an object'
        word = entry.get('word')
        assert isinstance(word, str) and word.strip(), 'missing word'
        if word in words and word not in ALLOWED_DUPLICATES:
            errors.append(f'duplicate word: {word}')
        words.add(word)
        assert isinstance(entry.get('meanings'), list) and entry['meanings'], f'{word}: missing meanings'

        def walk(value, path):
            if isinstance(value, dict):
                for key, child in value.items():
                    if key in ('translation', 'en', 'ru', 'phrase'):
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
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path)
    parser.add_argument('--changes', type=Path)
    args = parser.parse_args()
    errors = []
    try:
        data = json.loads(DATASET.read_bytes())
        errors.extend(validate(data))
    except (AssertionError, ValueError, OSError) as exc:
        errors.append(str(exc))

    if bool(args.baseline) != bool(args.changes):
        errors.append('--baseline and --changes must be used together')
    elif args.baseline and not errors:
        try:
            expected = json.loads(args.baseline.read_bytes())
            changes = json.loads(args.changes.read_bytes())
            entries = {e['word']: e for e in expected}
            for change in changes:
                assert sum(e['word'] == change['word'] for e in expected) == 1, 'ambiguous target word'
                target = entries[change['word']]
                for key in change['path'][:-1]:
                    target = target[key]
                key = change['path'][-1]
                assert key in ('translation', 'en', 'ru', 'phrase'), 'non-text edit'
                assert target[key] == change['before'], 'baseline mismatch'
                assert isinstance(change['after'], str) and change['after'].strip(), 'invalid replacement'
                target[key] = change['after']
            assert data == expected, 'changes outside reviewed manifest'
        except (AssertionError, ValueError, OSError, KeyError, IndexError) as exc:
            errors.append(f'Change verification: {exc}')

    print(f'{DATASET}: {len(data) if "data" in locals() else "unreadable"} entries')
    print(f'Total errors found: {len(errors)}')
    for error in errors:
        print(error)
    return bool(errors)


if __name__ == '__main__':
    raise SystemExit(main())
