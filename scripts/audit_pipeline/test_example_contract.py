"""Regression tests: unsafe history cannot authorize a new dictionary write."""
import copy
import unittest
from example_contract import DIMENSIONS, binding, digest, validate_examples, validate_proposals, approved_changes


class ExampleContractTests(unittest.TestCase):
    def setUp(self):
        self.entry = {'word': 'know', 'meanings': [{'translation': 'испытать, пережить', 'partOfSpeech': 'verb', 'examples': []}]}
        self.candidate = {'en': 'She has known hardship.', 'ru': 'Она пережила тяжёлые времена.',
                          'usage_status': 'current', 'contemporary_explanation': 'Known hardship is a current experiential construction.',
                          'origin': 'generated', 'target_lemma': 'know', 'target_form': 'known',
                          'before_examples': [], 'sense_explanation': 'Known hardship describes experienced difficulty.',
                          'translation_explanation': 'Пережила conveys experience; hardship is тяжёлые времена.',
                          'contrast': 'Direct object hardship, unlike knowledge of a fact.',
                          'source_searches': [{'file': 'dictionary.pdf', 'query': 'know hardship', 'result': 'No suitable sentence; generated original.'}]}
        self.s9 = [{'word': 'know', 'checks': [{'meaning_index': 1, 'examples_checked': 0, 'generated_example': self.candidate}]}]
        self.review = {'meaning_index': 1, 'candidate_sha256': digest(binding(self.entry, 1, self.candidate)),
                       'verdict': 'approved', 'confidence': .95,
                       'judgments': {k: {'pass': True, 'reason': f'{k}: known hardship is examined in this sense.'} for k in DIMENSIONS}}
        self.s10 = [{'word': 'know', 'decision': 'изменить', 'example_reviews': [self.review]}]

    def errors(self):
        return validate_examples([self.entry], self.s9, self.s10)

    def test_reviewed_candidate_builds_manifest(self):
        self.assertEqual([], self.errors())
        self.assertEqual(1, len(approved_changes([self.entry], self.s9, self.s10)))

    def test_historical_quote_cannot_become_approved_example(self):
        self.candidate['usage_status'] = 'obsolete'
        self.assertTrue(self.errors())

    def test_specialist_requires_real_contemporary_context(self):
        self.candidate['usage_status'] = 'current_specialist'
        self.assertTrue(self.errors())

    def test_old_seven_checks_cannot_authorize_contemporary_addition(self):
        self.review['judgments'].pop('contemporary_usage')
        self.assertTrue(self.errors())

    def test_false_contemporary_judgment_blocks_approval(self):
        self.review['judgments']['contemporary_usage']['pass'] = False
        self.assertTrue(self.errors())

    def test_old_accepted_without_change_does_not_authorize_addition(self):
        self.s10[0]['decision'] = 'принято без изменения'
        self.assertTrue(self.errors())

    def test_missing_independent_review(self):
        self.s10[0]['example_reviews'] = []
        self.assertTrue(self.errors())

    def test_changed_translation_invalidates_approval(self):
        self.candidate['ru'] = 'Она знает об этом.'
        self.assertTrue(any('stale' in e for e in self.errors()))

    def test_changed_sense_invalidates_approval(self):
        self.entry['meanings'][0]['translation'] = 'знать'
        self.assertTrue(any('stale' in e for e in self.errors()))

    def test_failed_semantic_dimension_cannot_be_approved(self):
        self.review['judgments']['sense_match']['pass'] = False
        self.assertTrue(self.errors())

    def test_synonym_without_target_is_rejected(self):
        self.candidate['en'] = 'She experienced hardship.'
        self.assertTrue(any('target_form' in e for e in self.errors()))

    def test_examples_checked_cannot_be_inflated_to_hide_empty(self):
        self.s9[0]['checks'][0]['examples_checked'] = 1
        self.assertTrue(any('canonical examples' in e for e in self.errors()))

    def test_repeated_meaning_cannot_hide_unreviewed_meaning(self):
        self.s9[0]['checks'].append(copy.deepcopy(self.s9[0]['checks'][0]))
        self.assertTrue(self.errors())

    def test_empty_reason_checklist_is_rejected(self):
        self.review['judgments']['translation_fidelity']['reason'] = ''
        self.assertTrue(self.errors())

    def test_structural_green_does_not_authorize_empty_meaning(self):
        self.s9[0]['checks'][0].pop('generated_example')
        self.s10[0]['example_reviews'] = []
        self.s10[0]['decision'] = 'принято без изменения'
        self.assertTrue(self.errors())

    def test_incomplete_author_output_is_rejected_before_critic_call(self):
        check = self.s9[0]['checks'][0]
        check['candidate_example'] = copy.deepcopy(self.candidate)
        self.assertEqual(['know/1: select exactly one candidate'], validate_proposals([self.entry], self.s9))
        del check['candidate_example']
        del check['generated_example']
        check['no_candidate_reason'] = 'One attempt picked the wrong sense.'
        check['rejected_attempts'] = [{'en': 'A', 'ru': 'Б', 'problem': 'Wrong sense'}]
        self.assertEqual(
            ['know/1: empty meaning needs a candidate or two explained rejected attempts'],
            validate_proposals([self.entry], self.s9),
        )

    def test_candidate_must_bind_edited_sense_before_critic_call(self):
        changed = dict(self.entry['meanings'][0], register=['разговорное'])
        revised_entry = dict(self.entry, meanings=[changed])
        reports = [
            [{'word': 'know', 'after': revised_entry, 'entry_proposals': [{'edits': []}]}],
            [{'word': 'know', 'meaning_proposals': [{'meaning_index': 1, 'after_meaning': changed}]}],
        ]
        for author in reports:
            with self.subTest(author=author):
                self.candidate.pop('sense_after', None)
                self.assertEqual(
                    ['know/1: example sense_after must match the stage07 proposal'],
                    validate_proposals([self.entry], self.s9, author),
                )
                self.candidate['sense_after'] = changed
                self.assertEqual([], validate_proposals([self.entry], self.s9, author))

    def test_one_unresolved_sense_does_not_block_another_approved_example(self):
        self.s10[0]['decision'] = 'review_required'
        self.assertEqual([], self.errors())
        self.assertEqual(1, len(approved_changes([self.entry], self.s9, self.s10)))

    def test_pending_attempts_are_not_manifest_changes(self):
        check = self.s9[0]['checks'][0]
        check.pop('generated_example')
        check['no_candidate_reason'] = 'Two constructions drift to knowledge rather than experience.'
        check['rejected_attempts'] = [{'en': 'A', 'ru': 'Б', 'problem': 'Wrong sense'}, {'en': 'C', 'ru': 'Д', 'problem': 'Unnatural collocation'}]
        self.s10[0]['example_reviews'] = []
        self.s10[0]['decision'] = 'review_required'
        self.assertEqual([], self.errors())
        self.assertEqual([], approved_changes([self.entry], self.s9, self.s10))

if __name__ == '__main__':
    unittest.main()
