# -*- coding: utf-8 -*-
"""
Audit all Oxford 5000 words that should have multiple parts of speech.
Ensure no second section (2. v, 2. n, 2. a, etc.) was dropped.
"""
import json, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# List of critical words with multiple POS to check
critical_check = ['act', 'air', 'back', 'balance', 'bear', 'beat', 'block', 'board', 'book', 'call', 'care', 'case', 'cast', 'catch', 'cause', 'charge', 'check', 'clear', 'close', 'cook', 'cost', 'cover', 'cross', 'cry', 'cure', 'cut', 'deal', 'demand', 'design', 'desire', 'die', 'doubt', 'draw', 'dress', 'drink', 'drive', 'drop', 'end', 'escape', 'excuse', 'face', 'fall', 'fear', 'feel', 'fight', 'figure', 'fill', 'film', 'finish', 'fire', 'fish', 'fit', 'fix', 'fly', 'fold', 'force', 'form', 'free', 'gain', 'game', 'glance', 'guide', 'hand', 'handle', 'hang', 'harm', 'hate', 'head', 'hear', 'heat', 'help', 'hide', 'hit', 'hold', 'hope', 'hunt', 'hurry', 'hurt', 'iron', 'join', 'judge', 'jump', 'keep', 'kick', 'kiss', 'knock', 'know', 'lack', 'land', 'last', 'laugh', 'lead', 'leak', 'lean', 'leap', 'leave', 'lie', 'lift', 'light', 'like', 'limit', 'line', 'link', 'load', 'loan', 'lock', 'look', 'lose', 'love', 'mail', 'make', 'mark', 'market', 'match', 'matter', 'mean', 'mind', 'miss', 'mix', 'move', 'name', 'need', 'note', 'notice', 'number', 'offer', 'open', 'order', 'pack', 'paint', 'park', 'part', 'pass', 'pay', 'pick', 'place', 'plan', 'plant', 'play', 'point', 'post', 'press', 'price', 'print', 'pull', 'push', 'question', 'race', 'rain', 'raise', 'reach', 'record', 'refuse', 'regard', 'remain', 'remark', 'rent', 'repair', 'repeat', 'reply', 'report', 'request', 'rest', 'result', 'return', 'ride', 'ring', 'rise', 'risk', 'roll', 'rule', 'run', 'rush', 'sail', 'save', 'say', 'score', 'scream', 'search', 'seat', 'secure', 'see', 'sense', 'serve', 'service', 'set', 'settle', 'shade', 'shake', 'shape', 'share', 'shift', 'shine', 'ship', 'shock', 'shoot', 'shop', 'shout', 'show', 'shut', 'sign', 'signal', 'silence', 'sink', 'sit', 'slip', 'smoke', 'snow', 'sound', 'space', 'spare', 'speak', 'speed', 'spell', 'spend', 'spill', 'spin', 'split', 'spot', 'spread', 'spring', 'stand', 'star', 'stare', 'start', 'state', 'stay', 'steal', 'steam', 'step', 'stick', 'stop', 'store', 'storm', 'strain', 'stream', 'stretch', 'strike', 'string', 'strip', 'stroke', 'struggle', 'study', 'stuff', 'subject', 'suit', 'supply', 'support', 'suppose', 'surprise', 'surround', 'suspect', 'swear', 'sweep', 'swim', 'swing', 'switch', 'talk', 'taste', 'tax', 'teach', 'tear', 'tell', 'test', 'thank', 'tie', 'time', 'tip', 'tire', 'title', 'touch', 'tour', 'track', 'trade', 'train', 'transfer', 'transport', 'trap', 'travel', 'treat', 'trick', 'trip', 'trouble', 'trust', 'try', 'turn', 'twist', 'type', 'use', 'value', 'view', 'visit', 'voice', 'vote', 'wait', 'wake', 'walk', 'wall', 'want', 'warm', 'warn', 'wash', 'waste', 'watch', 'water', 'wave', 'wear', 'weather', 'welcome', 'wet', 'wheel', 'whip', 'whisper', 'whistle', 'win', 'wind', 'wipe', 'wish', 'wonder', 'work', 'worry', 'wrap', 'wreck', 'yield']

words_by_name = {item['word']: item for item in oxford_data}

missing_pos = []
for cw in critical_check:
    if cw in words_by_name:
        it = words_by_name[cw]
        poses = set(m['partOfSpeech'] for m in it['meanings'])
        if len(poses) < 2 and len(it['meanings']) > 5:
            # Check if this word typically has both noun and verb in English
            missing_pos.append((cw, list(poses), len(it['meanings'])))

print(f"Checked {len(critical_check)} critical words. Single POS with >5 meanings: {len(missing_pos)}")
for it in missing_pos[:15]:
    print(f"  Word '{it[0]}': POS={it[1]}, meanings={it[2]}")
