import io, json

data = json.load(io.open('src/data/oxford_5000.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 500: {data[500]['word']}")
print(f"Word 999: {data[999]['word']}")
