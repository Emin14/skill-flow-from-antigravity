#!/usr/bin/env python3
"""Validate strict 06–10 audit reports against the canonical dataset and sources."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
import shutil
import unicodedata
from pathlib import Path
from example_contract import validate_examples
from entry_identity import resolve_entries, batch_selection
from source_quotes import quote_error
from entry_contract import issue_target_errors, proposed_after
import copy
from meaning_contract import validate_meanings

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATASET = ROOT / "src/data/oxford_5000.json"
GENERIC_EVIDENCE = (
    "источники проверены",
    "подтверждающий фрагмент, показывающий улучшение, не найден",
    "ocr-варианты без подтверждения исключены",
)
STAGES = ("06", "07", "08", "09", "10")


def norm(value: str) -> str:
    return unicodedata.normalize("NFC", value)


def source_limits(source_root: Path) -> dict[str, int]:
    limits: dict[str, int] = {}
    pdfinfo = shutil.which("pdfinfo") or "/Users/emin/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/pdfinfo"
    for path in source_root.iterdir():
        if path.suffix.lower() == ".pdf":
            try:
                output = subprocess.check_output([pdfinfo, str(path)], text=True, stderr=subprocess.DEVNULL)
                match = re.search(r"Pages:\s+(\d+)", output)
                if match:
                    limits[norm(path.name)] = int(match.group(1))
            except (OSError, subprocess.CalledProcessError) as exc:
                raise ValueError(f"Cannot inventory source {path}: {exc}") from exc
        elif path.suffix.lower() == ".docx":
            try:
                import zipfile

                with zipfile.ZipFile(path) as archive:
                    xml = archive.read("word/document.xml").decode("utf-8", "replace")
                limits[norm(path.name)] = len(re.findall(r"<w:p(?: [^>]*)?>", xml))
            except (OSError, KeyError, zipfile.BadZipFile):
                continue
    return limits


def add(errors: list[str], batch: Path, word: str, message: str) -> None:
    errors.append(f"{batch.name}/{word}: {message}")


def validate_batch(batch: Path, expected: list[str], limits: dict[str, int], through_stage: str = "10", entries=None) -> list[str]:
    errors: list[str] = []
    stages: dict[str, list[dict]] = {}
    required_stages = STAGES[:STAGES.index(through_stage)+1]
    if len(expected) != 20 or len(set(expected)) != 20:
        return [f"{batch.name}: batch requires exactly 20 distinct words"]
    for stage in required_stages:
        path = batch / f"stage_{stage}.json"
        if not path.exists():
            errors.append(f"{batch.name}: missing {path.name}")
            continue
        try:
            payload = json.loads(path.read_text())
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{batch.name}: invalid {path.name}: {exc}")
            continue
        if not isinstance(payload, list) or len(payload) != len(expected):
            errors.append(f"{batch.name}: {path.name} must contain exactly {len(expected)} records")
            continue
        if any(not isinstance(item, dict) for item in payload):
            errors.append(f"{batch.name}: {path.name} records must be objects")
            continue
        stages[stage] = payload
        if [item.get("word") for item in payload] != expected:
            errors.append(f"{batch.name}: {path.name} word order does not match dataset")

    if errors or len(stages) != len(required_stages):
        return errors

    evidence_seen: dict[str, str] = {}
    reason_seen: dict[str, str] = {}
    for stage, payload in stages.items():
        for item in payload:
            word = item.get("word", "<missing>")
            if item.get("decision") not in {"изменить", "оставить", "review_required", "принято без изменения"}:
                add(errors, batch, word, f"stage_{stage}: invalid decision")
            reason = item.get("reason")
            confidence = item.get("confidence")
            if not isinstance(reason, str) or not reason.strip():
                add(errors, batch, word, f"stage_{stage}: missing reason")
            elif reason in reason_seen and reason_seen[reason] != word:
                add(errors, batch, word, f"stage_{stage}: reason repeats {reason_seen[reason]}")
            else:
                reason_seen[reason] = word
            if isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
                add(errors, batch, word, f"stage_{stage}: invalid confidence")

    for item in stages["06"]:
        word = item["word"]
        evidence = item.get("source_evidence")
        results = evidence.get("search_results") if isinstance(evidence, dict) else None
        if not isinstance(results, list) or not results:
            add(errors, batch, word, "stage_06: missing per-source search_results")
            continue
        if any(not isinstance(result, dict) for result in results):
            add(errors, batch, word, "stage_06: search results must be objects")
            continue
        files = [norm(r.get('file', '')) for r in results if isinstance(r.get('file'), str)]
        if len(files) != len(set(files)):
            add(errors, batch, word, "stage_06: duplicate source search")
        for missing in sorted(set(limits) - set(files)):
            add(errors, batch, word, f"stage_06: missing source search: {missing}")
        for result in results:
            if type(result.get('found')) is not bool or not isinstance(result.get('query'), str) or not result['query'].strip():
                add(errors, batch, word, "stage_06: every search requires query and boolean found")
            filename = result.get("file")
            if not isinstance(filename, str) or not (batch.parents[1] / filename).exists():
                # Sources live at repository root, independent of report root.
                if not isinstance(filename, str) or not (ROOT / filename).exists():
                    add(errors, batch, word, f"stage_06: source file does not exist: {filename!r}")
                    continue
            if not result.get("found"):
                query = result.get("query")
                outcome = result.get("result")
                if not isinstance(query, str) or not query.strip() or not isinstance(outcome, str) or not outcome.strip():
                    add(errors, batch, word, "stage_06: missing query/result for not-found search")
                continue
            locations = result.get("locations")
            if not isinstance(locations, list) or not locations:
                add(errors, batch, word, "stage_06: found result has no locations")
                continue
            for location in locations:
                if not isinstance(location, dict):
                    add(errors, batch, word, "stage_06: location must be an object")
                    continue
                key = "page" if norm(filename).lower().endswith(".pdf") else "line"
                number = location.get(key)
                quote = location.get("quote")
                if not isinstance(number, int) or number < 1 or number > limits.get(norm(filename), 0):
                    add(errors, batch, word, f"stage_06: invalid {key} {number} for {filename}")
                if not isinstance(quote, str) or len(quote.strip()) < 8:
                    add(errors, batch, word, "stage_06: missing short exact quote")
                    continue
                if type(number) is int and 1 <= number <= limits.get(norm(filename), 0):
                    source_path = ROOT / filename
                    if not source_path.exists():
                        source_path = batch.parents[1] / filename
                    problem = quote_error(source_path, number, quote)
                    if problem:
                        add(errors, batch, word, f"stage_06: {filename}:{number}: {problem}")
                lowered = quote.lower()
                if any(marker in lowered for marker in GENERIC_EVIDENCE):
                    add(errors, batch, word, "stage_06: generic evidence text")
                digest = hashlib.sha256(f"{norm(filename)}|{number}|{quote}".encode()).hexdigest()
                if digest in evidence_seen and evidence_seen[digest] != word:
                    add(errors, batch, word, f"stage_06: evidence repeats {evidence_seen[digest]}")
                evidence_seen[digest] = word

    if entries is not None:
        by_word = {entry['word']: entry for entry in entries}
        for item in stages.get('07', []):
            try:
                expected_after = proposed_after(by_word[item['word']], copy.deepcopy(item))
                if item.get('after') != expected_after:
                    add(errors, batch, item['word'], 'stage_07: after contains changes absent from explicit proposals')
            except (ValueError, KeyError, TypeError, IndexError) as exc:
                add(errors, batch, item['word'], 'stage_07: invalid explicit proposal: '+str(exc))
            if item.get('before') != by_word[item['word']]:
                add(errors, batch, item['word'], 'stage_07: before must exactly match canonical entry')
        for item in stages.get('08', []):
            meanings = item.get('meanings')
            count = len(by_word[item['word']].get('meanings', []))
            if not isinstance(meanings, list) or any(not isinstance(m, dict) for m in meanings):
                continue
            indices = [m.get('meaning_index') for m in meanings]
            if len(indices) != count or set(i for i in indices if type(i) is int) != set(range(1, count+1)):
                add(errors, batch, item['word'], 'stage_08: cover each meaning exactly once with one-based meaning_index')
            if any(type(m.get('primary')) is not bool for m in meanings) or not any(m.get('primary') is True for m in meanings):
                add(errors, batch, item['word'], 'stage_08: boolean primary flags and at least one primary meaning required')

    for item in stages.get("07", []):
        word = item["word"]
        if "before" not in item or "after" not in item:
            add(errors, batch, word, "stage_07: before/after required")
        if item.get("decision") == "review_required" and not item.get("review_reason"):
            add(errors, batch, word, "stage_07: review_reason required")

    for item in stages.get("08", []):
        if not isinstance(item.get("meanings"), list):
            add(errors, batch, item["word"], "stage_08: meanings/order/primary check missing")
        else:
            for meaning in item["meanings"]:
                if not isinstance(meaning, dict):
                    add(errors, batch, item["word"], "stage_08: meaning must be object")
                    continue
                if not all(key in meaning for key in ("partOfSpeech", "primary", "decision", "reason")):
                    add(errors, batch, item["word"], "stage_08: incomplete meaning order/primary record")

    for item in stages.get("09", []):
        if not isinstance(item.get("checks"), list) or any(not isinstance(check, dict) or "problem" not in check or "examples_checked" not in check for check in item["checks"]):
            add(errors, batch, item["word"], "stage_09: per-meaning checks missing")
        else:
            for check in item["checks"]:
                if check.get("examples_checked") == 0:
                    candidate = check.get("candidate_example")
                    generated = check.get("generated_example")
                    if candidate and candidate.get("origin") not in ("source", "dictionary"):
                        add(errors, batch, item["word"], "stage_09: source candidate must be marked origin=source")
                    if generated and generated.get("origin") != "generated":
                        add(errors, batch, item["word"], "stage_09: generated example must be marked origin=generated")
                    if generated and (not all(generated.get(key) for key in ("en", "ru", "reason")) or not (generated.get("quality_checks") or all(isinstance(generated.get(key), str) and generated[key].strip() for key in ("sense_explanation", "translation_explanation", "contrast", "contemporary_explanation")))):
                        add(errors, batch, item["word"], "stage_09: generated example requires en/ru/reason and quality_checks or all explicit v2 quality explanations")
                    if not candidate and not generated and not check.get("no_candidate_reason"):
                        add(errors, batch, item["word"], "stage_09: empty examples require source candidate, generated example, or no_candidate_reason")

    for item in stages.get("10", []):
        word = item["word"]
        for key in ("evidence_ref", "before_after_ref"):
            if not item.get(key):
                add(errors, batch, word, f"stage_10: {key} required")
        if item.get("decision") == "review_required":
            issues = item.get("issues")
            if not isinstance(issues, list) or not issues:
                add(errors, batch, word, "stage_10: review_required needs concrete issues")
            else:
                for issue in issues:
                    target_entry = next((entry for entry in entries if entry['word']==word), None) if entries is not None else None
                    for problem in issue_target_errors(issue, target_entry):
                        add(errors, batch, word, 'stage_10: '+problem)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("report_root", type=Path)
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--source-root", type=Path, default=ROOT)
    parser.add_argument("--start-index", type=int, default=0, help="zero-based dataset offset for a partial report root")
    parser.add_argument("--selected-list", type=Path, help="selected_words.json for a non-contiguous sample")
    parser.add_argument("--run-final-qa", action="store_true")
    args = parser.parse_args()
    data = json.loads(args.dataset.read_text())
    all_words = [entry["word"] for entry in data]
    batches = sorted(path for path in args.report_root.glob("batch_*") if path.is_dir())
    if args.selected_list:
        selected_payload = json.loads(args.selected_list.read_text())
        selected_records = selected_payload.get("records", selected_payload) if isinstance(selected_payload, dict) else selected_payload
        expected = [record["word"] for record in selected_records]
    else:
        expected = all_words[args.start_index : args.start_index + len(batches) * 20]
    limits = source_limits(args.source_root)
    errors: list[str] = []
    if not batches:
        errors.append("No batches found; an empty audit cannot pass")
    if args.start_index < 0:
        errors.append("start-index must be nonnegative")
    if args.run_final_qa:
        qa = subprocess.run([sys.executable, str(ROOT / 'final_qa_validation.py')], cwd=ROOT, capture_output=True, text=True)
        if qa.returncode or 'Total errors found: 0' not in qa.stdout:
            errors.append('current canonical dataset final QA failed: ' + qa.stdout + qa.stderr)
    for index, batch in enumerate(batches):
        start = index * 20
        try:
            selection = selected_records[start:start+20] if args.selected_list else batch_selection(batch)
            if selection is None:
                selection = [{'word': data[i]['word'], 'dataset_index': i} for i in range(args.start_index+start, args.start_index+start+20)]
            entries, _ = resolve_entries(data, expected[start:start+20], selection)
            errors.extend(validate_batch(batch, expected[start:start+20], limits, entries=entries))
            s9 = json.loads((batch / 'stage_09.json').read_text())
            s10 = json.loads((batch / 'stage_10.json').read_text())
            errors.extend(f'{batch.name}: {error}' for error in validate_examples(entries, s9, s10))
            s7 = json.loads((batch / 'stage_07.json').read_text())
            errors.extend(f'{batch.name}: {error}' for error in validate_meanings(entries, s7, s9, s10))
        except (OSError, ValueError, KeyError, TypeError, IndexError) as exc:
            errors.append(f'{batch.name}: example contract failed: {exc}')
        if args.run_final_qa:
            qa = batch / "final_qa_validation.txt"
            if not qa.exists() or "Total errors found: 0" not in qa.read_text():
                errors.append(f"{batch.name}: final_qa_validation did not pass")
    expected_batches = (len(expected) + 19) // 20
    if len(batches) != expected_batches:
        errors.append(f"expected {expected_batches} batches, found {len(batches)}")
    print(f"Batches: {len(batches)}")
    print(f"Words: {len(expected)}")
    print(f"Total errors found: {len(errors)}")
    for error in errors[:200]:
        print(error)
    if len(errors) > 200:
        print(f"... {len(errors) - 200} additional errors omitted")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
