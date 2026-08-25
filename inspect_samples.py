import json

with open('dictionary_evaluation_500.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Sample of evaluated words (first 10):')
for d in data[:10]:
    print('='*70)
    print(f"WORD: {d['word']} ({d['pos']})")
    print(f"  Oxford 5000 [{d['oxford_5000']['score']}/10]: {d['oxford_5000']['meanings']}")
    print(f"  CLD [{d['cld']['score']}/10]: {d['cld']['meanings']}")
    print(f"  Sam [{d['sam']['score']}/10]: {d['sam']['meanings']}")
    print(f"  Muller A4 [{d['muller_a4']['score']}/10]: {d['muller_a4']['meanings']}")
    print(f"  Muller 300k [{d['muller_300k']['score']}/10]: {d['muller_300k']['meanings']}")
    print(f"  Shkolnik [{d['shkolnik']['score']}/10]: {d['shkolnik']['meanings']}")
    print(f"  Muller AST [{d['muller_ast']['score']}/10]: {d['muller_ast']['meanings']}")
