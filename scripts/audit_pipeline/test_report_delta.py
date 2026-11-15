import copy
import unittest
from example_contract import digest, DIMENSIONS, binding
from report_delta import patch, expand_records
from entry_contract import group_after, entry_binding, issue_target_errors, CRITERIA
from meaning_contract import combined_changes, validate_meanings


class DeltaTests(unittest.TestCase):
    def test_sequential_appends_have_distinct_targets(self):
        original = {'phrases': []}
        edits = [{'op': 'add', 'path': '/phrases/-', 'after': {'id': i}} for i in (1, 2)]
        self.assertEqual(patch(original, edits), {'phrases': [{'id': 1}, {'id': 2}]})
        self.assertEqual(original, {'phrases': []})
        with self.assertRaises(ValueError):
            patch(original, edits + [{'op': 'replace', 'path': '/phrases/0/id', 'before': 1, 'after': 3}])

    def test_stale_and_overlapping_paths(self):
        value={'x':{'a':1}}
        with self.assertRaises(ValueError):patch(value,[{'op':'replace','path':'/x/a','before':2,'after':3}])
        with self.assertRaises(ValueError):patch(value,[{'op':'replace','path':'/x','before':{'a':1},'after':{'a':2}}, {'op':'replace','path':'/x/a','before':2,'after':3}])
        self.assertEqual(value,{'x':{'a':1}})

    def test_no_delete_and_negative_index(self):
        for edit in [{'op':'remove','path':'/a/0'}, {'op':'replace','path':'/a/-1','before':1,'after':2}]:
            with self.assertRaises(ValueError):patch({'a':[1]},[edit])

    def test_unchanged_repair_does_not_generate_fields(self):
        base={'word':'x','confidence':.8,'reason':'actual authored reason'}
        req={'role':'06','entries':[{'word':'x'}],'repair':{'rejected_output':[base]}}
        result=expand_records([{'word':'x','base_sha256':digest(base),'edits':[]}],req)
        self.assertEqual(result,[base]);self.assertIsNot(result[0],base)
        with self.assertRaises(ValueError):expand_records([{'word':'x','base_sha256':'wrong','edits':[]}],req)

    def test_repair_changes_only_named_field(self):
        base={'word':'x','confidence':'high','reason':'Preserve explanation'}
        req={'role':'06','entries':[{'word':'x'}],'repair':{'rejected_output':[base]}}
        wire={'word':'x','base_sha256':digest(base),'edits':[{'op':'replace','path':'/confidence','before':'high','after':.91}]}
        result=expand_records([wire],req)
        self.assertEqual(result,[dict(base,confidence=.91)])
        self.assertEqual(base['confidence'],'high')

    def test_compact_07_roundtrip(self):
        entry={'word':'x','meanings':[{'translation':'old','examples':[],'primary':True}]}
        wire={'word':'x','meaning_proposals':[{'meaning_index':1,'reason':'authored','sources':[], 'edits':[{'op':'replace','path':'/translation','before':'old','after':'new'}]}]}
        result=expand_records([wire],{'role':'07','entries':[entry]})[0]
        self.assertEqual(result['before'],entry)
        self.assertEqual(result['after']['meanings'][0]['translation'],'new')
        self.assertEqual(result['meaning_proposals'][0]['before_meaning'],entry['meanings'][0])
        self.assertNotIn('before',wire)

    def test_unrepresented_snapshot_change_rejected(self):
        e={'word':'x','meanings':[],'phrases':[]}
        with self.assertRaises(ValueError):expand_records([{'word':'x','before':e,'after':dict(e,phrases=[1])}],{'role':'07','entries':[e]})


class AtomicGroupTests(unittest.TestCase):
    def setUp(self):
        self.entry={'word':'own','meanings':[{'id':1,'translation':'own; own up','partOfSpeech':'verb','register':[],'primary':True,'examples':[]}], 'phrases':[]}
        source={'url':'https://example.test/fixture','quote':'own up: admit'}
        self.group={'reason':'Separate phrasal sense without losing it','confidence':.9,'edits':[
            {'op':'replace','path':'/meanings/0/translation','before':'own; own up','after':'own','reason':'Keep base verb sense','sources':[source]},
            {'op':'add','path':'/phrases/-','after':{'id':1,'phrase':'own up','partOfSpeech':'verb','translation':'admit','register':[],'examples':[]},'reason':'Preserve phrasal sense separately','sources':[source]}]}
        self.author={'word':'own','entry_proposals':[self.group],'before':copy.deepcopy(self.entry),'after':group_after(self.entry,self.group)}
        self.editor={'word':'own','checks':[{'meaning_index':1,'examples_checked':0,'no_candidate_reason':'Fixture ambiguity','rejected_attempts':[{'en':'one','ru':'one','problem':'one'},{'en':'two','ru':'two','problem':'two'}]}]}
        self.review={'proposal_sha256':digest(entry_binding(self.entry,self.group)),'verdict':'approved','confidence':.95,'judgments':{key:{'pass':True,'reason':'Fixture '+key} for key in CRITERIA}}
        self.critic={'word':'own','decision':'review_required','entry_reviews':[self.review],'example_reviews':[]}

    def test_linked_edits_are_one_manifest_change(self):
        changes=combined_changes([self.entry],[self.author],[self.editor],[self.critic])
        self.assertEqual(len(changes),1)
        self.assertEqual(changes[0]['after_entry']['meanings'][0]['translation'],'own')
        self.assertEqual(changes[0]['after_entry']['phrases'][0]['phrase'],'own up')
        self.assertEqual(self.entry['phrases'],[])

    def test_append_initializes_optional_phrases_without_mutating_before(self):
        entry=copy.deepcopy(self.entry)
        del entry['phrases']
        result=group_after(entry,self.group)
        self.assertEqual(result['phrases'][0]['phrase'],'own up')
        self.assertNotIn('phrases',entry)

    def test_multiple_appends_still_reject_duplicate_phrase_ids(self):
        group=copy.deepcopy(self.group)
        group['edits'].append(copy.deepcopy(group['edits'][1]))
        with self.assertRaisesRegex(ValueError,'Duplicate phrase IDs'):
            group_after(self.entry,group)

    def test_rejection_defers_entire_group(self):
        self.review['verdict']='rejected';self.review['judgments']['information_preserved']['pass']=False
        self.assertEqual(combined_changes([self.entry],[self.author],[self.editor],[self.critic]),[])

    def test_change_invalidates_independent_approval(self):
        self.group['edits'][1]['after']['translation']='different'
        self.author['after']=group_after(self.entry,self.group)
        self.assertTrue(any('Stale' in e for e in validate_meanings([self.entry],[self.author],[self.editor],[self.critic])))

    def test_examples_ids_and_primary_protected(self):
        for path,value in [('/meanings/0/primary',False),('/meanings/0/examples',[]),('/meanings/0/id',9)]:
            group=copy.deepcopy(self.group);group['edits']=[{'op':'replace','path':path,'before':None,'after':value,'reason':'x','sources':[{'url':'https://example.test','quote':'x'}]}]
            with self.assertRaises(ValueError):group_after(self.entry,group)

    def test_missing_independent_judgment_rejected(self):
        del self.review['judgments']['information_preserved']
        self.assertTrue(validate_meanings([self.entry],[self.author],[self.editor],[self.critic]))

    def test_typed_issue_addresses(self):
        base={'problem':'Specific phrase issue','required_action':'Check phrase meaning'}
        entry=self.author['after']
        self.assertEqual(issue_target_errors(dict(base,target={'kind':'phrase','index':1}),entry),[])
        self.assertTrue(issue_target_errors(dict(base,target={'kind':'phrase','index':2}),entry))
        self.assertTrue(issue_target_errors(dict(base,meaning_index=None),entry))
        self.assertEqual(issue_target_errors(dict(base,target={'kind':'field','path':'/word'}),entry),[])
        self.assertTrue(issue_target_errors(dict(base,target={'kind':'field','path':'/missing'}),entry))
        self.assertEqual(issue_target_errors(dict(base,target={'kind':'missing_meaning','description':'Missing noun sense'}),entry),[])

if __name__=='__main__':unittest.main()

class ApplicationTests(unittest.TestCase):
    def test_atomic_entry_and_stale_second_change_never_mutate_input(self):
        from apply_examples_manifest import apply_reviewed
        entry={'word':'x','meanings':[{'examples':[]}],'phrases':[]}
        after=copy.deepcopy(entry);after['phrases']=[{'phrase':'x up'}]
        changes=[{'word':'x','before_entry':copy.deepcopy(entry),'after_entry':after}]
        result,reverse=apply_reviewed([entry],changes)
        self.assertEqual(result,[after]);self.assertEqual(entry['phrases'],[])
        restored,_=apply_reviewed(result,reverse)
        self.assertEqual(restored,[entry])
        with self.assertRaises(ValueError):apply_reviewed([entry],changes+[{'word':'x','meaning_index':0,'before_examples':[],'after_example':{'en':'x','ru':'x'}}])
        self.assertEqual(entry['phrases'],[])
        changes[0]['before_entry']['word']='different'
        with self.assertRaises(ValueError):apply_reviewed([entry],changes)

    def test_atomic_write_preserves_file_permissions(self):
        from apply_examples_manifest import atomic_write
        from pathlib import Path
        import tempfile
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'fixture.json';path.write_bytes(b'old');path.chmod(0o640)
            atomic_write(path,b'new')
            self.assertEqual(path.read_bytes(),b'new')
            self.assertEqual(path.stat().st_mode & 0o777,0o640)
            self.assertEqual(len(list(Path(folder).iterdir())),1)

    def test_dispatch_materializes_twenty_worker_records(self):
        import tempfile,json
        from pathlib import Path
        from types import SimpleNamespace
        from unittest.mock import patch as mock_patch
        from dispatch_roles import run_worker
        entries=[{'word':str(i),'meanings':[]} for i in range(20)]
        with tempfile.TemporaryDirectory() as folder:
            request=Path(folder)/'input.json';output=Path(folder)/'stage_07.json'
            request.write_text(json.dumps({'role':'07','entries':entries}))
            def worker(*args,**kwargs):
                output.write_text(json.dumps([{'word':e['word'],'decision':'оставить','reason':'authored '+e['word'],'confidence':.9} for e in entries]))
                return SimpleNamespace(returncode=0)
            with mock_patch('dispatch_roles.subprocess.run',side_effect=worker):run_worker(['fixture'],'07',request,output)
            records=json.loads(output.read_text())
            self.assertEqual([r['before'] for r in records],entries)
            self.assertEqual([r['after'] for r in records],entries)
            self.assertNotIn('before',json.loads(output.with_suffix('.wire.json').read_text())[0])

class IndependentAcceptanceTests(unittest.TestCase):
    setUp = AtomicGroupTests.setUp
    def add_independent_example(self):
        meaning={'id':2,'translation':'fixture sense','partOfSpeech':'verb','register':[],'primary':False,'examples':[]}
        self.entry['meanings'].append(copy.deepcopy(meaning))
        self.author['before']=copy.deepcopy(self.entry)
        self.author['after']=group_after(self.entry,self.group)
        self.review['proposal_sha256']=digest(entry_binding(self.entry,self.group))
        candidate={'en':'I own a car.','ru':'У меня есть машина.','origin':'generated','before_examples':[],
                   'target_lemma':'own','target_form':'own','usage_status':'current','contemporary_explanation':'Fixture ordinary verb.',
                   'sense_explanation':'Fixture ownership.','translation_explanation':'Fixture equivalent.','contrast':'Fixture separate sense.',
                   'source_searches':[{'file':'fixture.pdf','query':'own','result':'Fixture search.'}]}
        self.editor['checks'].append({'meaning_index':2,'examples_checked':0,'generated_example':candidate})
        self.critic['example_reviews']=[{'meaning_index':2,'candidate_sha256':digest(binding(self.entry,2,candidate)),
            'verdict':'approved','confidence':.9,'judgments':{k:{'pass':True,'reason':'Fixture '+k} for k in DIMENSIONS}}]

    def test_rejected_group_keeps_independent_approved_addition(self):
        self.add_independent_example();self.review['verdict']='rejected'
        result=combined_changes([self.entry],[self.author],[self.editor],[self.critic])
        self.assertEqual(len(result),1);self.assertEqual(result[0]['meaning_index'],1)
        self.assertNotIn('after_entry',result[0])

    def test_existing_example_replacement_is_explicitly_deferred(self):
        self.add_independent_example()
        old=[{'en':'Old fixture.','ru':'Старый пример.'}]
        self.entry['meanings'][1]['examples']=old
        self.author['before']=copy.deepcopy(self.entry);self.author['after']=group_after(self.entry,self.group)
        self.review['proposal_sha256']=digest(entry_binding(self.entry,self.group))
        check=self.editor['checks'][1];check['examples_checked']=1;check['generated_example']['before_examples']=old
        self.critic['example_reviews'][0]['candidate_sha256']=digest(binding(self.entry,2,check['generated_example']))
        deferred=[];result=combined_changes([self.entry],[self.author],[self.editor],[self.critic],deferred)
        self.assertEqual(result[0]['after_entry']['meanings'][1]['examples'],old)
        self.assertEqual(deferred[0]['meaning_index'],2)

class PhraseSyntaxEvidenceTests(unittest.TestCase):
    def test_phrase_pos_uses_unchanged_phrase_as_evidence(self):
        entry={'word':'home','meanings':[], 'phrases':[{'id':1,'phrase':'There is no place like home.','partOfSpeech':'noun','translation':'fixture','examples':[],'register':[]}]}
        group={'reason':'Full sentence has subject and predicate','confidence':.95,'edits':[{'op':'replace','path':'/phrases/0/partOfSpeech','before':'noun','after':'sentence','reason':'There is is the finite predicate in this exact saved phrase','sources':[]}]}
        self.assertEqual(group_after(entry,group)['phrases'][0]['partOfSpeech'],'sentence')
        group['edits'][0].update(path='/phrases/0/translation',before='fixture',after='new translation')
        with self.assertRaises(ValueError):group_after(entry,group)

    def test_changed_phrase_text_cannot_use_source_free_pos(self):
        entry={'word':'home','meanings':[], 'phrases':[{'id':1,'phrase':'Old fixture','partOfSpeech':'noun','translation':'fixture','examples':[],'register':[]}]}
        group={'reason':'fixture','confidence':.9,'edits':[
          {'op':'replace','path':'/phrases/0/partOfSpeech','before':'noun','after':'sentence','reason':'fixture','sources':[]},
          {'op':'replace','path':'/phrases/0/phrase','before':'Old fixture','after':'New fixture.','reason':'fixture','sources':[{'url':'https://example.test','quote':'New fixture.'}]}]}
        with self.assertRaises(ValueError):group_after(entry,group)
