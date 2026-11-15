import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from source_search import search, source_data


class SourceSearchTests(unittest.TestCase):
    def test_word_boundaries(self):
        result=search(['other mother the THE'], 'the')
        self.assertEqual(result['match_count'],2)

    def test_phrases_and_original_quotes(self):
        text='She used\nto live here.'
        result=search([text], 'used to')
        self.assertEqual(result['match_count'],1)
        self.assertIn(result['locations'][0]['quote'],text)

    def test_truncation_and_full_location(self):
        result=search(['same same same same'], 'same', 2)
        self.assertEqual(result['match_count'],4)
        self.assertTrue(result['truncated'])
        self.assertEqual(len(result['locations']),2)
        self.assertEqual(result['locations'][0]['location'],1)

    def test_cache_reuse_and_invalidation(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'book.pdf'; source.write_bytes(b'first')
            cache=Path(tmp)/'cache'
            with patch('source_search.extract',return_value=['original']) as extraction:
                first,_=source_data(source,cache)
                self.assertEqual(source_data(source,cache)[0],first)
                self.assertEqual(extraction.call_count,1)
                source.write_bytes(b'changed')
                source_data(source,cache)
                self.assertEqual(extraction.call_count,2)

    def test_empty_extraction_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'book.pdf';source.write_bytes(b'pdf')
            with patch('source_search.extract',return_value=[None,'',' ']):
                with self.assertRaisesRegex(ValueError,'OCR required'):
                    source_data(source,Path(tmp)/'cache')

class PacketViewTests(unittest.TestCase):
    def test_small_view_preserves_sources_and_flags_hidden_hits(self):
        from source_search import packet_view
        packet={'sources':[{'file':'a.pdf'},{'file':'b.pdf'}], 'contract':'mechanical',
                'records':[{'word':'word','search_results':[
                    {'file':f,'match_count':3,'locations':[{'page':n,'quote':'original'} for n in [1,2,3]],'truncated':False}
                    for f in ['a.pdf','b.pdf']]}]}
        small=packet_view(packet,'word',1)
        self.assertEqual(len(small['records'][0]['search_results']),2)
        self.assertTrue(all(r['truncated'] for r in small['records'][0]['search_results']))
        self.assertEqual(len(packet['records'][0]['search_results'][0]['locations']),3)
        self.assertEqual(len(packet_view(packet,'word',3)['records'][0]['search_results'][0]['locations']),3)
        with self.assertRaises(ValueError):packet_view(packet,'missing')
