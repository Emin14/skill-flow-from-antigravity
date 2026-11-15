import json
import tempfile
import unittest
from pathlib import Path
from entry_identity import resolve_entries
from source_quotes import quote_error
from validate_reports import validate_batch


class SafetyTests(unittest.TestCase):
    def test_ambiguous_word_never_chooses_last(self):
        with self.assertRaisesRegex(ValueError, 'ambiguous'):
            resolve_entries([{'word': 'use'}, {'word': 'use'}], ['use'])

    def test_explicit_homograph(self):
        data = [{'word': 'use', 'pos': 'verb'}, {'word': 'use', 'pos': 'noun'}]
        entries, indices = resolve_entries(data, ['use'], [{'word': 'use', 'dataset_index': 0}])
        self.assertEqual(entries[0]['pos'], 'verb')
        self.assertEqual(indices, [0])

    def test_invalid_indices(self):
        for index in [-1, True, 1, '0']:
            with self.subTest(index=index), self.assertRaises(ValueError):
                resolve_entries([{'word': 'a'}], ['a'], [{'word': 'a', 'dataset_index': index}])

    def test_early_gate_and_missing_source(self):
        with tempfile.TemporaryDirectory() as tmp:
            batch = Path(tmp)
            words = [f'word{i}' for i in range(20)]
            records = [{'word': word, 'decision': 'оставить', 'reason': word+' individual reason',
                        'confidence': .9, 'source_evidence': {'search_results': [
                            {'file': __file__, 'query': word, 'found': False, 'result': 'not found'}]}}
                       for word in words]
            path = batch/'stage_06.json'
            path.write_text(json.dumps(records))
            self.assertEqual(validate_batch(batch, words, {}, through_stage='06'), [])
            errors = validate_batch(batch, words, {'missing.pdf': 3}, through_stage='06')
            self.assertTrue(any('missing source search' in e for e in errors))
            self.assertFalse(any('stage_07.json' in e for e in errors))
            records[0] = None
            path.write_text(json.dumps(records))
            self.assertTrue(validate_batch(batch, words, {}, through_stage='06'))

    def test_boolean_confidence_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            batch = Path(tmp)
            words = [str(i) for i in range(20)]
            records = [{'word': w, 'decision': 'оставить', 'reason': w, 'confidence': True} for w in words]
            (batch/'stage_06.json').write_text(json.dumps(records))
            self.assertTrue(any('invalid confidence' in e for e in validate_batch(batch, words, {}, through_stage='06')))

    def test_real_quote_and_wrong_location(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp)/'source.txt'
            source.write_text('A genuine quotation.\nAnother line.\n')
            self.assertIsNone(quote_error(source, 1, 'A genuine quotation.'))
            self.assertIsNotNone(quote_error(source, 2, 'A genuine quotation.'))
            self.assertIsNotNone(quote_error(source, 1, 'Invented evidence.'))


if __name__ == '__main__':
    unittest.main()

class DispatchTests(unittest.TestCase):
    def test_bad_worker_stops_before_second_role(self):
        from unittest.mock import patch
        import dispatch_roles
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root/'agent-roles').mkdir()
            for filename in dispatch_roles.STAGES.values():
                (root/'agent-roles'/filename).write_text('Review every entry.')
            dataset = root/'dataset.json'
            data = [{'word': f'w{i}', 'meanings': []} for i in range(20)]
            dataset.write_text(json.dumps(data))
            selected = root/'selection.json'
            selected.write_text(json.dumps([{'word': e['word'], 'dataset_index': i} for i,e in enumerate(data)]))
            calls = []
            def bad_worker(command, role, prompt, output):
                calls.append(role)
                request = json.loads(prompt.read_text())
                self.assertEqual(request['entries'], data)
                self.assertEqual(request['model_scope']['pass_through_indices'], [])
                output.write_text(json.dumps([{'word': e['word']} for e in data]))
            argv = ['dispatch', '--batch-index', '1', '--output-root', str(root/'reports'),
                    '--selected-list', str(selected), '--worker', 'fake-worker']
            with patch.object(dispatch_roles, 'ROOT', root), patch.object(dispatch_roles, 'DATASET', dataset), patch.object(dispatch_roles, 'source_limits', return_value={}), patch.object(dispatch_roles, 'run_worker', side_effect=bad_worker), patch('sys.argv', argv):
                with self.assertRaises(SystemExit):
                    dispatch_roles.main()
            self.assertEqual(calls, ['06'])
            self.assertEqual(json.loads(dataset.read_text()), data)
