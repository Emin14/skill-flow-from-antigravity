import json
import tempfile
import unittest
from pathlib import Path
from measure_run import measure


class MeasurementTests(unittest.TestCase):
    def test_archived_attempt_is_not_billed_twice(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name in ('batch_001', 'batch_001/repair_06_001'):
                path = root / name
                path.mkdir(parents=True, exist_ok=True)
                (path / 'stage_06.metrics.json').write_text(json.dumps({
                    'role': '06', 'elapsed_seconds': 2,
                    'usage': [{'input_tokens': 100, 'cached_input_tokens': 40, 'output_tokens': 10}]}))
                (path / 'stage_06.events.jsonl').write_text('{"id":"same-attempt"}\n')
            result = measure(root)
            self.assertEqual(len(result['attempts']), 1)
            self.assertEqual(result['totals']['uncached_input_tokens'], 60)
            self.assertEqual(result['totals']['output_tokens'], 10)

    def test_missing_usage_is_reported_not_estimated(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'stage_06.metrics.json').write_text(json.dumps({
                'role': '06', 'elapsed_seconds': 1, 'usage': []}))
            self.assertFalse(measure(root)['all_attempts_have_usage'])


if __name__ == '__main__':
    unittest.main()
