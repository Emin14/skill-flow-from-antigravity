import io, json

data = json.load(io.open('src/data/oxford_5000.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 2000: {data[2000]['word']}")
print(f"Word 2499: {data[2499]['word']}")
print(f"Word 2500: {data[2500]['word']}")
