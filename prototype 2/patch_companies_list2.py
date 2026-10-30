import re

with open('src/components/CompaniesList.tsx', 'r') as f:
    content = f.read()

content = content.replace('<div className="overflow-x-auto flex-1">', '<div className="flex-1 min-h-0 relative"><div className="absolute inset-0 overflow-auto">')

# We need to add a closing div right before the end of that block.
# The original block ends with:
#           {filteredCompanies.length === 0 && (
#             <div className="p-8 text-center text-slate-500">No companies found matching your search.</div>
#           )}
#         </div>
#       </div>

content = re.sub(
    r'(\s*\{filteredCompanies\.length === 0 && \(\s*<div className="p-8 text-center text-slate-500">No companies found matching your search\.</div>\s*\)\}\s*)(</div>\s*</div>)',
    r'\1</div>\2',
    content
)

with open('src/components/CompaniesList.tsx', 'w') as f:
    f.write(content)
