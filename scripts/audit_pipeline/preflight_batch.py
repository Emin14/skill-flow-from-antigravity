#!/usr/bin/env python3
"""Deterministic preflight for one audit batch.

This script deliberately performs only mechanical checks.  It never decides
which dictionary meaning is primary and never rewrites a dictionary entry.
Those semantic decisions remain with roles 06 and 08.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATASET = ROOT / "src/data/oxford_5000.json"


def pdf_pages(path: Path) -> int | None:
    pdfinfo = __import__("shutil").which("pdfinfo")
    if not pdfinfo:
        return None
    try:
        out = subprocess.check_output([pdfinfo, str(path)], text=True, stderr=subprocess.DEVNULL)
    except (OSError, subprocess.CalledProcessError):
        return None
    match = re.search(r"Pages:\s+(\d+)", out)
    return int(match.group(1)) if match else None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch-index", type=int, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    args = parser.parse_args()
    if args.batch_index < 1:
        parser.error("--batch-index must be positive")

    data = json.loads(args.dataset.read_text())
    start = (args.batch_index - 1) * 20
    entries = data[start : start + 20]
    if len(entries) != 20:
        raise SystemExit(f"batch {args.batch_index} is incomplete")
    words = [entry.get("word") for entry in entries]
    if any(not isinstance(word, str) or not word.strip() for word in words):
        raise SystemExit("canonical dataset contains an empty word")
    if len(set(words)) != 20:
        raise SystemExit("canonical dataset contains duplicate words in this batch")

    report_dir = args.output_root / f"batch_{args.batch_index:03d}"
    report_dir.mkdir(parents=True, exist_ok=True)
    source_files = sorted(
        str(path.relative_to(ROOT))
        for path in ROOT.iterdir()
        if path.is_file() and path.suffix.lower() in {".pdf", ".docx"}
    )
    manifest = {
        "batch_index": args.batch_index,
        "start_index": start,
        "word_order": words,
        "source_files": source_files,
        "source_page_limits": {
            name: pdf_pages(ROOT / name)
            for name in source_files
            if name.lower().endswith(".pdf")
        },
        "empty_meanings": [
            {
                "word": entry["word"],
                "meaning_indices": [
                    index
                    for index, meaning in enumerate(entry.get("meanings", []), 1)
                    if not meaning.get("examples")
                ],
            }
            for entry in entries
            if any(not meaning.get("examples") for meaning in entry.get("meanings", []))
        ],
    }
    (report_dir / "preflight.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    )
    print(json.dumps({"batch": args.batch_index, "words": 20, "sources": len(source_files)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
