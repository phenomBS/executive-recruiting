import re

with open('src/data/mockData.ts', 'r') as f:
    content = f.read()

# Fix double emiScore for e-1
content = re.sub(r"emiScore: 84,\s*behavioralScore: 95,\s*emiScore: null,", r"emiScore: null,\n    behavioralScore: 95,", content)

with open('src/data/mockData.ts', 'w') as f:
    f.write(content)
