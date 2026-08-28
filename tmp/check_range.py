import io, json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 0: {data[0]['word']}")
print(f"Word 499: {data[499]['word']}")
print(f"Word 500: {data[500]['word']}")
