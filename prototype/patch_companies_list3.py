import re

with open('src/components/CompaniesList.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'(\s*\{displayedCompanies\.length === 0 && \(\s*<div className="p-8 text-center text-slate-500">No companies found matching your search\.</div>\s*\)\}\s*)(</div>\s*</div>)',
    r'\1</div>\2',
    content
)

with open('src/components/CompaniesList.tsx', 'w') as f:
    f.write(content)
