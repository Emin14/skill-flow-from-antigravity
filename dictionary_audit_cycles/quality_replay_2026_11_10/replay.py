"""Read-only historical replay. Restore the previous canonical state in memory."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

REPORT = Path(__file__).resolve().parent
ROOT = REPORT.parents[1]
BASE = REPORT.with_name("next20_trial_2026_11_09")
sys.path.insert(0, str(ROOT / "scripts/audit_pipeline"))
import dispatch_roles
import validate_reports
from apply_examples_manifest import apply_reviewed


class HistoricalInput:
    def __init__(self, text, canonical):
        self.text = text
        self.canonical = canonical

    def read_text(self):
        return self.text

    def relative_to(self, root):
        return self.canonical.relative_to(root)


canonical = dispatch_roles.DATASET
raw = canonical.read_bytes()
if hashlib.sha256(raw).hexdigest() != (BASE / "after_sha256.txt").read_text().strip():
    raise SystemExit("Canonical snapshot differs from the previous run's verified result")
reverse = json.loads((BASE / "reverse_changes.json").read_text())["reverse_changes"]
historical, _ = apply_reviewed(json.loads(raw), reverse)
selection = REPORT / "selected_words.json"
selected = json.loads(selection.read_text())
baseline = json.loads((BASE / "batch_001/input_09.json").read_text())["entries"]
if [historical[row["dataset_index"]] for row in selected] != baseline:
    raise SystemExit("Historical entries differ from the previous worker input")
snapshot = HistoricalInput(json.dumps(historical, ensure_ascii=False), canonical)

start = sys.argv[1] if len(sys.argv) > 1 else "08"
if start not in {"08", "09", "10", "gate"}:
    raise SystemExit("Expected 08, 09, 10, or gate")
if start != "gate":
    dispatch_roles.DATASET = snapshot
    sys.argv = [
        "dispatch_roles.py", "--batch-index", "1", "--output-root", str(REPORT),
        "--selected-list", str(selection), "--start-stage", start,
        "--stop-after", "10", "--worker", "python3 -B scripts/audit_pipeline/codex_worker_adapter.py",
    ]
    if dispatch_roles.main():
        raise SystemExit("Dispatch failed")

qa = subprocess.run([sys.executable, str(ROOT / "final_qa_validation.py")], capture_output=True, text=True, check=True)
(REPORT / "batch_001/final_qa_validation.txt").write_text(qa.stdout + qa.stderr)
validate_reports.DEFAULT_DATASET = snapshot
sys.argv = ["validate_reports.py", str(REPORT), "--selected-list", str(selection), "--run-final-qa"]
result = validate_reports.main()
if canonical.read_bytes() != raw:
    raise SystemExit("Canonical dataset changed during replay")
raise SystemExit(result)
