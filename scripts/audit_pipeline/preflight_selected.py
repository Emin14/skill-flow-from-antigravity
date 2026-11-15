#!/usr/bin/env python3
"""Run mechanical preflight for a frequency-selected report batch."""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def page_count(path: Path) -> int | None:
    pdfinfo = shutil.which("pdfinfo")
    if not pdfinfo:
        return None
    try:
        text = subprocess.check_output([pdfinfo, str(path)], text=True, stderr=subprocess.DEVNULL)
    except (OSError, subprocess.CalledProcessError):
        return None
    match = re.search(r"Pages:\s+(\d+)", text)
    return int(match.group(1)) if match else None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("selected_root", type=Path)
    parser.add_argument("--batch", type=int, required=True)
    parser.add_argument("--dataset", type=Path, default=ROOT / "src/data/oxford_5000.json")
    args = parser.parse_args()
    selected = json.loads((args.selected_root / "selected_words.json").read_text())
    data = json.loads(args.dataset.read_text())
    members = [r for r in selected if r["batch"] == args.batch]
    if len(members) != 20:
        raise SystemExit(f"selected batch {args.batch} must contain exactly 20 words")
    words = []
    for member in members:
        index = member["dataset_index"]
        if not isinstance(index, int) or index < 0 or index >= len(data):
            raise SystemExit(f"invalid dataset index: {index}")
        entry = data[index]
        if entry.get("word") != member["word"]:
            raise SystemExit(f"selected word/index mismatch: {member}")
        words.append(entry["word"])
    source_files = sorted(
        str(path.relative_to(ROOT))
        for path in ROOT.iterdir()
        if path.is_file() and path.suffix.lower() in {".pdf", ".docx"}
    )
    output = args.selected_root / f"batch_{args.batch:03d}" / "preflight.json"
    output.write_text(
        json.dumps(
            {
                "batch": args.batch,
                "selected_dataset_indices": [r["dataset_index"] for r in members],
                "word_order": words,
                "source_files": source_files,
                "source_page_limits": {name: page_count(ROOT / name) for name in source_files if name.lower().endswith(".pdf")},
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )
    print(json.dumps({"batch": args.batch, "words": words}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
