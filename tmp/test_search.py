import io

with io.open('tmp/muller_full_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

print('Total chars:', len(text))

# Find abandon
idx = text.find('abandon')
print('abandon at:', idx)

snippet = text[idx:idx+400]
out = io.open('tmp/snippet_abandon.txt', 'w', encoding='utf-8')
out.write(snippet)
out.close()
print('done')
