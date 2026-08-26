# -*- coding: utf-8 -*-
"""
Subagent 1: Structure Auditor
Subagent 6: Duplicate & Metadata Auditor
"""
import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

def audit_structure_and_duplicates(filepath):
    print(f"=== Running Subagent 1 & 6: Structure, Duplicate & Metadata Audit on {filepath} ===")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    report = {
        'total_entries': len(data),
        'structural_issues': [],
        'duplicates': [],
        'metadata_issues': [],
        'statistics': {
            'words_count': len(data),
            'unique_words_count': len(set(d.get('word') for d in data if 'word' in d)),
            'total_meanings': 0,
            'total_examples': 0,
            'total_phrases': 0,
            'words_with_phrases': 0
        }
    }

    seen_entries = {}
    valid_pos_set = {'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'numeral', 'article', 'particle', 'other', 'adverb/adjective', 'noun/adverb', 'noun/verb'}

    for idx, item in enumerate(data):
        # Check basic schema
        if not isinstance(item, dict):
            report['structural_issues'].append({
                'index': idx,
                'type': 'invalid_entry_type',
                'description': f'Entry at index {idx} is not a dictionary'
            })
            continue

        word = item.get('word')
        if not word or not isinstance(word, str):
            report['structural_issues'].append({
                'index': idx,
                'type': 'missing_or_invalid_word',
                'description': f'Entry at index {idx} has missing or non-string word'
            })
            continue

        # Duplicate check (exact match on all fields)
        item_str = json.dumps(item, sort_keys=True, ensure_ascii=False)
        if item_str in seen_entries:
            report['duplicates'].append({
                'word': word,
                'first_seen_index': seen_entries[item_str],
                'duplicate_index': idx,
                'exact_duplicate': True
            })
        else:
            seen_entries[item_str] = idx

        # Metadata checks
        cefr = item.get('cefr')
        if cefr and not isinstance(cefr, str):
            report['metadata_issues'].append({
                'word': word,
                'field': 'cefr',
                'issue': 'non_string_cefr',
                'value': cefr
            })

        freq = item.get('frequency_rank')
        if freq is not None and not isinstance(freq, (int, float)):
            report['metadata_issues'].append({
                'word': word,
                'field': 'frequency_rank',
                'issue': 'non_numeric_freq',
                'value': freq
            })

        # Meanings structure check
        meanings = item.get('meanings')
        if meanings is None or not isinstance(meanings, list):
            report['structural_issues'].append({
                'word': word,
                'type': 'missing_or_invalid_meanings',
                'description': 'meanings is missing or not a list'
            })
        else:
            if len(meanings) == 0:
                report['structural_issues'].append({
                    'word': word,
                    'type': 'empty_meanings_list',
                    'description': 'meanings list is empty'
                })

            for m_idx, m in enumerate(meanings, 1):
                report['statistics']['total_meanings'] += 1
                if not isinstance(m, dict):
                    report['structural_issues'].append({
                        'word': word,
                        'meaning_index': m_idx,
                        'type': 'invalid_meaning_type',
                        'description': 'meaning element is not a dict'
                    })
                    continue

                # id check
                m_id = m.get('id')
                if m_id != m_idx:
                    report['structural_issues'].append({
                        'word': word,
                        'meaning_index': m_idx,
                        'type': 'non_sequential_id',
                        'found': m_id,
                        'expected': m_idx
                    })

                # POS check
                pos = m.get('partOfSpeech')
                if not pos or pos not in valid_pos_set:
                    report['structural_issues'].append({
                        'word': word,
                        'meaning_id': m_id,
                        'type': 'invalid_part_of_speech',
                        'value': pos
                    })

                # Translation check
                trans = m.get('translation')
                if trans is None or not isinstance(trans, str):
                    report['structural_issues'].append({
                        'word': word,
                        'meaning_id': m_id,
                        'type': 'invalid_translation_type',
                        'value': trans
                    })

                # Register check
                reg = m.get('register')
                if reg is not None:
                    if not isinstance(reg, list):
                        report['structural_issues'].append({
                            'word': word,
                            'meaning_id': m_id,
                            'type': 'invalid_register_type',
                            'description': 'register should be a list of strings if present'
                        })

                # Examples check
                exs = m.get('examples')
                if exs is not None:
                    if not isinstance(exs, list):
                        report['structural_issues'].append({
                            'word': word,
                            'meaning_id': m_id,
                            'type': 'invalid_examples_type',
                            'description': 'examples should be a list'
                        })
                    else:
                        for ex_idx, ex in enumerate(exs):
                            report['statistics']['total_examples'] += 1
                            if not isinstance(ex, dict):
                                report['structural_issues'].append({
                                    'word': word,
                                    'meaning_id': m_id,
                                    'example_index': ex_idx,
                                    'type': 'invalid_example_element',
                                    'description': 'example item is not a dict'
                                })
                                continue
                            if 'en' not in ex or 'ru' not in ex:
                                report['structural_issues'].append({
                                    'word': word,
                                    'meaning_id': m_id,
                                    'example_index': ex_idx,
                                    'type': 'example_missing_keys',
                                    'keys_found': list(ex.keys())
                                })
                            # Check for misplaced register inside example
                            if 'register' in ex:
                                report['structural_issues'].append({
                                    'word': word,
                                    'meaning_id': m_id,
                                    'example_index': ex_idx,
                                    'type': 'misplaced_register_in_example',
                                    'description': 'register field found inside example dict'
                                })

        # Phrases structure check
        phrases = item.get('phrases')
        if phrases is not None:
            if not isinstance(phrases, list):
                report['structural_issues'].append({
                    'word': word,
                    'type': 'invalid_phrases_type',
                    'description': 'phrases should be a list'
                })
            else:
                if len(phrases) > 0:
                    report['statistics']['words_with_phrases'] += 1
                for p_idx, ph in enumerate(phrases):
                    report['statistics']['total_phrases'] += 1
                    if not isinstance(ph, dict):
                        report['structural_issues'].append({
                            'word': word,
                            'phrase_index': p_idx,
                            'type': 'invalid_phrase_element',
                            'description': 'phrase item is not a dict'
                        })
                        continue
                    if 'en' not in ph or 'ru' not in ph:
                        report['structural_issues'].append({
                            'word': word,
                            'phrase_index': p_idx,
                            'type': 'phrase_missing_keys',
                            'keys_found': list(ph.keys())
                        })
                    if 'register' in ph:
                        report['structural_issues'].append({
                            'word': word,
                            'phrase_index': p_idx,
                            'type': 'misplaced_register_in_phrase',
                            'description': 'register field found inside phrase dict'
                        })

    with open('STRUCTURAL_ISSUES.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"Structure & Duplicates Audit Completed:")
    print(f"  Total words: {report['statistics']['words_count']}")
    print(f"  Unique words: {report['statistics']['unique_words_count']}")
    print(f"  Structural issues found: {len(report['structural_issues'])}")
    print(f"  Exact duplicates found: {len(report['duplicates'])}")
    print(f"  Metadata issues found: {len(report['metadata_issues'])}")
    print(f"  Total meanings: {report['statistics']['total_meanings']}")
    print(f"  Total examples: {report['statistics']['total_examples']}")
    print(f"  Total phrases: {report['statistics']['total_phrases']}")
    print(f"  Words with phrases: {report['statistics']['words_with_phrases']}")
    return report

if __name__ == '__main__':
    audit_structure_and_duplicates('oxford_5000_updated.json')
