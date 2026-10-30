import re

with open('src/data/mockData.ts', 'r') as f:
    content = f.read()

# I will target each candidate ID specifically and replace their avatarUrl
photos = {
    'c-1': "'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&q=80'", # John
    'e-1': "'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80'", # Jensen
    'e-2': "'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80'", # Colette
    'e-3': "'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80'", # Debora
    'e-4': "'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80'", # Timothy
}

def replace_avatar(m):
    id_str = m.group(1)
    if id_str in photos:
        return f"id: '{id_str}',\n{m.group(2)}\n    avatarUrl: {photos[id_str]},"
    return m.group(0)

# The regex matches id, then non-greedy everything up to avatarUrl:
content = re.sub(r"id: '([^']+)',([\s\S]*?)avatarUrl: [^,]+,", replace_avatar, content)

with open('src/data/mockData.ts', 'w') as f:
    f.write(content)

