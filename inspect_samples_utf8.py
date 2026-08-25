import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('dictionary_evaluation_500.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for d in data[:8]:
    print('='*70)
    print(f"СЛОВО: {d['word']} [{d['pos']}]")
    print(f"  1. Oxford 5000 ({d['oxford_5000']['score']}/10): {', '.join(d['oxford_5000']['meanings'][:5])}")
    print(f"  2. CLD ({d['cld']['score']}/10): {', '.join(d['cld']['meanings'][:5])}")
    print(f"  3. Sam ({d['sam']['score']}/10): {', '.join(d['sam']['meanings'][:5])}")
    print(f"  4. Muller A4 ({d['muller_a4']['score']}/10): {', '.join(d['muller_a4']['meanings'][:5])}")
    print(f"  5. Muller 300k ({d['muller_300k']['score']}/10): {', '.join(d['muller_300k']['meanings'][:5])}")
    print(f"  6. Shkolnik ({d['shkolnik']['score']}/10): {', '.join(d['shkolnik']['meanings'][:5])}")
    print(f"  7. Muller AST ({d['muller_ast']['score']}/10): {', '.join(d['muller_ast']['meanings'][:5])}")
