import copy
import unittest
from example_contract import DIMENSIONS, binding, digest
from meaning_contract import CRITERIA, combined_changes, meaning_binding, validate_meanings


class MeaningContractTests(unittest.TestCase):
    def setUp(self):
        self.entry = {'word': 'over', 'meanings': [{'id': 1, 'primary': False, 'partOfSpeech': 'noun', 'translation': 'переход на приём', 'register': ['радиосвязь'], 'examples': []}]}
        before = copy.deepcopy(self.entry['meanings'][0])
        after = dict(before, partOfSpeech='interjection', translation='приём!; конец передачи, жду ответа')
        self.proposal = {'meaning_index': 1, 'before_meaning': before, 'after_meaning': after,
                         'reason': 'Radio formula is an interjection.',
                         'sources': [{'url': 'https://example.test/dictionary', 'quote': 'over interjection'}]}
        self.s7 = [{'word': 'over', 'before': copy.deepcopy(self.entry), 'after': copy.deepcopy(self.entry), 'meaning_proposals': [self.proposal]}]
        self.s7[0]['after']['meanings'][0] = copy.deepcopy(after)
        self.s9 = [{'word': 'over', 'checks': [{'meaning_index': 1, 'examples_checked': 0}]}]
        self.review = {'meaning_index': 1, 'proposal_sha256': digest(meaning_binding(self.entry, self.proposal)),
                       'verdict': 'approved', 'confidence': .95,
                       'judgments': {k: {'pass': True, 'reason': 'Test fixture judgment: '+k} for k in CRITERIA}}
        self.s10 = [{'word': 'over', 'decision': 'review_required', 'meaning_reviews': [self.review], 'example_reviews': []}]

    def errors(self):
        return validate_meanings([self.entry], self.s7, self.s9, self.s10)

    def test_valid_separately_reviewed_clarification(self):
        self.assertEqual([], self.errors())

    def test_no_unreviewed_definition_change(self):
        self.s10[0]['meaning_reviews'] = []
        self.assertTrue(self.errors())

    def test_cannot_silently_change_primary(self):
        self.proposal['after_meaning']['primary'] = True
        self.assertTrue(self.errors())

    def test_cannot_replace_examples_in_definition_proposal(self):
        self.proposal['after_meaning']['examples'] = [{'en': 'Bad', 'ru': 'Bad'}]
        self.assertTrue(self.errors())

    def test_before_and_entry_snapshots_are_checked(self):
        self.s7[0]['after']['meanings'][0]['translation'] = 'Different'
        self.assertTrue(self.errors())

    def test_changed_pos_invalidates_review(self):
        self.proposal['after_meaning']['partOfSpeech'] = 'adverb'
        self.assertTrue(any('stale' in e for e in self.errors()))

    def test_contradictory_judgment_cannot_authorize_definition(self):
        self.review['judgments']['source_support']['pass'] = False
        self.assertTrue(self.errors())

    def test_changing_source_invalidates_meaning_review(self):
        self.proposal['sources'][0]['quote'] = 'Different source text'
        self.assertTrue(any('stale' in e for e in self.errors()))

    def test_sources_must_contain_a_quote(self):
        self.proposal['sources'][0].pop('quote')
        self.assertTrue(self.errors())

    def add_example(self):
        candidate = {'en': 'Can you hear me? Over.', 'ru': 'Вы меня слышите? Приём.',
                     'origin': 'generated', 'target_lemma': 'over', 'target_form': 'Over',
                     'sense_after': copy.deepcopy(self.proposal['after_meaning']), 'before_examples': [],
                     'usage_status': 'current', 'contemporary_explanation': 'Current radio formula.',
                     'sense_explanation': 'The speaker finishes a radio turn.', 'translation_explanation': 'Приём marks turn ending.',
                     'contrast': 'Radio turn, not physical movement.',
                     'source_searches': [{'file': 'radio.pdf', 'query': 'over radio', 'result': 'Source test fixture.'}]}
        self.s9[0]['checks'][0]['generated_example'] = candidate
        self.s10[0]['example_reviews'] = [{'meaning_index': 1, 'candidate_sha256': digest(binding(self.entry, 1, candidate)),
            'verdict': 'approved', 'confidence': .95, 'judgments': {k: {'pass': True, 'reason': 'Test example judgment '+k} for k in DIMENSIONS}}]
        return candidate

    def test_example_and_pos_are_combined_as_one_reviewed_change(self):
        self.add_example()
        changes = combined_changes([self.entry], self.s7, self.s9, self.s10)
        self.assertEqual(1, len(changes))
        self.assertEqual('interjection', changes[0]['after_meaning']['partOfSpeech'])
        self.assertEqual('Can you hear me? Over.', changes[0]['after_meaning']['examples'][0]['en'])
        self.assertEqual([], self.entry['meanings'][0]['examples'])

    def test_rejected_definition_blocks_its_otherwise_approved_example(self):
        self.add_example()
        self.review['verdict'] = 'rejected'
        self.review['judgments']['source_support']['pass'] = False
        self.assertEqual([], combined_changes([self.entry], self.s7, self.s9, self.s10))

    def test_example_cannot_silently_use_another_proposed_sense(self):
        candidate = self.add_example()
        candidate['sense_after']['translation'] = 'Непроверенный смысл'
        self.assertTrue(self.errors())


if __name__ == '__main__':
    unittest.main()
