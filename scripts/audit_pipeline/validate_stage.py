#!/usr/bin/env python3
"""Validate a stage and its predecessors using the same gate as final acceptance."""
import json
import sys
from pathlib import Path
from validate_reports import validate_batch, source_limits, ROOT


def validate(path, expected_words=None, stage=''):
    path = Path(path)
    stage = stage or path.stem.removeprefix('stage_')
    data = json.loads(path.read_text())
    if not isinstance(data, list) or any(not isinstance(x, dict) for x in data):
        raise ValueError('Stage output must be an array of objects')
    words = expected_words if expected_words is not None else [x.get('word') for x in data]
    errors = validate_batch(path.parent, words, source_limits(ROOT), through_stage=stage)
    if errors:
        raise ValueError('\n'.join(errors))
    return data


if __name__ == '__main__':
    try:
        validate(sys.argv[1], stage=sys.argv[2] if len(sys.argv)>2 else '')
    except Exception as exc:
        print(f'VALIDATION FAILED: {exc}')
        raise SystemExit(1)
    print('VALIDATION PASSED')
